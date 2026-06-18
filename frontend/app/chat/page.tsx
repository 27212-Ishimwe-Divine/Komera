'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { t, getLang, Lang } from '@/lib/translations';

interface Message { role: string; content: string; }

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [lang, setLang] = useState<Lang>('en');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setLang((JSON.parse(u).language as Lang) || getLang());
  }, [router]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const T = t[lang];

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/chat', { message: userMsg, sessionId, language: lang });
      setSessionId(data.sessionId);
      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-gradient-to-r from-teal-800 to-emerald-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link href="/dashboard" className="text-white font-bold text-lg hover:text-teal-200 transition">{T.back}</Link>
        <span className="text-teal-200 text-sm font-medium">{T.chatTitle}</span>
      </nav>

      <div className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-sm text-gray-600">
          {T.chatHint}
        </div>
        {messages.length === 0 && (
          <div className="text-center mt-20">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">💚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-1">{T.chatEmpty}</h3>
            <p className="text-gray-400 text-sm">{T.chatEmptySub}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {m.role !== 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">K</div>
            )}
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
              m.role === 'user'
                ? 'bg-teal-600 text-white rounded-tr-none'
                : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">K</div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="bg-white border-t shadow-lg px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder={T.chatPlaceholder}
            className="flex-1 border-2 border-gray-200 rounded-full px-5 py-3 text-gray-800 focus:outline-none focus:border-teal-500 transition" />
          <button type="submit" disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-semibold disabled:opacity-50 transition shadow-lg shadow-teal-200">
            {T.send}
          </button>
        </div>
      </form>
    </div>
  );
}
