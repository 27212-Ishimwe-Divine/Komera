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
    { id: 'sleep', text: "N'ukeye ute ijoro ryashize?", type: 'scale' },
    { id: 'appetite', text: 'Urumva ute amafunguro?', type: 'scale' },
    { id: 'social', text: 'Wumvise ute kouri kumwe n\'abandi?', type: 'scale' },
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
    if (avg >= 4) setTip(t[lang].checkinTip + ': Keep up the good habits!');
    else if (avg >= 2) setTip(t[lang].checkinTip + ': Consider a short breathing session.');
    else setTip(t[lang].checkinTip + ': You may want to reach out to a professional.');
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
    <div className="relative min-h-screen flex flex-col">
      {/* Calming background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop')",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#fdf8ef]/92 via-[#fdf8ef]/88 to-[#fdf8ef]/95" />

      <nav className="relative px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-hill-dark font-bold text-lg hover:text-hill transition">{T.back}</Link>
        <span className="text-hill text-sm font-medium">{T.checkinTitle}</span>
      </nav>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Question step */}
        {result === null && (
          <div className="komera-card bg-card/90 backdrop-blur max-w-lg w-full text-center p-8">
            <h2 className="text-2xl font-black text-hill-dark mb-4">{current.text}</h2>
            <div className="flex justify-center gap-4 mb-6">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v}
                  onClick={() => setAnswer(v)}
                  className={`w-12 h-12 rounded-full transition ${answers[current.id] === v ? 'bg-hill text-white' : 'bg-lake-soft text-hill-dark'}`}
                >{v}</button>
              ))}
            </div>
            <button onClick={next}
              disabled={answers[current.id] === undefined}
              className="bg-hill hover:bg-hill-dark text-white font-bold py-2 px-6 rounded-xl disabled:opacity-40 transition"
            >{step + 1 === total ? T.checkinDone : T.checkinNext}</button>
          </div>
        )}

        {/* Result */}
        {result !== null && (
          <div className="komera-card bg-card/90 backdrop-blur max-w-md w-full text-center p-8">
            <h2 className="text-4xl font-black text-hill-dark mb-4">{T.checkinResult}: {result}/5</h2>
            <p className="text-earth mb-6 italic">{tip}</p>
            <div className="flex gap-3">
              <button onClick={restart}
                className="flex-1 border-2 border-hill text-hill py-3 rounded-xl font-bold hover:bg-lake-soft transition"
              >{T.checkinAgain}</button>
              <Link href="/dashboard"
                className="flex-1 bg-hill text-white py-3 rounded-xl font-bold hover:bg-hill-dark transition flex items-center justify-center"
              >{T.back}</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
