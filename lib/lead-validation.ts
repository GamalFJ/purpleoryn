import crypto from "crypto";

// Rate limiting state: Map of IP hash -> timestamps array
const submissionLog = new Map<string, number[]>();

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normalizes phone numbers to standard E.164-compatible format.
 * Examples:
 *   "(214) 555-0192" -> "+12145550192"
 *   "2145550192"     -> "+12145550192"
 *   "1-214-555-0192" -> "+12145550192"
 *   "+1 214 555 0192"-> "+12145550192"
 */
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const digitsOnly = trimmed.replace(/\D/g, "");

  // US 10-digit number
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  // 11 digits starting with 1 (North American country code)
  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    return `+${digitsOnly}`;
  }

  // International format with leading +
  if (trimmed.startsWith("+") && digitsOnly.length >= 7) {
    return `+${digitsOnly}`;
  }

  // Fallback to cleaned digits
  return digitsOnly ? (digitsOnly.length >= 10 ? `+${digitsOnly}` : digitsOnly) : trimmed;
}

export function hashIp(ip: string): string {
  const salt = process.env.CHAT_IP_SALT || "purploryn-lead-salt-2026";
  return crypto.createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

/**
 * Basic sliding-window rate limiter for public form submissions.
 * Default: maximum 5 submissions per 10 minutes per IP.
 */
export function checkRateLimit(
  ip: string,
  maxSubmissions = 5,
  windowMs = 10 * 60 * 1000
): { allowed: boolean; remaining: number } {
  const ipKey = hashIp(ip);
  const now = Date.now();
  const cutoff = now - windowMs;

  const timestamps = (submissionLog.get(ipKey) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= maxSubmissions) {
    submissionLog.set(ipKey, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  submissionLog.set(ipKey, timestamps);

  // Periodic cleanup if map grows large (> 1000 IPs)
  if (submissionLog.size > 1000) {
    for (const [key, times] of submissionLog.entries()) {
      const valid = times.filter((t) => t > cutoff);
      if (valid.length === 0) {
        submissionLog.delete(key);
      } else {
        submissionLog.set(key, valid);
      }
    }
  }

  return { allowed: true, remaining: maxSubmissions - timestamps.length };
}
