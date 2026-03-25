import './globals.css';
import { Comfortaa } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

const comfortaa = Comfortaa({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-comfortaa',
  display: 'swap',
});

const shellBg = '#0d081b';

export const viewport: Viewport = {
  themeColor: shellBg,
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
    // Content draws under status bar; avoids light “stripe” with dark UI
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
    <html lang="en" className={`${comfortaa.variable} min-h-dvh overflow-x-hidden bg-[#0d081b]`}>
      <body className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden bg-[#0d081b] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
