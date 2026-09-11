import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

/**
 * Hash a password securely with scrypt and a cryptographic random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a password against a stored hash (supports modern scrypt & legacy base64 with constant-time comparison)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  // Modern format: scrypt:salt:hash
  if (storedHash.startsWith("scrypt:")) {
    const parts = storedHash.split(":");
    if (parts.length !== 3) return false;
    const [, salt, originalHash] = parts;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const originalBuffer = Buffer.from(originalHash, "hex");
    if (originalBuffer.length !== derivedKey.length) return false;
    return crypto.timingSafeEqual(originalBuffer, derivedKey);
  }

  // Legacy fallback: base64
  const legacyHash = Buffer.from(password).toString("base64");
  const a = Buffer.from(legacyHash);
  const b = Buffer.from(storedHash);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Check if the stored hash is in legacy format and needs automatic upgrade
 */
export function isLegacyPasswordHash(storedHash: string): boolean {
  return !storedHash || !storedHash.startsWith("scrypt:");
}

/**
 * Sliding Window In-Memory Rate Limiter Middleware
 */
interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = "تم تجاوز الحد المسموح به من المحاولات، يرجى الانتظار قليلاً" } = options;
  const ipStore = new Map<string, { count: number; resetTime: number }>();

  // Periodic cleanup of stale IPs every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipStore.entries()) {
      if (now > entry.resetTime) {
        ipStore.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
    const now = Date.now();

    const record = ipStore.get(clientIp);

    if (!record || now > record.resetTime) {
      ipStore.set(clientIp, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (record.count >= maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      res.status(429).json({
        error: message,
        retryAfterSeconds: retryAfter,
      });
      return;
    }

    record.count += 1;
    next();
  };
}

/**
 * Safe OTP Store with Max Attempts & Automatic TTL Pruning
 */
interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}

export class SafeOtpStore {
  private store = new Map<string, OtpEntry>();
  private maxAttempts: number;

  constructor(maxAttempts = 5) {
    this.maxAttempts = maxAttempts;
    // Auto-cleanup every 2 minutes
    setInterval(() => this.cleanup(), 2 * 60 * 1000).unref();
  }

  set(email: string, code: string, ttlMs = 10 * 60 * 1000): void {
    this.store.set(email.toLowerCase().trim(), {
      code,
      expiresAt: Date.now() + ttlMs,
      attempts: 0,
      verified: false,
    });
  }

  get(email: string): OtpEntry | undefined {
    return this.store.get(email.toLowerCase().trim());
  }

  verify(email: string, inputCode: string): { success: boolean; reason?: string } {
    const key = email.toLowerCase().trim();
    const entry = this.store.get(key);

    if (!entry) {
      return { success: false, reason: "كود التحقق غير موجود أو انتهت صلاحيته" };
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return { success: false, reason: "انتهت صلاحية كود التحقق، يرجى طلب كود جديد" };
    }

    entry.attempts += 1;

    if (entry.attempts > this.maxAttempts) {
      this.store.delete(key);
      return { success: false, reason: "تم تجاوز الحد الأقصى للمحاولات الخاطئة، يرجى طلب كود جديد" };
    }

    if (entry.code !== inputCode.toString().trim()) {
      return {
        success: false,
        reason: `كود التحقق غير صحيح (المحاولة ${entry.attempts} من ${this.maxAttempts})`,
      };
    }

    entry.verified = true;
    return { success: true };
  }

  isVerified(email: string): boolean {
    const entry = this.store.get(email.toLowerCase().trim());
    return !!entry && entry.verified && Date.now() <= entry.expiresAt;
  }

  delete(email: string): void {
    this.store.delete(email.toLowerCase().trim());
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}
