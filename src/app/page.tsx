'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lesson, TypingResult, LessonStats, GlobalStats } from '@/types';
import {
  saveTypingSession,
  getAllLessonsStats,
  getGlobalSummary,
  clearAllHistory,
} from '@/lib/storage';
import { Navbar } from '@/components/Navbar';
import { LessonCard } from '@/components/LessonCard';
import { LessonModal } from '@/components/LessonModal';
import { TypingArea } from '@/components/TypingArea';
import { ResultModal } from '@/components/ResultModal';
import { StatsOverview } from '@/components/StatsOverview';
import { Search } from 'lucide-react';

export default function Home() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lessonStatsMap, setLessonStatsMap] = useState<Record<string, LessonStats>>({});
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalSessions: 0,
    totalDurationSeconds: 0,
    overallAvgWpm: 0,
    overallAvgRpm: 0,
    overallAvgAccuracy: 0,
    bestWpm: 0,
    bestRpm: 0,
    lessonsPracticedCount: 0,
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentView, setCurrentView] = useState<'lessons' | 'typing' | 'stats'>('lessons');
  const [selectedLessonForModal, setSelectedLessonForModal] = useState<Lesson | null>(null);
  const [activeSessionLesson, setActiveSessionLesson] = useState<Lesson | null>(null);
  const [activeDurationMinutes, setActiveDurationMinutes] = useState<number>(3);
  const [lastResult, setLastResult] = useState<TypingResult | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load and apply theme
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('ketikan_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(savedTheme);
      } else {
        document.documentElement.classList.add('dark');
      }
    } catch {
      // fallback
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('ketikan_theme', nextTheme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(nextTheme);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLessons = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/lessons');
      const data = await res.json();
      if (data.lessons && Array.isArray(data.lessons)) {
        setLessons(data.lessons);
      }
    } catch (err) {
      console.error('Error fetching lessons:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshStats = useCallback(() => {
    if (lessons.length > 0) {
      const stats = getAllLessonsStats(lessons);
      setLessonStatsMap(stats);
      const summary = getGlobalSummary();
      setGlobalStats(summary);
    }
  }, [lessons]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  useEffect(() => {
    refreshStats();
  }, [lessons, refreshStats]);

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleOpenLessonModal = (lesson: Lesson) => {
    setSelectedLessonForModal(lesson);
  };

  const handleStartSession = (lesson: Lesson, durationMinutes: number) => {
    setSelectedLessonForModal(null);
    setActiveSessionLesson(lesson);
    setActiveDurationMinutes(durationMinutes);
    setCurrentView('typing');
  };

  const handleFinishSession = (result: Omit<TypingResult, 'id' | 'completedAt'>) => {
    const saved = saveTypingSession(result);
    setLastResult(saved);
    refreshStats();
  };

  const handleRetrySession = () => {
    const lesson = activeSessionLesson;
    setLastResult(null);
    if (lesson) {
      setCurrentView('typing');
    }
  };

  const handleCancelTyping = () => {
    setActiveSessionLesson(null);
    setCurrentView('lessons');
  };

  const filteredLessons = lessons.filter((l) => {
    return (
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.folderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const isLight = theme === 'light';

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0f1117] text-neutral-200'
    }`}>
      {/* Navbar with Scoring and Theme Toggle */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setLastResult(null);
          setCurrentView(view);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        globalStats={globalStats}
      />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* VIEW 1: TYPING ARENA */}
        {currentView === 'typing' && activeSessionLesson && (
          <TypingArea
            lesson={activeSessionLesson}
            durationMinutes={activeDurationMinutes}
            soundEnabled={soundEnabled}
            theme={theme}
            onFinish={handleFinishSession}
            onCancel={handleCancelTyping}
          />
        )}

        {/* VIEW 2: STATS */}
        {currentView === 'stats' && (
          <StatsOverview
            lessons={lessons}
            lessonStatsMap={lessonStatsMap}
            globalStats={globalStats}
            theme={theme}
            onSelectLesson={(lesson) => {
              setCurrentView('lessons');
              handleOpenLessonModal(lesson);
            }}
            onClearHistory={() => {
              clearAllHistory();
              refreshStats();
            }}
            onBackToLessons={() => setCurrentView('lessons')}
          />
        )}

        {/* VIEW 3: LESSONS GRID */}
        {currentView === 'lessons' && (
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="flex items-center justify-between gap-4">
              <span className={`text-sm font-mono font-medium ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                {filteredLessons.length} lessons available
              </span>

              <div className="relative w-full max-w-xs">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search lessons..."
                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm transition-colors focus:outline-none ${
                    isLight
                      ? 'bg-white border border-slate-200 focus:border-slate-400 text-slate-800 placeholder-slate-400 shadow-sm'
                      : 'bg-neutral-900 border border-neutral-800 focus:border-neutral-700 text-neutral-200 placeholder-neutral-500'
                  }`}
                />
              </div>
            </div>

            {/* Lessons Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className={`h-44 rounded-2xl animate-pulse ${
                      isLight ? 'bg-slate-200/60 border border-slate-200' : 'bg-neutral-900/30 border border-neutral-800/80'
                    }`}
                  />
                ))}
              </div>
            ) : filteredLessons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    stats={lessonStatsMap[lesson.id]}
                    theme={theme}
                    onSelect={handleOpenLessonModal}
                  />
                ))}
              </div>
            ) : (
              <div className={`p-10 text-center rounded-2xl border text-sm font-mono ${
                isLight ? 'border-slate-200 text-slate-400 bg-white' : 'border-neutral-800 text-neutral-500'
              }`}>
                No lessons found matching &quot;{searchQuery}&quot;.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pre-session Settings Modal */}
      {selectedLessonForModal && (
        <LessonModal
          lesson={selectedLessonForModal}
          stats={lessonStatsMap[selectedLessonForModal.id]}
          theme={theme}
          onClose={() => setSelectedLessonForModal(null)}
          onStart={handleStartSession}
        />
      )}

      {/* Result Modal */}
      {lastResult && (
        <ResultModal
          result={lastResult}
          lessonStats={lessonStatsMap[lastResult.lessonId]}
          theme={theme}
          onRetry={handleRetrySession}
          onSelectOther={() => {
            setLastResult(null);
            setCurrentView('lessons');
          }}
          onViewAllStats={() => {
            setLastResult(null);
            setCurrentView('stats');
          }}
        />
      )}
    </main>
  );
}
