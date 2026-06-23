'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lang } from '@/lib/translations';

const NAV: Record<Lang, { href: string; icon: string; label: string }[]> = {
  en: [
    { href: '/dashboard', icon: '🌱', label: 'Garden' },
    { href: '/chat', icon: '💬', label: 'Chat' },
    { href: '/mood', icon: '🌸', label: 'Mood' },
    { href: '/journal', icon: '📓', label: 'Journal' },
    { href: '/resources', icon: '📚', label: 'Resources' },
  ],
  rw: [
    { href: '/dashboard', icon: '🌱', label: 'Urusobe' },
    { href: '/chat', icon: '💬', label: 'Ikiganiro' },
    { href: '/mood', icon: '🌸', label: 'Imitekerere' },
    { href: '/journal', icon: '📓', label: 'Inyandiko' },
    { href: '/resources', icon: '📚', label: 'Amakuru' },
  ],
  fr: [
    { href: '/dashboard', icon: '🌱', label: 'Jardin' },
    { href: '/chat', icon: '💬', label: 'Chat' },
    { href: '/mood', icon: '🌸', label: 'Humeur' },
    { href: '/journal', icon: '📓', label: 'Journal' },
    { href: '/resources', icon: '📚', label: 'Ressources' },
  ],
};

const HIDE_ON = ['/', '/login', '/register', '/onboarding'];

const CRISIS_LABEL: Record<Lang, string> = {
  en: 'Crisis',
  rw: 'Ihutirwa',
  fr: 'Urgence',
};

export default function WarmNav() {
  const pathname = usePathname();
  const { lang, user } = useAuth();

  if (HIDE_ON.includes(pathname) || !user) return null;

  const items = NAV[lang];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E8DFD4] bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hill text-lg text-white shadow-sm">
              🌅
            </span>
            <div>
              <p className="text-sm font-bold text-hill-dark leading-none">Komera</p>
              <p className="text-[10px] text-earth leading-none mt-0.5">Ndwira</p>
            </div>
          </Link>
          <Link
            href="/crisis"
            className="flex items-center gap-1.5 rounded-full bg-crisis-soft px-3 py-1.5 text-xs font-semibold text-crisis transition hover:bg-crisis hover:text-white"
          >
            <span aria-hidden>🆘</span>
            <span>{CRISIS_LABEL[lang]}</span>
          </Link>
        </div>
      </header>

      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E8DFD4] bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 py-1">
          {items.map(({ href, icon, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-all ${
                  active ? 'text-hill' : 'text-earth/60 hover:text-hill'
                }`}
              >
                <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`} aria-hidden>
                  {icon}
                </span>
                <span className="text-[10px] font-semibold">{label}</span>
                {active && <span className="h-1 w-1 rounded-full bg-sunrise" aria-hidden />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
