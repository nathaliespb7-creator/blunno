import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

const FEATURES = [
  { label: 'SOS Breathing', color: '#905e8c' },
  { label: 'Focus Sounds', color: '#e7b453' },
  { label: 'Mindful Planner', color: '#83a9ad' },
  { label: 'Mini Breaks', color: '#6a3cae' },
] as const;

async function loadMascotDataUrl(): Promise<string | null> {
  try {
    const mascotPath = join(process.cwd(), 'public', 'blunno-mascot-make-v23.png');
    const mascotBuffer = await readFile(mascotPath);
    return `data:image/png;base64,${mascotBuffer.toString('base64')}`;
  } catch {
    console.warn('[og-image] Mascot image not found, rendering without it');
    return null;
  }
}

async function loadFont(weight: 500 | 700): Promise<ArrayBuffer | null> {
  const url =
    weight === 700
      ? 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_TknNSg.ttf'
      : 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_m07NSg.ttf';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load Plus Jakarta Sans (${weight})`);
    }
    return response.arrayBuffer();
  } catch (e) {
    console.warn(`[og-image] Failed to load Plus Jakarta Sans ${weight}:`, e);
    return null;
  }
}

async function loadTiroTelugu(): Promise<ArrayBuffer | null> {
  const url = 'https://fonts.gstatic.com/l/font?kit=aFTQ7PxlZWk2EPiSymjXdKSNWqi-MjYgzA&skey=c5928e8e3da1a200&v=v7';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to load Tiro Telugu');
    }
    return response.arrayBuffer();
  } catch (e) {
    console.warn('[og-image] Failed to load Tiro Telugu:', e);
    return null;
  }
}

export async function GET() {
  const [mascotSrc, fontMedium, fontBold, fontTiro] = await Promise.all([
    loadMascotDataUrl(),
    loadFont(500),
    loadFont(700),
    loadTiroTelugu(),
  ]);

  const fonts: Array<{ name: string; data: ArrayBuffer; weight: 500 | 700 | 400; style: 'normal' }> = [];
  if (fontMedium) fonts.push({ name: 'Plus Jakarta Sans' as const, data: fontMedium, weight: 500 as const, style: 'normal' as const });
  if (fontBold) fonts.push({ name: 'Plus Jakarta Sans' as const, data: fontBold, weight: 700 as const, style: 'normal' as const });
  if (fontTiro) fonts.push({ name: 'Tiro Telugu' as const, data: fontTiro, weight: 400 as const, style: 'normal' as const });

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, #0b0b1a 0%, #131121 48%, #1a1530 100%)',
          color: '#e5dff6',
          fontFamily: fontMedium ? 'Plus Jakarta Sans' : 'sans-serif',
        }}
      >
        {/* Ambient glow behind mascot column */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -40,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background:
              'radial-gradient(circle, rgba(106,60,174,0.35) 0%, rgba(106,60,174,0.12) 42%, rgba(106,60,174,0) 72%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 80,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background:
              'radial-gradient(circle, rgba(145,126,255,0.28) 0%, rgba(145,126,255,0.1) 45%, rgba(145,126,255,0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: 420,
            width: 360,
            height: 360,
            borderRadius: 9999,
            background:
              'radial-gradient(circle, rgba(131,169,173,0.18) 0%, rgba(131,169,173,0.06) 50%, rgba(131,169,173,0) 72%)',
          }}
        />

        {/* Left: copy */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: mascotSrc ? '58%' : '100%',
            paddingTop: 72,
            paddingBottom: 72,
            paddingLeft: 80,
            paddingRight: 32,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 28,
            }}
          >
            <div
              style={{
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 14,
                paddingRight: 14,
                borderRadius: 9999,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#83a9ad',
                textTransform: 'uppercase',
              }}
            >
              Your pocket reset
            </div>
          </div>

          <div
            style={{
              fontSize: 96,
              lineHeight: 1.1,
              fontWeight: 400,
              fontFamily: fontTiro ? 'Tiro Telugu' : 'sans-serif',
              color: '#e5dff6',
            }}
          >
            Blunno
          </div>

          <div
            style={{
              marginTop: 22,
              maxWidth: 520,
              fontSize: 30,
              lineHeight: 1.25,
              fontWeight: 500,
              color: '#c9c4d8',
            }}
          >
            Your pocket reset for study stress
          </div>

          <div
            style={{
              marginTop: 14,
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(201,196,216,0.72)',
            }}
          >
            Free · Offline · No signup
          </div>

          <div
            style={{
              marginTop: 44,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {FEATURES.map((feature) => (
              <div
                key={feature.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 9999,
                    background: feature.color,
                    boxShadow: `0 0 12px ${feature.color}88`,
                  }}
                />
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: 'rgba(229,223,246,0.92)',
                  }}
                >
                  {feature.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: mascot */}
        {mascotSrc && (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42%',
              paddingRight: 56,
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 380,
                height: 380,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 340,
                  height: 340,
                  borderRadius: 9999,
                  background:
                    'radial-gradient(circle, rgba(124,90,255,0.45) 0%, rgba(124,90,255,0.18) 38%, rgba(124,90,255,0) 72%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 280,
                  height: 280,
                  borderRadius: 9999,
                  background:
                    'radial-gradient(circle, rgba(201,191,255,0.35) 0%, rgba(201,191,255,0.12) 50%, rgba(201,191,255,0) 75%)',
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mascotSrc}
                alt=""
                width={320}
                height={320}
                style={{
                  position: 'relative',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}
