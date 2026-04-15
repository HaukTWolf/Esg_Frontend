import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import type { VocabEntry } from '../types';
import { getPracticeWords, isCorrectAnswer, pickRandomWord } from '../lib/words';
import Button from './Button';
import TextInput from './TextInput';

interface PracticeCardProps {
  entries: VocabEntry[];
  isLoading: boolean;
}

type PracticeResult = 'correct' | 'incorrect' | null;

function PracticeCard({ entries, isLoading }: PracticeCardProps) {
  const [started, setStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState<VocabEntry | null>(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<PracticeResult>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const practiceWords = getPracticeWords(entries);

  useEffect(() => {
    if (practiceWords.length === 0) {
      setStarted(false);
      setCurrentWord(null);
      setAnswer('');
      setResult(null);
      return;
    }

    if (started && (!currentWord || !practiceWords.some((entry) => entry.key === currentWord.key))) {
      setCurrentWord(pickRandomWord(practiceWords));
      setAnswer('');
      setResult(null);
    }
  }, [practiceWords, currentWord, started]);

  function startPractice(): void {
    setStarted(true);
    setCurrentWord(pickRandomWord(practiceWords));
    setAnswer('');
    setResult(null);
  }

  function checkAnswer(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!currentWord || !answer.trim()) {
      return;
    }

    const answerIsCorrect = isCorrectAnswer(answer, currentWord.translation);
    setResult(answerIsCorrect ? 'correct' : 'incorrect');

    if (answerIsCorrect) {
      setCorrectCount((value) => value + 1);
    } else {
      setWrongCount((value) => value + 1);
    }
  }

  function nextWord(): void {
    setCurrentWord(pickRandomWord(practiceWords, currentWord?.key));
    setAnswer('');
    setResult(null);
  }

  function resetPractice(): void {
    setStarted(false);
    setCurrentWord(null);
    setAnswer('');
    setResult(null);
    setCorrectCount(0);
    setWrongCount(0);
  }

  return (
    <section className="card">
      <div className="card-header-split practice-card-heading">
        <div>
          <p className="section-label">Schritt 2</p>
          <h2 className="section-title">Vokabel ueben</h2>
          <p className="section-hint">
            Du siehst ein Wort und schreibst die passende Uebersetzung in das Feld.
          </p>
        </div>

        {started && <p className="practice-card-stats">Richtig: {correctCount} | Falsch: {wrongCount}</p>}
      </div>

      {isLoading ? (
        <div className="empty-state">
          <strong>Lade Vokabeln...</strong>
          <span>Die Daten werden gerade aus dem Backend geholt.</span>
        </div>
      ) : !currentWord ? (
        <div className="empty-state practice-card-start-state">
          <strong>{practiceWords.length === 0 ? 'Noch keine Uebung moeglich' : 'Training bereit'}</strong>
          <span>
            {practiceWords.length === 0
              ? 'Lege zuerst mindestens eine Vokabel an.'
              : 'Starte die Uebung, um eine zufaellige Vokabel zu sehen.'}
          </span>
          {practiceWords.length > 0 && (
            <span className="practice-card-start-copy">
              Druecke auf Start. Danach bekommst du immer ein Wort und kannst deine Antwort direkt
              pruefen.
            </span>
          )}
          {practiceWords.length > 0 && <Button onClick={startPractice}>Training starten</Button>}
        </div>
      ) : (
        <div className="practice-card-body">
          <div className="card-panel practice-card-word-panel">
            <span className="practice-card-label">Finde die passende Uebersetzung</span>
            <strong className="practice-card-word">{currentWord.key}</strong>
            {currentWord.exampleSentence && <p className="practice-card-example">{currentWord.exampleSentence}</p>}
            <div className="practice-card-meta">
              <span>{practiceWords.length} Karten verfuegbar</span>
              <span>Kategorie: {currentWord.domain || '-'}</span>
            </div>
          </div>

          <form className="practice-card-form" onSubmit={checkAnswer}>
            <TextInput
              fullWidth
              autoComplete="off"
              label="Deine Antwort"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
                if (result) {
                  setResult(null);
                }
              }}
              placeholder="z. B. work"
            />

            <div className="practice-card-actions">
              <Button type="submit" disabled={!answer.trim()}>
                Pruefen
              </Button>
              <Button type="button" variant="secondary" onClick={nextWord}>
                Weiter
              </Button>
              <Button type="button" variant="secondary" onClick={resetPractice}>
                Neu starten
              </Button>
            </div>
          </form>

          {result && (
            <div
              className={`practice-card-feedback ${
                result === 'correct' ? 'practice-card-feedback-correct' : 'practice-card-feedback-wrong'
              }`}>
              <strong>{result === 'correct' ? 'Richtig' : 'Nicht ganz'}</strong>
              <span>Richtige Uebersetzung: {currentWord.translation}</span>
              {currentWord.exampleSentence && <span>Beispielsatz: {currentWord.exampleSentence}</span>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default PracticeCard;
