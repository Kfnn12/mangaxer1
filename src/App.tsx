import React, { useState } from 'react';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { DetailsView } from './components/DetailsView';
import { AZView } from './components/AZView';
import { AZList } from './components/AZList';
import { LatestView } from './components/LatestView';
import { GenreIndexView } from './components/GenreIndexView';
import { GenreView } from './components/GenreView';
import { Search, BookMarked, Github, Zap, LayoutGrid } from 'lucide-react';
import { Toaster } from 'sonner';

export default function App() {
  const [view, setView] = useState<'home' | 'search' | 'details' | 'az' | 'latest' | 'genre_index' | 'genre'>('home');
  const [query, setQuery] = useState('');
  const [selectedMangaId, setSelectedMangaId] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setView('search');
    }
  };

  const navigateToHome = () => {
    setView('home');
    setQuery('');
    setSelectedLetter(null);
  };

  const navigateToLatest = () => {
    setView('latest');
    setQuery('');
    setSelectedLetter(null);
  };
  
  const navigateToGenreIndex = () => {
    setView('genre_index');
    setQuery('');
    setSelectedLetter(null);
  };

  const navigateToGenre = (genre: string) => {
    setSelectedGenre(genre);
    setView('genre');
    setQuery('');
    setSelectedLetter(null);
  };

  const navigateToDetails = (id: string) => {
    setSelectedMangaId(id);
    setView('details');
  };

  const triggerSearch = (newQuery: string) => {
    setQuery(newQuery);
    setView('search');
    setSelectedLetter(null);
  };

  const navigateToAZ = (letter: string) => {
    setSelectedLetter(letter);
    setView('az');
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans">
      <Toaster theme="dark" position="bottom-right" className="!font-sans" />
      <header className="h-16 flex items-center justify-between px-8 bg-black/60 backdrop-blur-md border-b border-white/10 shrink-0 z-50 sticky top-0">
        <div className="flex items-center gap-8">
          <div 
            className="text-2xl font-black tracking-tighter text-orange-600 flex items-center gap-2 italic cursor-pointer transition-opacity hover:opacity-80"
            onClick={navigateToHome}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded bg-orange-600 text-black not-italic pointer-events-none">
              <BookMarked className="h-5 w-5" />
            </div>
            MANGAXER
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={navigateToLatest}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-colors ${view === 'latest' ? 'bg-orange-600/20 text-orange-500' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <Zap className="w-4 h-4" />
              New Updates
            </button>
            <button
              onClick={navigateToGenreIndex}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-colors ${['genre_index', 'genre'].includes(view) ? 'bg-orange-600/20 text-orange-500' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutGrid className="w-4 h-4" />
              Genres
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} className="relative flex items-center group w-full max-w-md">
            <div className="absolute left-3 text-zinc-500 pointer-events-none">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search manga..."
              className="bg-zinc-900 border border-white/5 py-2 pl-10 pr-4 rounded-full text-sm w-full focus:outline-none focus:border-orange-600/50 transition-all font-medium placeholder:text-zinc-500 text-white"
            />
          </form>
          <a 
            href="https://manganow.to" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 border border-white/20 flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
            title="Go to manganow.to"
          >
            <span className="sr-only">Go to Source</span>
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-8 gap-8 mx-auto w-full max-w-7xl">
        {view === 'home' && <HomeView onSelectManga={navigateToDetails} onViewLatest={navigateToLatest} />}
        {view === 'latest' && <LatestView onSelectManga={navigateToDetails} />}
        {view === 'genre_index' && <GenreIndexView onSelectGenre={navigateToGenre} />}
        {view === 'genre' && selectedGenre && <GenreView genre={selectedGenre} onSelectManga={navigateToDetails} onBackToGenres={navigateToGenreIndex} />}
        {view === 'search' && <SearchView query={query} onSelectManga={navigateToDetails} />}
        {view === 'az' && selectedLetter && <AZView letter={selectedLetter} onSelectManga={navigateToDetails} />}
        {view === 'details' && selectedMangaId && (
          <DetailsView 
            id={selectedMangaId} 
            onBack={() => setView('home')} 
            onSearch={triggerSearch}
          />
        )}
        
        {view !== 'details' && (
          <AZList currentLetter={selectedLetter || undefined} onSelectLetter={navigateToAZ} />
        )}
      </main>

      <footer className="h-10 px-8 flex items-center justify-between bg-black/40 border-t border-white/5 text-[10px] text-zinc-600 font-mono tracking-tighter shrink-0 uppercase mt-auto">
        <div className="flex gap-4">
          <span>API Status: <span className="text-emerald-500">Operational</span></span>
        </div>
        <div className="flex gap-6 italic">
          <span>Mangaxer Explorer API</span>
        </div>
      </footer>
    </div>
  );
}
