export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyFingerMap {
  key: string;
  display?: string;
  finger: FingerId;
  fingerName: string;
  fingerColor: string;
  shiftRequired?: boolean;
}

export interface Lesson {
  id: string;
  name: string;
  folderName: string;
  fileName: string;
  content: string;
  lines: string[];
  preview: string;
  charCount: number;
  wordCount: number;
  difficulty: 'pemula' | 'menengah' | 'mahir';
  category: string;
}

export interface TypingResult {
  id: string;
  lessonId: string;
  lessonName: string;
  wpm: number;
  rpm: number; // Characters / Keystrokes per minute
  accuracy: number;
  errors: number;
  durationSeconds: number;
  totalCharsTyped: number;
  correctCharsTyped: number;
  completedAt: string;
  wpmHistory?: number[]; // snapshots over time for charts
}

export interface LessonStats {
  lessonId: string;
  lessonName: string;
  attemptsCount: number;
  bestWpm: number;
  bestRpm: number;
  avgWpm: number;
  avgRpm: number;
  avgAccuracy: number;
  lastAttemptDate: string;
  lastWpm: number;
  history: TypingResult[];
}

export interface GlobalStats {
  totalSessions: number;
  totalDurationSeconds: number;
  overallAvgWpm: number;
  overallAvgRpm: number;
  overallAvgAccuracy: number;
  bestWpm: number;
  bestRpm: number;
  lessonsPracticedCount: number;
}
