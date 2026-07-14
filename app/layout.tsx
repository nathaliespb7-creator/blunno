import './globals.css';
import { Inter, Plus_Jakarta_Sans, Tiro_Telugu } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { cookies, headers } from 'next/headers';
import Script from 'next/script';

import { AudioUnlock } from '@/components/shared/AudioUnlock';
import { CookieConsent } from '@/components/shared/CookieConsent';
import { DevCacheReset } from '@/components/shared/DevCacheReset';
import { GlobalAudioIndicator } from '@/components/shared/GlobalAudioIndicator';
import { ServiceWorkerRegister } from '@/components/shared/ServiceWorkerRegister';
import { Notification } from '@/components/ui';
import { I18nProvider } from '@/i18n/I18nProvider';
import { LOCALE_BOOTSTRAP_SCRIPT, localeFromAcceptLanguage, parseLocale } from '@/i18n/locale';
import type { Locale } from '@/i18n/types';
import en from '@/i18n/en.json';
import ru from '@/i18n/ru.json';
import { GA_MEASUREMENT_ID, YM_COUNTER_ID } from '@/lib/analytics';

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

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
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

/** Locale from cookie / Accept-Language must be resolved per request, not at build time. */
export const dynamic = 'force-dynamic';

function getSeoStrings(locale: Locale) {
  const t = locale === 'ru' ? ru : en;
  return {
    defaultTitle: (t as Record<string, string>)['seo.defaultTitle'] || 'Blunno – Pocket reset for study stress',
    defaultDesc: (t as Record<string, string>)['seo.defaultDesc'] || 'Free offline PWA for students: calm exam panic with SOS breathing, focus with study sounds, take mini breaks. No signup required.',
    keywords: (t as Record<string, string>)['seo.keywords'] || 'student stress, exam panic, adhd focus, study sounds, mental health, breathing exercise, offline pwa',
    ogTitle: (t as Record<string, string>)['seo.ogTitle'] || 'Blunno – Pocket reset for study stress',
    ogDesc: (t as Record<string, string>)['seo.ogDesc'] || 'Free offline PWA for students. Calm exam panic, focus with sounds, take mini breaks.',
  };
}

const OG_LOCALE_MAP: Record<Locale, string> = { en: 'en_US', ru: 'ru_RU' };

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const fromCookie = parseLocale(cookieStore.get('blunno_lang')?.value);
  const locale: Locale = fromCookie ?? localeFromAcceptLanguage(headerStore.get('accept-language'));
  const seo = getSeoStrings(locale);

  return {
    metadataBase: new URL('https://blunno.app'),
    title: {
      default: seo.defaultTitle,
      template: '%s — Blunno',
    },
    description: seo.defaultDesc,
    keywords: seo.keywords,
    authors: [{ name: 'Blunno' }],
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
      languages: {
        ru: 'https://blunno.app',
        en: 'https://blunno.app',
        'x-default': 'https://blunno.app',
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDesc,
      url: 'https://blunno.app',
      siteName: 'Blunno',
      locale: OG_LOCALE_MAP[locale],
      type: 'website',
      images: [{ url: '/og-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.ogDesc,
      images: ['/og-image'],
    },
    icons: {
      icon: '/icon-192.png',
      apple: '/apple-touch-icon.png',
    },
  };
}

async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = parseLocale(cookieStore.get('blunno_lang')?.value);
  if (fromCookie) return fromCookie;
  const headerStore = await headers();
  return localeFromAcceptLanguage(headerStore.get('accept-language'));
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLocale = await getServerLocale();

  return (
    <html
      lang={initialLocale}
      suppressHydrationWarning
      className={`${tiroTelugu.variable} ${plusJakartaSans.variable} ${inter.variable} min-h-dvh overflow-x-hidden bg-blunno-bg`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden font-ui text-blunno-foreground antialiased">
        <I18nProvider initialLocale={initialLocale}>
        <AudioUnlock />
        <ServiceWorkerRegister />
        <DevCacheReset />
        <link rel="preload" as="image" href="/blunno-mascot-make-v23.webp" type="image/webp" />
        {children}
        <Notification />
        <GlobalAudioIndicator />
        <CookieConsent />
        </I18nProvider>
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
        {/* Yandex Metrika */}
        <Script id="ym-init" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
            ym(${YM_COUNTER_ID},'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:'dataLayer',referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});
          `}
        </Script>
        <noscript>
          <div>
            <img src={'https://mc.yandex.ru/watch/${YM_COUNTER_ID}'} style={{position:'absolute',left:-9999}} alt="" />
          </div>
        </noscript>
        <Script id="software-application-jsonld" type="application/ld+json">
          {JSON.stringify(softwareApplicationJsonLd)}
        </Script>
      </body>
    </html>
  );
}
