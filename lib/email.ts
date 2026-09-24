import nodemailer from 'nodemailer';

export interface OrderEmailData {
  customerName: string;
  phone: string;
  email: string;
  productCategory: string;
  productName?: string;
  customizations: string;
  deliveryDate?: string;
  specialNotes?: string;
  referenceImageUrl?: string;
}

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendOrderEmail(data: OrderEmailData): Promise<void> {
  const transporter = createTransporter();

  const clientEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #FDF6EF; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #E8A0B4 0%, #C9A96E 100%); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; }
    .body { padding: 32px; }
    .section { margin-bottom: 24px; }
    .section h2 { color: #C4617A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .field { display: flex; gap: 12px; margin-bottom: 8px; }
    .label { color: #8A6E77; font-size: 14px; min-width: 140px; font-weight: 600; }
    .value { color: #2D1B26; font-size: 14px; }
    .customizations { background: #FFF0F5; border-left: 3px solid #E8A0B4; padding: 16px; border-radius: 0 8px 8px 0; color: #2D1B26; font-size: 14px; white-space: pre-wrap; }
    .footer { background: #FDF6EF; padding: 24px; text-align: center; color: #8A6E77; font-size: 13px; }
    .badge { display: inline-block; background: #E8A0B4; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🌸 Sparsh Divine Art Studio</h1>
      <p>New Custom Order Request</p>
    </div>
    <div class="body">
      <div class="section">
        <h2>Customer Details</h2>
        <div class="field"><span class="label">Name:</span><span class="value">${data.customerName}</span></div>
        <div class="field"><span class="label">Phone:</span><span class="value">${data.phone}</span></div>
        <div class="field"><span class="label">Email:</span><span class="value">${data.email}</span></div>
      </div>
      <div class="section">
        <h2>Order Details</h2>
        <div class="field"><span class="label">Category:</span><span class="value"><span class="badge">${data.productCategory}</span></span></div>
        ${data.productName ? `<div class="field"><span class="label">Product:</span><span class="value">${data.productName}</span></div>` : ''}
        ${data.deliveryDate ? `<div class="field"><span class="label">Delivery By:</span><span class="value">${data.deliveryDate}</span></div>` : ''}
      </div>
      <div class="section">
        <h2>Customization Details</h2>
        <div class="customizations">${data.customizations}</div>
      </div>
      ${data.specialNotes ? `
      <div class="section">
        <h2>Special Notes</h2>
        <div class="customizations">${data.specialNotes}</div>
      </div>` : ''}
    </div>
    <div class="footer">
      <p>Reply to this email or WhatsApp the customer to confirm & proceed.</p>
      <p>Sparsh Divine Art Studio · info@sparshdivineartstudio.com</p>
    </div>
  </div>
</body>
</html>
  `;

  const customerEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #FDF6EF; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #E8A0B4 0%, #C9A96E 100%); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .body { padding: 32px; color: #2D1B26; }
    .steps { background: #FFF0F5; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .step { display: flex; gap: 16px; margin-bottom: 16px; }
    .step-num { background: #E8A0B4; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .footer { background: #FDF6EF; padding: 24px; text-align: center; color: #8A6E77; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🌸 Sparsh Divine Art Studio</h1>
    </div>
    <div class="body">
      <h2>Namaste, ${data.customerName}! 🙏</h2>
      <p>We've received your custom order request and our artisan is reviewing it with love and care.</p>
      <p><strong>What happens next?</strong></p>
      <div class="steps">
        <div class="step"><span class="step-num">1</span><span>Our artisan reviews your request within 24 hours</span></div>
        <div class="step"><span class="step-num">2</span><span>We confirm pricing & timeline via WhatsApp or email</span></div>
        <div class="step"><span class="step-num">3</span><span>You pay (UPI / bank transfer / COD) after approval</span></div>
        <div class="step"><span class="step-num">4</span><span>We craft your piece with love & deliver it to you ✨</span></div>
      </div>
      <p>For urgent queries, WhatsApp us at <strong>+91 8160901481</strong></p>
      <p><em>"Har cheez mein pyaar hai — aapka bhi order aisa hi hoga." 🌸</em></p>
    </div>
    <div class="footer">
      <p>Sparsh Divine Art Studio · info@sparshdivineartstudio.com</p>
      <p>WhatsApp: +91 8160901481</p>
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Sparsh Divine Art Studio" <${process.env.EMAIL_USER}>`,
    to: process.env.NEXT_PUBLIC_BRAND_EMAIL,
    subject: `🌸 New Custom Order from ${data.customerName} — ${data.productCategory}`,
    html: clientEmail,
    replyTo: data.email,
  });

  await transporter.sendMail({
    from: `"Sparsh Divine Art Studio" <${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: `We received your order! 🌸 — Sparsh Divine Art Studio`,
    html: customerEmail,
  });
}
