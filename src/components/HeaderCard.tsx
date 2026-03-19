import Button from './Button';

interface HeaderCardProps {
  isRefreshing: boolean;
  totalWords: number;
  totalCategories: number;
  onRefresh: () => void;
}

function HeaderCard({ isRefreshing, totalWords, totalCategories, onRefresh }: HeaderCardProps) {
  return (
    <section className="card header-card">
      <div>
        <p className="section-label">Start</p>
        <h1 className="section-title page-title">Vokabeln einfach lernen</h1>
        <p className="section-hint header-card-intro">
          Arbeite von oben nach unten: zuerst ein Wort eingeben, dann ueben und danach alles in der
          Liste nachsehen.
        </p>
        <p className="header-card-summary">
          Gespeichert sind aktuell {totalWords} Vokabeln in {totalCategories} Kategorien.
        </p>
      </div>

      <div className="header-card-actions">
        <Button onClick={onRefresh}>{isRefreshing ? 'Aktualisiere...' : 'Daten neu laden'}</Button>
      </div>
    </section>
  );
}

export default HeaderCard;
