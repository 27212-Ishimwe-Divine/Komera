'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lang, t } from '@/lib/translations';

interface NavItem {
  href: string;
  icon: string;
  label: string;
  description: string;
  category: string;
  popular?: boolean;
  new?: boolean;
}

const NAVIGATION_ITEMS: Record<Lang, NavItem[]> = {
  en: [
    // Emergency
    {
      href: '/crisis',
      icon: '🆘',
      label: 'Crisis Support',
      description: 'Immediate help for emergencies',
      category: 'Emergency',
    },
    // Wellness Tools
    {
      href: '/mood',
      icon: '🌸',
      label: 'Mood Tracker',
      description: 'Track and understand your feelings',
      category: 'Wellness Tools',
    },
    {
      href: '/journal',
      icon: '📓',
      label: 'Journal',
      description: 'Write and reflect on your thoughts',
      category: 'Wellness Tools',
    },
    {
      href: '/breathe',
      icon: '🌬️',
      label: 'Breathing Exercises',
      description: 'Calm your mind with breathing',
      category: 'Wellness Tools',
    },
    {
      href: '/ground',
      icon: '🌍',
      label: 'Grounding',
      description: 'Stay present and centered',
      category: 'Wellness Tools',
    },
    {
      href: '/checkin',
      icon: '✅',
      label: 'Daily Check-in',
      description: 'Start your day mindfully',
      category: 'Wellness Tools',
    },
    {
      href: '/feelings',
      icon: '💭',
      label: 'Explore Feelings',
      description: 'Understand your emotions',
      category: 'Wellness Tools',
    },
    {
      href: '/awareness',
      icon: '🧘',
      label: 'Mindfulness',
      description: 'Practice awareness and presence',
      category: 'Wellness Tools',
    },
    {
      href: '/garden',
      icon: '🌱',
      label: 'Your Garden',
      description: 'Watch your wellness grow',
      category: 'Wellness Tools',
      popular: true,
    },
    // Communication
    {
      href: '/chat',
      icon: '💬',
      label: 'Chat',
      description: 'Talk with supportive listeners',
      category: 'Communication',
      popular: true,
    },
    {
      href: '/community',
      icon: '🤝',
      label: 'Community',
      description: 'Connect with others',
      category: 'Communication',
    },
    // Information
    {
      href: '/about',
      icon: 'ℹ️',
      label: 'About Us',
      description: 'Learn about Komera',
      category: 'Information',
    },
    {
      href: '/resources',
      icon: '📚',
      label: 'Resources',
      description: 'Helpful articles and guides',
      category: 'Information',
    },
    {
      href: '/helpers',
      icon: '🙏',
      label: 'Helpers',
      description: 'Support resources',
      category: 'Information',
    },
    // Professional
    {
      href: '/therapist',
      icon: '👨‍⚕️',
      label: 'Find a Therapist',
      description: 'Professional mental health support',
      category: 'Professional',
    },
    {
      href: '/therapist/testimonials',
      icon: '⭐',
      label: 'Testimonials',
      description: 'Stories from others',
      category: 'Professional',
    },
  ],
  rw: [
    // Emergency
    {
      href: '/crisis',
      icon: '🆘',
      label: 'Igiterane',
      description: 'Ifashayobora ryihuse',
      category: 'Emergency',
    },
    // Wellness Tools
    {
      href: '/mood',
      icon: '🌸',
      label: 'Kuvuga imitekerere',
      description: 'Rakaza no kumenya imitekerere',
      category: 'Wellness Tools',
      popular: true,
    },
    {
      href: '/journal',
      icon: '📓',
      label: 'Inyandiko',
      description: 'Andika wumva iki',
      category: 'Wellness Tools',
    },
    {
      href: '/breathe',
      icon: '🌬️',
      label: 'Guhema',
      description: 'Vugisha umutwe wawe',
      category: 'Wellness Tools',
    },
    {
      href: '/ground',
      icon: '🌍',
      label: 'Kugira umutwe',
      description: 'Ubuze kuri uwo wuri',
      category: 'Wellness Tools',
    },
    {
      href: '/checkin',
      icon: '✅',
      label: 'Kugenzura',
      description: 'Tangira umunsi mwiza',
      category: 'Wellness Tools',
    },
    {
      href: '/feelings',
      icon: '💭',
      label: 'Imitekerere',
      description: 'Menya imitekerere yawe',
      category: 'Wellness Tools',
    },
    {
      href: '/awareness',
      icon: '🧘',
      label: 'Ubumutima',
      description: 'Gukora ubumutima',
      category: 'Wellness Tools',
    },
    {
      href: '/garden',
      icon: '🌱',
      label: 'Urusobe rwawe',
      description: 'Reba ubuzima bwo',
      category: 'Wellness Tools',
      popular: true,
    },
    // Communication
    {
      href: '/chat',
      icon: '💬',
      label: 'Ikiganiro',
      description: 'Vugana n\'abafasha',
      category: 'Communication',
      popular: true,
    },
    {
      href: '/community',
      icon: '🤝',
      label: 'Umuryango',
      description: 'Twiyumbarize',
      category: 'Communication',
    },
    // Information
    {
      href: '/about',
      icon: 'ℹ️',
      label: 'Ibyerekeye',
      description: 'Menya Komera',
      category: 'Information',
    },
    {
      href: '/resources',
      icon: '📚',
      label: 'Amakuru',
      description: 'Ingingo zifasha',
      category: 'Information',
    },
    {
      href: '/helpers',
      icon: '🙏',
      label: 'Abafasha',
      description: 'Ingingo zifasha',
      category: 'Information',
    },
    // Professional
    {
      href: '/therapist',
      icon: '👨‍⚕️',
      label: 'Abaganga',
      description: 'Ifashayobora ryihuse',
      category: 'Professional',
    },
    {
      href: '/therapist/testimonials',
      icon: '⭐',
      label: 'Ibimenyetso',
      description: 'Ibyanditswe n\'abandi',
      category: 'Professional',
    },
  ],
  fr: [
    // Emergency
    {
      href: '/crisis',
      icon: '🆘',
      label: 'Urgence',
      description: 'Aide immédiate',
      category: 'Emergency',
    },
    // Wellness Tools
    {
      href: '/mood',
      icon: '🌸',
      label: 'Humeur',
      description: 'Suivez vos émotions',
      category: 'Wellness Tools',
      popular: true,
    },
    {
      href: '/journal',
      icon: '📓',
      label: 'Journal',
      description: 'Écrivez vos pensées',
      category: 'Wellness Tools',
    },
    {
      href: '/breathe',
      icon: '🌬️',
      label: 'Respiration',
      description: 'Calmez votre esprit',
      category: 'Wellness Tools',
    },
    {
      href: '/ground',
      icon: '🌍',
      label: 'Ancrage',
      description: 'Restez présent',
      category: 'Wellness Tools',
    },
    {
      href: '/checkin',
      icon: '✅',
      label: 'Point quotidien',
      description: 'Commencez bien votre journée',
      category: 'Wellness Tools',
    },
    {
      href: '/feelings',
      icon: '💭',
      label: 'Émotions',
      description: 'Comprenez vos sentiments',
      category: 'Wellness Tools',
    },
    {
      href: '/awareness',
      icon: '🧘',
      label: 'Pleine conscience',
      description: 'Pratiquez la présence',
      category: 'Wellness Tools',
    },
    {
      href: '/garden',
      icon: '🌱',
      label: 'Votre jardin',
      description: 'Regardez votre bien-être grandir',
      category: 'Wellness Tools',
      popular: true,
    },
    // Communication
    {
      href: '/chat',
      icon: '💬',
      label: 'Chat',
      description: 'Parlez avec des auditeurs',
      category: 'Communication',
      popular: true,
    },
    {
      href: '/community',
      icon: '🤝',
      label: 'Communauté',
      description: 'Connectez-vous avec d\'autres',
      category: 'Communication',
    },
    // Information
    {
      href: '/about',
      icon: 'ℹ️',
      label: 'À propos',
      description: 'En savoir plus sur Komera',
      category: 'Information',
    },
    {
      href: '/resources',
      icon: '📚',
      label: 'Ressources',
      description: 'Articles et guides utiles',
      category: 'Information',
    },
    {
      href: '/helpers',
      icon: '🙏',
      label: 'Aides',
      description: 'Ressources de soutien',
      category: 'Information',
    },
    // Professional
    {
      href: '/therapist',
      icon: '👨‍⚕️',
      label: 'Trouver un thérapeute',
      description: 'Soutien professionnel',
      category: 'Professional',
    },
    {
      href: '/therapist/testimonials',
      icon: '⭐',
      label: 'Témoignages',
      description: 'Histoires d\'autres',
      category: 'Professional',
    },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  Emergency: 'from-red-500 to-red-600',
  'Wellness Tools': 'from-emerald-500 to-teal-500',
  Communication: 'from-blue-500 to-indigo-500',
  Information: 'from-amber-500 to-orange-500',
  Professional: 'from-purple-500 to-pink-500',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  Emergency: '🆘',
  'Wellness Tools': '🌿',
  Communication: '💬',
  Information: '📚',
  Professional: '👨‍⚕️',
};

interface FullNavigationProps {
  lang: Lang;
  loggedIn: boolean;
}

export default function FullNavigation({ lang, loggedIn }: FullNavigationProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const items = NAVIGATION_ITEMS[lang];
  const T = t[lang];

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  // Group items by category
  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, NavItem[]>);
  }, [filteredItems]);

  // Get popular items
  const popularItems = useMemo(() => {
    return items.filter((item) => item.popular).slice(0, 4);
  }, [items]);

  const handleNavClick = (href: string) => {
    if (loggedIn) {
      router.push(href);
    } else {
      router.push('/login');
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={T.searchTools}
          className="w-full rounded-2xl border-2 border-[#E8DFD4] bg-white px-6 py-4 pl-14 text-base outline-none transition focus:border-hill focus:ring-4 focus:ring-hill/10"
        />
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
      </div>

      {/* Popular Items - Show when no search */}
      {!searchQuery && popularItems.length > 0 && (
        <div className="animate-fade-up">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-hill">
            <span className="text-xl">⭐</span>
            {T.popular}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => handleNavClick(item.href)}
                className="komera-card group relative p-5 text-left transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-hill text-xs font-bold text-white shadow-md">
                  ⭐
                </div>
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[item.category] || 'from-hill to-lake'} text-3xl text-white shadow-lg transition group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h4 className="mt-4 font-semibold text-lg text-hill-dark">{item.label}</h4>
                <p className="mt-2 text-sm leading-relaxed text-earth">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-hill">
                  {loggedIn ? 'Open →' : 'Login →'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Categories */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="animate-fade-up">
          <button
            type="button"
            onClick={() => toggleCategory(category)}
            className="mb-4 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-hill/5 to-lake/5 px-5 py-3 transition hover:from-hill/10 hover:to-lake/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{CATEGORY_EMOJIS[category] || '📁'}</span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-hill">
                {category}
              </h3>
              <span className="rounded-full bg-hill/10 px-2 py-1 text-xs font-semibold text-hill">
                {categoryItems.length}
              </span>
            </div>
            <span
              className={`transform transition ${
                expandedCategory === category ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>

          {(expandedCategory === category || searchQuery) && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryItems.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className="komera-card group relative p-5 text-left transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {item.new && (
                    <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-sunrise text-xs font-bold text-white shadow-md">
                      NEW
                    </div>
                  )}
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[category] || 'from-hill to-lake'} text-3xl text-white shadow-lg transition group-hover:scale-110 group-hover:rotate-6`}
                  >
                    {item.icon}
                  </div>
                  <h4 className="mt-4 font-semibold text-lg text-hill-dark">{item.label}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-earth">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-hill">
                    {loggedIn ? 'Open →' : 'Login →'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* No results */}
      {searchQuery && filteredItems.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg font-semibold text-hill-dark">
            {T.noToolsFound}
          </p>
          <p className="mt-2 text-earth">
            {T.tryDifferentSearch}
          </p>
        </div>
      )}
    </div>
  );
}
