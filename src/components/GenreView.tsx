import React, { useEffect, useState, useCallback } from 'react';
import { api, type MangaItem } from '../api';
import { MangaCard } from './MangaCard';
import { Loader2, LayoutGrid, ArrowLeft } from 'lucide-react';
import { ErrorDisplay } from './ErrorDisplay';
import { toast } from 'sonner';

interface GenreViewProps {
  genre: string;
  onSelectManga: (id: string) => void;
  onBackToGenres: () => void;
}

export function GenreView({ genre, onSelectManga, onBackToGenres }: GenreViewProps) {
  const [data, setData] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchGenreMode = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    setError(null);
    
    try {
      const response = await api.getGenre(genre, pageNum);
      if (isLoadMore) {
        setData(prev => [...prev, ...response.results]);
      } else {
        setData(response.results);
      }
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to load ${genre} manga`, { description: e.message });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [genre]);

  useEffect(() => {
    setPage(1);
    fetchGenreMode(1, false);
  }, [fetchGenreMode]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGenreMode(nextPage, true);
  };

  if (loading && page === 1) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <ErrorDisplay 
         title={`Failed to load "${genre.replace(/-/g, ' ')}"`}
         message={`Could not fetch results. ${error}`}
         onRetry={() => fetchGenreMode(1, false)}
      />
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-zinc-500">
        <LayoutGrid className="mb-4 h-12 w-12 opacity-50 text-orange-600/50" />
        <h3 className="text-xl font-black italic tracking-widest uppercase">No manga found</h3>
        <p className="mt-2 text-sm">We couldn't find anything in the genre "<span className="text-orange-500">{genre.replace(/-/g, ' ')}</span>"</p>
        <button onClick={onBackToGenres} className="mt-6 text-orange-500 hover:underline">Back to Genres</button>
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col gap-8 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBackToGenres} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
          title="Back to all genres"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-black italic tracking-wider flex items-center gap-2 uppercase">
          <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
          GENRE: <span className="text-orange-500">{genre.replace(/-/g, ' ')}</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {data.map((manga, i) => (
          <MangaCard key={`genre-${genre}-${manga.id}-${i}`} manga={manga} onClick={onSelectManga} />
        ))}
      </div>
      
      <div className="flex justify-center mt-8 pt-8 border-t border-white/5">
        <button 
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="flex items-center gap-2 px-8 py-3 rounded bg-orange-600 text-white font-bold tracking-widest uppercase hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {loadingMore ? <Loader2 className="h-5 w-5 animate-spin" /> : <LayoutGrid className="h-5 w-5" />}
          Load More
        </button>
      </div>
    </section>
  );
}
