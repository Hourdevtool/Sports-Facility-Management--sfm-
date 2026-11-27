import "server-only";
import bcrypt from "bcryptjs";


const SALT_ROUNDS = 12;

// ฟังก์ชันเข้ารหัสรหัสผ่าน
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// ฟังก์ชันถอดรหัส
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
