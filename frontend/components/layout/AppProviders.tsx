'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import ThemeDebugProbe from '@/components/debug/ThemeDebugProbe';
import WarmNav from './WarmNav';

function AppShell({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const showNav = Boolean(user);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center animate-fade-up">
          <span className="text-5xl animate-float inline-block">🌅</span>
          <p className="mt-4 text-sm font-semibold text-hill">Komera</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <WarmNav />
      <div className={showNav ? 'pb-24' : ''}>{children}</div>
    </>
  );
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeDebugProbe />
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
