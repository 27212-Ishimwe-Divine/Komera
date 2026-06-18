'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { t, getLang, Lang } from '@/lib/translations';

export default function AboutPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    setLang(getLang());
  }, [router]);

  const T = t[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-indigo-800 to-cyan-700 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="text-white font-bold text-lg hover:text-cyan-200 transition">{T.back}</Link>
        <span className="text-cyan-200 text-sm font-medium">{T.aboutCardTitle}</span>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-8 text-white shadow-2xl shadow-indigo-200/20">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/90 font-semibold mb-3">Komera</p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{T.aboutCardTitle}</h1>
          <p className="mt-5 text-base md:text-lg text-cyan-100/90 leading-relaxed">{T.aboutIntro}</p>
        </section>

        <section className="grid gap-5">
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{T.aboutMissionTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{T.aboutMissionText}</p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{T.aboutValuesTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{T.aboutValuesText}</p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{T.aboutOfferTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{T.aboutOfferText}</p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{T.aboutContactTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{T.aboutContactText}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
