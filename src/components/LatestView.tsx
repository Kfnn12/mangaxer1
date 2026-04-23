import React, { useEffect, useState, useCallback } from 'react';
import { api, type SearchData, type MangaItem } from '../api';
import { MangaCard } from './MangaCard';
import { Loader2, Zap } from 'lucide-react';
import { ErrorDisplay } from './ErrorDisplay';
import { toast } from 'sonner';

interface LatestViewProps {
  onSelectManga: (id: string) => void;
}

export function LatestView({ onSelectManga }: LatestViewProps) {
  const [data, setData] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchLatestMode = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    setError(null);
    
    try {
      const response = await api.getLatest(pageNum);
      if (isLoadMore) {
        setData(prev => [...prev, ...response.results]);
      } else {
        setData(response.results);
      }
    } catch (e: any) {
      setError(e.message);
      toast.error("Failed to load latest updates", { description: e.message });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestMode(1, false);
  }, [fetchLatestMode]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLatestMode(nextPage, true);
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
         title="Failed to load Latest Updates"
         message={`Could not fetch results. ${error}`}
         onRetry={() => fetchLatestMode(1, false)}
      />
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-zinc-500">
        <Zap className="mb-4 h-12 w-12 opacity-50 text-orange-600/50" />
        <h3 className="text-xl font-black italic tracking-widest uppercase">No updates found</h3>
      </div>
    );
  }

  return (
    <section className="flex-1 flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black italic tracking-wider flex items-center gap-2">
          <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
          NEW UPDATES MANGA
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {data.map((manga, i) => (
          <MangaCard key={`latest-${manga.id}-${i}`} manga={manga} onClick={onSelectManga} />
        ))}
      </div>
      
      <div className="flex justify-center mt-8 pt-8 border-t border-white/5">
        <button 
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="flex items-center gap-2 px-8 py-3 rounded bg-orange-600 text-white font-bold tracking-widest uppercase hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {loadingMore ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
          Load More Updates
        </button>
      </div>
    </section>
  );
}
