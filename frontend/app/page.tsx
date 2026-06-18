'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLang, Lang, t } from '@/lib/translations';

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLang(getLang());
    setLoggedIn(Boolean(localStorage.getItem('token')));
  }, []);

  const T = t[lang];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Komera</p>
            <h1 className="text-2xl font-extrabold">{T.appName}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <button onClick={() => router.push('#about')} className="transition hover:text-teal-600">About Us</button>
            <button onClick={() => router.push('#services')} className="transition hover:text-teal-600">Services</button>
            <button onClick={() => router.push('#contact')} className="transition hover:text-teal-600">Contact</button>
            <button onClick={() => router.push(loggedIn ? '/dashboard' : '/login')} className="rounded-full border border-teal-600 bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700">
              {loggedIn ? T.dashboardButton : T.login}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-teal-600 font-semibold">{T.landingLabel}</p>
            <h2 className="text-4xl font-black leading-tight text-slate-900 md:text-5xl">{T.landingTitle}</h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">{T.landingSubtitle}</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => router.push(loggedIn ? '/dashboard' : '/login')} className="rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/10 transition hover:bg-teal-700">
                {loggedIn ? T.dashboardButton : T.signIn}
              </button>
              <button onClick={() => router.push('/register')} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-600">
                {T.register}
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-cyan-700 via-teal-700 to-emerald-700 p-8 text-white shadow-2xl shadow-slate-900/10">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-100 font-semibold">{T.landingHighlight}</p>
              <h3 className="text-3xl font-bold">{T.landingEmergencyHeading}</h3>
              <p className="text-sm leading-7 text-cyan-100/90">{T.landingEmergencyText}</p>
              <div className="rounded-3xl bg-white/10 p-5 shadow-inner">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-100 font-semibold">{T.landingHotlineLabel}</p>
                <p className="mt-2 text-xl font-semibold">+250 793 902 059</p>
                <p className="text-sm text-cyan-100/80">{T.landingHotlineNote}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mt-20 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-teal-600 font-semibold">About Us</p>
              <h3 className="text-3xl font-bold text-slate-900">{T.aboutSectionTitle}</h3>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
              <h4 className="text-xl font-semibold text-slate-900">{T.aboutMissionTitle}</h4>
              <p className="mt-4 text-slate-600 leading-7">{T.aboutMissionText}</p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[2rem] bg-slate-50 p-6 border border-slate-200">
                <h4 className="text-lg font-semibold text-slate-900">{T.aboutValuesTitle}</h4>
                <p className="mt-3 text-slate-600 leading-7">{T.aboutValuesText}</p>
              </div>
              <div className="rounded-[2rem] bg-slate-50 p-6 border border-slate-200">
                <h4 className="text-lg font-semibold text-slate-900">{T.aboutOfferTitle}</h4>
                <p className="mt-3 text-slate-600 leading-7">{T.aboutOfferText}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mt-20">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-teal-600 font-semibold">Our Services</p>
            <h3 className="mt-3 text-3xl font-bold text-slate-900">{T.servicesSectionTitle}</h3>
            <p className="mt-4 max-w-2xl text-slate-600 leading-7">{T.servicesSectionText}</p>
            <p className="mt-4 text-sm text-slate-500">You can browse all service summaries before login. Tap a card to sign in and start using the service.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: '🆘', title: T.service1Title, text: T.service1Text, href: '/crisis' },
              { icon: '📞', title: T.service2Title, text: T.service2Text, href: '/resources' },
              { icon: '💬', title: T.service3Title, text: T.service3Text, href: '/chat' },
              { icon: '📚', title: T.service4Title, text: T.service4Text, href: '/journal' },
            ].map((item) => (
              <button key={item.title}
                type="button"
                onClick={() => router.push(loggedIn ? item.href : '/login')}
                className="group rounded-[2rem] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-teal-300"
              >
                <p className="text-3xl">{item.icon}</p>
                <h4 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h4>
                <p className="mt-3 text-slate-600 leading-7">{item.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition group-hover:text-teal-700">
                  {loggedIn ? 'Open service' : 'Login to use'}
                  <span>→</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-20 rounded-[2rem] bg-gradient-to-r from-slate-900 to-teal-700 p-10 text-white shadow-2xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-200 font-semibold">Contact</p>
              <h3 className="mt-3 text-3xl font-bold">{T.contactSectionTitle}</h3>
              <p className="mt-4 text-slate-200 leading-7">{T.contactSectionText}</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200 font-semibold">Hotline</p>
                <p className="mt-2 text-2xl font-semibold">8015</p>
                <p className="mt-1 text-sm text-cyan-100">{T.contactSuicideLine}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200 font-semibold">Health Line</p>
                <p className="mt-2 text-2xl font-semibold">114</p>
                <p className="mt-1 text-sm text-cyan-100">{T.contactRbcLine}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="https://www.kmentalhealth.gov.rw/" target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              {T.contactPortalButton}
            </a>
            <a href="tel:+250793902059" className="inline-flex rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              +250 793 902 059
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
