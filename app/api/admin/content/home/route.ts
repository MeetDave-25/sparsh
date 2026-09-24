import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { normalizeHomeContent } from '@/lib/homeContent';
import { HOME_CONTENT_KEY } from '@/lib/siteContent';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const row = await prisma.siteContent.findUnique({ where: { key: HOME_CONTENT_KEY } });
  return NextResponse.json({
    content: normalizeHomeContent(row?.data),
    updatedAt: row?.updatedAt ?? null,
  });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const content = normalizeHomeContent((body as { content?: unknown })?.content);

  const row = await prisma.siteContent.upsert({
    where: { key: HOME_CONTENT_KEY },
    create: { key: HOME_CONTENT_KEY, data: content },
    update: { data: content },
  });

  revalidatePath('/');
  return NextResponse.json({ content, updatedAt: row.updatedAt });
}
