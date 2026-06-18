'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Lang } from '@/lib/translations';
import { MOOD_GARDEN } from '@/lib/constants';

const STEPS: Record<
  Lang,
  { emoji: string; title: string; body: string; quote?: string; isMood?: boolean; isFinal?: boolean }[]
> = {
  en: [
    {
      emoji: '🌅',
      title: 'Muraho, friend',
      body: 'Komera means "stay strong" — not alone, but together. This is your private inner garden. What grows here stays here.',
      quote: '"Umuti urahenda, ariko ubuzima ni agaciro." — Healing takes time, but life is precious.',
    },
    {
      emoji: '🌍',
      title: 'Your language, your way',
      body: 'Speak in Kinyarwanda, English, or French — whatever feels most like home. You can change this anytime.',
    },
    {
      emoji: '🌱',
      title: 'How are you arriving today?',
      body: 'There is no wrong answer. This helps your garden know where to begin.',
      isMood: true,
    },
    {
      emoji: '🤝',
      title: 'One small promise',
      body: 'Komera is a companion, not a doctor. For emergencies, we will always show you real people who can help — just tap Crisis anytime.',
      isFinal: true,
    },
  ],
  rw: [
    {
      emoji: '🌅',
      title: 'Muraho, nshuti',
      body: 'Komera bisobanura "gukomera" — nturi wenyine. Uru ni urusobe rwawe rw\'imbere. Ibyo uhinga hano biraguma hano.',
      quote: '"Umuti urahenda, ariko ubuzima ni agaciro."',
    },
    {
      emoji: '🌍',
      title: 'Ururimi rwawe',
      body: 'Vuga mu Kinyarwanda, Icyongereza, cyangwa Igifaransa — uko wiyumva woroheye. Ushobora guhindura igihe cyose.',
    },
    {
      emoji: '🌱',
      title: 'Waje umeze ute?',
      body: 'Nta gisubizo cyo kuyivamo. Ibi bifasha urusobe rwawe kumenya aho gutangira.',
      isMood: true,
    },
    {
      emoji: '🤝',
      title: 'Isezerano rimwe',
      body: 'Komera ni inshuti, si umuganga. Mu gihe cy\'ihutirwa, kanda Ihutirwa — tuzagira abantu b\'ukuri bashobora kugufasha.',
      isFinal: true,
    },
  ],
  fr: [
    {
      emoji: '🌅',
      title: 'Muraho, mon ami(e)',
      body: 'Komera signifie "tiens bon" — pas seul(e), mais ensemble. C\'est votre jardin intérieur privé.',
      quote: '"La guérison prend du temps, mais la vie est précieuse."',
    },
    {
      emoji: '🌍',
      title: 'Votre langue',
      body: 'Parlez en kinyarwanda, anglais ou français — ce qui vous ressemble. Modifiable à tout moment.',
    },
    {
      emoji: '🌱',
      title: 'Comment arrivez-vous aujourd\'hui?',
      body: 'Il n\'y a pas de mauvaise réponse. Cela aide votre jardin à savoir par où commencer.',
      isMood: true,
    },
    {
      emoji: '🤝',
      title: 'Une petite promesse',
      body: 'Komera est un compagnon, pas un médecin. En cas d\'urgence, appuyez sur Urgence — nous vous montrerons de vraies personnes.',
      isFinal: true,
    },
  ],
};

const LABELS = {
  back: { en: 'Back', rw: 'Subira inyuma', fr: 'Retour' },
  continue: { en: 'Continue', rw: 'Komeza', fr: 'Continuer' },
  begin: { en: 'Begin my journey', rw: 'Tangira urugendo', fr: 'Commencer' },
  skip: { en: 'Skip for now', rw: 'Simbuka', fr: 'Passer' },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { lang, markOnboarded } = useAuth();
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const steps = STEPS[lang];
  const current = steps[step];

  const finish = async () => {
    markOnboarded();
    if (mood) {
      try {
        await api.post('/mood', { mood, note: 'First garden check-in' });
      } catch {
        localStorage.setItem('komera_first_mood', String(mood));
      }
    }
    router.replace('/dashboard');
  };

  const next = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    await finish();
    setSaving(false);
  };

  return (
    <div className="min-h-screen komera-gradient-hero flex flex-col">
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-sunrise' : i < step ? 'w-2 bg-sunrise/60' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <div key={step} className="w-full max-w-md animate-fade-up komera-card p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sunrise-soft text-4xl animate-float">
            {current.emoji}
          </div>

          <h1 className="text-2xl font-bold text-hill-dark">{current.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-earth">{current.body}</p>

          {current.quote && (
            <p className="proverb-text mt-6 text-sm text-hill border-t border-[#E8DFD4] pt-4">
              {current.quote}
            </p>
          )}

          {current.isMood && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {MOOD_GARDEN.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`flex flex-col items-center gap-1 rounded-2xl p-3 min-w-[4.5rem] transition-all ${
                    mood === m.value
                      ? 'bg-lake-soft ring-2 ring-lake scale-105'
                      : 'bg-background hover:bg-sunrise-soft'
                  }`}
                  aria-label={m.label[lang]}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[10px] font-medium text-earth leading-tight">{m.label[lang]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex w-full max-w-md gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 rounded-full border border-white/40 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {LABELS.back[lang]}
            </button>
          )}
          <button
            type="button"
            onClick={next}
            disabled={(current.isMood && mood === null) || saving}
            className="flex-1 rounded-full bg-sunrise py-3 text-sm font-bold text-white shadow-[var(--shadow-warm)] transition hover:brightness-105 disabled:opacity-40"
          >
            {saving
              ? '...'
              : current.isFinal
              ? LABELS.begin[lang]
              : LABELS.continue[lang]}
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            markOnboarded();
            router.replace('/dashboard');
          }}
          className="mt-4 text-xs text-white/60 underline-offset-2 hover:underline"
        >
          {LABELS.skip[lang]}
        </button>
      </div>
    </div>
  );
}
