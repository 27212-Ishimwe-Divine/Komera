'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { t, getLang, Lang } from '@/lib/translations';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<Lang>('en');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.replace('/login');
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);
    setLang((u.language as Lang) || getLang());
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.replace('/login');
  };

  if (!user) return null;
  const T = t[lang];

  const actionCards = [
    { href: '/chat', emoji: '💬', title: T.chat, desc: T.chatDesc, accent: 'bg-teal-500 text-white' },
    { href: '/mood', emoji: '😊', title: T.mood, desc: T.moodDesc, accent: 'bg-emerald-500 text-white' },
    { href: '/journal', emoji: '📓', title: T.journal, desc: T.journalDesc, accent: 'bg-violet-500 text-white' },
    { href: '/breathe', emoji: '🌬️', title: 'Breathing', desc: 'Slow breathing exercises for calm focus', accent: 'bg-sky-500 text-white' },
    { href: '/resources', emoji: '📚', title: 'Tips', desc: 'Browse practical wellbeing guides', accent: 'bg-slate-500 text-white' },
    { href: '/awareness', emoji: '🧠', title: 'Awareness', desc: 'Learn basic mental health skills', accent: 'bg-blue-500 text-white' },
    { href: '/crisis', emoji: '🆘', title: 'Crisis', desc: 'Get urgent referral support', accent: 'bg-red-500 text-white' },
  ];

  const filteredServices = actionCards.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{T.appName}</h1>
            <p className="text-sm text-slate-500">{T.appTagline}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-900 font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {T.logout}
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-start">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-teal-600 font-semibold">Welcome back</p>
              <div>
                <h2 className="text-4xl font-black text-slate-900 md:text-5xl">{T.dashboardGreeting(user.name)}</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{T.dashboardQuote}</p>
                <p className="mt-4 max-w-2xl text-slate-600 leading-7">{T.dashboardExplain}</p>
              </div>
            </div>
            <div className="rounded-[1.8rem] bg-slate-50 p-6 shadow-sm border border-slate-200">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 font-semibold">Today</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Take one calm step</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">{T.dashboardTip}</p>
              <div className="mt-6 space-y-3">
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="font-semibold text-slate-900">Notice one feeling</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="font-semibold text-slate-900">Take a slow breath</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-teal-600 font-semibold">Services</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">All Komera service tools</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Search or click any box below to go directly to a Komera page.</p>
            </div>
            <div className="w-full md:w-1/2">
              <input
                type="text"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Search chat, mood, journal, crisis, tips..."
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredServices.length === 0 ? (
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-600">No results found. Try another keyword.</div>
            ) : (
              filteredServices.map(card => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl ${card.accent}`}>
                    {card.emoji}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{card.desc}</p>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
