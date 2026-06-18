'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { t } from '@/lib/translations';
import { useAuth } from '@/context/AuthContext';
import ChatBubble from '@/components/chat/ChatBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';

interface Message {
  role: string;
  content: string;
}

const STARTERS: Record<string, string[]> = {
  en: ['I feel alone today', 'I need someone to listen', 'How do I calm my mind?'],
  rw: ['Numva nenyine uyu munsi', 'Nkeneye uwumva', 'Nshobora gutuza ate?'],
  fr: ['Je me sens seul(e) aujourd\'hui', 'J\'ai besoin qu\'on m\'écoute', 'Comment calmer mon esprit?'],
};

export default function ChatPage() {
  const { lang } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const T = t[lang];
  const starters = STARTERS[lang] || STARTERS.en;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/chat', { message: userMsg, sessionId, language: lang });
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col bg-background">
      <div className="border-b border-[#E8DFD4] bg-card px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-hill to-lake text-xl text-white shadow-sm">
            🌅
          </span>
          <div>
            <h1 className="font-bold text-hill-dark">Ndwira</h1>
            <p className="text-xs text-earth">{T.chatTitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
          <div className="komera-card p-4 text-sm leading-relaxed text-earth">{T.chatHint}</div>

          {messages.length === 0 && (
            <div className="py-8 text-center">
              <span className="text-5xl animate-float inline-block">💬</span>
              <h3 className="mt-4 text-lg font-bold text-hill-dark">{T.chatEmpty}</h3>
              <p className="mt-1 text-sm text-earth">{T.chatEmptySub}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-[#E8DFD4] bg-card px-4 py-2 text-xs font-medium text-hill transition hover:border-lake hover:bg-lake-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="sticky bottom-[4.5rem] border-t border-[#E8DFD4] bg-card/95 px-4 py-3 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-2xl gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={T.chatPlaceholder}
            className="flex-1 rounded-full border border-[#E8DFD4] bg-background px-5 py-3 text-sm text-foreground outline-none transition focus:border-lake focus:ring-2 focus:ring-lake-soft"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-hill px-5 py-3 text-sm font-semibold text-white transition hover:bg-hill-dark disabled:opacity-40"
          >
            {T.send}
          </button>
        </div>
      </form>
    </div>
  );
}
