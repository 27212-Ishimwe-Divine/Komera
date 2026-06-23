'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { t } from '@/lib/translations';
import { useAuth } from '@/context/AuthContext';
import { MOOD_GARDEN } from '@/lib/constants';
import RadialMoodSelector from '@/components/garden/RadialMoodSelector';

interface MoodLog {
  id: number;
  mood: number;
  note?: string;
  createdAt: string;
}

export default function MoodPage() {
  const { lang } = useAuth();
  const [selected, setSelected] = useState<number | null>(null);
  const [details, setDetails] = useState('');
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(false);

  const T = t[lang];

  const moodsForSelector = MOOD_GARDEN.map((m) => ({
    value: m.value,
    emoji: m.emoji,
    labelKey: m.label[lang],
    color: m.color,
  }));

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/mood');
      setLogs(data);
    } catch {
      /* silent */
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      toast.error(T.selectMoodError);
      return;
    }
    setLoading(true);
    try {
      await api.post('/mood', { mood: selected, note: details });
      toast.success(T.moodLogged);
      setSelected(null);
      setDetails('');
      fetchLogs();
    } catch {
      toast.error(T.moodFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Calming background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop')",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#fdf8ef]/92 via-[#fdf8ef]/88 to-[#fdf8ef]/95" />

      <main className="relative mx-auto max-w-xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-hill">Mood Garden</p>
            <h1 className="mt-2 text-2xl font-bold text-hill-dark">{T.moodTitle}</h1>
            <p className="mt-2 text-sm text-earth">{T.moodIntro}</p>
          </div>
          <a
            href="tel:112"
            className="rounded-full border-2 border-red-500 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
          >
            📞 {T.policeEmergency}: {T.policeNumber}
          </a>
        </div>

        <div className="komera-card bg-card/90 backdrop-blur p-6">
          <h2 className="text-center text-lg font-semibold text-hill-dark">{T.moodQuestion}</h2>
          <form onSubmit={submit}>
            <RadialMoodSelector moods={moodsForSelector} selected={selected} onSelect={setSelected} />
            <p className="text-center text-sm text-earth">{T.moodStepHint}</p>

            {selected && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-hill-dark">
                  {[1, 2].includes(selected) ? T.moodPromptSad : T.moodPromptOther}
                </p>
                <p className="mb-3 text-sm text-earth">{T.moodPromptIntro}</p>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-[#E8DFD4] bg-background/90 px-4 py-3 text-sm text-foreground outline-none transition focus:border-lake focus:ring-2 focus:ring-lake-soft"
                  rows={4}
                  placeholder={T.moodPromptPlaceholder}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-hill py-3 font-bold text-white transition hover:bg-hill-dark disabled:opacity-50"
            >
              {loading ? T.logging : T.logMood}
            </button>
          </form>
        </div>

        <h3 className="mb-4 mt-8 text-lg font-bold text-hill-dark">{T.recentMoods}</h3>
        <div className="space-y-3">
          {logs.map((log) => {
            const mood = MOOD_GARDEN.find((m) => m.value === log.mood);
            const plantEmoji = mood ? mood.plant : '🌱';
            const moodLabel = mood ? mood.label[lang] : '—';
            return (
              <div
                key={log.id}
                className="komera-card bg-card/90 backdrop-blur flex items-center gap-4 px-4 py-4"
              >
                <span className="text-3xl">{plantEmoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-hill-dark">{moodLabel}</p>
                  {log.note && <p className="mt-0.5 text-sm text-earth">{log.note}</p>}
                </div>
                <span className="whitespace-nowrap text-xs text-earth/70">
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>
            );
          })}
          {logs.length === 0 && (
            <p className="py-8 text-center text-sm text-earth">{T.noMoods}</p>
          )}
        </div>
      </main>
    </div>
  );
}
