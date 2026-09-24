import { createHmac, timingSafeEqual } from 'crypto';

// Pure token helpers with no Next.js request APIs, so proxy.ts and route handlers can share them.

export const ADMIN_COOKIE = 'sparsh_admin';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function secret(): string {
  const s = process.env.ADMIN_SECRET_KEY;
  if (!s || s.length < 16) {
    throw new Error('ADMIN_SECRET_KEY must be set to at least 16 characters');
  }
  return s;
}

function hmac(value: string): Buffer {
  return createHmac('sha256', secret()).update(value).digest();
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !input) return false;
  // Comparing HMACs keeps the comparison constant-time regardless of input length
  return timingSafeEqual(hmac(input), hmac(expected));
}

export function createSessionToken(): string {
  const payload = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${payload}.${hmac(payload).toString('base64url')}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = hmac(payload);
  const given = Buffer.from(sig, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  return Number(payload) > Date.now();
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
};
