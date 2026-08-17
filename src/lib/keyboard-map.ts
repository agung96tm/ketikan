import { FingerId } from '@/types';

export interface FingerInfo {
  id: FingerId;
  name: string;
  hand: 'left' | 'right' | 'both';
  color: string;
}

export const FINGERS: Record<FingerId, FingerInfo> = {
  'left-pinky': {
    id: 'left-pinky',
    name: 'Left Pinky',
    hand: 'left',
    color: '#f87171',
  },
  'left-ring': {
    id: 'left-ring',
    name: 'Left Ring',
    hand: 'left',
    color: '#fb923c',
  },
  'left-middle': {
    id: 'left-middle',
    name: 'Left Middle',
    hand: 'left',
    color: '#facc15',
  },
  'left-index': {
    id: 'left-index',
    name: 'Left Index',
    hand: 'left',
    color: '#4ade80',
  },
  'thumb': {
    id: 'thumb',
    name: 'Thumb',
    hand: 'both',
    color: '#38bdf8',
  },
  'right-index': {
    id: 'right-index',
    name: 'Right Index',
    hand: 'right',
    color: '#60a5fa',
  },
  'right-middle': {
    id: 'right-middle',
    name: 'Right Middle',
    hand: 'right',
    color: '#a78bfa',
  },
  'right-ring': {
    id: 'right-ring',
    name: 'Right Ring',
    hand: 'right',
    color: '#f472b6',
  },
  'right-pinky': {
    id: 'right-pinky',
    name: 'Right Pinky',
    hand: 'right',
    color: '#fb7185',
  },
};

export interface KeyDefinition {
  code: string;
  label: string;
  shiftLabel?: string;
  finger: FingerId;
  width?: string;
  isSpecial?: boolean;
}

export const KEYBOARD_LAYOUT: KeyDefinition[][] = [
  // Row 1 (Number Row)
  [
    { code: 'Backquote', label: '`', shiftLabel: '~', finger: 'left-pinky' },
    { code: 'Digit1', label: '1', shiftLabel: '!', finger: 'left-pinky' },
    { code: 'Digit2', label: '2', shiftLabel: '@', finger: 'left-ring' },
    { code: 'Digit3', label: '3', shiftLabel: '#', finger: 'left-middle' },
    { code: 'Digit4', label: '4', shiftLabel: '$', finger: 'left-index' },
    { code: 'Digit5', label: '5', shiftLabel: '%', finger: 'left-index' },
    { code: 'Digit6', label: '6', shiftLabel: '^', finger: 'right-index' },
    { code: 'Digit7', label: '7', shiftLabel: '&', finger: 'right-index' },
    { code: 'Digit8', label: '8', shiftLabel: '*', finger: 'right-middle' },
    { code: 'Digit9', label: '9', shiftLabel: '(', finger: 'right-ring' },
    { code: 'Digit0', label: '0', shiftLabel: ')', finger: 'right-pinky' },
    { code: 'Minus', label: '-', shiftLabel: '_', finger: 'right-pinky' },
    { code: 'Equal', label: '=', shiftLabel: '+', finger: 'right-pinky' },
    { code: 'Backspace', label: 'backspace', finger: 'right-pinky', width: 'w-20', isSpecial: true },
  ],
  // Row 2 (Tab / QWERTY Row)
  [
    { code: 'Tab', label: 'tab', finger: 'left-pinky', width: 'w-16', isSpecial: true },
    { code: 'KeyQ', label: 'q', shiftLabel: 'Q', finger: 'left-pinky' },
    { code: 'KeyW', label: 'w', shiftLabel: 'W', finger: 'left-ring' },
    { code: 'KeyE', label: 'e', shiftLabel: 'E', finger: 'left-middle' },
    { code: 'KeyR', label: 'r', shiftLabel: 'R', finger: 'left-index' },
    { code: 'KeyT', label: 't', shiftLabel: 'T', finger: 'left-index' },
    { code: 'KeyY', label: 'y', shiftLabel: 'Y', finger: 'right-index' },
    { code: 'KeyU', label: 'u', shiftLabel: 'U', finger: 'right-index' },
    { code: 'KeyI', label: 'i', shiftLabel: 'I', finger: 'right-middle' },
    { code: 'KeyO', label: 'o', shiftLabel: 'O', finger: 'right-ring' },
    { code: 'KeyP', label: 'p', shiftLabel: 'P', finger: 'right-pinky' },
    { code: 'BracketLeft', label: '[', shiftLabel: '{', finger: 'right-pinky' },
    { code: 'BracketRight', label: ']', shiftLabel: '}', finger: 'right-pinky' },
    { code: 'Backslash', label: '\\', shiftLabel: '|', finger: 'right-pinky', width: 'w-14' },
  ],
  // Row 3 (Home Row)
  [
    { code: 'CapsLock', label: 'caps', finger: 'left-pinky', width: 'w-20', isSpecial: true },
    { code: 'KeyA', label: 'a', shiftLabel: 'A', finger: 'left-pinky' },
    { code: 'KeyS', label: 's', shiftLabel: 'S', finger: 'left-ring' },
    { code: 'KeyD', label: 'd', shiftLabel: 'D', finger: 'left-middle' },
    { code: 'KeyF', label: 'f', shiftLabel: 'F', finger: 'left-index' },
    { code: 'KeyG', label: 'g', shiftLabel: 'G', finger: 'left-index' },
    { code: 'KeyH', label: 'h', shiftLabel: 'H', finger: 'right-index' },
    { code: 'KeyJ', label: 'j', shiftLabel: 'J', finger: 'right-index' },
    { code: 'KeyK', label: 'k', shiftLabel: 'K', finger: 'right-middle' },
    { code: 'KeyL', label: 'l', shiftLabel: 'L', finger: 'right-ring' },
    { code: 'Semicolon', label: ';', shiftLabel: ':', finger: 'right-pinky' },
    { code: 'Quote', label: "'", shiftLabel: '"', finger: 'right-pinky' },
    { code: 'Enter', label: 'enter ↵', finger: 'right-pinky', width: 'w-24', isSpecial: true },
  ],
  // Row 4 (Bottom Row)
  [
    { code: 'ShiftLeft', label: 'shift', finger: 'left-pinky', width: 'w-24', isSpecial: true },
    { code: 'KeyZ', label: 'z', shiftLabel: 'Z', finger: 'left-pinky' },
    { code: 'KeyX', label: 'x', shiftLabel: 'X', finger: 'left-ring' },
    { code: 'KeyC', label: 'c', shiftLabel: 'C', finger: 'left-middle' },
    { code: 'KeyV', label: 'v', shiftLabel: 'V', finger: 'left-index' },
    { code: 'KeyB', label: 'b', shiftLabel: 'B', finger: 'left-index' },
    { code: 'KeyN', label: 'n', shiftLabel: 'N', finger: 'right-index' },
    { code: 'KeyM', label: 'm', shiftLabel: 'M', finger: 'right-index' },
    { code: 'Comma', label: ',', shiftLabel: '<', finger: 'right-middle' },
    { code: 'Period', label: '.', shiftLabel: '>', finger: 'right-ring' },
    { code: 'Slash', label: '/', shiftLabel: '?', finger: 'right-pinky' },
    { code: 'ShiftRight', label: 'shift', finger: 'right-pinky', width: 'w-24', isSpecial: true },
  ],
  // Row 5 (Space Row)
  [
    { code: 'ControlLeft', label: 'ctrl', finger: 'left-pinky', width: 'w-10 sm:w-12', isSpecial: true },
    { code: 'MetaLeft', label: 'cmd ⌘', finger: 'left-pinky', width: 'w-10 sm:w-12', isSpecial: true },
    { code: 'AltLeft', label: 'alt', finger: 'thumb', width: 'w-10 sm:w-12', isSpecial: true },
    { code: 'Space', label: 'space bar ␣', finger: 'thumb', width: 'w-48 sm:w-64 md:w-[320px] flex-1', isSpecial: true },
    { code: 'AltRight', label: 'alt', finger: 'thumb', width: 'w-10 sm:w-12', isSpecial: true },
    { code: 'MetaRight', label: 'cmd ⌘', finger: 'right-pinky', width: 'w-10 sm:w-12', isSpecial: true },
    { code: 'ControlRight', label: 'ctrl', finger: 'right-pinky', width: 'w-10 sm:w-12', isSpecial: true },
  ],
];

