import "server-only";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { NextResponse } from "next/server";
import { tb_users } from "@/db/schema/users";
import type { SessionPayload } from "@/types/auth";

export const SESSION_COOKIE_NAME = "sfm_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 ชั่วโมง
const JWT_ALG = "HS256";
const JWT_ISSUER = "sfm-app";
const JWT_AUDIENCE = "sfm-web";


const VALID_ROLES: ReadonlySet<string> = new Set(tb_users.role.enumValues);

// อ่าน SESSION_SECRET 
function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

// ตรวจว่า payload จาก JWT มี sub และ role ที่ตรงกับ schema จริง
function isSessionPayload(
  payload: JWTPayload
): payload is JWTPayload & SessionPayload {
  return (
    typeof payload.sub === "string" &&
    payload.sub.length > 0 &&
    typeof payload.role === "string" &&
    VALID_ROLES.has(payload.role)
  );
}

// ออก JWT token
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: JWT_ALG })
    .setSubject(payload.sub)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

// ตรวจ JWT token
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: [JWT_ALG],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return isSessionPayload(payload)
      ? { sub: payload.sub, role: payload.role }
      : null;
  } catch {
    return null;
  }
}

// แนบ HttpOnly Cookie ลง Response
export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // กัน JS อ่าน (กัน XSS)
    secure: process.env.NODE_ENV === "production", // บังคับ HTTPS บน prod
    sameSite: "lax", // กัน CSRF
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

// ลบ Cookie ตอน logout
export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
