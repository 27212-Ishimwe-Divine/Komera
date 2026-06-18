'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { t, getLang, Lang } from '@/lib/translations';
import RadialMoodSelector from '../components/RadialMoodSelector';

const MOODS = [
  { value: 1, emoji: '😞', labelKey: 'Very Bad', color: 'bg-red-200 ring-red-500' },
  { value: 2, emoji: '😕', labelKey: 'Bad', color: 'bg-orange-200 ring-orange-500' },
  { value: 3, emoji: '😐', labelKey: 'Okay', color: 'bg-yellow-200 ring-yellow-500' },
  { value: 4, emoji: '🙂', labelKey: 'Good', color: 'bg-lime-200 ring-lime-500' },
  { value: 5, emoji: '😄', labelKey: 'Great', color: 'bg-green-200 ring-green-500' },
  // New options for richer expression
  { value: 6, emoji: '🤩', labelKey: 'Excited', color: 'bg-pink-200 ring-pink-500' },
  { value: 7, emoji: '😓', labelKey: 'Stressed', color: 'bg-indigo-200 ring-indigo-500' },
  { value: 8, emoji: '😌', labelKey: 'Calm', color: 'bg-teal-200 ring-teal-500' },
  { value: 9, emoji: '🥱', labelKey: 'Tired', color: 'bg-gray-300 ring-gray-500' },
];

interface MoodLog { id: number; mood: number; note?: string; feeling?: string; createdAt: string; }

export default function MoodPage() {
  const router = useRouter();


  // State declarations
  const [lang, setLang] = useState<Lang>('en');
  const [selected, setSelected] = useState<number | null>(null);
  const [details, setDetails] = useState('');
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (value: number) => {
    setSelected(value);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setLang((JSON.parse(u).language as Lang) || getLang());
    fetchLogs();
  }, [router]);

  const fetchLogs = async () => {
    try { const { data } = await api.get('/mood'); setLogs(data); } catch {}
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) { toast.error(T.selectMoodError); return; }
    setLoading(true);
    try {
      const combinedNote = details;
      await api.post('/mood', { mood: selected, note: combinedNote });
      toast.success(T.moodLogged);
      setSelected(null); setDetails(''); fetchLogs();
    } catch { toast.error(T.moodFailed); }
    finally { setLoading(false); }
  };

  const T = t[lang];

  return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">

      <nav className="bg-gradient-to-r from-teal-800 to-emerald-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="text-white font-bold text-lg hover:text-teal-200 transition">{T.back}</Link>
        <span className="text-teal-200 text-sm font-medium">{T.moodTitle}</span>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">{T.moodQuestion}</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">{T.moodIntro}</p>
          <form onSubmit={submit}>
            <RadialMoodSelector moods={MOODS} selected={selected} onSelect={handleSelect} />
            <p className="mt-4 text-sm text-gray-600 text-center">{T.moodStepHint}</p>
            {selected && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">{(selected && [1,2].includes(selected)) ? T.moodPromptSad : T.moodPromptOther}</p>
                <p className="text-sm text-gray-600 mb-3">{T.moodPromptIntro}</p>
                <textarea
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white text-gray-900 focus:outline-none focus:border-teal-500 transition resize-none text-sm"
                  rows={4}
                  placeholder={T.moodPromptPlaceholder}
                />
              </div>
            )}
            <button type="submit" disabled={loading}
              className="mt-4 w-full bg-teal-600 hover:bg-teal-700 hover:scale-105 text-white py-3 rounded-xl font-bold transition disabled:opacity-50 shadow-lg shadow-teal-100"
            >
              {loading ? T.logging : T.logMood}
            </button>
          </form>
        </div>

        <h3 className="font-bold text-gray-700 mb-4 text-lg">{T.recentMoods}</h3>
        <div className="space-y-3">
          {logs.map(log => {
            const mood = MOODS.find(m => m.value === log.mood);
            return (
              <div key={log.id} className="bg-white rounded-xl shadow-sm px-4 py-4 flex items-center gap-4 border border-gray-100">
                <span className="text-3xl">{mood?.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-700">{mood?.labelKey}</p>
                  {log.note && <p className="text-sm text-gray-400 mt-0.5">{log.note}</p>}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(log.createdAt).toLocaleDateString()}</span>
              </div>
            );
          })}
          {logs.length === 0 && <p className="text-gray-400 text-sm text-center py-8">{T.noMoods}</p>}
        </div>
      </main>
    </div>
  );
}
