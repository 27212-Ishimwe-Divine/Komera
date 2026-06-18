'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { t, getLang, Lang } from '@/lib/translations';

interface Entry { id: number; title?: string; content: string; createdAt: string; }

export default function JournalPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setLang((JSON.parse(u).language as Lang) || getLang());
    fetchEntries();
  }, [router]);

  const fetchEntries = async () => {
    try { const { data } = await api.get('/journal'); setEntries(data); } catch {}
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) { toast.error('Content is required'); return; }
    setLoading(true);
    try {
      await api.post('/journal', { title, content });
      toast.success('✅ Entry saved!');
      setTitle(''); setContent(''); fetchEntries();
    } catch { toast.error('Failed to save entry'); }
    finally { setLoading(false); }
  };

  const deleteEntry = async (id: number) => {
    try { await api.delete(`/journal/${id}`); setEntries(prev => prev.filter(e => e.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const T = t[lang];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-teal-800 to-emerald-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="text-white font-bold text-lg hover:text-teal-200 transition">{T.back}</Link>
        <span className="text-teal-200 text-sm font-medium">{T.journalTitle}</span>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{T.newEntry}</h2>
          <p className="text-sm text-gray-600 mb-4">This is your private space to write freely. There is no right or wrong way to express yourself.</p>
          <form onSubmit={submit} className="space-y-4">
            <input type="text" placeholder={T.entryTitle} value={title} onChange={e => setTitle(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-teal-500 transition" />
            <textarea placeholder={T.entryContent} value={content} onChange={e => setContent(e.target.value)}
              rows={6} required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-teal-500 transition resize-none" />
            <button type="submit" disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-50 shadow-lg shadow-teal-100">
              {loading ? T.saving : T.saveEntry}
            </button>
          </form>
        </div>

        <h3 className="font-bold text-gray-700 mb-4 text-lg">{T.pastEntries}</h3>
        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800">{entry.title || T.untitled}</h4>
                <button onClick={() => deleteEntry(entry.id)}
                  className="text-red-400 hover:text-red-600 text-xs font-medium transition">{T.delete}</button>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{entry.content}</p>
              <p className="text-xs text-gray-300 mt-3">{new Date(entry.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {entries.length === 0 && <p className="text-gray-400 text-sm text-center py-8">{T.noEntries}</p>}
        </div>
      </main>
    </div>
  );
}
