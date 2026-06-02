import './globals.css';
import { Comfortaa, Inter, Plus_Jakarta_Sans, Poppins, Roboto, Sarabun, Tiro_Telugu } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { AudioUnlock } from '@/components/shared/AudioUnlock';
import { DevCacheReset } from '@/components/shared/DevCacheReset';
import { ServiceWorkerRegister } from '@/components/shared/ServiceWorkerRegister';
import { Notification } from '@/components/ui';

const comfortaa = Comfortaa({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-comfortaa',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

/** Figma Welcome: заголовок (замена Toppan Bunkyu Midashi Gothic) */
const welcomeDisplay = Poppins({
  subsets: ['latin'],
  variable: '--font-welcome-display',
  display: 'swap',
  weight: ['700'],
});

const sarabun = Sarabun({
  subsets: ['latin', 'thai'],
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
  subsets: ['latin', 'cyrillic'],
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

const shellBg = '#0B0B1A';

export const viewport: Viewport = {
  themeColor: shellBg,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Blunno — Your Pocket Reset for Study Stress | Free Offline PWA for Students',
  description:
    'Blunno helps students reset during study stress. Free offline PWA with SOS breathing, focus sounds, and mini breaks. No signup, works without internet. Built for students.',
  keywords:
    'study stress, exam anxiety, focus sounds, offline PWA, student mental health, ADHD focus, free study tool, white noise for studying, brown noise for focus, library ambience, coffee shop sounds, dorm room noise cancellation, how to calm down before exam, free study ambience, pocket reset, study break, SOS breathing, panic relief for students',
  applicationName: 'Blunno',
  openGraph: {
    title: 'Blunno — Pocket Reset for Study Stress',
    description:
      'Free 3-minute breathing for exam panic. Study sounds that work offline. Built for students.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blunno — Pocket Reset for Study Stress',
    description:
      'Free offline PWA for study stress relief. SOS breathing, focus sounds, no signup, works without internet.',
  },
  appleWebApp: {
    capable: true,
    title: 'Blunno',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
      className={`${welcomeDisplay.variable} ${tiroTelugu.variable} ${plusJakartaSans.variable} ${comfortaa.variable} ${sarabun.variable} ${roboto.variable} ${inter.variable} min-h-dvh overflow-x-hidden bg-blunno-bg`}
    >
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-QH796CJ4ZX"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QH796CJ4ZX');
          `}
        </Script>
      </head>
      <body className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden font-ui text-blunno-foreground antialiased">
        <AudioUnlock />
        <ServiceWorkerRegister />
        <DevCacheReset />
        {children}
        <Notification />
      </body>
    </html>
  );
}
