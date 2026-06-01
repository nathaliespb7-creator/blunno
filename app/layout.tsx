import './globals.css';
import { Comfortaa, Inter, Plus_Jakarta_Sans, Poppins, Roboto, Sarabun, Tiro_Telugu } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

import { AndroidNavBarColor } from '@/components/shared/AndroidNavBarColor';
import { DevCacheReset } from '@/components/shared/DevCacheReset';
import { ServiceWorkerRegister } from '@/components/shared/ServiceWorkerRegister';
import { ViewportDebugProbe } from '@/components/shared/ViewportDebugProbe';
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
  weight: ['400'],
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

/** Matches app shell bottom — avoids white nav-bar gap on legacy Android/Huawei */
const appThemeColor = '#120f25';

export const viewport: Viewport = {
  themeColor: appThemeColor,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Blunno',
  description: 'Your gentle companion for anxiety and ADHD',
  applicationName: 'Blunno',
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
    apple: [{ url: '/apple-touch-icon-v10.png', sizes: '180x180', type: 'image/png' }],
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
      className={`${welcomeDisplay.variable} ${tiroTelugu.variable} ${plusJakartaSans.variable} ${comfortaa.variable} ${sarabun.variable} ${roboto.variable} ${inter.variable} min-h-dvh overflow-x-hidden`}
    >
      <body className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden font-ui leading-normal text-blunno-foreground antialiased">
        <AndroidNavBarColor />
        {process.env.NODE_ENV === 'development' ? <ViewportDebugProbe /> : null}
        <DevCacheReset />
        <ServiceWorkerRegister />
        {children}
        <Notification />
      </body>
    </html>
  );
}
