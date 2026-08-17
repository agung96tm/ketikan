import { LessonStats, GlobalStats, TypingResult } from '@/types';

const STORAGE_KEY_HISTORY = 'ketikan_history_v1';

export function getStoredHistory(): TypingResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading localStorage', e);
    return [];
  }
}

export function saveTypingSession(result: Omit<TypingResult, 'id' | 'completedAt'>): TypingResult {
  if (typeof window === 'undefined') {
    return {
      ...result,
      id: `res-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
  }

  const newResult: TypingResult = {
    ...result,
    id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    completedAt: new Date().toISOString(),
  };

  try {
    const history = getStoredHistory();
    history.unshift(newResult);
    // Keep last 500 records
    const trimmed = history.slice(0, 500);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }

  return newResult;
}

export function getStatsForLesson(lessonId: string, lessonName: string): LessonStats {
  const history = getStoredHistory().filter((item) => item.lessonId === lessonId);

  if (history.length === 0) {
    return {
      lessonId,
      lessonName,
      attemptsCount: 0,
      bestWpm: 0,
      bestRpm: 0,
      avgWpm: 0,
      avgRpm: 0,
      avgAccuracy: 0,
      lastAttemptDate: '',
      lastWpm: 0,
      history: [],
    };
  }

  const attemptsCount = history.length;
  const bestWpm = Math.max(...history.map((h) => h.wpm || 0));
  const bestRpm = Math.max(...history.map((h) => h.rpm || 0));
  const totalWpm = history.reduce((acc, h) => acc + (h.wpm || 0), 0);
  const totalRpm = history.reduce((acc, h) => acc + (h.rpm || 0), 0);
  const totalAccuracy = history.reduce((acc, h) => acc + (h.accuracy || 0), 0);
  const avgWpm = Math.round(totalWpm / attemptsCount);
  const avgRpm = Math.round(totalRpm / attemptsCount);
  const avgAccuracy = Math.round((totalAccuracy / attemptsCount) * 10) / 10;
  const lastAttemptDate = history[0]?.completedAt || '';
  const lastWpm = history[0]?.wpm || 0;

  return {
    lessonId,
    lessonName,
    attemptsCount,
    bestWpm,
    bestRpm,
    avgWpm,
    avgRpm,
    avgAccuracy,
    lastAttemptDate,
    lastWpm,
    history,
  };
}

export function getAllLessonsStats(lessons: { id: string; name: string }[]): Record<string, LessonStats> {
  const statsMap: Record<string, LessonStats> = {};
  lessons.forEach((l) => {
    statsMap[l.id] = getStatsForLesson(l.id, l.name);
  });
  return statsMap;
}

export function getGlobalSummary(): GlobalStats {
  const history = getStoredHistory();
  if (history.length === 0) {
    return {
      totalSessions: 0,
      totalDurationSeconds: 0,
      overallAvgWpm: 0,
      overallAvgRpm: 0,
      overallAvgAccuracy: 0,
      bestWpm: 0,
      bestRpm: 0,
      lessonsPracticedCount: 0,
    };
  }

  const totalSessions = history.length;
  const totalDurationSeconds = history.reduce((acc, h) => acc + (h.durationSeconds || 0), 0);
  const bestWpm = Math.max(...history.map((h) => h.wpm || 0));
  const bestRpm = Math.max(...history.map((h) => h.rpm || 0));

  const totalWpm = history.reduce((acc, h) => acc + (h.wpm || 0), 0);
  const totalRpm = history.reduce((acc, h) => acc + (h.rpm || 0), 0);
  const totalAccuracy = history.reduce((acc, h) => acc + (h.accuracy || 0), 0);

  const uniqueLessons = new Set(history.map((h) => h.lessonId));

  return {
    totalSessions,
    totalDurationSeconds,
    overallAvgWpm: Math.round(totalWpm / totalSessions),
    overallAvgRpm: Math.round(totalRpm / totalSessions),
    overallAvgAccuracy: Math.round((totalAccuracy / totalSessions) * 10) / 10,
    bestWpm,
    bestRpm,
    lessonsPracticedCount: uniqueLessons.size,
  };
}

export function clearAllHistory(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  }
}
