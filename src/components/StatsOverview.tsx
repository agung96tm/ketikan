'use client';

import React from 'react';
import { Lesson, LessonStats, GlobalStats } from '@/types';
import { Trash2, ArrowLeft, Play } from 'lucide-react';

interface StatsOverviewProps {
  lessons: Lesson[];
  lessonStatsMap: Record<string, LessonStats>;
  globalStats: GlobalStats;
  theme?: 'dark' | 'light';
  onSelectLesson: (lesson: Lesson) => void;
  onClearHistory: () => void;
  onBackToLessons: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  lessons,
  lessonStatsMap,
  globalStats,
  theme = 'dark',
  onSelectLesson,
  onClearHistory,
  onBackToLessons,
}) => {
  const isLight = theme === 'light';

  const handleConfirmClear = () => {
    if (window.confirm('Clear all typing history and stats?')) {
      onClearHistory();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLessons}
            className={`p-2 rounded-xl transition-colors ${
              isLight
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Scores & Progress
            </h1>
            <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              Overview of all your practice sessions by lesson.
            </p>
          </div>
        </div>

        {globalStats.totalSessions > 0 && (
          <button
            onClick={handleConfirmClear}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>reset history</span>
          </button>
        )}
      </div>

      {/* Clean Table */}
      <div className={`rounded-2xl border overflow-hidden font-mono text-sm transition-colors ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-[#141824] border-neutral-800'
      }`}>
        <table className="w-full text-left">
          <thead className={`border-b text-xs uppercase font-sans font-bold ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-500'
              : 'bg-[#0f1117] border-neutral-800 text-neutral-400'
          }`}>
            <tr>
              <th className="py-3.5 px-5">lesson</th>
              <th className="py-3.5 px-4 text-center">attempts</th>
              <th className="py-3.5 px-4 text-center">avg wpm</th>
              <th className="py-3.5 px-4 text-center">best wpm</th>
              <th className="py-3.5 px-4 text-center">accuracy</th>
              <th className="py-3.5 px-5 text-right font-sans">action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-neutral-800/80'}`}>
            {lessons.map((lesson) => {
              const stats = lessonStatsMap[lesson.id];
              const attempts = stats?.attemptsCount || 0;
              const bestWpm = stats?.bestWpm || 0;
              const avgWpm = stats?.avgWpm || 0;
              const avgAccuracy = stats?.avgAccuracy || 0;

              return (
                <tr key={lesson.id} className={`transition-colors ${
                  isLight ? 'hover:bg-slate-50/80' : 'hover:bg-neutral-800/30'
                }`}>
                  <td className="py-4 px-5 font-sans">
                    <div className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {lesson.name}
                    </div>
                    <div className={`text-xs font-mono ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                      {lesson.folderName}
                    </div>
                  </td>
                  <td className={`py-4 px-4 text-center font-semibold ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
                    {attempts > 0 ? `${attempts}x` : '-'}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {attempts > 0 ? (
                      <span className="text-sky-500 font-bold text-base">{avgWpm}</span>
                    ) : (
                      <span className={isLight ? 'text-slate-300' : 'text-neutral-600'}>-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {bestWpm > 0 ? (
                      <span className="text-amber-500 font-bold text-base">{bestWpm}</span>
                    ) : (
                      <span className={isLight ? 'text-slate-300' : 'text-neutral-600'}>-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {attempts > 0 ? (
                      <span className="text-emerald-500 font-semibold">{avgAccuracy}%</span>
                    ) : (
                      <span className={isLight ? 'text-slate-300' : 'text-neutral-600'}>-</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right font-sans">
                    <button
                      onClick={() => onSelectLesson(lesson)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>practice</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
