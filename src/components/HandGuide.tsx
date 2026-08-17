'use client';

import React from 'react';
import { FingerId } from '@/types';
import { FINGERS } from '@/lib/keyboard-map';

interface HandGuideProps {
  activeFinger: FingerId;
  theme?: 'dark' | 'light';
}

export const HandGuide: React.FC<HandGuideProps> = ({ activeFinger, theme = 'dark' }) => {
  const activeInfo = FINGERS[activeFinger];
  const isLight = theme === 'light';

  const leftFingers: { id: FingerId; label: string }[] = [
    { id: 'left-pinky', label: 'Pinky' },
    { id: 'left-ring', label: 'Ring' },
    { id: 'left-middle', label: 'Middle' },
    { id: 'left-index', label: 'Index' },
    { id: 'thumb', label: 'Thumb' },
  ];

  const rightFingers: { id: FingerId; label: string }[] = [
    { id: 'thumb', label: 'Thumb' },
    { id: 'right-index', label: 'Index' },
    { id: 'right-middle', label: 'Middle' },
    { id: 'right-ring', label: 'Ring' },
    { id: 'right-pinky', label: 'Pinky' },
  ];

  return (
    <div className={`flex items-center justify-between px-4 sm:px-5 py-2.5 rounded-xl border text-sm transition-colors ${
      isLight
        ? 'bg-slate-100/90 border-slate-200 text-slate-800'
        : 'bg-[#141824]/90 border-neutral-800 text-neutral-200'
    }`}>
      <div className="flex items-center gap-2.5">
        <span
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: activeInfo?.color || '#38bdf8' }}
        />
        <span className={isLight ? 'text-slate-500 font-medium' : 'text-neutral-400 font-medium'}>
          use finger:
        </span>
        <strong className="font-bold text-base" style={{ color: activeInfo?.color || '#38bdf8' }}>
          {activeInfo?.name || 'Thumb'}
        </strong>
      </div>

      <div className="flex items-center gap-6 sm:gap-8 font-mono text-xs">
        {/* Left hand dots */}
        <div className="flex items-center gap-2">
          <span className={`font-sans font-semibold mr-0.5 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>L:</span>
          {leftFingers.map((f, idx) => {
            const isActive = activeFinger === f.id;
            return (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isActive ? 'scale-150 ring-2 ring-white shadow-md' : 'opacity-40 hover:opacity-100'
                }`}
                style={{ backgroundColor: FINGERS[f.id].color }}
                title={`Left ${f.label}`}
              />
            );
          })}
        </div>

        {/* Right hand dots */}
        <div className="flex items-center gap-2">
          <span className={`font-sans font-semibold mr-0.5 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>R:</span>
          {rightFingers.map((f, idx) => {
            const isActive = activeFinger === f.id;
            return (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isActive ? 'scale-150 ring-2 ring-white shadow-md' : 'opacity-40 hover:opacity-100'
                }`}
                style={{ backgroundColor: FINGERS[f.id].color }}
                title={`Right ${f.label}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
