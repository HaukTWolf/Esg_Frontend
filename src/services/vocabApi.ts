import type { SingleEntryFormValues, VocabEntry } from '../types';

const API_ROOT = process.env.REACT_APP_API_BASE_URL || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Die Anfrage an das Backend ist fehlgeschlagen.');
  }

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export function getAllEntries(): Promise<VocabEntry[]> {
  return request<VocabEntry[]>('/api/vocab');
}

export async function addSingleEntry(entry: SingleEntryFormValues): Promise<VocabEntry> {
  const createdEntries = await request<VocabEntry[]>('/api/vocab/batch', {
    method: 'POST',
    body: JSON.stringify({
      words: [entry.key.trim()],
      sourceLang: entry.sourceLang.trim(),
      targetLang: entry.targetLang.trim(),
      domain: entry.domain.trim(),
    }),
  });

  const createdEntry = createdEntries[0];

  if (!createdEntry) {
    throw new Error('Das Backend hat keine erzeugte Vokabel zurueckgegeben.');
  }

  return createdEntry;
}
