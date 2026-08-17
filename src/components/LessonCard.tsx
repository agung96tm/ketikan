'use client';

import React from 'react';
import { Lesson, LessonStats } from '@/types';
import { Play } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  stats?: LessonStats;
  theme?: 'dark' | 'light';
  onSelect: (lesson: Lesson) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  stats,
  theme = 'dark',
  onSelect,
}) => {
  const attempts = stats?.attemptsCount || 0;
  const bestWpm = stats?.bestWpm || 0;
  const avgWpm = stats?.avgWpm || 0;
  const isLight = theme === 'light';

  return (
    <div
      onClick={() => onSelect(lesson)}
      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
        isLight
          ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg shadow-sm'
          : 'bg-[#141824]/90 border-neutral-800 hover:border-neutral-700 hover:bg-[#181e2e]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {lesson.name}
          </h3>
          <span className={`text-xs font-mono ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
            {lesson.folderName}
          </span>
        </div>

        <p className={`font-mono text-sm line-clamp-2 p-3 rounded-xl border mb-4 leading-relaxed ${
          isLight
            ? 'bg-slate-50 text-slate-600 border-slate-200'
            : 'bg-[#0f1117] text-neutral-400 border-neutral-800'
        }`}>
          {lesson.preview}
        </p>
      </div>

      <div className={`flex items-center justify-between pt-3 border-t text-sm ${
        isLight ? 'border-slate-100' : 'border-neutral-800/80'
      }`}>
        <div className="flex items-center gap-3 font-mono text-xs">
          {attempts > 0 ? (
            <>
              <span className={isLight ? 'text-slate-600' : 'text-neutral-400'}>
                best: <strong className="text-amber-500 font-bold text-sm">{bestWpm}</strong>
              </span>
              <span className={isLight ? 'text-slate-600' : 'text-neutral-400'}>
                avg: <strong className="text-sky-500 font-bold text-sm">{avgWpm}</strong>
              </span>
              <span className={isLight ? 'text-slate-400' : 'text-neutral-500'}>({attempts}x)</span>
            </>
          ) : (
            <span className={isLight ? 'text-slate-400' : 'text-neutral-500'}>not practiced yet</span>
          )}
        </div>

        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
            isLight
              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
              : 'bg-white text-slate-950 hover:bg-neutral-200 shadow-sm'
          }`}
        >
          <Play className="w-3 h-3 fill-current" />
          <span>start</span>
        </button>
      </div>
    </div>
  );
};
