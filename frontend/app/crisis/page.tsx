'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLang, Lang } from '@/lib/translations';

const content = {
  en: {
    title: 'Emergency Crisis & Referral Support',
    sub: 'You are not alone. Help is available now in Rwanda through trusted helplines and referral care.',
    breath: 'Take a deep breath. You are safe.',
    safetyText: 'If you feel unsafe or overwhelmed, call one of these numbers immediately. Your safety matters.',
    contacts: [
      { name: 'Kigali Mental Health Referral Centre', number: '+250 793 902 059 / +250 736 440 666', desc: '24/7 mental health emergency support in Kinyinya, Gasabo' },
      { name: 'National Suicide Prevention Helpline', number: '8015', desc: 'Free confidential emotional support available 24/7' },
      { name: 'Rwanda Biomedical Centre Helpline', number: '114', desc: 'General health services and crisis intervention' },
      { name: 'Police Emergency', number: '112', desc: 'If you are in immediate danger' },
    ],
    portal: { label: 'Kigali Mental Health Portal', url: 'https://www.kmentalhealth.gov.rw/', desc: 'Visit the portal to book an appointment and learn more.' },
    tips: ['You matter and your life has value', 'This feeling can pass', 'Reach out to someone you trust', 'Go to the nearest hospital if needed'],
    back: '← Back',
  },
  rw: {
    title: 'Ubufasha bw\'Ihutirwa n\'Ubujyanama',
    sub: 'Ntabwo uri wenyine. Ubufasha burahari ubu mu Rwanda binyuze kuri nimero zizewe n\'ibigo by\'inkunga.',
    breath: 'Humeka neza. Uri mu mutekano.',
    safetyText: 'Niba wumva utabona umutekano cyangwa ubabaye cyane, hamagara imwe muri izi nimero ako kanya. Umutekano wawe urakomeye.',
    contacts: [
      { name: 'Kigali Mental Health Referral Centre', number: '+250 793 902 059 / +250 736 440 666', desc: 'Ubufasha bwo mu mutwe 24/7 mu Kinyinya, Gasabo' },
      { name: 'Nimero y\'Ubwirinzi bw\'Kwiyahura', number: '8015', desc: 'Ubufasha bw\'ibanga kandi buboneka 24/7' },
      { name: 'Nimero ya RBC', number: '114', desc: 'Serivisi z\'ubuzima rusange n\'ubufasha bw\'ihutirwa' },
      { name: 'Polisi', number: '112', desc: 'Niba uri mu kaga' },
    ],
    portal: { label: 'Urubuga rwa Kigali Mental Health', url: 'https://www.kmentalhealth.gov.rw/', desc: 'Sura urubuga kugira ngo utegure gahunda cyangwa umenye byinshi.' },
    tips: ['Ufite agaciro kandi ubuzima bwawe bufite agaciro', 'Iki cyiyumvo gishobora kunyura', 'Vugana n\'uwo wizera', 'Jya ku bitaro bihebye niba bikenewe'],
    back: '← Gusubira',
  },
  fr: {
    title: 'Soutien d\'Urgence et d\'Orientation',
    sub: 'Vous n\'êtes pas seul(e). De l\'aide est disponible maintenant au Rwanda via des lignes d\'urgence fiables et des services de référence.',
    breath: 'Respirez profondément. Vous êtes en sécurité.',
    safetyText: 'Si vous vous sentez en danger ou dépassé(e), appelez immédiatement l\'un de ces numéros. Votre sécurité est importante.',
    contacts: [
      { name: 'Centre de Référence de Kigali pour la Santé Mentale', number: '+250 793 902 059 / +250 736 440 666', desc: 'Soutien d\'urgence 24/7 et consultation à Gasabo' },
      { name: 'Ligne Nationale de Prévention du Suicide', number: '8015', desc: 'Soutien émotionnel gratuit et confidentiel 24/7' },
      { name: 'Ligne du Centre Biomédical du Rwanda', number: '114', desc: 'Services de santé générale et intervention de crise' },
      { name: 'Police Urgence', number: '112', desc: 'Si vous êtes en danger immédiat' },
    ],
    portal: { label: 'Portail Kigali Mental Health', url: 'https://www.kmentalhealth.gov.rw/', desc: 'Visitez le portail pour prendre rendez-vous et en savoir plus.' },
    tips: ['Vous comptez et votre vie a de la valeur', 'Ce sentiment peut passer', 'Contactez quelqu\'un en qui vous avez confiance', 'Allez à l\'hôpital le plus proche si nécessaire'],
    back: '← Retour',
  },
};

export default function CrisisPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [pulse, setPulse] = useState(false);

  useEffect(() => { setLang(getLang()); }, []);

  const C = content[lang];

  return (
    <div className="min-h-screen bg-red-50">
      <nav className="bg-red-700 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="text-white font-bold text-lg hover:text-red-200 transition">{C.back}</Link>
        <span className="text-red-200 text-sm font-medium">🆘 {C.title}</span>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-10 space-y-6">
        {/* Hero */}
        <div className="bg-red-600 rounded-2xl p-8 text-center text-white shadow-xl">
          <div className={`w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl ${pulse ? 'scale-110' : 'scale-100'} transition-transform duration-500`}
            onClick={() => setPulse(!pulse)}>❤️</div>
          <h1 className="text-2xl font-black mb-2">{C.title}</h1>
          <p className="text-red-100 text-sm">{C.sub}</p>
          <p className="mt-4 text-white font-semibold italic">"{C.breath}"</p>
          <p className="mt-3 text-red-100 text-sm">{C.safetyText}</p>
        </div>

        {/* Emergency contacts */}
        <div className="space-y-3">
          {C.contacts.map((c, i) => {
            const numbers = c.number.split('/').map((n) => n.trim());
            return (
              <div key={i} className="flex flex-col gap-4 bg-white rounded-xl p-4 shadow-sm border-2 border-red-100 hover:border-red-300 transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">📞</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.desc}</p>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {numbers.map((num, j) => (
                    <a key={j}
                      href={`tel:${num.replace(/[^\d+]/g, '')}`}
                      className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
                    >
                      {num}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm border border-red-100">
          <p className="font-semibold text-gray-800">{C.portal.label}</p>
          <p className="mt-2 text-sm text-gray-600">{C.portal.desc}</p>
          <a href={C.portal.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition">
            {C.portal.label}
          </a>
        </div>

        {/* Reminder tips */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
          <h3 className="font-bold text-gray-700 mb-3">💚 Remember:</h3>
          <ul className="space-y-2">
            {C.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-teal-500 font-bold">✓</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
