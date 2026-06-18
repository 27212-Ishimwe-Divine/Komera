'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { t, getLang, Lang } from '@/lib/translations';

export default function TestimonialsPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [input, setInput] = useState('');
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setLang((JSON.parse(u).language as Lang) || getLang());
    const stored = localStorage.getItem('testimonials');
    if (stored) setList(JSON.parse(stored));
  }, [router]);

  const submit = () => {
    if (!input.trim()) return;
    const updated = [input.trim(), ...list];
    setList(updated);
    localStorage.setItem('testimonials', JSON.stringify(updated));
    setInput('');
    toast.success('✅ Testimony shared!');
  };

  const T = t[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-teal-800 to-emerald-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="text-white font-bold text-lg hover:text-teal-200 transition">{T.back}</Link>
        <span className="text-teal-200 text-sm font-medium">{T.testimonialsTitle}</span>
      </nav>
      <main className="max-w-xl mx-auto px-6 py-10">
        <p className="text-center text-gray-600 mb-4">{T.testimonialsDesc}</p>
        <textarea
          placeholder={T.testimonialPlaceholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white text-gray-900 focus:outline-none focus:border-teal-500 transition resize-none text-sm mb-4"
          rows={3}
        />
        <button
          onClick={submit}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-50 shadow-lg shadow-teal-100"
          disabled={!input.trim()}
        >
          {T.submitTestimonial}
        </button>
        <section className="mt-8">
          <h3 className="font-bold text-gray-700 mb-4 text-lg">{T.testimonialsTitle}</h3>
          {list.length === 0 ? (
            <p className="text-gray-400">{T.noTestimonials}</p>
          ) : (
            <ul className="space-y-2">
              {list.map((t, i) => (
                <li key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
