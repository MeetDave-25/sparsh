import { cache } from 'react';
import { prisma } from './prisma';
import { DEFAULT_HOME_CONTENT, normalizeHomeContent, type HomeContent } from './homeContent';
import { CONTENT_DOCS, normalizeDoc, type DocContent, type DocKey } from './content/docs';

export const HOME_CONTENT_KEY = 'home';

export const getHomeContent = cache(async (): Promise<HomeContent> => {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key: HOME_CONTENT_KEY } });
    return row ? normalizeHomeContent(row.data) : DEFAULT_HOME_CONTENT;
  } catch (error) {
    // Never take the homepage down because the content table is unreachable
    console.error('Failed to load homepage content, using defaults', error);
    return DEFAULT_HOME_CONTENT;
  }
});

/** Admin-editable content for one page or the site settings, falling back to the built-in defaults. */
export const getContent = cache(async <K extends DocKey>(key: K): Promise<DocContent<K>> => {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key } });
    return row ? normalizeDoc(key, row.data) : CONTENT_DOCS[key].defaults;
  } catch (error) {
    console.error(`Failed to load "${key}" content, using defaults`, error);
    return CONTENT_DOCS[key].defaults;
  }
});

export const getSiteSettings = () => getContent('site');
