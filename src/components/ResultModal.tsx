'use client';

import React from 'react';
import { TypingResult, LessonStats } from '@/types';
import { RotateCcw, ArrowRight } from 'lucide-react';

interface ResultModalProps {
  result: TypingResult;
  lessonStats?: LessonStats;
  theme?: 'dark' | 'light';
  onRetry: () => void;
  onSelectOther: () => void;
  onViewAllStats: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  lessonStats,
  theme = 'dark',
  onRetry,
  onSelectOther,
  onViewAllStats,
}) => {
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`relative w-full max-w-md rounded-2xl border p-7 flex flex-col gap-6 text-center shadow-2xl transition-colors ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900'
          : 'bg-[#121620] border-neutral-800 text-neutral-100'
      }`}>
        <div>
          <div className={`text-xs font-mono mb-1 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
            session completed ({result.durationSeconds}s)
          </div>
          <h2 className="text-2xl font-bold">
            {result.lessonName}
          </h2>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className={`p-4 rounded-xl border flex flex-col items-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
          }`}>
            <span className={`text-xs font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>wpm</span>
            <div className="text-5xl font-extrabold font-mono text-sky-500 mt-1">
              {result.wpm}
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col items-center ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
          }`}>
            <span className={`text-xs font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>accuracy</span>
            <div className="text-5xl font-extrabold font-mono text-emerald-500 mt-1">
              {result.accuracy}%
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className={`grid grid-cols-3 gap-2.5 p-3.5 rounded-xl border font-mono text-sm ${
          isLight ? 'bg-slate-100/70 border-slate-200 text-slate-700' : 'bg-neutral-950 border-neutral-800/80 text-neutral-300'
        }`}>
          <div>
            <span className={`text-xs block ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>rpm</span>
            <strong className="text-base font-bold">{result.rpm}</strong>
          </div>
          <div>
            <span className={`text-xs block ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>errors</span>
            <strong className={`text-base font-bold ${result.errors > 0 ? 'text-rose-500' : isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
              {result.errors}
            </strong>
          </div>
          <div>
            <span className={`text-xs block ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>chars</span>
            <strong className="text-base font-bold">{result.totalCharsTyped}</strong>
          </div>
        </div>

        {lessonStats && (
          <div className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
            lesson total: {lessonStats.attemptsCount}x (avg: {lessonStats.avgWpm} wpm)
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          <button
            onClick={onRetry}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-sm font-bold shadow-sm transition-colors ${
              isLight
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-white hover:bg-neutral-200 text-slate-950'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>retry</span>
          </button>

          <button
            onClick={onSelectOther}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
          >
            <span>lessons</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewAllStats}
            className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                : 'text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            scores
          </button>
        </div>
      </div>
    </div>
  );
};
