import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const orders = await prisma.orderRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 500 });
  return NextResponse.json({ orders });
}
