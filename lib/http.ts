import "server-only";
import { NextResponse, type NextRequest } from "next/server";

// สั่งเบราว์เซอร์/proxy ห้าม cache ข้อมูล API
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
  Pragma: "no-cache",
} as const;

// ส่ง Response
export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(
    { ok: true, data },
    { status, headers: NO_STORE_HEADERS }
  );
}

// ส่ง Response 
export function jsonError(
  message: string,
  status: number,
  retryAfterSeconds?: number
): NextResponse {
  const headers: Record<string, string> = { ...NO_STORE_HEADERS };
  if (retryAfterSeconds !== undefined) {
    headers["Retry-After"] = String(retryAfterSeconds);
  }
  return NextResponse.json({ ok: false, message }, { status, headers });
}

// กัน CSRF ข้ามโดเมน: Origin ต้องตรงกับ Host 
export function isTrustedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// ดึง IP จริงของผู้ใช้งาน 
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

// อ่าน JSON body 
export async function readJsonBody(
  req: NextRequest,
  maxBytes = 4_096
): Promise<
  | { ok: true; data: unknown }
  | { ok: false; status: number; message: string }
> {
  const contentType = (req.headers.get("content-type") ?? "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return { ok: false, status: 415, message: "รองรับเฉพาะ application/json" };
  }

  const text = await req.text();
  if (text.length > maxBytes) {
    return { ok: false, status: 413, message: "ขนาดข้อมูลเกินกำหนด" };
  }

  try {
    return { ok: true, data: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, status: 400, message: "รูปแบบ JSON ไม่ถูกต้อง" };
  }
}
