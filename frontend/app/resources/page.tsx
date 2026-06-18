'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { t, getLang, Lang } from '@/lib/translations';

const resources = {
  en: [
    { emoji: '🧠', title: 'Understanding Anxiety', category: 'Mental Health', body: 'Anxiety is your body\'s natural response to stress. It\'s a feeling of fear or apprehension about what\'s to come. Tips: breathe deeply, challenge negative thoughts, talk to someone you trust, and limit caffeine.' },
    { emoji: '💤', title: 'The Power of Sleep', category: 'Wellness', body: 'Poor sleep worsens anxiety and depression. Aim for 7-9 hours. Avoid screens 1 hour before bed. Keep a consistent sleep schedule even on weekends.' },
    { emoji: '🏃', title: 'Exercise & Mental Health', category: 'Lifestyle', body: 'Just 30 minutes of walking per day can reduce symptoms of depression by 36%. Physical activity releases endorphins — your brain\'s natural mood lifters.' },
    { emoji: '🤝', title: 'How to Support a Friend', category: 'Community', body: 'Listen without judgment. Don\'t try to fix everything. Say "I\'m here for you." Encourage professional help gently. Check in regularly even with a simple text.' },
    { emoji: '🌿', title: 'Trauma & Healing', category: 'Trauma', body: 'Trauma affects the mind and body. Healing is not linear. It\'s okay to have good and bad days. Seek professional support, practice self-compassion, and connect with community.' },
    { emoji: '📵', title: 'Digital Detox', category: 'Lifestyle', body: 'Social media can increase anxiety and depression. Try a 24-hour digital detox weekly. Replace screen time with nature walks, reading, or calling a friend.' },
  ],
  rw: [
    { emoji: '🧠', title: 'Gusobanukirwa Impungenge', category: 'Ubuzima bwo mu Mutwe', body: 'Impungenge ni igisubizo cy\'umubiri wawe ku makuru akomeye. Izo ngingo zifasha: humeka neza, vuga na uwo ukunda, witondere icyi unywa gikubira.' },
    { emoji: '💤', title: 'Akamaro k\'Ibitotsi', category: 'Ubuzima', body: 'Ibitotsi bibi bitera ubuzima bwo mu mutwe gutinduka. Gerageza gusinzira amasaha 7-9. Reka gukoresha telefoni isaa imwe mbere yo gusinzira.' },
    { emoji: '🏃', title: 'Imyitozo n\'Ubuzima bwo mu Mutwe', category: 'Imibereho', body: 'Gutembera iminota 30 buri munsi birashobora kugabanya ibimenyetso bya depression. Imyitozo ikurura endorphines — ingirabuzimafatizo z\'ibyishimo mu bwonko.' },
    { emoji: '🤝', title: 'Gufasha Inshuti Yawe', category: 'Umuryango', body: 'Umvirize nta gucira urubanza. Vuga uti "Ndi hano." Shishikariza inzobere mpore. Jya ubaza ubuzima bwabo.' },
    { emoji: '🌿', title: 'Trauma no Gukira', category: 'Trauma', body: 'Trauma iterana umubiri n\'ubwonko. Gukira si urugendo rworoshye. Biroroshye kugira iminsi myiza n\'iy\'ibibazo. Shaka inzobere, wigirire impuhwe.' },
    { emoji: '📵', title: 'Kuruhuka kuri Interineti', category: 'Imibereho', body: 'Kwinjira mu mbuga nkoranyambaga bishobora kongera impungenge. Gerageza kureka isaa 24 buri cyumweru. Hindura igihe cya telefoni n\'icy\'imbyina mu karere.' },
  ],
  fr: [
    { emoji: '🧠', title: 'Comprendre l\'Anxiété', category: 'Santé Mentale', body: 'L\'anxiété est la réponse naturelle de votre corps au stress. Conseils: respirez profondément, défiez les pensées négatives, parlez à quelqu\'un de confiance.' },
    { emoji: '💤', title: 'Le Pouvoir du Sommeil', category: 'Bien-être', body: 'Un mauvais sommeil aggrave l\'anxiété et la dépression. Visez 7-9 heures. Évitez les écrans 1 heure avant le coucher.' },
    { emoji: '🏃', title: 'Exercice et Santé Mentale', category: 'Mode de Vie', body: '30 minutes de marche par jour peuvent réduire les symptômes de dépression de 36%. L\'activité physique libère des endorphines.' },
    { emoji: '🤝', title: 'Soutenir un Ami', category: 'Communauté', body: 'Écoutez sans juger. Ne cherchez pas à tout résoudre. Dites "Je suis là pour toi." Encouragez doucement l\'aide professionnelle.' },
    { emoji: '🌿', title: 'Trauma et Guérison', category: 'Trauma', body: 'Le trauma affecte l\'esprit et le corps. La guérison n\'est pas linéaire. Cherchez un soutien professionnel et pratiquez l\'autocompassion.' },
    { emoji: '📵', title: 'Détox Numérique', category: 'Mode de Vie', body: 'Les réseaux sociaux peuvent augmenter l\'anxiété. Essayez une détox numérique de 24h par semaine. Remplacez le temps d\'écran par des promenades.' },
  ],
};

const navLabel = { en: 'Resources', rw: 'Amakuru', fr: 'Ressources' };
const back = { en: '← Komera', rw: '← Komera', fr: '← Komera' };

export default function ResourcesPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    setLang(getLang());
  }, [router]);

  const T = t[lang];
  const items = resources[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-teal-800 to-emerald-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="text-white font-bold text-lg hover:text-teal-200 transition">{back[lang]}</Link>
        <span className="text-teal-200 text-sm font-medium">{navLabel[lang]}</span>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-100">
          <p className="text-sm text-gray-700">{T.resourcesIntro}</p>
        </div>
        <div className="grid gap-4">
          {items.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
              onClick={() => setSelected(selected === i ? null : i)}>
              <div className="flex items-center gap-4 p-5">
                <span className="text-3xl">{r.emoji}</span>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">{r.category}</span>
                  <h3 className="font-bold text-gray-800">{r.title}</h3>
                </div>
                <span className="text-gray-400 text-xl">{selected === i ? '▲' : '▼'}</span>
              </div>
              {selected === i && (
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                  {r.body}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
