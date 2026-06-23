'use client';
import { useState, useEffect } from 'react';

interface BreathingGardenProps {
  logs: any[];
  lang: string;
}

const WHISPERS: Record<string, string[]> = {
  en: [
    "You're doing beautifully",
    "One breath at a time",
    "Growth is happening, even when slow",
    "This space is yours",
    "You showed up today. That's enough.",
    "Peace begins with this breath",
    "You are safe here",
    "Let it all go",
  ],
  rw: [
    "Ukora neza",
    "Umwuka umwe",
    "Imikoro irihinduka",
    "Aha ni aho wewe",
    "Wageze uyu munsi. Ni byo bihagaze.",
    "Amani itangira uyu mwuka",
    "Uri mu mutekano hano",
    "Yose ikurire",
  ],
  fr: [
    "Vous faites magnifiquement",
    "Un souffle à la fois",
    "La croissance arrive, même lentement",
    "Cet espace est à vous",
    "Vous êtes là aujourd'hui. C'est suffisant.",
    "La paix commence avec ce souffle",
    "Vous êtes en sécurité ici",
    "Lâchez tout",
  ],
};

const BREATH_TEXT: Record<string, { in: string; out: string; idle: string }> = {
  en: { in: "Breathe in", out: "Breathe out", idle: "Breathe" },
  rw: { in: "Humeka", out: "Tangura", idle: "Humeka" },
  fr: { in: "Respirez", out: "Expirez", idle: "Respirez" },
};

const TAP_TEXT: Record<string, string> = {
  en: "Tap to breathe together",
  rw: "Kanda kuri humeka hamwe",
  fr: "Touchez pour respirer ensemble",
};

export default function BreathingGarden({ logs, lang }: BreathingGardenProps) {
  const [isBreathing, setIsBreathing] = useState(false);
  const [bloomLevel, setBloomLevel] = useState(0);
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);

  const whispers = WHISPERS[lang] || WHISPERS.en;
  const breathText = BREATH_TEXT[lang] || BREATH_TEXT.en;
  const tapText = TAP_TEXT[lang] || TAP_TEXT.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setBloomLevel((prev) => Math.min(Math.max(prev + (isBreathing ? 8 : 1), 0), 100));
    }, 120);
    return () => clearInterval(interval);
  }, [isBreathing]);

  // Alternate breathe in/out phase while breathing is active
  useEffect(() => {
    if (!isBreathing) return;
    const phaseTimer = setInterval(() => {
      setPhase((p) => (p === "in" ? "out" : "in"));
    }, 1400);
    return () => clearInterval(phaseTimer);
  }, [isBreathing]);

  // Create floating particles when breathing
  useEffect(() => {
    if (!isBreathing) {
      setParticles([]);
      return;
    }
    const particleInterval = setInterval(() => {
      if (particles.length < 20) {
        const newParticle = {
          id: Date.now(),
          x: 50 + (Math.random() - 0.5) * 40,
          y: 50 + (Math.random() - 0.5) * 30,
          size: 4 + Math.random() * 8,
          opacity: 0.6 + Math.random() * 0.4,
        };
        setParticles((prev) => [...prev, newParticle]);
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
        }, 3000);
      }
    }, 400);
    return () => clearInterval(particleInterval);
  }, [isBreathing, particles.length]);

  const handleGardenClick = () => {
    setIsBreathing(true);
    setPhase("in");
    setMessage(whispers[Math.floor(Math.random() * whispers.length)]);
    setTimeout(() => {
      setIsBreathing(false);
      setMessage("");
    }, 2800);
  };

  return (
    <div
      onClick={handleGardenClick}
      className="relative mx-auto h-[560px] w-full max-w-2xl cursor-pointer rounded-3xl overflow-hidden select-none shadow-lg"
    >
      {/* Real nature photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop')",
          filter: `brightness(${0.8 + bloomLevel / 500}) saturate(${0.9 + bloomLevel / 400})`,
        }}
      />

      {/* Warm overlay for legibility + mood */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3a3320]/30 to-transparent" />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/40 pointer-events-none animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            filter: 'blur(2px)',
          }}
        />
      ))}

      {/* Soft glow that grows with bloomLevel */}
      <div
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000 ease-in-out pointer-events-none"
        style={{
          width: `${120 + bloomLevel * 1.6}px`,
          height: `${120 + bloomLevel * 1.6}px`,
          background:
            "radial-gradient(circle, rgba(255,244,214,0.55) 0%, rgba(255,244,214,0.15) 55%, transparent 80%)",
          filter: isBreathing ? "blur(2px)" : "blur(6px)",
          transform: isBreathing
            ? phase === "in"
              ? "translate(-50%, -50%) scale(1.15)"
              : "translate(-50%, -50%) scale(0.92)"
            : "translate(-50%, -50%) scale(1)",
        }}
      />

      {/* Breathing ring guide, only visible while active */}
      {isBreathing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full border-2 border-white/50 transition-all ease-in-out"
            style={{
              width: phase === "in" ? "260px" : "180px",
              height: phase === "in" ? "260px" : "180px",
              transitionDuration: "1400ms",
            }}
          />
        </div>
      )}

      {/* Inner breathing ring */}
      {isBreathing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full border border-white/30 transition-all ease-in-out"
            style={{
              width: phase === "in" ? "200px" : "140px",
              height: phase === "in" ? "200px" : "140px",
              transitionDuration: "1400ms",
            }}
          />
        </div>
      )}

      {/* Main word, elegant serif */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <h2
          className="font-serif text-white text-5xl sm:text-6xl tracking-wide drop-shadow-md transition-all duration-700"
          style={{ 
            opacity: isBreathing ? 1 : 0.92,
            transform: isBreathing
              ? phase === "in"
                ? "scale(1.05)"
                : "scale(0.95)"
              : "scale(1)",
          }}
        >
          {isBreathing ? (phase === "in" ? breathText.in : breathText.out) : breathText.idle}
        </h2>

        {message && (
          <p className="mt-6 font-serif text-white/90 text-lg tracking-wide max-w-xs drop-shadow-sm transition-all duration-700 animate-fade-up">
            {message}
          </p>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/70 tracking-wide pointer-events-none font-light">
        {tapText}
      </div>
    </div>
  );
}
