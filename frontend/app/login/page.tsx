'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { t, Lang } from '@/lib/translations';

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const T = t[lang];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ ...data.user, language: lang }));
      localStorage.setItem('lang', lang);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2">{T.appName}</h1>
          <p className="text-teal-300 text-lg">{T.appTagline}</p>
        </div>
        <div className="space-y-6">
          {[T.loginFeature1, T.loginFeature2, T.loginFeature3].map(item => (
            <div key={item} className="flex items-center gap-3 text-teal-100 text-sm">{item}</div>
          ))}
        </div>
        <p className="text-teal-400 text-xs">&copy; 2024 Komera · Rwanda</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 bg-white px-8 py-12 lg:rounded-l-3xl">
        {/* Lang switcher */}
        <div className="flex gap-2 mb-8 self-end">
          {(['en','rw','fr'] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${lang === l ? 'bg-teal-600 text-white border-teal-600' : 'text-teal-700 border-teal-200 hover:border-teal-400'}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">{T.loginTitle}</h2>
            <p className="text-gray-500">{T.loginSub}</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{T.email}</label>
              <input type="email" required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-teal-500 transition"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{T.password}</label>
              <input type="password" required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-teal-500 transition"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 text-lg shadow-lg shadow-teal-200">
              {loading ? T.signingIn : T.signIn}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            {T.noAccount}{' '}
            <Link href="/register" className="text-teal-600 font-semibold hover:underline">{T.register}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
