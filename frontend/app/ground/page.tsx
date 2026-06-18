'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { t, getLang, Lang } from '@/lib/translations';

const STEPS = {
  en: [
    { count: 5, sense: 'SEE', icon: '👁️', color: 'from-violet-500 to-purple-600', instruction: 'Look around you. Name 5 things you can see right now.', examples: ['A wall', 'Your hands', 'A window', 'A cup', 'A door'] },
    { count: 4, sense: 'TOUCH', icon: '🤲', color: 'from-teal-500 to-emerald-600', instruction: 'Notice 4 things you can physically feel right now.', examples: ['The floor beneath your feet', 'Your clothes on your skin', 'The chair you sit on', 'Your breath in your chest'] },
    { count: 3, sense: 'HEAR', icon: '👂', color: 'from-blue-500 to-cyan-600', instruction: 'Listen carefully. Name 3 sounds you can hear right now.', examples: ['Birds outside', 'Your breathing', 'Wind or traffic'] },
    { count: 2, sense: 'SMELL', icon: '👃', color: 'from-amber-500 to-orange-600', instruction: 'Notice 2 things you can smell (or like the smell of).', examples: ['Fresh air', 'Your skin or clothes'] },
    { count: 1, sense: 'TASTE', icon: '👅', color: 'from-pink-500 to-rose-600', instruction: 'Bring awareness to 1 thing you can taste right now.', examples: ['Water', 'Your last meal', 'Nothing — and that is okay'] },
  ],
  rw: [
    { count: 5, sense: 'REBA', icon: '👁️', color: 'from-violet-500 to-purple-600', instruction: 'Reba ibikuzenguruye. Vuga ibintu 5 ubona ubu.', examples: ['Urukuta', 'Intoki zawe', 'Idirishya', 'Ikayiko', 'Umuryango'] },
    { count: 4, sense: 'KORAHO', icon: '🤲', color: 'from-teal-500 to-emerald-600', instruction: 'Wumve ibintu 4 ukora ubu.', examples: ['Ubutaka munsi y\'ibirenge byawe', 'Imyenda yabano', 'Intebe ubicaho', 'Umwuka mu gifu'] },
    { count: 3, sense: 'UMVA', icon: '👂', color: 'from-blue-500 to-cyan-600', instruction: 'Tega amatwi. Vuga ibintu 3 wumva ubu.', examples: ['Inyoni hanze', 'Guhumeka kwawe', 'Umuyaga'] },
    { count: 2, sense: 'NUKA', icon: '👃', color: 'from-amber-500 to-orange-600', instruction: 'Bona ibintu 2 byuka (cyangwa ukunda).', examples: ['Umwuka mwiza', 'Igikwangwari cyawe'] },
    { count: 1, sense: 'ONGERA', icon: '👅', color: 'from-pink-500 to-rose-600', instruction: 'Tegereza kimwe ukora mu kanwa kawe ubu.', examples: ['Amazi', 'Ibyakunnywe', 'Ntanyu — ni sawa'] },
  ],
  fr: [
    { count: 5, sense: 'VOIR', icon: '👁️', color: 'from-violet-500 to-purple-600', instruction: 'Regardez autour de vous. Nommez 5 choses que vous pouvez voir maintenant.', examples: ['Un mur', 'Vos mains', 'Une fenêtre', 'Une tasse', 'Une porte'] },
    { count: 4, sense: 'TOUCHER', icon: '🤲', color: 'from-teal-500 to-emerald-600', instruction: 'Remarquez 4 choses que vous pouvez physiquement sentir maintenant.', examples: ['Le sol sous vos pieds', 'Vos vêtements sur votre peau', 'La chaise où vous êtes assis', 'Votre souffle dans votre poitrine'] },
    { count: 3, sense: 'ENTENDRE', icon: '👂', color: 'from-blue-500 to-cyan-600', instruction: 'Écoutez attentivement. Nommez 3 sons que vous entendez maintenant.', examples: ['Des oiseaux dehors', 'Votre respiration', 'Le vent ou la circulation'] },
    { count: 2, sense: 'SENTIR', icon: '👃', color: 'from-amber-500 to-orange-600', instruction: 'Remarquez 2 choses que vous pouvez sentir.', examples: ['L\'air frais', 'Votre peau ou vos vêtements'] },
    { count: 1, sense: 'GOÛTER', icon: '👅', color: 'from-pink-500 to-rose-600', instruction: 'Portez votre attention sur 1 chose que vous pouvez goûter maintenant.', examples: ['De l\'eau', 'Votre dernier repas', 'Rien — et c\'est tout à fait normal'] },
  ],
};

