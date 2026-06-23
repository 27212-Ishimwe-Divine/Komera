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
  rw: { title: 'Shaka Inzobere', sub: 'Inzobere z\'ubuzima bwo mu mutwe mu Rwanda', intro: 'Aba bantu n\'ibitaro bashobora kuguha ubufasha bwihuse igihe hagize icyo ukenera. Hamagara abahari kugira ngo bagusubize vuba.', helpIntro: 'Uru rupapuro rwerekana inzobere zemewe n\'serivisi z\'inkunga. Kanda ku muntu ushaka kugufasha vuba.', all: 'Bose', available: 'Bahari Ubu', call: 'Hamagara', message: 'Ubutumwa', types: { doctor: 'Muganga', therapist: 'Inzobere', counselor: 'Umujyanama', hospital: 'Ibitaro' }, langs: 'Bavuga:', unavailable: 'Ntahari' },
  fr: { title: 'Obtenir de l\'Aide Professionnelle', sub: 'Thérapeutes, médecins et conseillers vérifiés au Rwanda', intro: 'Ces contacts incluent des professionnels et des hôpitaux qui peuvent répondre rapidement si quelque chose arrive. Appelez les prestataires disponibles pour une aide immédiate.', helpIntro: 'Cette page liste des professionnels vérifiés et des services de soutien. Appuyez sur un contact pour obtenir de l\'aide rapidement.', all: 'Tous', available: 'Disponible Maintenant', call: 'Appeler', message: 'Message', types: { doctor: 'Médecin', therapist: 'Thérapeute', counselor: 'Conseiller', hospital: 'Hôpital' }, langs: 'Parle:', unavailable: 'Indisponible' },
};

const typeColor: Record<string, string> = { doctor: 'bg-lake-soft text-hill-dark', therapist: 'bg-bloom/20 text-hill-dark', counselor: 'bg-hill/15 text-hill-dark', hospital: 'bg-sunrise/20 text-hill-dark' };

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
    <div className="relative min-h-screen pb-24">
      {/* Calming background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop')",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#fdf8ef]/92 via-[#fdf8ef]/88 to-[#fdf8ef]/95" />

      <nav className="relative bg-card/90 backdrop-blur px-6 py-4 border-b border-[#E8DFD4]">
        <h1 className="text-hill-dark font-black text-xl">{L.title}</h1>
        <p className="text-hill text-xs mt-0.5">{L.sub}</p>
        <p className="text-earth text-xs mt-2">{L.intro}</p>
      </nav>

      <main className="relative max-w-2xl mx-auto px-4 py-6">
        <div className="komera-card bg-card/90 backdrop-blur p-5 mb-6">
          <p className="text-sm text-earth">{L.helpIntro}</p>
        </div>
        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['all', 'available', 'doctor', 'therapist', 'counselor', 'hospital'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition capitalize ${filter === f ? 'bg-hill text-white border-hill' : 'text-earth border-[#E8DFD4] bg-card/80 hover:border-hill'}`}>
              {f === 'all' ? L.all : f === 'available' ? L.available : (L.types as any)[f]}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((h, i) => (
            <div key={i} className="komera-card bg-card/90 backdrop-blur p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-hill to-lake flex items-center justify-center text-3xl flex-shrink-0">{h.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-hill-dark">{h.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColor[h.type]}`}>{(L.types as any)[h.type]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${h.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {h.available ? '🟢 ' + L.available : '⚪ ' + L.unavailable}
                    </span>
                  </div>
                  <p className="text-sm text-hill font-medium">{h.role}</p>
                  <p className="text-xs text-earth/70 mb-2">📍 {h.location}</p>
                  <p className="text-sm text-earth leading-relaxed mb-3">{h.bio}</p>
                  <p className="text-xs text-earth/70 mb-3">{L.langs} {h.lang.map(l => l.toUpperCase()).join(' · ')}</p>
                  <div className="flex gap-2">
                    <a href={`tel:${h.phone}`}
                      className="flex items-center gap-1 bg-hill hover:bg-hill-dark text-white px-4 py-2 rounded-xl text-xs font-bold transition">
                      📞 {L.call}
                    </a>
                    <a href={`tel:${h.phone}`}
                      className="flex items-center gap-1 border-2 border-lake-soft text-hill hover:border-hill px-4 py-2 rounded-xl text-xs font-bold transition">
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
