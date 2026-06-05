import './globals.css';
import { Inter, Plus_Jakarta_Sans, Poppins, Roboto, Sarabun, Tiro_Telugu } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { AudioUnlock } from '@/components/shared/AudioUnlock';
import { CookieConsent } from '@/components/shared/CookieConsent';
import { DevCacheReset } from '@/components/shared/DevCacheReset';
import { GlobalAudioIndicator } from '@/components/shared/GlobalAudioIndicator';
import { ServiceWorkerRegister } from '@/components/shared/ServiceWorkerRegister';
import { Notification } from '@/components/ui';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

/** Figma Welcome: заголовок (замена Toppan Bunkyu Midashi Gothic) */
const welcomeDisplay = Poppins({
  subsets: ['latin'],
  variable: '--font-welcome-display',
  display: 'swap',
  weight: ['700'],
});

const sarabun = Sarabun({
  subsets: ['latin'],
  variable: '--font-sarabun',
  display: 'swap',
  weight: ['400', '700', '800'],
});

/** Слово BLUNNO на Welcome */
const tiroTelugu = Tiro_Telugu({
  subsets: ['latin'],
  variable: '--font-tiro-telugu',
  display: 'swap',
  weight: ['400'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['400', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400'],
});

const shellBg = '#120f25';

const softwareApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Blunno',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'iOS, Android, Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Free offline PWA for students: calm exam panic with SOS breathing, focus with study sounds, take mini breaks.',
};

export const viewport: Viewport = {
  themeColor: shellBg,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://blunno.app'),
  title: {
    default: 'Blunno – Pocket reset for study stress',
    template: '%s – Blunno',
  },
  description:
    'Free offline PWA for students: calm exam panic with SOS breathing, focus with study sounds, take mini breaks. No signup required.',
  keywords:
    'student stress, exam panic, adhd focus, study sounds, mental health, breathing exercise, offline pwa',
  authors: [{ name: 'Blunno Team' }],
  creator: 'Blunno',
  publisher: 'Blunno',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://blunno.app',
  },
  openGraph: {
    title: 'Blunno – Pocket reset for study stress',
    description:
      'Free offline PWA for students. Calm exam panic, focus with sounds, take mini breaks.',
    url: 'https://blunno.app',
    siteName: 'Blunno',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blunno – Pocket reset for study stress',
    description: 'Free offline PWA for students',
    images: ['/og-image'],
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${welcomeDisplay.variable} ${tiroTelugu.variable} ${plusJakartaSans.variable} ${sarabun.variable} ${roboto.variable} ${inter.variable} min-h-dvh overflow-x-hidden bg-blunno-bg`}
    >
      <body className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden font-ui text-blunno-foreground antialiased">
        <AudioUnlock />
        <ServiceWorkerRegister />
        <DevCacheReset />
        {children}
        <Notification />
        <GlobalAudioIndicator />
        <CookieConsent />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              wait_for_update: 500
            });
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
          `}
        </Script>
        <Script id="software-application-jsonld" type="application/ld+json">
          {JSON.stringify(softwareApplicationJsonLd)}
        </Script>
      </body>
    </html>
  );
}
