'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { SITE_DOC, type SiteSettings } from '@/lib/content/docs';

const SiteContext = createContext<SiteSettings>(SITE_DOC.defaults);

/** Admin-editable site settings (contact details, menu, footer, feature switches) for client components. */
export function SiteProvider({ settings, children }: { settings: SiteSettings; children: ReactNode }) {
  return <SiteContext.Provider value={settings}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
