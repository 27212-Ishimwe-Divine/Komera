'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLang, Lang } from '@/lib/translations';
import { useEffect, useState } from 'react';

const navItems = {
  en: [
    { href: '/dashboard', emoji: '🏠', label: 'Home' },
    { href: '/about', emoji: 'ℹ️', label: 'About Us' },
    { href: '/#services', emoji: '🛠️', label: 'Services' },
    { href: '/crisis', emoji: '🆘', label: 'Crisis' },
  ],
  rw: [
    { href: '/dashboard', emoji: '🏠', label: 'Ahabanza' },
    { href: '/about', emoji: 'ℹ️', label: 'Turi bande' },
    { href: '/#services', emoji: '🛠️', label: 'Serivisi' },
    { href: '/crisis', emoji: '🆘', label: 'Ihutirwa' },
  ],
  fr: [
    { href: '/dashboard', emoji: '🏠', label: 'Accueil' },
    { href: '/about', emoji: 'ℹ️', label: 'À propos' },
    { href: '/#services', emoji: '🛠️', label: 'Services' },
    { href: '/crisis', emoji: '🆘', label: 'Urgence' },
  ],
};

const hideOn = ['/', '/login', '/register'];

export default function BottomNav() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    setLang(getLang());
  }, []);

  if (hideOn.includes(pathname)) return null;

  const items = navItems[lang];

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex justify-around items-center py-2 px-1">
        {items.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                active ? 'text-teal-600' : 'text-gray-400 hover:text-teal-500'
              }`}
            >
              <span className={`text-xl transition-transform ${active ? 'scale-125' : ''}`}>{item.emoji}</span>
              <span className={`text-[10px] font-semibold ${active ? 'text-teal-600' : 'text-gray-400'}`}>{item.label}</span>
              {active && <span className="w-1 h-1 bg-teal-600 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
