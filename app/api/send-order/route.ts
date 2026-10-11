import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderEmail } from '@/lib/email';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: NextRequest) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }

  const order = {
    customerName: str(data.customerName, 120),
    phone: str(data.phone, 30),
    email: str(data.email, 160),
    productCategory: str(data.productCategory, 80) || str(data.category, 80),
    productName: str(data.productName, 200) || null,
    customizations: str(data.customizations, 5000),
    deliveryDate: str(data.deliveryDate, 40) || null,
    specialNotes: str(data.specialNotes, 3000) || null,
  };

  if (!order.customerName || !order.phone) {
    return NextResponse.json({ success: false, message: 'Name and phone are required' }, { status: 400 });
  }

  // Save first, so the order shows up in admin even if the email fails.
  let saved = false;
  try {
    await prisma.orderRequest.create({ data: order });
    saved = true;
  } catch (error) {
    console.error('Failed to save order', error);
  }

  try {
    await sendOrderEmail({ ...order, productName: order.productName ?? undefined, deliveryDate: order.deliveryDate ?? undefined, specialNotes: order.specialNotes ?? undefined });
  } catch (error) {
    console.error('Email send error:', error);
    // Don't block the user — WhatsApp is the primary channel
    return NextResponse.json({ success: saved, message: 'Email failed, use WhatsApp' }, { status: 200 });
  }

  return NextResponse.json({ success: true });
}
