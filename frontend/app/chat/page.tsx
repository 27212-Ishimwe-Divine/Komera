'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { t } from '@/lib/translations';
import { useAuth } from '@/context/AuthContext';
import ChatBubble from '@/components/chat/ChatBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp?: Date;
}

export default function ChatPage() {
  const { user, lang } = useAuth();
  const T = t[lang];

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: T.emptyTitle || "Hello, I'm here with you.", timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = T.suggestions || [
    lang === 'rw' ? "Umeze ute uyu munsi?" : "How are you feeling today?",
    lang === 'rw' ? "Ndumva nshushanya" : "I feel overwhelmed",
    lang === 'rw' ? "Nshaka kuganira" : "I need someone to talk to",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (overrideText?: string) => {
    const userMsg = (overrideText ?? input).trim();
    if (!userMsg || loading) return;

    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat', {
        message: userMsg,
        sessionId,
        language: lang,
        userId: user?.id,
      });

      setSessionId(data.sessionId);

      setMessages((prev) => [...prev, {
        role: 'model',
        content: data.reply,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error(error);
      toast.error(T.chatError || "Something went wrong");

      const fallback = lang === 'rw'
        ? "Ndi kubona ikibazo ubu. Ongera ugerageze, ndi hano."
        : "I'm having a small issue. Try again, I'm still here.";

      setMessages((prev) => [...prev, { role: 'model', content: fallback }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId, lang, user, T]);

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col">
      {/* Calming background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop')",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#fdf8ef]/92 via-[#fdf8ef]/88 to-[#fdf8ef]/95" />

      {/* Header */}
      <div className="border-b border-[#E8DFD4] bg-card/90 backdrop-blur px-4 py-4 sticky top-0 z-10">
        <div className="mx-auto max-w-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-hill to-lake text-3xl shadow-sm">
              🌿
            </span>
            <div>
              <h1 className="font-bold text-2xl text-hill-dark">{T.title || "Komera"}</h1>
              <p className="text-sm text-earth">{T.subtitle || "I'm here to listen and support you"}</p>
            </div>
          </div>
          <a
            href="tel:112"
            className="rounded-full border-2 border-red-500 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
          >
            📞 {T.policeEmergency}: {T.policeNumber}
          </a>
        </div>
      </div>

      {/* Messages Area */}
      <div className="relative flex-1 overflow-y-auto pb-32">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {messages.length === 1 && messages[0].role === 'model' && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-lake/10 text-7xl">
                🌅
              </div>
              <p className="text-earth text-lg max-w-md mx-auto">{T.emptySub || "You can speak freely. I'm listening."}</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <ChatBubble
              key={index}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}

          {loading && <TypingIndicator />}

          {showSuggestions && (
            <div className="mt-6 px-4">
              <p className="text-earth text-sm mb-3 text-center font-light">{T.suggestionsTitle || "Try saying something like..."}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion)}
                    className="text-sm border border-[#E8DFD4] hover:border-lake bg-card/90 backdrop-blur hover:bg-lake-soft rounded-3xl px-5 py-3 transition-all active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Centered Input Area - Improved visibility */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-3 bg-white/95 backdrop-blur border-2 border-[#E8DFD4] rounded-3xl p-3 shadow-xl"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={T.placeholder || (lang === 'rw' ? "Vuga ibiri mu mutima wawe..." : "Tell me what's on your heart...")}
            className="flex-1 bg-[#fdf8ef] px-5 py-4 text-base outline-none border border-[#E8DFD4] rounded-2xl resize-y min-h-[52px] max-h-[120px] placeholder:text-earth/60 focus:border-hill focus:ring-2 focus:ring-hill/20 transition-all"
            disabled={loading}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-2xl bg-hill px-6 py-3 font-semibold text-white hover:bg-hill-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg self-end"
          >
            {T.send || 'Send'}
          </button>
        </form>
        <p className="text-center text-xs text-earth/70 mt-3 font-medium">
          {T.languageNote || 'Press Enter to send • Shift + Enter for new line'}
        </p>
      </div>
    </div>
  );
}