export function getFingerForKey(char: string): FingerInfo {
  if (char === ' ' || char === 'Space') {
    return FINGERS['thumb'];
  }
  if (char === '\n' || char === 'Enter') {
    return FINGERS['right-pinky'];
  }
  if (char === 'Backspace') {
    return FINGERS['right-pinky'];
  }
  if (char === 'Tab') {
    return FINGERS['left-pinky'];
  }

  const lower = char.toLowerCase();

  if (['1', '!', 'q', 'a', 'z', '`', '~'].includes(lower)) return FINGERS['left-pinky'];
  if (['2', '@', 'w', 's', 'x'].includes(lower)) return FINGERS['left-ring'];
  if (['3', '#', 'e', 'd', 'c'].includes(lower)) return FINGERS['left-middle'];
  if (['4', '$', '5', '%', 'r', 't', 'f', 'g', 'v', 'b'].includes(lower)) return FINGERS['left-index'];

  if (['6', '^', '7', '&', 'y', 'u', 'h', 'j', 'n', 'm'].includes(lower)) return FINGERS['right-index'];
  if (['8', '*', 'i', 'k', ',', '<'].includes(lower)) return FINGERS['right-middle'];
  if (['9', '(', 'o', 'l', '.', '>'].includes(lower)) return FINGERS['right-ring'];
  if (['0', ')', '-', '_', '=', '+', 'p', '[', '{', ']', '}', '\\', '|', ';', ':', "'", '"', '/', '?'].includes(lower)) {
    return FINGERS['right-pinky'];
  }

  return FINGERS['thumb'];
}

export function getKeyCodeForChar(char: string): string {
  if (char === ' ') return 'Space';
  if (char === '\n' || char === '↵') return 'Enter';
  if (char === '\t') return 'Tab';

  const charUpper = char.toUpperCase();
  if (charUpper >= 'A' && charUpper <= 'Z') {
    return `Key${charUpper}`;
  }
  if (char >= '0' && char <= '9') {
    return `Digit${char}`;
  }

  const symbolMap: Record<string, string> = {
    '`': 'Backquote', '~': 'Backquote',
    '!': 'Digit1', '@': 'Digit2', '#': 'Digit3', '$': 'Digit4', '%': 'Digit5',
    '^': 'Digit6', '&': 'Digit7', '*': 'Digit8', '(': 'Digit9', ')': 'Digit0',
    '-': 'Minus', '_': 'Minus',
    '=': 'Equal', '+': 'Equal',
    '[': 'BracketLeft', '{': 'BracketLeft',
    ']': 'BracketRight', '}': 'BracketRight',
    '\\': 'Backslash', '|': 'Backslash',
    ';': 'Semicolon', ':': 'Semicolon',
    "'": 'Quote', '"': 'Quote',
    ',': 'Comma', '<': 'Comma',
    '.': 'Period', '>': 'Period',
    '/': 'Slash', '?': 'Slash',
  };

  return symbolMap[char] || '';
}
