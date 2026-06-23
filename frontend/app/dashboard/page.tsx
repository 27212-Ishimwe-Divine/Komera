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
    if (user) {
      api.get('/mood').then(({ data }) => setLogs(data)).catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  const actionCards = [
    { href: '/chat', emoji: '💬', title: T.chat, desc: T.chatDesc, accent: 'from-hill to-lake' },
    { href: '/mood', emoji: '🌸', title: T.mood, desc: T.moodDesc, accent: 'from-sunrise to-bloom' },
    { href: '/journal', emoji: '📓', title: T.journal, desc: T.journalDesc, accent: 'from-earth to-hill' },
    { 
      href: '/garden', 
      emoji: '🌳', 
      title: T.yourGarden || "Your Garden", 
      desc: T.gardenDesc || "Watch your inner world grow", 
      accent: 'from-emerald-600 to-amber-500' 
    },
    { 
      href: '/breathe', 
      emoji: '🌬️', 
      title: T.breatheTitle || "Breathe", 
      desc: T.breatheDesc || "Find calm in every breath", 
      accent: 'from-lake to-hill' 
    },
  ];

  const filtered = actionCards.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-12">
      <main className="mx-auto max-w-4xl px-6 py-10 space-y-10">

        {/* Greeting */}
        <section className="animate-fade-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-hill">
            {T.welcomeBack || 'Welcome back'}
          </p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-hill-dark leading-tight">
                {T.dashboardGreeting ? T.dashboardGreeting(user.name) : `Welcome, ${user.name}`}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-earth">
                {T.dashboardExplain || "How are you feeling today?"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:112"
                className="rounded-full border-2 border-red-500 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
              >
                📞 {T.policeEmergency}: {T.policeNumber}
              </a>
              <button
                onClick={logout}
                className="rounded-full border border-[#E8DFD4] bg-card px-5 py-2 text-sm font-medium text-earth hover:border-hill hover:text-hill transition"
              >
                {T.logout}
              </button>
            </div>
          </div>
        </section>

        {/* Daily Proverb */}
        <section className="komera-card p-8 rounded-3xl animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-hill">
            {T.dailyProverb || "Today's Wisdom"}
          </p>
          <p className="proverb-text mt-4 text-xl leading-relaxed text-hill-dark">
            {proverb.text}
          </p>
          <p className="mt-3 text-sm text-earth">{proverb.meaning}</p>
        </section>

        {/* Garden + Daily Steps */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <MoodGarden lang={lang} logs={logs} compact={false} />
          </div>

          <div className="lg:col-span-2 komera-card p-7 rounded-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-hill">
              {T.today || "Today's Calm Steps"}
            </p>
            <div className="mt-6 space-y-3">
              {dailySteps.map((step: any, i: number) => (
                <Link
                  key={i}
                  href={step.href}
                  className="flex items-center gap-4 rounded-2xl bg-background p-4 transition hover:bg-lake-soft group"
                >
                  <span className="text-3xl transition group-hover:scale-110">{step.emoji}</span>
                  <div>
                    <p className="font-semibold text-hill-dark">{step.title}</p>
                    <p className="text-xs text-earth mt-0.5">{step.desc || ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tools */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wider text-hill">
              {T.services || 'Explore Tools'}
            </p>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={T.searchPlaceholder || 'Search tools...'}
              className="w-80 rounded-full border border-[#E8DFD4] bg-card px-5 py-3 text-sm focus:border-lake focus:ring-2 focus:ring-lake-soft outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className="komera-card group p-7 rounded-3xl transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${card.accent} text-4xl text-white shadow-inner`}>
                  {card.emoji}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-hill-dark">{card.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-earth">{card.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}