import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    await sendOrderEmail({
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      productCategory: data.category,
      productName: data.productName,
      customizations: data.customizations,
      deliveryDate: data.deliveryDate,
      specialNotes: data.specialNotes,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    // Don't block the user — WhatsApp is the primary channel
    return NextResponse.json({ success: false, message: 'Email failed, use WhatsApp' }, { status: 200 });
  }
}
