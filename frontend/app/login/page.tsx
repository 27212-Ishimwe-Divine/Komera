'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { t, Lang } from '@/lib/translations';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [lang, setLang] = useState<Lang>('en');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const T = t[lang];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      const user = { ...data.user, language: lang };
      localStorage.setItem('lang', lang);
      login(data.token, user);
      const dest = localStorage.getItem('komera_onboarded') ? '/dashboard' : '/onboarding';
      router.push(dest);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Login failed');
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
        <div className="space-y-4">
          {[T.loginFeature1, T.loginFeature2, T.loginFeature3].map((item) => (
            <div key={item} className="flex items-center gap-3 text-white/90 text-sm rounded-2xl bg-white/10 px-4 py-3">
              {item}
            </div>
          ))}
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
            <span className="text-4xl">🌅</span>
            <h2 className="text-3xl font-bold text-hill-dark mb-1 mt-3">{T.loginTitle}</h2>
            <p className="text-earth">{T.loginSub}</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-hill-dark mb-1">{T.email}</label>
              <input
                type="email"
                required
                className="w-full border border-[#E8DFD4] rounded-2xl px-4 py-3 text-foreground bg-background focus:outline-none focus:border-lake focus:ring-2 focus:ring-lake-soft transition"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hill-dark mb-1">{T.password}</label>
              <input
                type="password"
                required
                className="w-full border border-[#E8DFD4] rounded-2xl px-4 py-3 text-foreground bg-background focus:outline-none focus:border-lake focus:ring-2 focus:ring-lake-soft transition"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hill hover:bg-hill-dark text-white font-bold py-3 rounded-full transition disabled:opacity-50 text-lg shadow-[var(--shadow-soft)]"
            >
              {loading ? T.signingIn : T.signIn}
            </button>
          </form>

          <p className="mt-6 text-center text-earth text-sm">
            {T.noAccount}{' '}
            <Link href="/register" className="text-hill font-semibold hover:underline">
              {T.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
