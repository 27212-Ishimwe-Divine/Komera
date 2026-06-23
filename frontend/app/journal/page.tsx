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
      toast.success('Entry saved!');
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

      <nav className="relative bg-card/90 backdrop-blur px-6 py-4 flex justify-between items-center border-b border-[#E8DFD4]">
        <Link href="/dashboard" className="text-hill-dark font-bold text-lg hover:text-hill transition">{T.back}</Link>
        <div className="flex items-center gap-3">
          <span className="text-hill text-sm font-medium">{T.journalTitle}</span>
          <a
            href="tel:112"
            className="rounded-full border-2 border-red-500 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
          >
            📞 {T.policeEmergency}: {T.policeNumber}
          </a>
        </div>
      </nav>

      <main className="relative max-w-2xl mx-auto px-6 py-10">
        <div className="komera-card bg-card/90 backdrop-blur p-6 mb-8">
          <h2 className="text-xl font-bold text-hill-dark mb-4">{T.newEntry}</h2>
          <p className="text-sm text-earth mb-4">This is your private space to write freely. There is no right or wrong way to express yourself.</p>
          <form onSubmit={submit} className="space-y-4">
            <input type="text" placeholder={T.entryTitle} value={title} onChange={e => setTitle(e.target.value)}
              className="w-full border border-[#E8DFD4] bg-background/90 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-hill focus:ring-2 focus:ring-lake-soft transition" />
            <textarea placeholder={T.entryContent} value={content} onChange={e => setContent(e.target.value)}
              rows={6} required
              className="w-full border border-[#E8DFD4] bg-background/90 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-hill focus:ring-2 focus:ring-lake-soft transition resize-none" />
            <button type="submit" disabled={loading}
              className="w-full bg-hill hover:bg-hill-dark text-white py-3 rounded-xl font-bold transition disabled:opacity-50 shadow-sm">
              {loading ? T.saving : T.saveEntry}
            </button>
          </form>
        </div>

        <h3 className="font-bold text-hill-dark mb-4 text-lg">{T.pastEntries}</h3>
        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="komera-card bg-card/90 backdrop-blur p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-hill-dark">{entry.title || T.untitled}</h4>
                <button onClick={() => deleteEntry(entry.id)}
                  className="text-red-400 hover:text-red-600 text-xs font-medium transition">{T.delete}</button>
              </div>
              <p className="text-earth text-sm leading-relaxed line-clamp-3">{entry.content}</p>
              <p className="text-xs text-earth/60 mt-3">{new Date(entry.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {entries.length === 0 && <p className="text-earth/70 text-sm text-center py-8">{T.noEntries}</p>}
        </div>
      </main>
    </div>
  );
}
