'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLang, Lang, t } from '@/lib/translations';
import FullNavigation from '@/components/layout/FullNavigation';

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setLang(getLang());
    setLoggedIn(Boolean(localStorage.getItem('token')));
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const T = t[lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className={`border-b border-[#E8DFD4] bg-card/95 backdrop-blur sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'shadow-lg py-3' : 'py-5'}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-hill to-lake text-lg text-white shadow-lg transition hover:scale-110">🌅</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-hill">Komera</p>
              <h1 className="text-xl font-extrabold text-hill-dark">{T.appName}</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-earth">
            <button type="button" onClick={() => router.push('#about')} className="transition hover:text-hill hover:scale-105">About</button>
            <button type="button" onClick={() => router.push('#services')} className="transition hover:text-hill hover:scale-105">Services</button>
            <button type="button" onClick={() => router.push('#contact')} className="transition hover:text-hill hover:scale-105">Contact</button>
            <button
              type="button"
              onClick={() => router.push(loggedIn ? '/dashboard' : '/login')}
              className="rounded-full bg-gradient-to-r from-hill to-lake px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:scale-105"
            >
              {loggedIn ? T.dashboardButton : T.login}
            </button>
          </div>
          <button 
            type="button"
            onClick={() => router.push(loggedIn ? '/dashboard' : '/login')}
            className="md:hidden rounded-full bg-gradient-to-r from-hill to-lake p-2.5 text-white shadow-md"
          >
            {loggedIn ? '🏠' : '👤'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center animate-fade-up">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-hill/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-hill animate-pulse"></span>
              <p className="text-xs font-semibold uppercase tracking-wider text-hill">{T.landingLabel}</p>
            </div>
            <h2 className="text-4xl font-black leading-tight text-hill-dark md:text-5xl lg:text-6xl">{T.landingTitle}</h2>
            <p className="max-w-2xl text-lg leading-8 text-earth">{T.landingSubtitle}</p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => router.push(loggedIn ? '/dashboard' : '/register')}
                className="group rounded-full bg-gradient-to-r from-hill to-lake px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
              >
                {loggedIn ? T.dashboardButton : T.register}
                <span className="ml-2 transition group-hover:translate-x-1">→</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="rounded-full border-2 border-[#E8DFD4] bg-card px-8 py-4 text-sm font-semibold text-hill-dark transition hover:border-hill hover:bg-hill/5"
              >
                {T.signIn}
              </button>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-hill/20 to-lake/20 flex items-center justify-center text-xs">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-earth">
                <span className="font-semibold text-hill-dark">10,000+</span> people finding peace
              </p>
            </div>
          </div>

          <div className="komera-gradient-hero rounded-[2rem] p-8 text-white shadow-[var(--shadow-warm)] animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">🆘</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-label-hero">{T.landingHighlight}</p>
              </div>
              <h3 className="text-3xl font-bold">{T.landingEmergencyHeading}</h3>
              <p className="text-sm leading-7 text-white/85">{T.landingEmergencyText}</p>
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-label-hero">{T.landingHotlineLabel}</p>
                <p className="mt-2 text-xl font-semibold">8015 · 112</p>
                <p className="text-sm text-white/75">{T.landingHotlineNote}</p>
              </div>
              <a href="tel:8015" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-hill-dark transition hover:bg-white/90">
                <span>📞</span>
                Call Now
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="mt-20 space-y-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-hill">About Us</p>
            <h3 className="mt-3 text-3xl font-bold text-hill-dark">{T.aboutSectionTitle}</h3>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="komera-card p-8 group hover:shadow-xl transition">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-hill to-lake text-3xl text-white shadow-lg group-hover:scale-110 transition">
                💚
              </div>
              <h4 className="mt-6 text-xl font-semibold text-hill-dark">{T.aboutMissionTitle}</h4>
              <p className="mt-4 text-earth leading-7">{T.aboutMissionText}</p>
            </div>
            <div className="grid gap-4">
              <div className="komera-card p-6 group hover:shadow-xl transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sunrise to-bloom text-2xl text-white shadow-md group-hover:scale-110 transition">
                  🌟
                </div>
                <h4 className="mt-4 text-lg font-semibold text-hill-dark">{T.aboutValuesTitle}</h4>
                <p className="mt-3 text-earth leading-7">{T.aboutValuesText}</p>
              </div>
              <div className="komera-card p-6 group hover:shadow-xl transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-earth to-hill text-2xl text-white shadow-md group-hover:scale-110 transition">
                  🎯
                </div>
                <h4 className="mt-4 text-lg font-semibold text-hill-dark">{T.aboutOfferTitle}</h4>
                <p className="mt-3 text-earth leading-7">{T.aboutOfferText}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mt-20">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-hill">Our Services</p>
            <h3 className="mt-3 text-3xl font-bold text-hill-dark">{T.servicesSectionTitle}</h3>
            <p className="mt-4 max-w-2xl mx-auto text-earth leading-7">{T.servicesSectionText}</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: '🆘', title: T.service1Title, text: T.service1Text, href: '/crisis', color: 'from-red-500 to-red-600' },
              { icon: '💬', title: T.service3Title, text: T.service3Text, href: '/chat', color: 'from-blue-500 to-indigo-500' },
              { icon: '🌸', title: T.mood, text: T.moodDesc, href: '/mood', color: 'from-pink-500 to-rose-500' },
              { icon: '📓', title: T.service4Title, text: T.service4Text, href: '/journal', color: 'from-amber-500 to-orange-500' },
            ].map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => router.push(loggedIn ? item.href : '/login')}
                className="komera-card group p-6 text-left transition hover:-translate-y-2 hover:shadow-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-4xl text-white shadow-lg transition group-hover:scale-110 group-hover:rotate-6`}>
                  {item.icon}
                </div>
                <h4 className="mt-5 text-xl font-semibold text-hill-dark">{item.title}</h4>
                <p className="mt-3 text-earth leading-7">{item.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-hill group-hover:translate-x-1 transition">
                  {loggedIn ? 'Open →' : 'Login →'}
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

        <section className="mt-20">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-hill">{T.allFeatures}</p>
            <h3 className="mt-3 text-3xl font-bold text-hill-dark">{T.exploreAll}</h3>
            <p className="mt-4 max-w-2xl mx-auto text-earth leading-7">
              {T.discoverTools}
            </p>
          </div>
          <div className="mt-8">
            <FullNavigation lang={lang} loggedIn={loggedIn} />
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="mt-20 border-t border-[#E8DFD4] bg-card/50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-hill to-lake text-lg text-white">🌅</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-hill">Komera</p>
                  <h4 className="text-lg font-bold text-hill-dark">{T.appName}</h4>
                </div>
              </div>
              <p className="text-sm text-earth leading-6">
                {T.landingSubtitle}
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-hill-dark mb-4">{T.quickLinks}</h5>
              <div className="space-y-2">
                <button type="button" onClick={() => router.push('#about')} className="block text-sm text-earth hover:text-hill transition">About</button>
                <button type="button" onClick={() => router.push('#services')} className="block text-sm text-earth hover:text-hill transition">Services</button>
                <button type="button" onClick={() => router.push('#contact')} className="block text-sm text-earth hover:text-hill transition">Contact</button>
                <button type="button" onClick={() => router.push('/resources')} className="block text-sm text-earth hover:text-hill transition">Resources</button>
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-hill-dark mb-4">{T.emergency}</h5>
              <div className="space-y-2">
                <a href="tel:112" className="block text-sm text-earth hover:text-hill transition font-semibold">📞 {T.policeEmergency}: {T.policeNumber}</a>
                <a href="tel:8015" className="block text-sm text-earth hover:text-hill transition">📞 8015 (Hotline)</a>
                <a href="tel:114" className="block text-sm text-earth hover:text-hill transition">📞 114 (Health Line)</a>
                <a href="https://www.kmentalhealth.gov.rw/" target="blank" rel="noreferrer" className="block text-sm text-earth hover:text-hill transition">🌐 Mental Health Portal</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#E8DFD4] text-center text-sm text-earth">
            <p>© 2026 Komera. {T.madeWithLove}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
