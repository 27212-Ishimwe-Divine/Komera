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

  // Calculate angle for each mood
  const angleStep = 360 / moods.length;

  // Keyboard navigation (left/right arrows)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!moods.length) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = selected === null ? moods[0].value :
          moods[(moods.findIndex(m => m.value === selected) + 1) % moods.length].value;
        onSelect(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = selected === null ? moods.length - 1 :
          (moods.findIndex(m => m.value === selected) - 1 + moods.length) % moods.length;
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
      style={{
        width: '260px',
        height: '260px',
        '--glow-color': 'rgba(255, 215, 0, 0.8)', // gold glow
      } as React.CSSProperties}
    >
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-100 via-white to-yellow-200 opacity-30" />
      {moods.map((m, idx) => {
        const rotate = angleStep * idx;
        const isSelected = selected === m.value;
        return (
          <button
            key={m.value}
            type="button"
            aria-label={`${m.labelKey} mood`}
            onClick={() => onSelect(m.value)}
            className={`absolute left-1/2 top-1/2 w-14 h-14 flex flex-col items-center justify-center rounded-full transition transform hover:scale-110 focus:outline-none ${isSelected ? `${m.color} ring-2 ring-offset-2 ring-${m.color.split(' ')[0]}` : 'border border-gray-200 hover:border-gray-300'}`}
            style={{
              transform: `rotate(${rotate}deg) translate(110px) rotate(-${rotate}deg)`,
              boxShadow: isSelected ? '0 0 12px 4px var(--glow-color)' : 'none',
            } as React.CSSProperties}
          >
            <span className="text-2xl" aria-hidden="true">{m.emoji}</span>
            <span className="text-xs mt-1 text-gray-600" aria-hidden="true">{m.labelKey}</span>
          </button>
        );
      })}
    </div>
  );
}
