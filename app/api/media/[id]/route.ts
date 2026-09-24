import { prisma } from '@/lib/prisma';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID.test(id)) return new Response('Not found', { status: 404 });

  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    select: { data: true, mimeType: true },
  });
  if (!asset) return new Response('Not found', { status: 404 });

  // Asset bytes never change for a given id (edits upload a new asset), so cache forever.
  return new Response(new Uint8Array(asset.data), {
    headers: {
      'Content-Type': asset.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
