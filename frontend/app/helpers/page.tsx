'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLang, Lang } from '@/lib/translations';

const helpers = [
  { name: 'Dr. Uwimana Marie', role: 'Psychiatrist', lang: ['rw', 'fr', 'en'], location: 'Kigali, Rwanda', available: true, type: 'doctor', emoji: '👩‍⚕️', bio: 'Specialist in trauma, PTSD and genocide trauma healing. 12 years experience.', phone: '+250 788 100 001' },
  { name: 'Jean Baptiste Nkurunziza', role: 'Clinical Psychologist', lang: ['rw', 'en'], location: 'Musanze, Rwanda', available: true, type: 'therapist', emoji: '🧑‍💼', bio: 'Youth mental health specialist. Cognitive behavioral therapy practitioner.', phone: '+250 788 100 002' },
  { name: 'Dr. Françoise Mukamurenzi', role: 'Therapist', lang: ['fr', 'rw'], location: 'Butare, Rwanda', available: false, type: 'therapist', emoji: '👩‍💼', bio: 'Specialized in grief counseling, depression and family therapy.', phone: '+250 788 100 003' },
  { name: 'Emmanuel Habimana', role: 'Counselor & Peer Support', lang: ['rw', 'en'], location: 'Online / Kigali', available: true, type: 'counselor', emoji: '🙋‍♂️', bio: 'Genocide survivor turned counselor. Specializes in community trauma healing.', phone: '+250 788 100 004' },
  { name: 'Rwanda Biomedical Centre', role: 'Mental Health Department', lang: ['rw', 'en', 'fr'], location: 'Kigali (Nationwide)', available: true, type: 'hospital', emoji: '🏥', bio: 'National mental health services. Free consultations available for low-income patients.', phone: '+250 788 306 916' },
  { name: 'Caraes Ndera Hospital', role: 'Psychiatric Hospital', lang: ['rw', 'fr'], location: 'Ndera, Kigali', available: true, type: 'hospital', emoji: '🏨', bio: 'Rwanda\'s main psychiatric hospital. 24/7 crisis services available.', phone: '+250 788 100 006' },
];

const labels = {
  en: { title: 'Get Professional Help', sub: 'Verified therapists, doctors and counselors in Rwanda', intro: 'These contacts include professionals and hospitals that can respond quickly if something strikes. Call available providers for immediate attention.', helpIntro: 'This page lists verified professionals and support services. Tap a contact to get help quickly.', all: 'All', available: 'Available Now', call: 'Call', message: 'Message', types: { doctor: 'Doctor', therapist: 'Therapist', counselor: 'Counselor', hospital: 'Hospital' }, langs: 'Speaks:', unavailable: 'Unavailable' },
  rw: { title: 'Shaka Inzobere', sub: 'Inzobere z\'ubuzima bwo mu mutwe mu Rwanda', intro: 'Aba bantu n\'ibitaro bashobora kuguha ubufasha bwihuse igihe hagize icyo ukenera. Hamagara abahari kugira ngo bagusubize vuba.', all: 'Bose', available: 'Bahari Ubu', call: 'Hamagara', message: 'Ubutumwa', types: { doctor: 'Muganga', therapist: 'Inzobere', counselor: 'Umujyanama', hospital: 'Ibitaro' }, langs: 'Bavuga:', unavailable: 'Ntahari' },
  fr: { title: 'Obtenir de l\'Aide Professionnelle', sub: 'Thérapeutes, médecins et conseillers vérifiés au Rwanda', intro: 'Ces contacts incluent des professionnels et des hôpitaux qui peuvent répondre rapidement si quelque chose arrive. Appelez les prestataires disponibles pour une aide immédiate.', all: 'Tous', available: 'Disponible Maintenant', call: 'Appeler', message: 'Message', types: { doctor: 'Médecin', therapist: 'Thérapeute', counselor: 'Conseiller', hospital: 'Hôpital' }, langs: 'Parle:', unavailable: 'Indisponible' },
};

const typeColor: Record<string, string> = { doctor: 'bg-blue-100 text-blue-700', therapist: 'bg-purple-100 text-purple-700', counselor: 'bg-teal-100 text-teal-700', hospital: 'bg-green-100 text-green-700' };

export default function HelpersPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    setLang(getLang());
  }, [router]);

  const L = labels[lang];
  const filtered = filter === 'all' ? helpers : filter === 'available' ? helpers.filter(h => h.available) : helpers.filter(h => h.type === filter);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <nav className="bg-gradient-to-r from-teal-800 to-emerald-800 px-6 py-4 shadow-lg">
        <h1 className="text-white font-black text-xl">{L.title}</h1>
        <p className="text-teal-300 text-xs mt-0.5">{L.sub}</p>
        <p className="text-teal-100 text-xs mt-2">{L.intro}</p>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-100">
          <p className="text-sm text-gray-700">{L.helpIntro}</p>
        </div>
        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['all', 'available', 'doctor', 'therapist', 'counselor', 'hospital'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition capitalize ${filter === f ? 'bg-teal-600 text-white border-teal-600' : 'text-gray-500 border-gray-200 hover:border-teal-300'}`}>
              {f === 'all' ? L.all : f === 'available' ? L.available : (L.types as any)[f]}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((h, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center text-3xl flex-shrink-0">{h.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-gray-800">{h.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColor[h.type]}`}>{(L.types as any)[h.type]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${h.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {h.available ? '🟢 ' + L.available : '⚪ ' + L.unavailable}
                    </span>
                  </div>
                  <p className="text-sm text-teal-700 font-medium">{h.role}</p>
                  <p className="text-xs text-gray-400 mb-2">📍 {h.location}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{h.bio}</p>
                  <p className="text-xs text-gray-500 mb-3">{L.langs} {h.lang.map(l => l.toUpperCase()).join(' · ')}</p>
                  <div className="flex gap-2">
                    <a href={`tel:${h.phone}`}
                      className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition">
                      📞 {L.call}
                    </a>
                    <a href={`tel:${h.phone}`}
                      className="flex items-center gap-1 border-2 border-teal-200 text-teal-700 hover:border-teal-400 px-4 py-2 rounded-xl text-xs font-bold transition">
                      💬 {L.message}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
