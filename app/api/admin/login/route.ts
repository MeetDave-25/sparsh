import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, checkPassword, createSessionToken, sessionCookieOptions } from '@/lib/adminSession';

export async function POST(request: Request) {
  let password = '';
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!checkPassword(password)) {
    // Small fixed delay slows down password guessing
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions);
  return res;
}
