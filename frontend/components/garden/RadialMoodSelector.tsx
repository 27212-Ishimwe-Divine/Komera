import React, { useEffect, useRef } from 'react';

interface Mood {
  value: number;
  emoji: string;
  labelKey: string;
  color: string;
}

interface RadialMoodSelectorProps {
  moods: Mood[];
  selected: number | null;
  onSelect: (value: number) => void;
}

export default function RadialMoodSelector({ moods, selected, onSelect }: RadialMoodSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const angleStep = 360 / moods.length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!moods.length) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next =
          selected === null
            ? moods[0].value
            : moods[(moods.findIndex((m) => m.value === selected) + 1) % moods.length].value;
        onSelect(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx =
          selected === null
            ? moods.length - 1
            : (moods.findIndex((m) => m.value === selected) - 1 + moods.length) % moods.length;
        onSelect(moods[prevIdx].value);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, moods, onSelect]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto my-6"
      style={{ width: '240px', height: '240px' } as React.CSSProperties}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sunrise-soft via-card to-lake-soft opacity-60" />
      {moods.map((m, idx) => {
        const rotate = angleStep * idx;
        const isSelected = selected === m.value;
        return (
          <button
            key={m.value}
            type="button"
            aria-label={`${m.labelKey} mood`}
            aria-pressed={isSelected}
            onClick={() => onSelect(m.value)}
            className={`absolute left-1/2 top-1/2 flex h-14 w-14 flex-col items-center justify-center rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-lake ${
              isSelected ? `${m.color} ring-2 ring-offset-2 scale-110` : 'border border-[#E8DFD4] bg-card'
            }`}
            style={{
              transform: `rotate(${rotate}deg) translate(100px) rotate(-${rotate}deg)`,
            }}
          >
            <span className="text-2xl" aria-hidden>
              {m.emoji}
            </span>
            <span className="mt-0.5 max-w-[3rem] truncate text-[9px] font-medium text-earth" aria-hidden>
              {m.labelKey}
            </span>
          </button>
        );
      })}
    </div>
  );
}
