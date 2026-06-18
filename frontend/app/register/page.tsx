'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { t, Lang } from '@/lib/translations';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [lang, setLang] = useState<Lang>('en');
  const [form, setForm] = useState({ name: '', email: '', password: '', language: 'en' });
  const [loading, setLoading] = useState(false);
  const T = t[lang];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { ...form, language: lang });
      const user = { ...data.user, language: lang };
      localStorage.setItem('lang', lang);
      localStorage.removeItem('komera_onboarded');
      login(data.token, user);
      router.push('/onboarding');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex komera-gradient-hero">
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">
        <div>
          <p className="text-label-hero text-sm font-semibold uppercase tracking-wider">Komera</p>
          <h1 className="text-5xl font-black tracking-tight mb-2 mt-2">{T.appName}</h1>
          <p className="text-white/80 text-lg">{T.appTagline}</p>
        </div>
        <div className="bg-white/10 rounded-[1.5rem] p-6 backdrop-blur">
          <p className="proverb-text text-white text-lg leading-relaxed">
            &ldquo;Rwanda rebuilt a nation after unimaginable trauma. Komera is a gentle hand extended to every Rwandan who has ever suffered in silence.&rdquo;
          </p>
        </div>
        <p className="text-white/50 text-xs">&copy; 2026 Komera · Rwanda</p>
      </div>

      <div className="flex flex-col justify-center w-full lg:w-1/2 bg-card px-8 py-12 lg:rounded-l-[2rem]">
        <div className="flex gap-2 mb-8 self-end">
          {(['en', 'rw', 'fr'] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                lang === l ? 'bg-hill text-white border-hill' : 'text-hill border-[#E8DFD4] hover:border-lake'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <span className="text-4xl">🌱</span>
            <h2 className="text-3xl font-bold text-hill-dark mb-1 mt-3">{T.registerTitle}</h2>
            <p className="text-earth">{T.registerSub}</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {[
              { label: T.fullName, key: 'name', type: 'text' },
              { label: T.email, key: 'email', type: 'email' },
              { label: T.minPassword, key: 'password', type: 'password' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-hill-dark mb-1">{label}</label>
                <input
                  type={type}
                  required
                  className="w-full border border-[#E8DFD4] rounded-2xl px-4 py-3 text-foreground bg-background focus:outline-none focus:border-lake focus:ring-2 focus:ring-lake-soft transition"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-hill-dark mb-1">{T.language}</label>
              <select
                className="w-full border border-[#E8DFD4] rounded-2xl px-4 py-3 text-foreground bg-background focus:outline-none focus:border-lake transition"
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
              >
                <option value="en">English</option>
                <option value="rw">Kinyarwanda</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hill hover:bg-hill-dark text-white font-bold py-3 rounded-full transition disabled:opacity-50 text-lg"
            >
              {loading ? T.creating : T.createAccount}
            </button>
          </form>

          <p className="mt-6 text-center text-earth text-sm">
            {T.haveAccount}{' '}
            <Link href="/login" className="text-hill font-semibold hover:underline">
              {T.signInLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
