// ============================================================================
// Puma Bot SaaS - Authentication & Cryptography Services
// OWASP Compliant: PBKDF2-SHA512 (100,000 iterations), Constant-Time Comparison
// ============================================================================

import crypto from 'crypto';

/**
 * Gera hash seguro PBKDF2 com salt aleatório de 16 bytes
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Compara a senha informada com o hash armazenado de forma constante no tempo
 * Suporta também compatibilidade com senhas legadas em texto puro
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || typeof storedHash !== 'string') return false;

  // Compatibilidade legada para senhas salvas em texto puro
  if (!storedHash.includes(':')) {
    return password === storedHash;
  }

  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;

  const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

  const bufOriginal = Buffer.from(originalHash, 'hex');
  const bufComputed = Buffer.from(computedHash, 'hex');

  if (bufOriginal.length !== bufComputed.length) return false;
  return crypto.timingSafeEqual(bufOriginal, bufComputed);
}

/**
 * Gera token de sessão opaco para cookies httpOnly
 */
export function generateSessionToken(userId: string): string {
  const random = crypto.randomBytes(24).toString('hex');
  return `sess_${userId}_${random}`;
}

/**
 * Extrai o userId de um token de sessão
 */
export function parseUserIdFromSession(token: string): string | null {
  if (!token || !token.startsWith('sess_')) return null;
  const parts = token.split('_');
  if (parts.length >= 2) {
    return parts[1];
  }
  return null;
}
