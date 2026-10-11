import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { isDocKey, normalizeDoc } from '@/lib/content/docs';

type Ctx = { params: Promise<{ key: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { key } = await params;
  if (!isDocKey(key)) return NextResponse.json({ error: 'Unknown content' }, { status: 404 });

  const row = await prisma.siteContent.findUnique({ where: { key } });
  return NextResponse.json({ content: normalizeDoc(key, row?.data), updatedAt: row?.updatedAt ?? null });
}

export async function PUT(request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { key } = await params;
  if (!isDocKey(key)) return NextResponse.json({ error: 'Unknown content' }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const content = normalizeDoc(key, (body as { content?: unknown })?.content);
  const row = await prisma.siteContent.upsert({
    where: { key },
    create: { key, data: content },
    update: { data: content },
  });

  // Site settings feed the navbar and footer on every page, so refresh everything.
  revalidatePath('/', 'layout');
  return NextResponse.json({ content, updatedAt: row.updatedAt });
}
