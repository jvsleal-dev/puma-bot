// ============================================================================
// Puma Bot Security Utilities - Cryptographic Primitives & Rate Limiter
// ============================================================================

import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'puma_bot_jwt_super_secret_high_entropy_key_512bits';

/**
 * Hash seguro de senha usando PBKDF2 com Salt de 16 bytes e 100.000 iterações (NIST Recommended)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Validação de senha imune a timing attacks (constant-time comparison)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

  const bufOriginal = Buffer.from(originalHash, 'hex');
  const bufComputed = Buffer.from(computedHash, 'hex');

  if (bufOriginal.length !== bufComputed.length) return false;
  return crypto.timingSafeEqual(bufOriginal, bufComputed);
}

/**
 * Geração de Token JWT assinado com HMAC-SHA256
 */
export function generateToken(payload: Record<string, any>, expiresInSeconds: number = 86400 * 7): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const claims = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${claims}`)
    .digest('base64url');

  return `${header}.${claims}.${signature}`;
}

/**
 * Verificação e decodificação do Token JWT
 */
export function verifyToken<T = any>(token: string): T | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, claims, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${claims}`)
    .digest('base64url');

  const bufExpected = Buffer.from(expectedSignature);
  const bufActual = Buffer.from(signature);

  if (bufExpected.length !== bufActual.length) return null;
  if (!crypto.timingSafeEqual(bufExpected, bufActual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(claims, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expirado
    }
    return payload as T;
  } catch (e) {
    return null;
  }
}

/**
 * Validação de Assinatura de Webhook (HMAC-SHA256) em tempo constante
 */
export function verifyWebhookSignature(payloadRaw: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const calculated = hmac.update(payloadRaw).digest('hex');

  const bufCalc = Buffer.from(calculated);
  const bufSig = Buffer.from(signature);

  if (bufCalc.length !== bufSig.length) return false;
  return crypto.timingSafeEqual(bufCalc, bufSig);
}

/**
 * Sanitização de texto contra XSS (Cross-Site Scripting)
 */
export function sanitizeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Rate Limiter em memória por IP (Token Bucket / Sliding Window)
 */
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const rateLimiters = new Map<string, RateLimitBucket>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 30,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = rateLimiters.get(key) || { tokens: maxRequests, lastRefill: now };

  const elapsedTime = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(maxRequests, bucket.tokens + elapsedTime * (maxRequests / windowSeconds));
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    rateLimiters.set(key, bucket);
    return { allowed: true, remaining: Math.floor(bucket.tokens) };
  } else {
    rateLimiters.set(key, bucket);
    return { allowed: false, remaining: 0 };
  }
}
