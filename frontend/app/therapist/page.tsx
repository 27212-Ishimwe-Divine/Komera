'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { t, getLang, Lang } from '@/lib/translations';

export default function TherapistPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setLang((JSON.parse(u).language as Lang) || getLang());
  }, [router]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/therapist', { message: userMsg });
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch (e) {
      toast.error(T.therapistFailed);
    } finally {
      setLoading(false);
    }
  };

  const T = t[lang];
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-teal-800 to-emerald-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="text-white font-bold text-lg hover:text-teal-200 transition">{T.back}</Link>
        <span className="text-teal-200 text-sm">{T.therapistTitle}</span>
      </nav>
      <main className="max-w-xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{T.therapistSub}</h2>
        <p className="text-sm text-gray-600 mb-6">{T.therapistIntro}</p>
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-lg ${m.from === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <textarea
            placeholder={T.therapistPlaceholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 min-h-[160px] border-2 border-gray-200 rounded-2xl px-4 py-3 bg-white text-gray-900 focus:outline-none focus:border-teal-500 transition resize-none"
            rows={5}
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="w-full sm:w-auto px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold disabled:opacity-50 transition"
          >
            {loading ? '...' : T.therapistSend}
          </button>
        </div>
      </main>
    </div>
  );
}
