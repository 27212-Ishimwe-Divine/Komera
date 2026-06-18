'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { t, getLang, Lang } from '@/lib/translations';

export default function FeelingsPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [feeling, setFeeling] = useState('');
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    const user = localStorage.getItem('user');
    if (user) setLang((JSON.parse(user).language as Lang) || getLang());
  }, [router]);

  const add = () => {
    if (!feeling.trim()) return;
    setList(prev => [feeling.trim(), ...prev]);
    setFeeling('');
    toast.success('Feeling recorded');
  };

  const T = t[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-teal-800 to-emerald-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="text-white font-bold text-lg hover:text-teal-200 transition">{T.back}</Link>
        <span className="text-teal-200 text-sm font-medium">{T.feelingTitle}</span>
      </nav>
      <main className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{T.feelingDesc}</h2>
        <p className="text-sm text-gray-600 mb-4">Try naming one feeling, or write a short sentence about how your day feels. It can help you understand yourself better.</p>
        <textarea
          placeholder={T.feelingPlaceholder}
          value={feeling}
          onChange={e => setFeeling(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl p-3 mb-3 focus:outline-none focus:border-teal-500"
          rows={3}
        />
        <button
          onClick={add}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl font-bold disabled:opacity-50 transition"
          disabled={!feeling.trim()}
        >
          {T.feelingSend}
        </button>
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{T.feelingTitle}</h3>
          {list.length === 0 ? (
            <p className="text-gray-400">No feelings shared yet.</p>
          ) : (
            <ul className="space-y-2">
              {list.map((f, i) => (
                <li key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  {f}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
