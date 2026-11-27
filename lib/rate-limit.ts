import "server-only";

type Bucket = {
  count: number;
  resetAt: number;
};

// เก็บตัวนับใน RAM 
const store = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

// keycheck
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const now = Date.now();

  // ล้างข้อมูลที่หมดอายุเมื่อ key เริ่มเยอะ
  if (store.size >= MAX_KEYS) {
    for (const [k, b] of store.entries()) {
      if (b.resetAt <= now) store.delete(k);
    }
  }

  const bucket = store.get(key);

  // เริ่มนับ 1 ใหม่กรณีที่หมดอายุหรือมาใหม่
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}

// รีเซ็ตตัวนับ 
export function resetRateLimit(key: string): void {
  store.delete(key);
}
