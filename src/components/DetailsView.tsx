import React, { useEffect, useState, useCallback } from 'react';
import { api, type MangaDetails } from '../api';
import { Loader2, ArrowLeft, Calendar, FileText, ChevronLeft, ChevronRight, Play, ArrowUpDown, ImageIcon } from 'lucide-react';
import { ChapterReader } from './ChapterReader';
import { RatingStars } from './RatingStars';
import { ErrorDisplay } from './ErrorDisplay';
import { toast } from 'sonner';

interface DetailsViewProps {
  id: string;
  onBack: () => void;
  onSearch?: (query: string) => void;
  onSelectManga: (id: string) => void;
}

export function DetailsView({ id, onBack, onSearch, onSelectManga }: DetailsViewProps) {
  const [data, setData] = useState<MangaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isReading, setIsReading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    setImgError(false);
    window.scrollTo(0, 0);
    api.getDetails(id)
      .then((res) => {
        setData(res);
        // Default to the first chapter (last in the descending list)
        setCurrentChapterIndex(res.chapters.length > 0 ? res.chapters.length - 1 : 0);
      })
      .catch((e) => {
        setError(e.message);
        toast.error("Failed to load details", { description: e.message });
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  if (error || !data) {
    return (
      <div className="flex flex-col flex-1 relative">
         <ErrorDisplay 
           title="Manga Not Found"
           message={`We couldn't load details for this manga. ${error || "The server could not find this ID."}`}
           onRetry={loadData}
         />
         <div className="absolute top-4 left-4">
            <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-orange-500 active:scale-95 uppercase font-black text-xs tracking-widest transition-all duration-200">
               <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-xs font-black tracking-widest text-zinc-500 hover:text-orange-500 uppercase transition-colors shrink-0 max-w-fit"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </button>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl shrink-0 p-8 border border-white/5 bg-zinc-900/50 flex flex-col md:flex-row gap-8">
        {/* Cover */}
        <div className="w-48 shrink-0 mx-auto md:mx-0 shadow-lg rounded overflow-hidden h-72 border border-white/10 relative bg-zinc-800">
          {imgError || !data.image ? (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-zinc-500">
              <ImageIcon className="h-10 w-10 mb-2 opacity-30" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">No Image</span>
            </div>
          ) : (
            <img 
              src={data.image} 
              alt={data.title} 
              onError={() => {
                console.error(`Failed to load image for manga details: ${data.title} (${data.id}) - URL: ${data.image}`);
                setImgError(true);
              }}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
        </div>
        
        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-orange-600 text-black text-[10px] font-black rounded uppercase">
              Current
            </span>
          </div>
          <div className="flex items-center gap-4">
             <h1 className="text-4xl md:text-5xl font-black italic uppercase leading-none tracking-tighter text-white">
               {data.title}
             </h1>
             <div className="hidden sm:block">
               <RatingStars 
                  id={data.id} 
                  initialRating={data.rating} 
                  onRated={(newRating) => setData({ ...data, rating: newRating })}
               />
             </div>
          </div>
          <div className="sm:hidden -mt-2">
             <RatingStars 
                id={data.id} 
                initialRating={data.rating} 
                onRated={(newRating) => setData({ ...data, rating: newRating })}
             />
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl max-h-[140px] overflow-y-auto custom-scrollbar mt-2">
            {data.description || "No description available."}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(data.details).slice(0, 5).map(([key, value]) => {
                if (key.toLowerCase() === 'genres' && typeof value === 'string') {
                  const genresList = value.split(',').map((g: string) => g.trim());
                  return (
                    <div key={key} className="flex items-center gap-1.5 px-3 py-1 bg-black/40 border border-white/5 rounded text-xs text-zinc-400 font-medium">
                      <strong className="text-zinc-500 mr-1">{key}:</strong>
                      {genresList.map((g, i) => (
                         <React.Fragment key={g}>
                           <button 
                             onClick={() => onSearch && onSearch(g)}
                             className="text-orange-500 hover:text-white transition-colors underline decoration-orange-500/30 hover:decoration-white/50 underline-offset-2"
                           >
                              {g}
                           </button>
                           {i < genresList.length - 1 && <span className="text-white/20">,</span>}
                         </React.Fragment>
                      ))}
                    </div>
                  );
                }

                return (
                  <span key={key} className="px-3 py-1 bg-black/40 border border-white/5 rounded text-xs text-zinc-400 font-medium">
                    <strong className="text-zinc-500 mr-1">{key}:</strong>{value}
                  </span>
                );
            })}
          </div>

          {/* Sequential Navigation Buttons */}
          {data.chapters.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-4 items-center bg-zinc-950 p-4 rounded-xl border border-white/5 shadow-inner">
               <div className="flex-1 min-w-[200px]">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Navigation Focus</p>
                  <p className="text-white font-bold truncate">{data.chapters[currentChapterIndex]?.title}</p>
               </div>
               
               <div className="flex gap-2 w-full sm:w-auto">
                  {currentChapterIndex < data.chapters.length - 1 ? (
                    <button 
                      onClick={() => setCurrentChapterIndex(currentChapterIndex + 1)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 active:bg-orange-600/20 active:text-orange-500 text-white text-xs font-black uppercase rounded transition-all duration-200"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev Chapter
                    </button>
                  ) : (
                    <button disabled className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-zinc-900/50 text-zinc-700 text-xs font-black uppercase rounded cursor-not-allowed">
                      <ChevronLeft className="h-4 w-4" /> Prev Chapter
                    </button>
                  )}

                  <button 
                    onClick={() => setIsReading(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-black text-xs font-black uppercase rounded transition-all duration-200 shadow-lg shadow-orange-600/20 cursor-pointer"
                  >
                    <Play className="h-3 w-3 fill-black" /> Read
                  </button>

                  {currentChapterIndex > 0 ? (
                    <button 
                      onClick={() => setCurrentChapterIndex(currentChapterIndex - 1)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 active:bg-orange-600/20 active:text-orange-500 text-white text-xs font-black uppercase rounded transition-all duration-200"
                    >
                      Next Chapter <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button disabled className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-zinc-900/50 text-zinc-700 text-xs font-black uppercase rounded cursor-not-allowed">
                      Next Chapter <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black italic uppercase tracking-wider flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
            Chapters
          </h2>
          {data?.chapters && data.chapters.length > 1 && (
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest bg-zinc-900 px-3 py-2 rounded border border-white/5 hover:border-orange-500/50 transition-colors"
            >
              <ArrowUpDown className="h-3 w-3" />
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
          )}
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.chapters.length > 0 ? (
            (sortOrder === 'asc' ? [...data.chapters].reverse() : data.chapters).map((ch, i) => {
              const actualIndex = sortOrder === 'asc' ? data.chapters.length - 1 - i : i;
              const isActive = currentChapterIndex === actualIndex;
              return (
              <div
                key={actualIndex}
                onClick={() => {
                  setCurrentChapterIndex(actualIndex);
                  setIsReading(true);
                }}
                className={`group flex flex-col justify-center gap-1.5 rounded-lg p-4 border transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.15)] ring-1 ring-orange-500/50' 
                    : 'bg-zinc-900/80 border-white/5 hover:border-orange-500/50 hover:bg-zinc-800/80 hover:-translate-y-0.5 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-bold text-sm line-clamp-1 transition-colors ${isActive ? 'text-orange-500' : 'text-zinc-200 group-hover:text-orange-400'}`}>
                    {ch.title}
                  </span>
                  <div className={`flex shrink-0 items-center justify-center w-6 h-6 rounded-full transition-colors ${isActive ? 'bg-orange-500/20' : 'bg-transparent group-hover:bg-white/5'}`}>
                    {isActive ? (
                        <Play className="h-3 w-3 fill-orange-500 text-orange-500 ml-0.5" />
                    ) : (
                        <FileText className="h-4 w-4 text-zinc-600 group-hover:text-orange-400 transition-colors" />
                    )}
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 text-[11px] font-medium tracking-wide transition-colors ${isActive ? 'text-orange-500/80' : 'text-zinc-500'}`}>
                  <Calendar className="h-3 w-3" /> {ch.date || "Unknown date"}
                </span>
              </div>
            )})
          ) : (
             <p className="text-zinc-500 text-sm py-4 italic col-span-full">No chapters available.</p>
          )}
        </div>
      </div>
      
      {data.related && data.related.length > 0 && (
        <div className="mt-8 pt-8 border-t border-white/5">
          <h2 className="text-xl font-black italic uppercase tracking-wider flex items-center gap-2 mb-6">
            <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {data.related.map((manga, i) => (
              <MangaCard 
                key={`related-${manga.id}-${i}`} 
                manga={manga} 
                onClick={(relatedId) => {
                  window.scrollTo(0, 0);
                  onSelectManga(relatedId);
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {isReading && data.chapters[currentChapterIndex] && (
        <ChapterReader 
          url={data.chapters[currentChapterIndex].url}
          title={data.chapters[currentChapterIndex].title}
          mangaTitle={data.title}
          hasNext={currentChapterIndex > 0}
          hasPrev={currentChapterIndex < data.chapters.length - 1}
          onNext={() => setCurrentChapterIndex(currentChapterIndex - 1)}
          onPrev={() => setCurrentChapterIndex(currentChapterIndex + 1)}
          onClose={() => setIsReading(false)}
        />
      )}
    </div>
  );
}
