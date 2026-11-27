import type { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";

import {
  getClientIp,
  isTrustedOrigin,
  jsonError,
  jsonOk,
  readJsonBody,
} from "@/lib/http";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginUser } from "@/services/auth";


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {

    if (!isTrustedOrigin(req)) {
      return jsonError("คำขอไม่ได้มาจากแหล่งที่อนุญาต", 403);
    }

    // checkip
    const ip = getClientIp(req);
    const ipLimit = checkRateLimit(`login:ip:${ip}`, 20, 60_000);
    if (!ipLimit.allowed) {
      return jsonError(
        "ส่งคำขอถี่เกินไป กรุณารอสักครู่",
        429,
        ipLimit.retryAfterSeconds
      );
    }

    const body = await readJsonBody(req);
    if (!body.ok) {
      return jsonError(body.message, body.status);
    }

    // 4. ส่งงานทั้งหมดให้ service จัดการ
    const result = await loginUser(body.data, ip);
    if (!result.ok) {
      return jsonError(result.message, result.status, result.retryAfterSeconds);
    }
    // 5. ตอบกลับพร้อมแนบ HttpOnly Cookie
    const res = jsonOk({ user: result.data.user }, 200);
    setSessionCookie(res, result.data.token);
    return res;
  } catch (error: unknown) {
    console.error("[api/auth/login] unexpected_error", error);
    return jsonError("เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง", 500);
  }
}