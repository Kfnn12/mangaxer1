import React, { useEffect, useState, useCallback } from 'react';
import { api, type SearchData } from '../api';
import { MangaCard } from './MangaCard';
import { Loader2, SearchX } from 'lucide-react';
import { ErrorDisplay } from './ErrorDisplay';
import { toast } from 'sonner';

interface SearchViewProps {
  query: string;
  onSelectManga: (id: string) => void;
}

export function SearchView({ query, onSelectManga }: SearchViewProps) {
  const [data, setData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(() => {
    setLoading(true);
    setError(null);
    api.search(query)
      .then(setData)
      .catch((e) => {
         setError(e.message);
         toast.error("Search Failed", { description: e.message });
      })
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay 
         title="Search Failed"
         message={`Could not fetch results for "${query}". ${error}`}
         onRetry={performSearch}
      />
    );
  }

  if (!data?.results || data.results.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-zinc-500">
        <SearchX className="mb-4 h-12 w-12 opacity-50 text-orange-600/50" />
        <h3 className="text-xl font-black italic tracking-widest uppercase">No results found</h3>
        <p className="mt-2 text-sm">We couldn't find anything matching "<span className="text-orange-500">{query}</span>"</p>
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col gap-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black italic tracking-wider flex items-center gap-2">
          <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
          SEARCH: <span className="text-orange-600">"{query}"</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {data.results.map((manga, i) => (
          <MangaCard key={`search-${manga.id}-${i}`} manga={manga} onClick={onSelectManga} />
        ))}
      </div>
    </section>
  );
}
