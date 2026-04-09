import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { PlayHub } from '@/components/features/play/PlayHub';

export const metadata: Metadata = {
  title: 'Play - Blunno',
  description: 'Fun games and activities to help with focus and relaxation',
};

export default function PlayPage(): ReactElement {
  return <PlayHub />;
}
