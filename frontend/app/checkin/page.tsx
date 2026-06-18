'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { t, getLang, Lang } from '@/lib/translations';

const QUESTIONS = {
  en: [
    { id: 'sleep', text: 'How did you sleep last night?', type: 'scale' },
    { id: 'appetite', text: 'How was your appetite?', type: 'scale' },
    { id: 'social', text: 'Did you feel connected with others?', type: 'scale' },
    { id: 'anxiety', text: 'Any anxiety or worry today?', type: 'scale' },
    { id: 'joy', text: 'Did you experience something joyful?', type: 'scale' },
  ],
  rw: [
    { id: 'sleep', text: 'N'ukeye ute last night?', type: 'scale' },
    { id: 'appetite', text: 'Urumva ute amafunguro?', type: 'scale' },
    { id: 'social', text: 'Wumvise ute ko uri kumwe n\'abandi?', type: 'scale' },
    { id: 'anxiety', text: 'Hari ubwoba cyangwa impungenge?', type: 'scale' },
    { id: 'joy', text: 'Wagize akanyamuneza?', type: 'scale' },
  ],
  fr: [
    { id: 'sleep', text: 'Comment avez-vous dormi la nuit dernière?', type: 'scale' },
    { id: 'appetite', text: 'Comment était votre appétit?', type: 'scale' },
    { id: 'social', text: 'Vous êtes-vous senti(e) connecté(e) aux autres?', type: 'scale' },
    { id: 'anxiety', text: 'Avez-vous ressenti de l\'anxiété ou des inquiétudes aujourd\'hui?', type: 'scale' },
    { id: 'joy', text: 'Avez-vous vécu un moment de joie?', type: 'scale' },
  ],
};

export default function CheckInPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [tip, setTip] = useState<string>('');

  useEffect(() => {
    setLang(getLang());
  }, []);

  const current = QUESTIONS[lang][step];
  const total = QUESTIONS[lang].length;

  const setAnswer = (value: number) => {
    setAnswers({ ...answers, [current.id]: value });
  };

  const next = () => {
    if (step + 1 < total) setStep(step + 1);
    else computeResult();
  };

  const computeResult = () => {
    const sum = Object.values(answers).reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / total);
    setResult(avg);
    // Simple tip logic based on avg
    if (avg >= 4) setTip(t[lang].checkinTip + ': Keep up the good habits!');
    else if (avg >= 2) setTip(t[lang].checkinTip + ': Consider a short breathing session.');
    else setTip(t[lang].checkinTip + ': You may want to reach out to a professional.');
    // Store check‑in count for badge tracking
    const stats = JSON.parse(localStorage.getItem('komera_stats') || '{}');
    stats.checkinSessions = (stats.checkinSessions || 0) + 1;
    localStorage.setItem('komera_stats', JSON.stringify(stats));
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setResult(null);
    setTip('');
  };

  const T = t[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col">
      <nav className="px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-indigo-200 font-bold text-lg hover:text-white transition">{T.back}</Link>
        <span className="text-indigo-300 text-sm font-medium">{T.checkinTitle}</span>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Question step */}
        {result === null && (
          <div className="max-w-lg w-full text-center">
            <h2 className="text-2xl font-black text-white mb-4">{current.text}</h2>
            <div className="flex justify-center gap-4 mb-6">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v}
                  onClick={() => setAnswer(v)}
                  className={`w-12 h-12 rounded-full ${answers[current.id] === v ? 'bg-indigo-600 text-white' : 'bg-indigo-200 text-indigo-700'} transition`}
                >{v}</button>
              ))}
            </div>
            <button onClick={next}
              disabled={answers[current.id] === undefined}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-xl disabled:opacity-40 transition"
            >{step + 1 === total ? T.checkinDone : T.checkinNext}</button>
          </div>
        )}

        {/* Result */}
        {result !== null && (
          <div className="max-w-md w-full text-center">
            <h2 className="text-4xl font-black text-white mb-4">{T.checkinResult}: {result}/5</h2>
            <p className="text-indigo-200 mb-6 italic">{tip}</p>
            <div className="flex gap-3">
              <button onClick={restart}
                className="flex-1 border-2 border-indigo-400 text-indigo-200 py-3 rounded-xl font-bold hover:bg-white/10 transition"
              >{T.checkinAgain}</button>
              <Link href="/dashboard"
                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
              >{T.back}</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
