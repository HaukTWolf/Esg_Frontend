import type { FormEvent } from 'react';
import { useDeferredValue, useEffect, useState } from 'react';
import { filterWords, getCategories } from '../lib/words';
import { addSingleEntry, getAllEntries } from '../services/vocabApi';
import type { SingleEntryFormValues, VocabEntry } from '../types';

const initialSingleForm: SingleEntryFormValues = {
  key: '',
  domain: '',
  sourceLang: 'de',
  targetLang: 'en',
};

function useAppViewModel() {
  const [entries, setEntries] = useState<VocabEntry[]>([]);
  const [singleForm, setSingleForm] = useState<SingleEntryFormValues>(initialSingleForm);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSavingSingle, setIsSavingSingle] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    void loadEntries();
  }, []);

  async function loadEntries({ silent = false }: { silent?: boolean } = {}): Promise<void> {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError('');

    try {
      const response = await getAllEntries();
      setEntries(response);
      setLastUpdated(new Date());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Das Backend konnte nicht geladen werden.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  function updateSingleForm<Field extends keyof SingleEntryFormValues>(
    field: Field,
    value: SingleEntryFormValues[Field]
  ): void {
    setSingleForm((current) => {
      if (field === 'sourceLang') {
        return {
          ...current,
          sourceLang: value as string,
          targetLang: value === 'de' ? 'en' : 'de',
        };
      }

      if (field === 'targetLang') {
        return {
          ...current,
          targetLang: value as string,
          sourceLang: value === 'de' ? 'en' : 'de',
        };
      }

      return { ...current, [field]: value };
    });
  }

  async function createWord(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSavingSingle(true);
    setError('');
    setFeedback('');

    try {
      const createdEntry = await addSingleEntry(singleForm);
      setSingleForm((current) => ({
        ...initialSingleForm,
        domain: current.domain,
        sourceLang: current.sourceLang,
        targetLang: current.targetLang,
      }));
      setFeedback(
        `"${createdEntry.key}" wurde erzeugt: ${createdEntry.translation || 'ohne Uebersetzung'}${
          createdEntry.exampleSentence ? ` | Satz: ${createdEntry.exampleSentence}` : ''
        }`
      );
      await loadEntries({ silent: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Die Vokabel konnte nicht gespeichert werden.');
    } finally {
      setIsSavingSingle(false);
    }
  }

  const categories = getCategories(entries);
  const filteredEntries = filterWords(entries, selectedCategory, deferredSearch);

  return {
    categories,
    entries,
    error,
    feedback,
    filteredEntries,
    isLoading,
    isRefreshing,
    isSavingSingle,
    lastUpdated,
    search,
    selectedCategory,
    singleForm,
    actions: {
      closeError: () => setError(''),
      closeFeedback: () => setFeedback(''),
      createWord,
      refreshEntries: () => void loadEntries({ silent: true }),
      setSearch,
      setSelectedCategory,
      updateSingleForm,
    },
  };
}

export default useAppViewModel;
