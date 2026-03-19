export interface VocabEntry {
  key: string;
  translation: string;
  exampleSentence: string;
  domain: string;
}

export interface SingleEntryFormValues {
  key: string;
  domain: string;
  sourceLang: string;
  targetLang: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
