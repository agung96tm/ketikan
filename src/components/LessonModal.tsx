'use client';

import React, { useState } from 'react';
import { Lesson, LessonStats } from '@/types';
import { X, Play } from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson | null;
  stats?: LessonStats;
  theme?: 'dark' | 'light';
  onClose: () => void;
  onStart: (lesson: Lesson, durationMinutes: number) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  stats,
  theme = 'dark',
  onClose,
  onStart,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(3);
  const isLight = theme === 'light';

  if (!lesson) return null;

  const attempts = stats?.attemptsCount || 0;
  const bestWpm = stats?.bestWpm || 0;
  const avgWpm = stats?.avgWpm || 0;
  const lastWpm = stats?.lastWpm || 0;

  const durations = [
    { label: '1 min', value: 1 },
    { label: '2 min', value: 2 },
    { label: '3 min (default)', value: 3 },
    { label: '5 min', value: 5 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className={`relative w-full max-w-lg rounded-2xl border p-6 sm:p-7 flex flex-col gap-6 shadow-2xl transition-colors ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900'
          : 'bg-[#121620] border-neutral-800 text-neutral-100'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${
            isLight
              ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className={`text-xs font-mono mb-1 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
            {lesson.folderName}/{lesson.fileName}
          </div>
          <h2 className="text-2xl font-bold">
            {lesson.name}
          </h2>
        </div>

        {/* Previous stats for this lesson */}
        <div className={`p-4 rounded-xl border font-mono text-sm ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-700'
            : 'bg-neutral-900/80 border-neutral-800 text-neutral-300'
        }`}>
          <div className="flex items-center justify-between mb-3 text-xs font-semibold">
            <span className={isLight ? 'text-slate-500' : 'text-neutral-400'}>lesson stats</span>
            <span>practiced: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{attempts}x</strong></span>
          </div>

          {attempts > 0 ? (
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className={`p-3 rounded-lg border text-center ${
                isLight ? 'bg-white border-slate-200' : 'bg-neutral-950 border-neutral-800'
              }`}>
                <span className={`text-xs block mb-0.5 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>best</span>
                <strong className="text-lg font-bold text-amber-500">{bestWpm} wpm</strong>
              </div>
              <div className={`p-3 rounded-lg border text-center ${
                isLight ? 'bg-white border-slate-200' : 'bg-neutral-950 border-neutral-800'
              }`}>
                <span className={`text-xs block mb-0.5 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>avg</span>
                <strong className="text-lg font-bold text-sky-500">{avgWpm} wpm</strong>
              </div>
              <div className={`p-3 rounded-lg border text-center ${
                isLight ? 'bg-white border-slate-200' : 'bg-neutral-950 border-neutral-800'
              }`}>
                <span className={`text-xs block mb-0.5 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>last</span>
                <strong className="text-lg font-bold">{lastWpm} wpm</strong>
              </div>
            </div>
          ) : (
            <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              No previous attempts for this lesson yet.
            </p>
          )}
        </div>

        {/* Text Preview */}
        <div>
          <span className={`text-sm font-semibold block mb-2 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
            text preview ({lesson.lines.length} lines):
          </span>
          <div className={`font-mono text-sm p-3 rounded-xl border max-h-24 overflow-y-auto leading-relaxed ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-700'
              : 'bg-neutral-950 border-neutral-800 text-neutral-300'
          }`}>
            {lesson.lines.map((line, idx) => (
              <div key={idx} className="truncate">
                <span className={isLight ? 'text-slate-400 mr-2' : 'text-neutral-600 mr-2'}>{idx + 1}.</span>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Duration selector */}
        <div>
          <label className={`text-sm font-semibold block mb-2 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
            duration:
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {durations.map((d) => {
              const isSelected = selectedDuration === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setSelectedDuration(d.value)}
                  className={`py-2.5 px-2 rounded-xl text-sm font-mono font-semibold transition-all ${
                    isSelected
                      ? isLight
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white text-slate-950 shadow-md'
                      : isLight
                      ? 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isLight
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            cancel
          </button>
          <button
            type="button"
            onClick={() => onStart(lesson, selectedDuration)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-colors ${
              isLight
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-white hover:bg-neutral-200 text-slate-950'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>start typing ({selectedDuration}m)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
