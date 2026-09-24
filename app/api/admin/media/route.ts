import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_DIMENSION = 2000;
const ACCEPTED_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif', 'heif', 'gif', 'tiff']);

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const assets = await prisma.mediaAsset.findMany({
    select: { id: true, filename: true, width: true, height: true, size: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(assets.map((a) => ({ ...a, url: `/api/media/${a.id}` })));
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get('file');
  } catch {
    return NextResponse.json({ error: 'Expected a multipart upload' }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'Image is larger than 12 MB' }, { status: 413 });
  }

  const input = Buffer.from(await file.arrayBuffer());

  // Decoding with sharp (not trusting the browser's MIME type) rejects anything that isn't a real image.
  // Re-encoding also strips EXIF data such as phone GPS location.
  let output: { data: Buffer; info: { width: number; height: number } };
  try {
    const image = sharp(input, { failOn: 'error', limitInputPixels: 60_000_000 });
    const meta = await image.metadata();
    if (!meta.format || !ACCEPTED_FORMATS.has(meta.format)) {
      return NextResponse.json({ error: 'Unsupported image format' }, { status: 415 });
    }
    output = await image
      .rotate()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    return NextResponse.json({ error: 'That file could not be read as an image' }, { status: 415 });
  }

  const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^\w\- ]+/g, '').trim().slice(0, 80) || 'image';

  const asset = await prisma.mediaAsset.create({
    data: {
      filename: `${baseName}.webp`,
      mimeType: 'image/webp',
      width: output.info.width,
      height: output.info.height,
      size: output.data.length,
      data: new Uint8Array(output.data),
    },
    select: { id: true, filename: true, width: true, height: true, size: true, createdAt: true },
  });

  return NextResponse.json({ ...asset, url: `/api/media/${asset.id}` }, { status: 201 });
}
