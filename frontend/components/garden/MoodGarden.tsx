'use client';

import Link from 'next/link';
import { Lang } from '@/lib/translations';
import { GARDEN_PLANTS, getGardenStage } from '@/lib/constants';

interface MoodGardenProps {
  lang: Lang;
  logs: { mood: number; createdAt: string }[];
  compact?: boolean;
}

const LABELS: Record<Lang, { title: string; empty: string; visit: string; days: string }> = {
  en: {
    title: 'Your Inner Garden',
    empty: 'Your garden is waiting. Log your first mood to plant a seed.',
    visit: 'Water your garden',
    days: 'days you showed up',
  },
  rw: {
    title: 'Urusobe rwawe rw\'Imitima',
    empty: 'Urusobe rwawe rurategereje. Andika imitekerere yawe ya mbere.',
    visit: 'Uhume urusobe',
    days: 'iminsi wagiye',
  },
  fr: {
    title: 'Votre jardin intérieur',
    empty: 'Votre jardin vous attend. Enregistrez votre première humeur.',
    visit: 'Arroser le jardin',
    days: 'jours de présence',
  },
};

export default function MoodGarden({ lang, logs, compact = false }: MoodGardenProps) {
  const L = LABELS[lang];
  const stage = getGardenStage(logs);
  const plant = GARDEN_PLANTS[stage] || '🌱';
  const streak = logs.length;

  if (compact) {
    return (
      <Link
        href="/mood"
        className="komera-card block p-5 transition hover:shadow-[var(--shadow-warm)] hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl animate-float">{plant}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-hill">{L.title}</p>
            <p className="mt-1 text-sm text-earth">
              {streak > 0 ? `${streak} ${L.days}` : L.empty}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="komera-card overflow-hidden">
      <div className="komera-gradient-warm px-6 py-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-hill">{L.title}</p>
        <div className="relative mx-auto mt-4 flex h-32 w-32 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-sunrise/20 animate-breathe" />
          <span className="relative text-6xl animate-float">{plant}</span>
        </div>
        {stage === 0 ? (
          <p className="mt-4 text-sm text-earth">{L.empty}</p>
        ) : (
          <p className="mt-4 text-sm font-medium text-hill-dark">
            {streak} {L.days} 🌱
          </p>
        )}
      </div>
      <div className="border-t border-[#E8DFD4] p-4">
        <Link
          href="/mood"
          className="block w-full rounded-full bg-hill py-2.5 text-center text-sm font-semibold text-white transition hover:bg-hill-dark"
        >
          {L.visit} →
        </Link>
      </div>
    </div>
  );
}
