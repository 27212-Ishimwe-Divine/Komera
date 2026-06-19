'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ChatBubble from '@/components/chat/ChatBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp?: Date;
}

const STARTERS: Record<string, string[]> = {
  en: ['I feel alone today', 'I need someone to listen', 'How do I calm my mind?'],
  rw: ['Ndumva ndi njyenyine uyu munsi', 'Nkeneye unyumva', 'Nshobora gutuza umutima wanjye gute?'],
  fr: ['Je me sens seul(e) aujourd\'hui', 'J\'ai besoin qu\'on m\'écoute', 'Comment calmer mon esprit ?'],
};

const FOLLOW_UP_SUGGESTIONS: Record<string, string[]> = {
  en: [
    "Why do you feel that way?",
    "Can you tell me more about what's happening?",
    "How is this making you feel right now?"
  ],
  rw: [
    "Kuki wiyumva utyo?",
    "Wabwira byinshi kuraho? Ntewe n'iki?",
    "Ubu wiyumva ute neza?"
  ],
  fr: [
    "Pourquoi vous sentez-vous comme ça ?",
    "Pouvez-vous m'en dire un peu plus ?",
    "Comment est-ce que cela vous fait ressentir ?"
  ]
};

export default function ChatPage() {
  const { lang, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const getTranslations = (language: string) => {
    if (language === 'rw') {
      return {
        title: 'Ndwira',
        subtitle: 'Umusohoza w’umutima wawe',
        emptyTitle: 'Muraho 👋',
        emptySub: 'Ndumva neza. Vuga ibyo uri kumva, ndi hano kukumva n\'kugufasha.',
        placeholder: 'Andika uko uri kwiyumva...',
        send: 'Ohereza',
        chatError: 'Habaye ikibazo. Ongera ugerageze.',
        languageNote: 'Ndwira irumva kandi ivuga mu Kinyarwanda',
        suggestionsTitle: 'Wabwira byinshi?',
        welcome: 'Muraho! Ndi hano kukumva. Wiyumva ute uyu munsi?'
      };
    }
    if (language === 'fr') {
      return {
        title: 'Ndwira',
        subtitle: 'Votre compagnon bienveillant',
        emptyTitle: 'Bonjour 👋',
        emptySub: 'Je suis là pour vous écouter. Parlez-moi de ce que vous ressentez.',
        placeholder: 'Écrivez ce que vous ressentez...',
        send: 'Envoyer',
        chatError: 'Une erreur est survenue. Veuillez réessayer.',
        languageNote: 'Ndwira répond en français',
        suggestionsTitle: 'Pouvez-vous en dire plus ?',
        welcome: 'Bonjour ! Je suis là pour vous écouter. Comment vous sentez-vous aujourd’hui ?'
      };
    }
    return {
      title: 'Ndwira',
      subtitle: 'Your empathetic companion',
      emptyTitle: 'Hello 👋',
      emptySub: 'I\'m here to listen. Share what\'s on your mind.',
      placeholder: 'Write how you\'re feeling...',
      send: 'Send',
      chatError: 'Something went wrong. Please try again.',
      languageNote: 'Ndwira is listening',
      suggestionsTitle: 'Can you tell me more?',
      welcome: 'Hello! I\'m here to listen. How are you feeling today?'
    };
  };

  const T = getTranslations(lang);
  const starters = STARTERS[lang] || STARTERS.en;
  const suggestions = FOLLOW_UP_SUGGESTIONS[lang] || FOLLOW_UP_SUGGESTIONS.en;

  // Send gentle welcome message when chat is empty
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          role: 'model',
          content: T.welcome,
          timestamp: new Date()
        }]);
      }, 600);
    }
  }, [lang]); // Re-welcome if language changes

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].role === 'user') {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg || loading) return;

    const newUserMessage: Message = { role: 'user', content: userMsg, timestamp: new Date() };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);
    setShowSuggestions(false);

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
      toast.error(T.chatError);
      
      const fallback = lang === 'rw' 
        ? "Ndi kubona ikibazo ubu. Ongera ugerageze, ndi hano."
        : lang === 'fr'
        ? "Je rencontre un petit problème. Réessayez, je suis là."
        : "I'm having a small issue. Try again, I'm still here.";
      
      setMessages((prev) => [...prev, { role: 'model', content: fallback }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId, lang, user, T]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col bg-background">
      {/* Header */}
      <div className="border-b border-[#E8DFD4] bg-card px-4 py-4 sticky top-0 z-10">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-hill to-lake text-3xl shadow-sm">
            🌿
          </span>
          <div>
            <h1 className="font-bold text-2xl text-hill-dark">{T.title}</h1>
            <p className="text-sm text-earth">{T.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {messages.length === 1 && messages[0].role === 'model' && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-lake/10 text-7xl">
                🌅
              </div>
              <p className="text-earth text-lg max-w-md mx-auto">{T.emptySub}</p>
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

          {/* Natural conversation suggestions */}
          {showSuggestions && (
            <div className="mt-6 px-4">
              <p className="text-earth text-sm mb-3 text-center font-light">{T.suggestionsTitle}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion)}
                    className="text-sm border border-[#E8DFD4] hover:border-lake bg-card hover:bg-lake-soft rounded-3xl px-5 py-3 transition-all active:scale-95"
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

      {/* Centered Input Area */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-3 bg-card border border-[#E8DFD4] rounded-3xl p-2 shadow-lg"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={T.placeholder}
            className="flex-1 bg-transparent px-6 py-4 text-base outline-none placeholder:text-earth"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-2xl bg-hill px-8 py-4 font-semibold text-white hover:bg-hill-dark disabled:opacity-60 transition"
          >
            {T.send}
          </button>
        </form>
        <p className="text-center text-xs text-earth/70 mt-3">
          {T.languageNote}
        </p>
      </div>
    </div>
  );
}