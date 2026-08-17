'use client';

import React from 'react';
import { KEYBOARD_LAYOUT, FINGERS, getKeyCodeForChar } from '@/lib/keyboard-map';
import { FingerId } from '@/types';

interface VirtualKeyboardProps {
  targetChar: string;
  pressedKeys: Set<string>;
  showColorHints?: boolean;
  theme?: 'dark' | 'light';
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  targetChar,
  pressedKeys,
  showColorHints = true,
  theme = 'dark',
}) => {
  const targetKeyCode = getKeyCodeForChar(targetChar);

  const isTargetShiftRequired =
    /[A-Z~!@#$%^&*()_+{}|:"<>?]/.test(targetChar);

  const isLight = theme === 'light';

  return (
    <div className={`w-full max-w-4xl mx-auto p-3 sm:p-3.5 rounded-xl border transition-colors ${
      isLight
        ? 'bg-slate-100/90 border-slate-200 shadow-md'
        : 'bg-[#141824]/90 border-neutral-800 shadow-md'
    }`}>
      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5">
        {KEYBOARD_LAYOUT.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 sm:gap-1.5 justify-center">
            {row.map((keyDef) => {
              const finger = FINGERS[keyDef.finger];
              const isTarget =
                keyDef.code === targetKeyCode ||
                (isTargetShiftRequired &&
                  (keyDef.code === 'ShiftLeft' || keyDef.code === 'ShiftRight') &&
                  keyDef.finger === (keyDef.code === 'ShiftLeft' ? 'left-pinky' : 'right-pinky'));

              const isPressed = pressedKeys.has(keyDef.code);
              const widthClass = keyDef.width || 'w-8 sm:w-10 md:w-11 flex-1';
              const fingerColor = finger.color;

              return (
                <div
                  key={keyDef.code}
                  className={`relative flex flex-col items-center justify-center h-9 sm:h-10 md:h-11 rounded-lg text-xs font-mono font-bold transition-all duration-75 select-none ${widthClass} ${
                    isPressed
                      ? isLight
                        ? 'bg-slate-300 text-slate-900 translate-y-0.5 shadow-inner'
                        : 'bg-neutral-700 text-white translate-y-0.5 shadow-inner'
                      : isTarget
                      ? isLight
                        ? 'bg-sky-100 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-neutral-800 text-white font-extrabold shadow-sm'
                      : isLight
                      ? 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-sm'
                      : 'bg-[#1a202c] text-neutral-300 hover:bg-neutral-800 border-neutral-700/80'
                  }`}
                  style={{
                    borderColor: isTarget
                      ? fingerColor
                      : isLight
                      ? '#cbd5e1'
                      : '#2d3748',
                    borderWidth: isTarget ? '2px' : '1px',
                    boxShadow: isTarget
                      ? `0 0 10px ${fingerColor}70`
                      : 'none',
                  }}
                >
                  {/* Subtle Finger Color Indicator Bar */}
                  {showColorHints && (
                    <div
                      className="absolute bottom-0.5 w-3 h-0.5 rounded-full opacity-80"
                      style={{ backgroundColor: fingerColor }}
                    />
                  )}

                  {/* Shift label */}
                  {keyDef.shiftLabel && (
                    <span className={`text-[9px] leading-none mb-0.5 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                      {keyDef.shiftLabel}
                    </span>
                  )}

                  {/* Main label */}
                  <span className={`leading-none uppercase ${keyDef.isSpecial ? 'text-[10px] sm:text-[11px] font-sans font-semibold' : 'text-xs sm:text-sm font-bold'}`}>
                    {keyDef.label}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Clean Legend */}
      {showColorHints && (
        <div className={`mt-2.5 pt-2 border-t flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-medium ${
          isLight ? 'border-slate-200 text-slate-600' : 'border-neutral-800 text-neutral-400'
        }`}>
          <span className={isLight ? 'text-slate-500 font-semibold' : 'text-neutral-500 font-semibold'}>finger guide:</span>
          {(Object.keys(FINGERS) as FingerId[]).map((fId) => {
            const f = FINGERS[fId];
            return (
              <div key={fId} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: f.color }}
                />
                <span className="text-[10px] sm:text-[11px]">{f.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
