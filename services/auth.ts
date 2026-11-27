import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { tb_users } from "@/db/schema/users";
import { verifyPassword } from "@/lib/auth/password";
import { signSession } from "@/lib/auth/session";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import type {
  AuthUserDTO,
  LoginInput,
  ServiceResult,
  UserRole,
} from "@/types/auth";

const DUMMY_HASH =
  "$2b$12$C6UzMDM.H6dfI/f/IKcEeO7H0N8b1fV8R2P7F8c8cZ5c3q6lQ6wG.";

const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,50}$/;

// ตรวจความถูกต้อง
function parseLoginInput(raw: unknown): LoginInput | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }
  const obj = raw as Record<string, unknown>;
  if (typeof obj.username !== "string" || typeof obj.password !== "string") {
    return null;
  }

  const username = obj.username.trim();
  const password = obj.password;

  // bcryptjs ตัดที่ 72 bytes  CPU DoS
  if (
    !USERNAME_REGEX.test(username) ||
    password.length < 8 ||
    password.length > 72
  ) {
    return null;
  }

  return { username, password };
}

// ฟังก์ชันหลักสำหรับล็อกอิน 
export async function loginUser(
  rawInput: unknown,
  clientIp: string,
  allowedRoles?: readonly UserRole[]
): Promise<ServiceResult<{ token: string; user: AuthUserDTO }>> {
  // 1. ตรวจรูปแบบข้อมูล
  const input = parseLoginInput(rawInput);
  if (!input) {
    return {
      ok: false,
      status: 401,
      message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
    };
  }

  // 2. จำกัดการเดารหัสต่อ username (5 ครั้ง / 15 นาที)
  const userKey = `login:user:${input.username.toLowerCase()}`;
  const userLimit = checkRateLimit(userKey, 5, 15 * 60_000);
  if (!userLimit.allowed) {
    return {
      ok: false,
      status: 429,
      message: "พยายามเข้าสู่ระบบผิดเกินกำหนด กรุณาลองใหม่ภายหลัง",
      retryAfterSeconds: userLimit.retryAfterSeconds,
    };
  }

  // 3. ค้นหาผู้ใช้ใน DB
  const [user] = await db
    .select({
      user_id: tb_users.user_id,
      username: tb_users.username,
      password: tb_users.password,
      full_name: tb_users.full_name,
      status: tb_users.status,
      role: tb_users.role,
    })
    .from(tb_users)
    .where(eq(tb_users.username, input.username))
    .limit(1);

  // 4. เช็ครหัสผ่าน
  const isPasswordValid = await verifyPassword(
    input.password,
    user ? user.password : DUMMY_HASH
  );

  if (!user || !isPasswordValid) {
    console.warn("[service/auth] login_failed", {
      ip: clientIp,
      username: input.username,
    });
    return {
      ok: false,
      status: 401,
      message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
    };
  }

  // 5. ตรวจสถานะบัญชี
  if (!user.status) {
    return {
      ok: false,
      status: 403,
      message: "บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ",
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      ok: false,
      status: 403,
      message: "บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานระบบส่วนนี้",
    };
  }

  // 6. สำเร็จ
  resetRateLimit(userKey);
  const token = await signSession({ sub: user.user_id, role: user.role });

  return {
    ok: true,
    data: {
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
    },
  };
}
