'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson, TypingResult, FingerId } from '@/types';
import { getFingerForKey } from '@/lib/keyboard-map';
import { playKeyClickSound, playEnterSound, playErrorSound, playCompleteSound } from '@/lib/audio';
import { VirtualKeyboard } from './VirtualKeyboard';
import { HandGuide } from './HandGuide';
import { CornerDownLeft, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface TypingAreaProps {
  lesson: Lesson;
  durationMinutes: number;
  soundEnabled: boolean;
  theme?: 'dark' | 'light';
  onFinish: (result: Omit<TypingResult, 'id' | 'completedAt'>) => void;
  onCancel: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  lesson,
  durationMinutes,
  soundEnabled,
  theme = 'dark',
  onFinish,
  onCancel,
}) => {
  const totalDurationSeconds = durationMinutes * 60;
  const isLight = theme === 'light';

  // Session State
  const [timeLeft, setTimeLeft] = useState<number>(totalDurationSeconds);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [currentLap, setCurrentLap] = useState<number>(1);

  // Line and Character Indexing
  const lines = lesson.lines.length > 0 ? lesson.lines : [lesson.content];
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(0);
  const [currentCharIdx, setCurrentCharIdx] = useState<number>(0);

  // Per-character correctness for current line
  const [charStatus, setCharStatus] = useState<('correct' | 'wrong')[]>([]);

  // Statistics counters
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);

  // Keyboard visual state
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [showColorHints, setShowColorHints] = useState<boolean>(true);

  // Refs for tracking latest state values in async callbacks & timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFinishedRef = useRef<boolean>(false);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  const timeLeftRef = useRef<number>(timeLeft);
  const correctKeystrokesRef = useRef<number>(correctKeystrokes);
  const totalKeystrokesRef = useRef<number>(totalKeystrokes);
  const errorCountRef = useRef<number>(errorCount);
  const wpmHistoryRef = useRef<number[]>(wpmHistory);

  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { correctKeystrokesRef.current = correctKeystrokes; }, [correctKeystrokes]);
  useEffect(() => { totalKeystrokesRef.current = totalKeystrokes; }, [totalKeystrokes]);
  useEffect(() => { errorCountRef.current = errorCount; }, [errorCount]);
  useEffect(() => { wpmHistoryRef.current = wpmHistory; }, [wpmHistory]);

  const currentLine = lines[currentLineIdx] || '';

  let currentExpectedChar = '';
  if (currentCharIdx < currentLine.length) {
    currentExpectedChar = currentLine[currentCharIdx];
  } else {
    currentExpectedChar = '\n';
  }

  const activeFingerInfo = getFingerForKey(currentExpectedChar);
  const activeFingerId: FingerId = activeFingerInfo.id;

  const elapsedSeconds = totalDurationSeconds - timeLeft;
  const elapsedMinutes = Math.max(elapsedSeconds / 60, 0.01);

  const liveWpm = hasStarted && elapsedSeconds > 0
    ? Math.round((correctKeystrokes / 5) / elapsedMinutes)
    : 0;

  const liveRpm = hasStarted && elapsedSeconds > 0
    ? Math.round(correctKeystrokes / elapsedMinutes)
    : 0;

  const liveAccuracy = totalKeystrokes > 0
    ? Math.round((correctKeystrokes / totalKeystrokes) * 1000) / 10
    : 100;

  // Auto-scroll single-line text smoothly to keep cursor centered
  useEffect(() => {
    if (cursorRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const cursor = cursorRef.current;

      const containerWidth = container.offsetWidth;
      const cursorLeft = cursor.offsetLeft;
      const cursorWidth = cursor.offsetWidth;

      // Scroll so cursor is positioned nicely at ~35% from the left
      const targetScroll = cursorLeft - containerWidth * 0.35 + cursorWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [currentCharIdx, currentLineIdx]);

  const handleFinish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsFinished(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (soundEnabled) {
      playCompleteSound(0.3);
    }

    const finalTimeLeft = timeLeftRef.current;
    const finalDurationSeconds = totalDurationSeconds - finalTimeLeft;
    const finalElapsedMinutes = Math.max(finalDurationSeconds / 60, 0.05);
    const finalWpm = Math.round((correctKeystrokesRef.current / 5) / finalElapsedMinutes);
    const finalRpm = Math.round(correctKeystrokesRef.current / finalElapsedMinutes);
    const finalAccuracy = totalKeystrokesRef.current > 0
      ? Math.round((correctKeystrokesRef.current / totalKeystrokesRef.current) * 1000) / 10
      : 100;

    onFinish({
      lessonId: lesson.id,
      lessonName: lesson.name,
      wpm: finalWpm,
      rpm: finalRpm,
      accuracy: finalAccuracy,
      errors: errorCountRef.current,
      durationSeconds: finalDurationSeconds,
      totalCharsTyped: totalKeystrokesRef.current,
      correctCharsTyped: correctKeystrokesRef.current,
      wpmHistory: wpmHistoryRef.current,
    });
  }, [
    lesson.id,
    lesson.name,
    onFinish,
    soundEnabled,
    totalDurationSeconds,
  ]);

  useEffect(() => {
    if (!hasStarted || isFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinish();
          return 0;
        }

        const nextTimeLeft = prev - 1;
        const elapsed = totalDurationSeconds - nextTimeLeft;
        if (elapsed % 5 === 0) {
          const m = Math.max(elapsed / 60, 0.01);
          const currentWpm = Math.round((correctKeystrokesRef.current / 5) / m);
          setWpmHistory((hist) => [...hist, currentWpm]);
        }

        return nextTimeLeft;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [hasStarted, isFinished, handleFinish, totalDurationSeconds]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isFinishedRef.current) return;

      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
        return;
      }

      // Handle Backspace / Delete key to step back and retype
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        if (currentCharIdx > 0) {
          if (soundEnabled) playKeyClickSound();
          setCurrentCharIdx((prev) => prev - 1);
          setCharStatus((prev) => prev.slice(0, -1));
        }
        return;
      }

      setPressedKeys((prev) => new Set(prev).add(e.code));

      if (!hasStarted) {
        setHasStarted(true);
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
      }

      const expected = currentExpectedChar;

      if (expected === '\n') {
        if (e.key === 'Enter') {
          if (soundEnabled) playEnterSound();
          setTotalKeystrokes((k) => k + 1);
          setCorrectKeystrokes((c) => c + 1);

          if (currentLineIdx + 1 < lines.length) {
            setCurrentLineIdx((prev) => prev + 1);
            setCurrentCharIdx(0);
            setCharStatus([]);
          } else {
            setCurrentLineIdx(0);
            setCurrentCharIdx(0);
            setCharStatus([]);
            setCurrentLap((lap) => lap + 1);
          }
        } else {
          if (soundEnabled) playErrorSound();
          setTotalKeystrokes((k) => k + 1);
          setErrorCount((err) => err + 1);
        }
        return;
      }

      if (e.key === expected) {
        if (soundEnabled) playKeyClickSound();
        setTotalKeystrokes((k) => k + 1);
        setCorrectKeystrokes((c) => c + 1);

        setCharStatus((prev) => [...prev, 'correct']);
        setCurrentCharIdx((prev) => prev + 1);
      } else {
        if (soundEnabled) playErrorSound();
        setTotalKeystrokes((k) => k + 1);
        setErrorCount((err) => err + 1);

        setCharStatus((prev) => [...prev, 'wrong']);
        setCurrentCharIdx((prev) => prev + 1);
      }
    },
    [
      currentExpectedChar,
      currentLineIdx,
      hasStarted,
      lines.length,
      soundEnabled,
    ]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(e.code);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-2.5 py-0">
      {/* Compact HUD Bar */}
      <div className={`flex items-center justify-between px-4 py-2 rounded-xl border font-mono transition-colors ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm text-slate-800'
          : 'bg-[#141824] border-neutral-800 shadow-md text-neutral-100'
      }`}>
        <div className="flex items-center gap-5 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className={`uppercase text-[11px] font-sans font-bold ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>time</span>
            <strong className={`font-mono text-lg font-bold ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : isLight ? 'text-slate-900' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`uppercase text-[11px] font-sans font-bold ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>wpm</span>
            <strong className="font-mono text-lg font-bold text-sky-500">{liveWpm}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`uppercase text-[11px] font-sans font-bold ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>rpm</span>
            <strong className="font-mono text-lg font-bold text-indigo-400">{liveRpm}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`uppercase text-[11px] font-sans font-bold ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>acc</span>
            <strong className="font-mono text-lg font-bold text-emerald-500">{liveAccuracy}%</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`uppercase text-[11px] font-sans font-bold ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>err</span>
            <strong className={`font-mono text-lg font-bold ${errorCount > 0 ? 'text-rose-500' : isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
              {errorCount}
            </strong>
          </div>
          {currentLap > 1 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-500 border border-sky-500/20">
              lap {currentLap}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowColorHints(!showColorHints)}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title={showColorHints ? 'Hide finger colors' : 'Show finger colors'}
          >
            {showColorHints ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>exit</span>
          </button>
        </div>
      </div>

      {/* Lesson Title & Line Info */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-neutral-300'}`}>
          {lesson.name}
        </span>
        <span className={`font-mono text-[11px] ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
          line {currentLineIdx + 1}/{lines.length}
        </span>
      </div>

      {/* ONE-LINE Moving / Horizontally Scrolling Typing Text Arena */}
      <div className={`relative px-5 py-3.5 rounded-xl border transition-colors overflow-hidden ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-[#141824] border-neutral-800 shadow-md'
      }`}>
        <div
          ref={textContainerRef}
          className="font-mono text-xl sm:text-2xl tracking-wide whitespace-nowrap overflow-x-hidden select-none scroll-smooth flex items-center py-1"
        >
          {currentLine.split('').map((char, index) => {
            const isCursor = index === currentCharIdx;
            const status = charStatus[index];
            const isSpace = char === ' ';

            let charClass = isLight ? 'text-slate-400' : 'text-neutral-600';
            if (status === 'correct') {
              charClass = 'text-emerald-500 font-bold';
            } else if (status === 'wrong') {
              charClass = isSpace
                ? 'text-rose-500 font-bold bg-rose-500/20 rounded'
                : 'text-rose-500 font-bold underline decoration-rose-500 decoration-2';
            }

            return (
              <span
                key={index}
                ref={isCursor ? cursorRef : null}
                className="relative inline-flex items-center shrink-0"
              >
                {isCursor && <span className="cursor-caret mr-[1px]" />}
                <span
                  className={`${charClass} inline-block text-center transition-all ${
                    isSpace
                      ? 'min-w-[0.55em] mx-0.5 sm:mx-1 rounded'
                      : 'min-w-[0.55em]'
                  } ${
                    isCursor
                      ? isLight
                        ? 'text-slate-900 bg-sky-100 px-1 rounded font-extrabold shadow-sm ring-1 ring-sky-400'
                        : 'text-white bg-sky-950 px-1 rounded font-extrabold shadow-sm ring-1 ring-sky-500/60'
                      : ''
                  }`}
                >
                  {isSpace ? (isCursor ? '␣' : status === 'wrong' ? '␣' : ' ') : char}
                </span>
              </span>
            );
          })}

          {currentCharIdx >= currentLine.length && (
            <span
              ref={cursorRef}
              className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-500 text-xs font-sans font-bold animate-pulse shrink-0"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span>enter ↵</span>
            </span>
          )}
        </div>
      </div>

      {/* Hand Guide */}
      <HandGuide activeFinger={activeFingerId} theme={theme} />

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        targetChar={currentExpectedChar}
        pressedKeys={pressedKeys}
        showColorHints={showColorHints}
        theme={theme}
      />
    </div>
  );
};
