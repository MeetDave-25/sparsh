import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { isOrderStatus } from '@/lib/orders/status';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { status?: unknown };
  if (!isOrderStatus(body.status)) return NextResponse.json({ error: 'Unknown status' }, { status: 400 });

  try {
    const order = await prisma.orderRequest.update({ where: { id }, data: { status: body.status } });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  try {
    await prisma.orderRequest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
}
