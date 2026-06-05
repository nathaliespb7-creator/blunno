import type { Metadata } from 'next';

export const SITE_URL = 'https://blunno.app';

const OG_IMAGE = {
  url: '/og-image',
  width: 1200,
  height: 630,
} as const;

export type RouteMetadataOptions = {
  path: string;
  title: string;
  description: string;
  /** Full document title; skips root `title.template` when set. */
  absoluteTitle?: string;
  ogTitle?: string;
  noIndex?: boolean;
};

function canonicalUrl(path: string): string {
  if (path === '/' || path === '') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function routeMetadata({
  path,
  title,
  description,
  absoluteTitle,
  ogTitle,
  noIndex = false,
}: RouteMetadataOptions): Metadata {
  const canonical = canonicalUrl(path);
  const resolvedOgTitle = ogTitle ?? absoluteTitle ?? title;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedOgTitle,
      description,
      url: canonical,
      siteName: 'Blunno',
      locale: 'en_US',
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedOgTitle,
      description,
      images: [`${SITE_URL}/og-image`],
    },
  };
}
