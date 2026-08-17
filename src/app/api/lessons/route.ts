import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Lesson } from '@/types';

function formatLessonTitle(folderName: string): string {
  const match = folderName.match(/^(\d+)[-_.]\s*(.+)$/);
  let prefix = '';
  let rest = folderName;

  if (match) {
    prefix = `Level ${parseInt(match[1], 10)}: `;
    rest = match[2];
  }

  // Replace hyphens and underscores with spaces
  const cleaned = rest.replace(/[-_]/g, ' ');

  const titleWords = cleaned
    .split(' ')
    .map((w) => {
      const lower = w.toLowerCase();
      if (['ab', 'cd', 'ed', 'gh', 'fj', 'dk', 'sl', 'cv', 'nm', 'zx', 'qw', 'op', 'er', 'ui', 'asdf', 'jkl', 'qwer', 'uiop', 'zxcv', 'bnm', 'wpm', 'rpm', 'js'].includes(lower)) {
        return w.toUpperCase();
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');

  return prefix ? `${prefix}${titleWords}` : titleWords;
}

export async function GET() {
  try {
    const lessonsDir = path.join(process.cwd(), 'lessons');

    try {
      await fs.access(lessonsDir);
    } catch {
      return NextResponse.json({ lessons: [] });
    }

    const entries = await fs.readdir(lessonsDir, { withFileTypes: true });
    const folderEntries = entries.filter((e) => e.isDirectory());

    folderEntries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    const lessons: Lesson[] = [];

    for (const folder of folderEntries) {
      const folderPath = path.join(lessonsDir, folder.name);
      const files = await fs.readdir(folderPath);
      // Support lesson.txt, leason.txt, or any .txt
      const txtFile = files.find((f) => f === 'lesson.txt' || f === 'leason.txt') || files.find((f) => f.endsWith('.txt'));

      if (txtFile) {
        const filePath = path.join(folderPath, txtFile);
        const rawContent = await fs.readFile(filePath, 'utf-8');
        const content = rawContent.replace(/\r\n/g, '\n').trim();
        const lines = content.split('\n').filter((l) => l.length > 0);

        const words = content.split(/\s+/).filter(Boolean);
        const preview = lines[0] || content.slice(0, 80);

        lessons.push({
          id: folder.name,
          name: formatLessonTitle(folder.name),
          folderName: folder.name,
          fileName: txtFile,
          content,
          lines,
          preview,
          charCount: content.length,
          wordCount: words.length,
          difficulty: 'pemula',
          category: 'Lesson',
        });
      }
    }

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Error loading lessons:', error);
    return NextResponse.json({ error: 'Failed to load lessons', lessons: [] }, { status: 500 });
  }
}
