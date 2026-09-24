export interface WhatsAppOrderMessage {
  customerName: string;
  phone: string;
  email: string;
  productCategory: string;
  productName?: string;
  customizations: string;
  deliveryDate?: string;
  specialNotes?: string;
}

export function buildWhatsAppMessage(order: WhatsAppOrderMessage): string {
  const lines = [
    `🌸 *New Custom Order — Sparsh Divine Art Studio*`,
    ``,
    `👤 *Customer:* ${order.customerName}`,
    `📱 *Phone:* ${order.phone}`,
    `📧 *Email:* ${order.email}`,
    ``,
    `🛍️ *Product Category:* ${order.productCategory}`,
    order.productName ? `🎁 *Product:* ${order.productName}` : null,
    ``,
    `✨ *Customization Details:*`,
    order.customizations,
    ``,
    order.deliveryDate ? `📅 *Requested Delivery By:* ${order.deliveryDate}` : null,
    order.specialNotes ? `📝 *Special Notes:* ${order.specialNotes}` : null,
    ``,
    `—`,
    `_Sent from Sparsh Divine Art Studio website_`,
  ].filter(Boolean).join('\n');

  return lines;
}

export function getWhatsAppURL(message: WhatsAppOrderMessage): string {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918160901481';
  const text = buildWhatsAppMessage(message);
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

export function getWhatsAppDirectURL(): string {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918160901481';
  return `https://wa.me/${whatsappNumber}`;
}
