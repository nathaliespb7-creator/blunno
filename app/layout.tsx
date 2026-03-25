import './globals.css';
import { Comfortaa } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

const comfortaa = Comfortaa({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-comfortaa',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#BDB2FF',
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
    statusBarStyle: 'default',
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
    <html lang="en" className={comfortaa.variable}>
      <body className="bg-[#FFF0F5] font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
