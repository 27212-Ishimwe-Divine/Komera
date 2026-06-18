'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { t, getLang, Lang } from '@/lib/translations';

export default function AwarenessPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    setLang(getLang());
  }, [router]);

  const T = t[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-teal-800 to-emerald-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="text-white font-bold text-lg hover:text-teal-200 transition">{T.back}</Link>
        <span className="text-teal-200 text-sm font-medium">{T.awarenessCardTitle}</span>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-8">
          <section className="rounded-[2rem] bg-gradient-to-r from-teal-700 via-cyan-600 to-emerald-600 p-8 text-white shadow-2xl shadow-teal-200/30">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/90 font-semibold mb-3">Komera</p>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{T.awarenessTitle}</h1>
            <p className="mt-5 text-base md:text-lg text-teal-100/95 leading-relaxed">{T.awarenessIntro}</p>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{T.awarenessWhatTitle}</h2>
              <p className="text-gray-600 leading-relaxed">{T.awarenessWhatText}</p>
            </div>
            <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{T.awarenessKnowTitle}</h2>
              <p className="text-gray-600 leading-relaxed">{T.awarenessKnowText}</p>
            </div>
            <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{T.awarenessProblemsTitle}</h2>
              <p className="text-gray-600 leading-relaxed">{T.awarenessProblemsText}</p>
            </div>
            <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{T.awarenessHelpTitle}</h2>
              <p className="text-gray-600 leading-relaxed">{T.awarenessHelpText}</p>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{T.awarenessTraumaTitle}</h2>
              <p className="text-gray-600 leading-relaxed">{T.awarenessTraumaText}</p>
            </div>
          </section>

          <section className="rounded-3xl bg-teal-50 border border-teal-100 p-6 shadow-sm">
            <p className="text-teal-900 text-sm leading-relaxed font-semibold">{T.awarenessFeatureTitle}</p>
            <p className="mt-3 text-gray-700 text-sm leading-relaxed">{T.awarenessFeatureText}</p>
          </section>

          <section className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <p className="text-gray-700 text-sm leading-relaxed">{T.awarenessNote}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
