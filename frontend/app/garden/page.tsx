'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { t } from '@/lib/translations';
import BreathingGarden from '@/components/garden/BreathingGarden';

export default function GardenPage() {
  const { user, lang } = useAuth();
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const T = t[lang];

  useEffect(() => {
    if (user) {
      // api.get('/mood').then(res => setMoodLogs(res.data)).catch(() => {});
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50">
        <p className="text-xl text-hill-dark">{T.login || 'Please log in to visit your garden'} 🌱</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 dark:from-hill-dark dark:to-hill-medium py-12 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold text-hill-dark mb-3">
              {T.yourGarden || "Your Living Garden"}
            </h1>
            <p className="text-xl text-earth max-w-md mx-auto">
              {T.gardenDesc || "Breathe with it. Watch it grow with you."}
            </p>
          </div>
          <a
            href="tel:112"
            className="rounded-full border-2 border-red-500 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
          >
            📞 {T.policeEmergency}: {T.policeNumber}
          </a>
        </div>

        <BreathingGarden logs={moodLogs} lang={lang} />

        <div className="text-center mt-10 text-xs text-earth">
          {T.gardenNote || "Tap or click the garden to breathe together • Your mood grows this space"}
        </div>
      </div>
    </div>
  );
}