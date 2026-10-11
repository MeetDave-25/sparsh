'use client';

import { useParams } from 'next/navigation';
import DocEditor from '@/components/admin/content/DocEditor';
import { CONTENT_DOCS, isDocKey, type ContentDoc } from '@/lib/content/docs';

export default function ContentDocPage() {
  const { key } = useParams<{ key: string }>();
  if (!isDocKey(key)) return <p style={{ padding: 32 }}>This page doesn’t exist.</p>;

  const doc = CONTENT_DOCS[key] as unknown as ContentDoc<Record<string, unknown>>;
  return (
    <DocEditor
      key={key}
      apiUrl={`/api/admin/content/${key}`}
      title={doc.title}
      description={doc.description}
      viewHref={doc.viewHref}
      sections={doc.sections}
      defaults={doc.defaults}
    />
  );
}
