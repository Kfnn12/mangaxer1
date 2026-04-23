import React, { useEffect, useState, useCallback } from 'react';
import { api, type HomeData } from '../api';
import { MangaCard } from './MangaCard';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ErrorDisplay } from './ErrorDisplay';
import { toast } from 'sonner';
import { HeroCarousel } from './HeroCarousel';

interface HomeViewProps {
  onSelectManga: (id: string) => void;
  onViewLatest?: () => void;
}

export function HomeView({ onSelectManga, onViewLatest }: HomeViewProps) {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trendingPage, setTrendingPage] = useState(0);
  const [latestPage, setLatestPage] = useState(0);

  const itemsPerPage = 6; // Standard row size for most screens in this grid

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    api.getHome()
      .then(setData)
      .catch((e) => {
        setError(e.message);
        toast.error("Failed to load manga", { description: e.message });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
         title="Failed to Load Home"
         message={`Could not load trending and active manga from the server. ${error}`}
         onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured Header Carousel */}
      {data?.trending && data.trending.length > 0 && (
         <HeroCarousel items={data.trending.slice(0, 5)} onSelect={onSelectManga} />
      )}
      {data?.trending && data.trending.length > 0 && (
        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black italic uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
              Trending Now
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setTrendingPage(Math.max(0, trendingPage - 1))}
                disabled={trendingPage === 0}
                className="p-1.5 rounded border border-white/10 bg-zinc-900 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setTrendingPage(Math.min(Math.ceil(data.trending.length / itemsPerPage) - 1, trendingPage + 1))}
                disabled={trendingPage >= Math.ceil(data.trending.length / itemsPerPage) - 1}
                className="p-1.5 rounded border border-white/10 bg-zinc-900 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {data.trending.slice(trendingPage * itemsPerPage, (trendingPage + 1) * itemsPerPage).map((manga, i) => (
              <MangaCard key={`trending-${manga.id}-${i}`} manga={manga} onClick={onSelectManga} />
            ))}
          </div>
        </section>
      )}

      {data?.latest && data.latest.length > 0 && (
        <section className="flex-1 border border-white/5 bg-white/[0.02] p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
               <h2 className="text-xl font-black italic uppercase tracking-wider flex items-center gap-2">
                 <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
                 Latest Updates
               </h2>
            </div>
            <div className="flex items-center gap-4">
              {onViewLatest && (
                <button 
                  onClick={onViewLatest}
                  className="px-4 py-1.5 rounded bg-orange-600/10 text-orange-500 hover:bg-orange-600 hover:text-white transition-colors text-xs font-bold tracking-wider uppercase"
                >
                  View More
                </button>
              )}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setLatestPage(Math.max(0, latestPage - 1))}
                  disabled={latestPage === 0}
                  className="p-1.5 rounded border border-white/10 bg-zinc-900 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setLatestPage(Math.min(Math.ceil(data.latest.length / itemsPerPage) - 1, latestPage + 1))}
                  disabled={latestPage >= Math.ceil(data.latest.length / itemsPerPage) - 1}
                  className="p-1.5 rounded border border-white/10 bg-zinc-900 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {data.latest.slice(latestPage * itemsPerPage, (latestPage + 1) * itemsPerPage).map((manga, i) => (
              <MangaCard key={`latest-${manga.id}-${i}`} manga={manga} onClick={onSelectManga} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
