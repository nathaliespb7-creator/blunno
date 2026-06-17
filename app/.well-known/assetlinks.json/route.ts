import { NextResponse } from 'next/server';

/** Digital Asset Links for RuStore / Android TWA. Replace fingerprint after PWA Builder signing. */
const assetLinks = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: 'app.blunno.pwa',
      sha256_cert_fingerprints: ['PLACEHOLDER:REPLACE:AFTER:PWA:BUILDER'],
    },
  },
] as const;

export function GET() {
  return NextResponse.json(assetLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
