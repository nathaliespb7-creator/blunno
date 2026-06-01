import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Choose your mood - Blunno',
  description:
    'Pick your study reset: SOS breathing for exam panic, planner, mini games, or focus sounds.',
};

export default function ChooseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
