import { cache } from 'react';
import { prisma } from './prisma';
import { DEFAULT_HOME_CONTENT, normalizeHomeContent, type HomeContent } from './homeContent';

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
