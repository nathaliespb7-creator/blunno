import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(80% 90% at 50% 35%, rgba(145,126,255,0.18) 0%, rgba(19,17,33,1) 62%), linear-gradient(135deg, #131121 0%, #1a1530 100%)',
          overflow: 'hidden',
          color: '#e5dff6',
          fontFamily: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              'radial-gradient(circle, rgba(201,191,255,0.3) 0%, rgba(145,126,255,0.2) 30%, rgba(145,126,255,0) 70%)',
            filter: 'blur(10px)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 78,
            left: 110,
            width: 14,
            height: 14,
            borderRadius: 9999,
            background: 'rgba(229,223,246,0.7)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 112,
            right: 148,
            width: 8,
            height: 8,
            borderRadius: 9999,
            background: 'rgba(201,196,216,0.65)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 104,
            left: 172,
            width: 10,
            height: 10,
            borderRadius: 9999,
            background: 'rgba(201,196,216,0.6)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <img
            src="/blunno-mascot-v2.png"
            alt="Blunno mascot"
            width={210}
            height={210}
            style={{
              objectFit: 'contain',
              filter:
                'drop-shadow(0 0 30px rgba(145,126,255,0.7)) drop-shadow(0 0 56px rgba(201,191,255,0.4))',
              marginBottom: 26,
            }}
          />

          <div
            style={{
              fontSize: 96,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#e5dff6',
            }}
          >
            Blunno
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 34,
              lineHeight: 1.2,
              fontWeight: 500,
              color: '#c9c4d8',
            }}
          >
            Your pocket reset for study stress
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
