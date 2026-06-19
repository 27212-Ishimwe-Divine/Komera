'use client';

import { useAuth } from '@/context/AuthContext';
import MoodGarden from '@/components/garden/MoodGarden';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function GardenPage() {
  const { user, lang } = useAuth();
  const [moodLogs, setMoodLogs] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      api.get('/mood')
        .then(res => setMoodLogs(res.data))
        .catch(err => console.error("Failed to load moods", err));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl">Please log in to view your garden 🌱</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-hill-dark dark:to-hill-medium py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-hill-dark mb-4">
          {lang === 'rw' ? "Ubusitani Bwawe" : "Your Inner Garden"}
        </h1>
        <p className="text-center text-muted-foreground mb-10 text-lg">
          {lang === 'rw' ? "Ibimera by'ubuzima bwawe bikura buri munsi" : "Watch your well-being grow day by day"}
        </p>

        <MoodGarden 
          logs={moodLogs} 
          lang={lang} 
          compact={false} 
        />
      </div>
    </div>
  );
}