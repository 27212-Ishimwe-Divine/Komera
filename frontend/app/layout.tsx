import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import BottomNav from './components/BottomNav';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = { title: 'Komera', description: 'Your mental health companion' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-slate-900`}>
        <Toaster position="top-right" />
        <BottomNav />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}
