import { Lang } from './translations';

export const MOOD_GARDEN = [
  { value: 1, emoji: '🌧️', plant: '🥀', label: { en: 'Heavy rain', rw: 'Imvura iremereye', fr: 'Pluie lourde' }, color: 'bg-red-100 ring-red-400' },
  { value: 2, emoji: '🌫️', plant: '🍂', label: { en: 'Cloudy', rw: 'Ibicu', fr: 'Nuageux' }, color: 'bg-orange-100 ring-orange-400' },
  { value: 3, emoji: '🌤️', plant: '🌿', label: { en: 'Partly sunny', rw: 'Izuba rito', fr: 'Partiellement ensoleillé' }, color: 'bg-yellow-100 ring-yellow-400' },
  { value: 4, emoji: '☀️', plant: '🌸', label: { en: 'Growing', rw: 'Irakura', fr: 'En croissance' }, color: 'bg-lime-100 ring-lime-500' },
  { value: 5, emoji: '🌈', plant: '🌻', label: { en: 'In bloom', rw: 'Irabyimbye', fr: 'En fleur' }, color: 'bg-green-100 ring-green-500' },
] as const;

export const PROVERBS: Record<Lang, { text: string; meaning: string }[]> = {
  en: [
    { text: 'Umuti urahenda, ariko ubuzima ni agaciro.', meaning: 'Healing takes time, but life is precious.' },
    { text: 'Umuntu ni we muntu ku bw\'abandi.', meaning: 'A person is a person through other people.' },
    { text: 'Komera — you are still here, and that matters.', meaning: 'Strength is showing up, even on hard days.' },
    { text: 'Amahoro atangira mu mutima.', meaning: 'Peace begins in the heart.' },
  ],
  rw: [
    { text: 'Umuti urahenda, ariko ubuzima ni agaciro.', meaning: 'Ubuvuzi bufata igihe, ariko ubuzima bufite agaciro.' },
    { text: 'Umuntu ni we muntu ku bw\'abandi.', meaning: 'Umuntu aba umuntu binyuze mu bandi.' },
    { text: 'Komera — uracyari hano, kandi ibyo bifite agaciro.', meaning: 'Gukomera ni kuguma, n\'iminsi ikomeye.' },
    { text: 'Amahoro atangira mu mutima.', meaning: 'Amahoro atangirira mu mutima wawe.' },
  ],
  fr: [
    { text: 'Umuti urahenda, ariko ubuzima ni agaciro.', meaning: 'La guérison prend du temps, mais la vie est précieuse.' },
    { text: 'Umuntu ni we muntu ku bw\'abandi.', meaning: 'On devient humain grâce aux autres.' },
    { text: 'Komera — vous êtes encore là, et cela compte.', meaning: 'Tenir bon, c\'est revenir, même les jours difficiles.' },
    { text: 'Amahoro atangira mu mutima.', meaning: 'La paix commence dans le cœur.' },
  ],
};

export const DAILY_STEPS: Record<Lang, { title: string; href: string; emoji: string }[]> = {
  en: [
    { title: 'Notice one feeling', href: '/mood', emoji: '🌱' },
    { title: 'Take a slow breath', href: '/breathe', emoji: '🌬️' },
    { title: 'Talk to Ndwira', href: '/chat', emoji: '💬' },
  ],
  rw: [
    { title: 'Menya kimwe mu byiyumvo', href: '/mood', emoji: '🌱' },
    { title: 'Fata umwuka utuje', href: '/breathe', emoji: '🌬️' },
    { title: 'Vugana na Ndwira', href: '/chat', emoji: '💬' },
  ],
  fr: [
    { title: 'Remarquer un sentiment', href: '/mood', emoji: '🌱' },
    { title: 'Prendre une respiration lente', href: '/breathe', emoji: '🌬️' },
    { title: 'Parler à Ndwira', href: '/chat', emoji: '💬' },
  ],
};

export function getDailyProverb(lang: Lang) {
  const day = new Date().getDate();
  const list = PROVERBS[lang];
  return list[day % list.length];
}

export function getGardenStage(logs: { mood: number }[]): number {
  if (!logs.length) return 0;
  const recent = logs.slice(0, 7);
  const avg = recent.reduce((s, l) => s + l.mood, 0) / recent.length;
  if (avg >= 4.5) return 5;
  if (avg >= 3.5) return 4;
  if (avg >= 2.5) return 3;
  if (avg >= 1.5) return 2;
  return 1;
}

export const GARDEN_PLANTS = ['', '🌱', '🍃', '🌿', '🌸', '🌻'];