export default function GroundPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [step, setStep] = useState(-1); // -1 = intro, 5 = complete
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    setLang(getLang());
  }, []);

  const T = t[lang];
  const steps = STEPS[lang];
  const current = step >= 0 && step < 5 ? steps[step] : null;

  const addItem = () => {
    if (!input.trim() || !current) return;
    const newItems = [...items, input.trim()];
    setItems(newItems);
    setInput('');
    if (newItems.length >= current.count) {
      setTimeout(() => {
        setItems([]);
        setStep(step + 1);
      }, 600);
    }
  };

  const start = () => {
    // Mark grounding as done in localStorage for badge tracking
    const stats = JSON.parse(localStorage.getItem('komera_stats') || '{}');
    stats.groundSessions = (stats.groundSessions || 0) + 1;
    localStorage.setItem('komera_stats', JSON.stringify(stats));
    setStep(0);
  };

  const restart = () => { setStep(-1); setItems([]); setInput(''); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <nav className="px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-purple-200 font-bold text-lg hover:text-white transition">{T.back}</Link>
        <span className="text-purple-300 text-sm font-medium">{T.groundTitle}</span>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">

        {/* Intro */}
        {step === -1 && (
          <div className="max-w-md w-full text-center">
            <div className="text-8xl mb-6 animate-pulse">🌍</div>
            <h1 className="text-4xl font-black text-white mb-3">{T.groundTitle}</h1>
            <p className="text-purple-200 text-lg mb-4">{T.groundSub}</p>
            <div className="bg-white/10 rounded-2xl p-5 mb-8 text-left space-y-2">
              {steps.map(s => (
                <div key={s.count} className="flex items-center gap-3 text-purple-100">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="font-semibold">{s.count} {s.sense}</span>
                </div>
              ))}
            </div>
            <p className="text-purple-300 text-sm mb-8 italic">{T.groundAnchorHint}</p>
            <button onClick={start}
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white font-black py-4 rounded-2xl text-xl shadow-2xl shadow-purple-900 transition-all active:scale-95">
              {T.groundStart}
            </button>
          </div>
        )}

        {/* Active step */}
        {current && (
          <div className="max-w-md w-full">
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-white' : i < step ? 'w-2 bg-white/60' : 'w-2 bg-white/20'}`} />
              ))}
            </div>

            {/* Step card */}
            <div className={`bg-gradient-to-br ${current.color} rounded-3xl p-8 mb-6 text-center shadow-2xl`}>
              <div className="text-7xl mb-3">{current.icon}</div>
              <div className="text-white/80 text-sm font-bold tracking-widest mb-1">{current.count} {current.sense}</div>
              <p className="text-white text-lg font-semibold leading-relaxed">{current.instruction}</p>
            </div>

            {/* Examples hint */}
            <div className="flex flex-wrap gap-2 mb-5 justify-center">
              {current.examples.map((ex, i) => (
                <span key={i} onClick={() => { if (items.length < current.count) { setInput(ex); } }}
                  className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-white/20 transition">
                  {ex}
                </span>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 mb-4">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder={`${items.length + 1} of ${current.count}...`}
                className="flex-1 bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-white/60 transition"
              />
              <button onClick={addItem}
                className="bg-white text-purple-700 font-black px-5 rounded-xl hover:bg-purple-50 transition">
                ✓
              </button>
            </div>

            {/* Listed items */}
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 text-white">
                  <span className="text-green-400 font-bold">{i + 1}.</span>
                  <span>{item}</span>
                </div>
              ))}
              {Array.from({ length: current.count - items.length }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 text-white/30 border border-white/10 border-dashed">
                  <span>{items.length + i + 1}.</span>
                  <span className="text-sm italic">...</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete */}
        {step === 5 && (
          <div className="max-w-md w-full text-center">
            <div className="text-8xl mb-6">💚</div>
            <h2 className="text-3xl font-black text-white mb-4">{T.groundComplete}</h2>
            <p className="text-purple-200 mb-8">{T.groundCompleteNote}</p>
            <div className="flex gap-3">
              <button onClick={restart}
                className="flex-1 border-2 border-purple-400 text-purple-200 py-3 rounded-xl font-bold hover:bg-white/10 transition">
                {T.groundRestart}
              </button>
              <Link href="/dashboard"
                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-center hover:opacity-90 transition">
                {T.back}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
