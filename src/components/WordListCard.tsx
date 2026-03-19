import type { VocabEntry } from '../types';
import { formatTimestamp } from '../lib/words';
import SelectInput from './SelectInput';
import TextInput from './TextInput';

interface WordListCardProps {
  entries: VocabEntry[];
  categories: string[];
  isLoading: boolean;
  lastUpdated: Date | null;
  search: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

function WordListCard({
  entries,
  categories,
  isLoading,
  lastUpdated,
  search,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: WordListCardProps) {
  const categoryOptions = [
    { value: 'all', label: 'Alle' },
    ...categories.map((category) => ({ value: category, label: category })),
  ];

  return (
    <section className="card">
      <div className="card-header-split word-list-card-header">
        <div>
          <p className="section-label">Liste</p>
          <h2 className="section-title">Gespeicherte Woerter</h2>
          <p className="section-hint">
            Hier kannst du nach einem Wort suchen oder nur ein bestimmtes Thema anzeigen lassen.
          </p>
        </div>

        <div className="word-list-card-controls">
          <TextInput
            label="Wort suchen"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="z. B. Arbeit"
          />

          <SelectInput
            label="Thema auswaehlen"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            options={categoryOptions}
          />
        </div>
      </div>

      <div className="word-list-card-meta">
        <span>{entries.length} sichtbare Vokabeln</span>
        <span>Letzte Aktualisierung: {formatTimestamp(lastUpdated)}</span>
      </div>

      {isLoading ? (
        <div className="empty-state">
          <strong>Lade Vokabeln...</strong>
          <span>Die Liste wird gerade aufgebaut.</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <strong>Keine Vokabeln gefunden</strong>
          <span>Pruefe die Suche oder lege zuerst neue Begriffe an.</span>
        </div>
      ) : (
        <div className="word-list-card-table-wrapper">
          <table className="word-list-card-table">
            <thead>
              <tr>
                <th>Begriff</th>
                <th>Uebersetzung</th>
                <th>Kategorie</th>
                <th>Beispielsatz</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={`${entry.key}-${index}`}>
                  <td>{entry.key || '-'}</td>
                  <td>{entry.translation || '-'}</td>
                  <td>{entry.domain || '-'}</td>
                  <td>{entry.exampleSentence || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default WordListCard;
