import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { getThemeById } from '@/lib/themes';
import { THEME_KEY, getSiteTheme } from '@/lib/siteTheme';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const theme = await getSiteTheme();
  return NextResponse.json({ themeId: theme.id });
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

  const themeId = (body as { themeId?: unknown })?.themeId;
  if (typeof themeId !== 'string' || !getThemeById(themeId)) {
    return NextResponse.json({ error: 'Unknown theme' }, { status: 400 });
  }

  await prisma.siteContent.upsert({
    where: { key: THEME_KEY },
    create: { key: THEME_KEY, data: { themeId } },
    update: { data: { themeId } },
  });

  revalidatePath('/', 'layout');
  return NextResponse.json({ themeId });
}
