'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getLang, Lang } from '@/lib/translations';

const content = {
  en: { title: 'Breathing Exercise', sub: 'Take a moment to calm your mind', inhale: 'Inhale', hold: 'Hold', exhale: 'Exhale', start: 'Start', stop: 'Stop', back: '← Komera', rounds: 'rounds completed' },
  rw: { title: 'Imyitozo yo Guhumeka', sub: 'Fata umwanya wo guceceka', inhale: 'Humeka mu', hold: 'Gumya', exhale: 'Humeka hanze', start: 'Tangira', stop: 'Hagarika', back: '← Komera', rounds: 'inzunguzanyo zarangiye' },
  fr: { title: 'Exercice de Respiration', sub: 'Prenez un moment pour calmer votre esprit', inhale: 'Inspirez', hold: 'Retenez', exhale: 'Expirez', start: 'Commencer', stop: 'Arrêter', back: '← Komera', rounds: 'cycles terminés' },
};

type Phase = 'inhale' | 'hold' | 'exhale' | 'idle';
const PHASES: { phase: Phase; duration: number }[] = [
  { phase: 'inhale', duration: 4 },
  { phase: 'hold', duration: 4 },
  { phase: 'exhale', duration: 6 },
];

const phaseColor = { inhale: 'from-teal-400 to-teal-600', hold: 'from-blue-400 to-blue-600', exhale: 'from-emerald-400 to-emerald-600', idle: 'from-gray-300 to-gray-400' };
const phaseScale = { inhale: 'scale-125', hold: 'scale-125', exhale: 'scale-100', idle: 'scale-100' };

export default function BreathePage() {
  const [lang, setLang] = useState<Lang>('en');
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIdx = useRef(0);

  useEffect(() => { setLang(getLang()); return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  const runPhase = (idx: number, roundCount: number) => {
    const { phase: p, duration } = PHASES[idx];
    setPhase(p);
    setCount(duration);
    let c = duration - 1;
    const tick = () => {
      setCount(c);
      if (c > 0) { c--; timerRef.current = setTimeout(tick, 1000); }
      else {
        const next = (idx + 1) % PHASES.length;
        const newRounds = next === 0 ? roundCount + 1 : roundCount;
        if (next === 0) setRounds(newRounds);
        timerRef.current = setTimeout(() => runPhase(next, newRounds), 500);
      }
    };
    timerRef.current = setTimeout(tick, 1000);
  };

  const start = () => { setRunning(true); setRounds(0); phaseIdx.current = 0; runPhase(0, 0); };
  const stop = () => { setRunning(false); setPhase('idle'); setCount(0); if (timerRef.current) clearTimeout(timerRef.current); };

  const C = content[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 to-emerald-900 flex flex-col">
      <nav className="px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-teal-200 font-bold text-lg hover:text-white transition">{C.back}</Link>
        <span className="text-teal-300 text-sm">{C.title}</span>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <h1 className="text-3xl font-black text-white mb-2 text-center">{C.title}</h1>
        <p className="text-teal-300 mb-12 text-center">{C.sub}</p>

        {/* Breathing circle */}
        <div className="relative flex items-center justify-center mb-12">
          <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${phaseColor[phase]} transition-all duration-1000 ${phaseScale[phase]} shadow-2xl flex items-center justify-center`}>
            <div className="text-center text-white">
              <div className="text-5xl font-black">{running ? count : '🌬️'}</div>
              {running && <div className="text-sm font-semibold mt-1 uppercase tracking-widest">{C[phase as keyof typeof C] as string}</div>}
            </div>
          </div>
          {/* Ripple rings */}
          {running && (
            <>
              <div className={`absolute w-56 h-56 rounded-full border-2 border-white/20 ${phaseScale[phase]} transition-all duration-1000`}></div>
              <div className={`absolute w-64 h-64 rounded-full border border-white/10 ${phaseScale[phase]} transition-all duration-1000`}></div>
            </>
          )}
        </div>

        {rounds > 0 && <p className="text-teal-300 mb-6">{rounds} {C.rounds}</p>}

        <button onClick={running ? stop : start}
          className={`px-10 py-4 rounded-full text-white font-bold text-lg transition shadow-xl ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-400'}`}>
          {running ? C.stop : C.start}
        </button>

        {/* Guide */}
        <div className="mt-10 flex gap-6 text-center">
          {PHASES.map(({ phase: p, duration }) => (
            <div key={p} className={`px-4 py-2 rounded-xl transition ${phase === p && running ? 'bg-white/20 text-white' : 'text-teal-400'}`}>
              <div className="text-2xl font-black">{duration}s</div>
              <div className="text-xs uppercase tracking-wide">{C[p as keyof typeof C] as string}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
