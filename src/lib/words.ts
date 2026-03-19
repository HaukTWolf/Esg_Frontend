import type { VocabEntry } from '../types';

export function formatTimestamp(timestamp: Date | null): string {
  if (!timestamp) {
    return 'noch nicht geladen';
  }

  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp);
}

export function getCategories(entries: VocabEntry[]): string[] {
  return Array.from(new Set(entries.map((entry) => entry.domain).filter(Boolean))).sort((left, right) =>
    left.localeCompare(right)
  );
}

export function filterWords(entries: VocabEntry[], selectedCategory: string, searchValue: string): VocabEntry[] {
  const normalizedSearch = searchValue.trim().toLowerCase();

  return entries.filter((entry) => {
    if (selectedCategory !== 'all' && entry.domain !== selectedCategory) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const haystack = [entry.key, entry.translation, entry.exampleSentence, entry.domain]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });
}

export function getPracticeWords(entries: VocabEntry[]): VocabEntry[] {
  return entries.filter((entry) => Boolean(entry.key?.trim()) && Boolean(entry.translation?.trim()));
}

export function pickRandomWord(entries: VocabEntry[], currentKey?: string): VocabEntry | null {
  if (entries.length === 0) {
    return null;
  }

  const availableWords =
    currentKey && entries.length > 1 ? entries.filter((entry) => entry.key !== currentKey) : entries;

  return availableWords[Math.floor(Math.random() * availableWords.length)] ?? null;
}

function normalizeAnswer(value: string): string {
  return value
    .toLocaleLowerCase('de-DE')
    .replace(/[.,!?;:()[\]"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isCorrectAnswer(answer: string, translation: string): boolean {
  const normalizedAnswer = normalizeAnswer(answer);
  const acceptedAnswers = translation
    .split(/[;,/]|(?:\s+or\s+)/i)
    .map((part) => normalizeAnswer(part))
    .filter(Boolean);

  return acceptedAnswers.includes(normalizedAnswer);
}
