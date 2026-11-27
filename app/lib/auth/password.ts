import 'server-only'
import bcrypt from 'bcryptjs'

// จำนวนที่ random
const SALT_ROUNDS = 12


// ฟังชั่นเข้ารหัส
export async function hashPassword(password:string): Promise<string>{
    return bcrypt.hash(password, SALT_ROUNDS)
}


// ยืนยันรหัส

export async function verifyPassword(password:string,hashedPassword: string):Promise<boolean>{
    return bcrypt.compare(password,hashedPassword)
}