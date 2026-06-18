import type { Metadata } from 'next';
import { Nunito, Source_Serif_4 } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AppProviders from '@/components/layout/AppProviders';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Komera — Your Inner Garden',
  description: 'A warm mental health companion for Rwanda. Komera. Ndwira. Amahoro.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <body className={`${nunito.variable} ${sourceSerif.variable} font-sans antialiased`}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#2C3E50',
              borderRadius: '1rem',
              border: '1px solid #E8DFD4',
            },
          }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
