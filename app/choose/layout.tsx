import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Choose your mood - Blunno',
  description: 'Select your mood: SOS, Planner, Play, or Relax',
};

export default function ChooseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
