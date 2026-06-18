'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getLang, Lang } from '@/lib/translations';

export interface User {
  id: number;
  name: string;
  email: string;
  language?: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  lang: Lang;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setLang: (lang: Lang) => void;
  markOnboarded: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_PATHS = ['/', '/login', '/register'];
const AUTH_ONLY_PATHS = ['/onboarding'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLangState] = useState<Lang>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    const storedLang = getLang();

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
        setLangState((parsed.language as Lang) || storedLang);
      } catch {
        localStorage.removeItem('user');
      }
    } else {
      setLangState(storedLang);
    }

    if (!token && !PUBLIC_PATHS.includes(pathname)) {
      router.replace('/login');
      setLoading(false);
      return;
    }

    if (token && (pathname === '/login' || pathname === '/register')) {
      const onboarded = localStorage.getItem('komera_onboarded');
      router.replace(onboarded ? '/dashboard' : '/onboarding');
      setLoading(false);
      return;
    }

    const onboarded = localStorage.getItem('komera_onboarded');
    if (
      token &&
      !onboarded &&
      !AUTH_ONLY_PATHS.includes(pathname) &&
      !PUBLIC_PATHS.includes(pathname)
    ) {
      router.replace('/onboarding');
    }

    setLoading(false);
  }, [pathname, router]);

  const login = useCallback((token: string, u: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    if (u.language) {
      localStorage.setItem('lang', u.language);
      setLangState(u.language as Lang);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    router.replace('/login');
  }, [router]);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem('lang', l);
    setLangState(l);
    if (user) {
      const updated = { ...user, language: l };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    }
  }, [user]);

  const markOnboarded = useCallback(() => {
    localStorage.setItem('komera_onboarded', 'true');
  }, []);

  return (
    <AuthContext.Provider value={{ user, lang, loading, login, logout, setLang, markOnboarded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
