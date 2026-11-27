import type { tb_users } from "@/db/schema/users";

// อ้างอิง type ตรงจาก DB schema 
export type UserRecord = typeof tb_users.$inferSelect;
export type UserRole = UserRecord["role"];


export type LoginInput = {
  readonly username: string;
  readonly password: string;
};

// ข้อมูลขั้นต่ำที่ฝังใน JWT
export type SessionPayload = {
  readonly sub: string; // user_id
  readonly role: UserRole;
};

// ข้อมูลผู้ใช้ที่ปลอดภัยสำหรับส่งกลับหน้าเว็บ
export type AuthUserDTO = {
  readonly user_id: string;
  readonly username: string;
  readonly full_name: string;
  readonly role: UserRole;
};

// ผลลัพธ์มาตรฐานของ Service
export type ServiceResult<T> =
  | { readonly ok: true; readonly data: T }
  | {
      readonly ok: false;
      readonly status: number;
      readonly message: string;
      readonly retryAfterSeconds?: number;
    };