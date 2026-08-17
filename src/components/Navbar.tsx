'use client';

import React from 'react';
import { Volume2, VolumeX, Keyboard, Sun, Moon } from 'lucide-react';
import { GlobalStats } from '@/types';

interface NavbarProps {
  currentView: 'lessons' | 'typing' | 'stats';
  onViewChange: (view: 'lessons' | 'stats') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  globalStats: GlobalStats;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
  globalStats,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 dark:border-neutral-800 bg-[#0f1117]/95 dark:bg-[#0f1117]/95 light:bg-white/95 light:border-slate-200 backdrop-blur-md transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onViewChange('lessons')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ketikan logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white dark:text-white light:text-slate-900">
            ketikan
          </span>
        </div>

        {/* Scoring Placed in Navbar - Larger Text */}
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-mono">
          <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-400 light:text-slate-500">
            <span>avg:</span>
            <strong className="text-sky-400 font-bold text-base">{globalStats.overallAvgWpm} wpm</strong>
          </div>
          <div className="w-[1px] h-4 bg-neutral-800 dark:bg-neutral-800 light:bg-slate-300" />
          <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-400 light:text-slate-500">
            <span>best:</span>
            <strong className="text-amber-400 font-bold text-base">{globalStats.bestWpm} wpm</strong>
          </div>
          <div className="w-[1px] h-4 bg-neutral-800 dark:bg-neutral-800 light:bg-slate-300 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 text-neutral-400 dark:text-neutral-400 light:text-slate-500">
            <span>sessions:</span>
            <strong className="text-white dark:text-white light:text-slate-900 font-bold text-base">{globalStats.totalSessions}</strong>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => onViewChange('lessons')}
            className={`px-3.5 py-1.5 rounded-lg text-sm transition-colors ${
              currentView === 'lessons'
                ? 'text-white dark:text-white light:text-slate-900 bg-neutral-800 dark:bg-neutral-800 light:bg-slate-200 font-semibold'
                : 'text-neutral-400 hover:text-white dark:text-neutral-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            lessons
          </button>
          <button
            onClick={() => onViewChange('stats')}
            className={`px-3.5 py-1.5 rounded-lg text-sm transition-colors ${
              currentView === 'stats'
                ? 'text-white dark:text-white light:text-slate-900 bg-neutral-800 dark:bg-neutral-800 light:bg-slate-200 font-semibold'
                : 'text-neutral-400 hover:text-white dark:text-neutral-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            scores
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="p-2 rounded-lg text-neutral-400 hover:text-white dark:text-neutral-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 hover:bg-neutral-800 dark:hover:bg-neutral-800 light:hover:bg-slate-200 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-2 rounded-lg text-neutral-400 hover:text-white dark:text-neutral-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 hover:bg-neutral-800 dark:hover:bg-neutral-800 light:hover:bg-slate-200 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
