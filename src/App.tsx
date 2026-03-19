import CreateWordCard from './components/CreateWordCard';
import HeaderCard from './components/HeaderCard';
import MessageBanner from './components/MessageBanner';
import PracticeCard from './components/PracticeCard';
import WordListCard from './components/WordListCard';
import useAppViewModel from './viewmodels/useAppViewModel';

function App() {
  const viewModel = useAppViewModel();

  return (
    <div className="app-shell">
      <main className="app-layout">
        <HeaderCard
          isRefreshing={viewModel.isRefreshing}
          totalWords={viewModel.entries.length}
          totalCategories={viewModel.categories.length}
          onRefresh={viewModel.actions.refreshEntries}
        />

        {viewModel.feedback && (
          <MessageBanner
            title="Erfolg"
            message={viewModel.feedback}
            tone="success"
            onClose={viewModel.actions.closeFeedback}
          />
        )}
        {viewModel.error && (
          <MessageBanner
            title="Fehler"
            message={viewModel.error}
            tone="error"
            onClose={viewModel.actions.closeError}
          />
        )}

        <section className="app-sections">
          <CreateWordCard
            values={viewModel.singleForm}
            isSubmitting={viewModel.isSavingSingle}
            onChange={viewModel.actions.updateSingleForm}
            onSubmit={viewModel.actions.createWord}
          />

          <PracticeCard entries={viewModel.entries} isLoading={viewModel.isLoading} />
          <WordListCard
            entries={viewModel.filteredEntries}
            categories={viewModel.categories}
            isLoading={viewModel.isLoading}
            lastUpdated={viewModel.lastUpdated}
            search={viewModel.search}
            selectedCategory={viewModel.selectedCategory}
            onSearchChange={viewModel.actions.setSearch}
            onCategoryChange={viewModel.actions.setSelectedCategory}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
