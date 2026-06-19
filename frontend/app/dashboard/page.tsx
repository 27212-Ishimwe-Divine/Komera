
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { t } from '@/lib/translations';
import { useAuth } from '@/context/AuthContext';
import MoodGarden from '@/components/garden/MoodGarden';
import { DAILY_STEPS, getDailyProverb } from '@/lib/constants';

interface MoodLog {
  mood: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, lang, logout } = useAuth();
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const T = t[lang];
  const proverb = getDailyProverb(lang);
  const dailySteps = DAILY_STEPS[lang];

  useEffect(() => {
    api.get('/mood').then(({ data }) => setLogs(data)).catch(() => {});
  }, []);

  if (!user) return null;

  const actionCards = [
    { href: '/chat', emoji: '💬', title: T.chat, desc: T.chatDesc, accent: 'from-hill to-lake' },
    { href: '/mood', emoji: '🌸', title: T.mood, desc: T.moodDesc, accent: 'from-sunrise to-bloom' },
    { href: '/journal', emoji: '📓', title: T.journal, desc: T.journalDesc, accent: 'from-earth to-hill' },
    { 
      href: '/breathe', 
      emoji: '🌬️', 
      title: T.breatheTitle, 
      desc: T.breatheDesc, 
      accent: 'from-lake to-hill' 
    },
    { 
      href: '/ground', 
      emoji: '🌍', 
      title: T.groundTitle, 
      desc: T.groundDesc, 
      accent: 'from-hill-dark to-hill' 
    },
  ];

  const filtered = actionCards.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">   {/* Bigger width + padding */}

        {/* Greeting */}
        <section className="animate-fade-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-hill">
            {T.welcomeBack || 'Welcome back'}
          </p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-hill-dark">{T.dashboardGreeting ? T.dashboardGreeting(user.name) : user.name}</h1>
              <p className="mt-3 text-base leading-relaxed text-earth">{T.dashboardExplain}</p>
            </div>
            <button
              onClick={logout}
              className="flex-shrink-0 rounded-full border border-[#E8DFD4] bg-card px-4 py-2 text-sm font-semibold text-earth transition hover:border-hill hover:text-hill"
            >
              {T.logout}
            </button>
          </div>
        </section>

        {/* Daily proverb */}
        <section className="komera-card p-7 animate-fade-up">   {/* Bigger padding */}
          <p className="text-xs font-semibold uppercase tracking-wider text-hill">
            {T.dailyProverb || "Today's proverb"}
          </p>
          <p className="proverb-text mt-3 text-lg text-hill-dark">{proverb.text}</p>
          <p className="mt-3 text-sm text-earth">{proverb.meaning}</p>
        </section>

        {/* Garden + daily steps */}
        <div className="grid gap-6 sm:grid-cols-2">   {/* More gap */}
          <div className="scale-[1.02]">   {/* Slightly bigger garden */}
            <MoodGarden lang={lang} logs={logs} />
          </div>
          <div className="komera-card p-7">   {/* Bigger padding */}
            <p className="text-xs font-semibold uppercase tracking-wider text-hill">
              {T.today || 'Today'}
            </p>
            <h3 className="mt-3 font-bold text-hill-dark text-xl">
              {T.oneCalmStep || 'One calm step'}
            </h3>
            <div className="mt-5 space-y-3">
              {dailySteps.map((step: any) => (
                <Link
                  key={step.href}
                  href={step.href}
                  className="flex items-center gap-4 rounded-2xl bg-background p-4 transition hover:bg-lake-soft"
                >
                  <span className="text-2xl">{step.emoji}</span>
                  <span className="text-base font-medium text-hill-dark">{step.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Services grid */}
        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-hill">
              {T.services || 'Services'}
            </p>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={T.searchPlaceholder || 'Search...'}
              className="mt-4 w-full rounded-full border border-[#E8DFD4] bg-card px-5 py-3 text-base outline-none transition focus:border-lake focus:ring-2 focus:ring-lake-soft"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="komera-card group overflow-hidden p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm)]"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${card.accent} text-2xl text-white shadow-sm`}>
                  {card.emoji}
                </div>
                <h3 className="mt-5 font-semibold text-xl text-hill-dark">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-earth">{card.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}