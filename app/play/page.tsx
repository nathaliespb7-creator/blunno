import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { PlayHub } from '@/components/features/play/PlayHub';

export const metadata: Metadata = {
  title: 'Play - Blunno',
  description: 'Quick study breaks with mini games — reset your mind between sessions.',
};

export default function PlayPage(): ReactElement {
  return <PlayHub />;
}
