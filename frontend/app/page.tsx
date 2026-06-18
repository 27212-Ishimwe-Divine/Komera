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
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-[#E8DFD4] bg-card/95 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-hill text-lg text-white">🌅</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-hill">Komera</p>
              <h1 className="text-xl font-extrabold text-hill-dark">{T.appName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-earth">
            <button type="button" onClick={() => router.push('#about')} className="transition hover:text-hill">About</button>
            <button type="button" onClick={() => router.push('#services')} className="transition hover:text-hill">Services</button>
            <button type="button" onClick={() => router.push('#contact')} className="transition hover:text-hill">Contact</button>
            <button
              type="button"
              onClick={() => router.push(loggedIn ? '/dashboard' : '/login')}
              className="rounded-full bg-hill px-4 py-2 text-sm font-semibold text-white transition hover:bg-hill-dark"
            >
              {loggedIn ? T.dashboardButton : T.login}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-hill">{T.landingLabel}</p>
            <h2 className="text-4xl font-black leading-tight text-hill-dark md:text-5xl">{T.landingTitle}</h2>
            <p className="max-w-2xl text-lg leading-8 text-earth">{T.landingSubtitle}</p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => router.push(loggedIn ? '/dashboard' : '/register')}
                className="rounded-full bg-hill px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-hill-dark"
              >
                {loggedIn ? T.dashboardButton : T.register}
              </button>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="rounded-full border border-[#E8DFD4] bg-card px-6 py-3 text-sm font-semibold text-hill-dark transition hover:border-hill"
              >
                {T.signIn}
              </button>
            </div>
          </div>

          <div className="komera-gradient-hero rounded-[2rem] p-8 text-white shadow-[var(--shadow-warm)]">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-label-hero">{T.landingHighlight}</p>
              <h3 className="text-3xl font-bold">{T.landingEmergencyHeading}</h3>
              <p className="text-sm leading-7 text-white/85">{T.landingEmergencyText}</p>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-label-hero">{T.landingHotlineLabel}</p>
                <p className="mt-2 text-xl font-semibold">8015 · 112</p>
                <p className="text-sm text-white/75">{T.landingHotlineNote}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mt-20 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-hill">About Us</p>
          <h3 className="text-3xl font-bold text-hill-dark">{T.aboutSectionTitle}</h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="komera-card p-6">
              <h4 className="text-xl font-semibold text-hill-dark">{T.aboutMissionTitle}</h4>
              <p className="mt-4 text-earth leading-7">{T.aboutMissionText}</p>
            </div>
            <div className="grid gap-4">
              <div className="komera-card p-6">
                <h4 className="text-lg font-semibold text-hill-dark">{T.aboutValuesTitle}</h4>
                <p className="mt-3 text-earth leading-7">{T.aboutValuesText}</p>
              </div>
              <div className="komera-card p-6">
                <h4 className="text-lg font-semibold text-hill-dark">{T.aboutOfferTitle}</h4>
                <p className="mt-3 text-earth leading-7">{T.aboutOfferText}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mt-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-hill">Our Services</p>
          <h3 className="mt-3 text-3xl font-bold text-hill-dark">{T.servicesSectionTitle}</h3>
          <p className="mt-4 max-w-2xl text-earth leading-7">{T.servicesSectionText}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: '🆘', title: T.service1Title, text: T.service1Text, href: '/crisis' },
              { icon: '💬', title: T.service3Title, text: T.service3Text, href: '/chat' },
              { icon: '🌸', title: T.mood, text: T.moodDesc, href: '/mood' },
              { icon: '📓', title: T.service4Title, text: T.service4Text, href: '/journal' },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => router.push(loggedIn ? item.href : '/login')}
                className="komera-card group p-6 text-left transition hover:-translate-y-1 hover:shadow-[var(--shadow-warm)]"
              >
                <p className="text-3xl">{item.icon}</p>
                <h4 className="mt-5 text-xl font-semibold text-hill-dark">{item.title}</h4>
                <p className="mt-3 text-earth leading-7">{item.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-hill">
                  {loggedIn ? 'Open →' : 'Login to use →'}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-20 komera-gradient-hero rounded-[2rem] p-10 text-white">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-label-hero">Contact</p>
              <h3 className="mt-3 text-3xl font-bold">{T.contactSectionTitle}</h3>
              <p className="mt-4 text-white/85 leading-7">{T.contactSectionText}</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-wider text-label-hero font-semibold">Hotline</p>
                <p className="mt-2 text-2xl font-semibold">8015</p>
                <p className="mt-1 text-sm text-white/75">{T.contactSuicideLine}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-wider text-label-hero font-semibold">Health Line</p>
                <p className="mt-2 text-2xl font-semibold">114</p>
                <p className="mt-1 text-sm text-white/75">{T.contactRbcLine}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://www.kmentalhealth.gov.rw/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-hill-dark transition hover:bg-sunrise-soft"
            >
              {T.contactPortalButton}
            </a>
            <a href="tel:8015" className="inline-flex rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              Call 8015
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
