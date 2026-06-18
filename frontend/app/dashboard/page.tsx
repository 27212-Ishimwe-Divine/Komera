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
    { href: '/breathe', emoji: '🌬️', title: lang === 'rw' ? 'Guhumeka' : lang === 'fr' ? 'Respirer' : 'Breathe', desc: lang === 'rw' ? 'Humeka utuje' : lang === 'fr' ? 'Exercices de respiration' : 'Slow breathing for calm', accent: 'from-lake to-hill' },
    { href: '/ground', emoji: '🌍', title: lang === 'rw' ? 'Guhumuriza' : lang === 'fr' ? 'Ancrage' : 'Grounding', desc: lang === 'rw' ? 'Garuka mu gihe cy\'ubu' : lang === 'fr' ? 'Revenir au présent' : '5-4-3-2-1 sensory calm', accent: 'from-hill-dark to-hill' },
    { href: '/checkin', emoji: '✨', title: lang === 'rw' ? 'Isuzuma' : lang === 'fr' ? 'Bilan' : 'Check-in', desc: lang === 'rw' ? 'Reba uko umeze' : lang === 'fr' ? 'Évaluez votre journée' : 'Daily wellness survey', accent: 'from-bloom to-sunrise' },
    { href: '/resources', emoji: '📚', title: lang === 'rw' ? 'Inama' : lang === 'fr' ? 'Conseils' : 'Tips', desc: lang === 'rw' ? 'Inama z\'ubuzima' : lang === 'fr' ? 'Guides bien-être' : 'Wellbeing guides', accent: 'from-earth to-lake' },
    { href: '/helpers', emoji: '🤝', title: lang === 'rw' ? 'Abafasha' : lang === 'fr' ? 'Aidants' : 'Helpers', desc: lang === 'rw' ? 'Abajyanama n\'ibitaro' : lang === 'fr' ? 'Professionnels & hôpitaux' : 'Therapists & hospitals', accent: 'from-hill to-earth' },
    { href: '/community', emoji: '💛', title: lang === 'rw' ? 'Umuryango' : lang === 'fr' ? 'Communauté' : 'Community', desc: lang === 'rw' ? 'Inkuru z\'ubudasa' : lang === 'fr' ? 'Histoires de résilience' : 'Shared stories', accent: 'from-sunrise to-hill' },
    { href: '/crisis', emoji: '🆘', title: lang === 'rw' ? 'Ihutirwa' : lang === 'fr' ? 'Urgence' : 'Crisis', desc: lang === 'rw' ? 'Ubufasha bwihuse' : lang === 'fr' ? 'Aide immédiate' : 'Immediate support', accent: 'from-crisis to-earth' },
  ];

  const filtered = actionCards.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Greeting */}
        <section className="animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-wider text-hill">
            {lang === 'rw' ? 'Murakaza neza' : lang === 'fr' ? 'Bon retour' : 'Welcome back'}
          </p>
          <div className="mt-2 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-hill-dark">{T.dashboardGreeting(user.name)}</h1>
              <p className="mt-2 text-sm leading-relaxed text-earth">{T.dashboardExplain}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex-shrink-0 rounded-full border border-[#E8DFD4] bg-card px-3 py-1.5 text-xs font-semibold text-earth transition hover:border-hill hover:text-hill"
            >
              {T.logout}
            </button>
          </div>
        </section>

        {/* Daily proverb */}
        <section className="komera-card p-5 animate-fade-up">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-hill">
            {lang === 'rw' ? 'Imigenzo y\'uyu munsi' : lang === 'fr' ? 'Proverbe du jour' : 'Today\'s proverb'}
          </p>
          <p className="proverb-text mt-2 text-sm text-hill-dark">{proverb.text}</p>
          <p className="mt-2 text-xs text-earth">{proverb.meaning}</p>
        </section>

        {/* Garden + daily steps */}
        <div className="grid gap-4 sm:grid-cols-2">
          <MoodGarden lang={lang} logs={logs} />
          <div className="komera-card p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-hill">
              {lang === 'rw' ? 'Uyu munsi' : lang === 'fr' ? 'Aujourd\'hui' : 'Today'}
            </p>
            <h3 className="mt-2 font-bold text-hill-dark">
              {lang === 'rw' ? 'Fata intambwe imwe ituje' : lang === 'fr' ? 'Un pas calme' : 'One calm step'}
            </h3>
            <div className="mt-4 space-y-2">
              {dailySteps.map((step) => (
                <Link
                  key={step.href}
                  href={step.href}
                  className="flex items-center gap-3 rounded-2xl bg-background p-3 transition hover:bg-lake-soft"
                >
                  <span className="text-xl">{step.emoji}</span>
                  <span className="text-sm font-medium text-hill-dark">{step.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Services grid */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-hill">
              {lang === 'rw' ? 'Serivisi' : lang === 'fr' ? 'Services' : 'Services'}
            </p>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'rw'
                  ? 'Shakisha...'
                  : lang === 'fr'
                  ? 'Rechercher...'
                  : 'Search chat, mood, journal...'
              }
              className="mt-3 w-full rounded-full border border-[#E8DFD4] bg-card px-4 py-2.5 text-sm outline-none transition focus:border-lake focus:ring-2 focus:ring-lake-soft"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="komera-card group overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm)]"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-lg text-white shadow-sm`}
                >
                  {card.emoji}
                </div>
                <h3 className="mt-3 font-semibold text-hill-dark">{card.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-earth">{card.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
