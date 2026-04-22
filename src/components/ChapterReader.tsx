import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { Loader2, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { ErrorDisplay } from './ErrorDisplay';
import { toast } from 'sonner';

interface ChapterReaderProps {
  url: string;
  title: string;
  mangaTitle: string;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export function ChapterReader({ url, title, mangaTitle, hasNext, hasPrev, onNext, onPrev, onClose }: ChapterReaderProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);
    api.getChapterPages(url, quality)
      .then(setPages)
      .catch((e) => {
         setError(e.message);
         toast.error("Failed to load page images", { description: e.message });
      })
      .finally(() => setLoading(false));
  }, [url, quality]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] overflow-y-auto custom-scrollbar flex flex-col">
      {/* Reader Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-zinc-950/90 backdrop-blur border-b border-white/5">
        <button 
          onClick={onClose}
          className="group flex items-center gap-2 text-xs font-black tracking-widest text-zinc-400 hover:text-orange-500 uppercase transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Close
        </button>
        <div className="text-center truncate px-4 flex-1">
           <h2 className="text-white font-bold text-sm tracking-wide truncate">{mangaTitle}</h2>
           <p className="text-orange-600 font-black text-[10px] uppercase tracking-widest truncate">{title}</p>
        </div>
        <div className="flex items-center gap-2">
            <select 
               value={quality} 
               onChange={(e) => setQuality(e.target.value as any)}
               className="bg-zinc-900 border border-white/5 text-zinc-300 text-[10px] font-black uppercase tracking-wider rounded py-1.5 px-2 hover:border-orange-500 focus:outline-none focus:border-orange-500 cursor-pointer appearance-none"
               style={{ WebkitAppearance: 'none' }}
            >
               <option value="high">High</option>
               <option value="medium">Med</option>
               <option value="low">Low</option>
            </select>
            <button 
               onClick={onPrev}
               disabled={!hasPrev}
               className="p-2 rounded bg-zinc-900 border border-white/5 disabled:opacity-50 hover:border-orange-500 active:scale-90 active:bg-orange-500/20 active:text-orange-500 text-zinc-300 disabled:hover:border-white/5 transition-all duration-200"
            >
               <ChevronUp className="h-4 w-4" />
            </button>
            <button 
               onClick={onNext}
               disabled={!hasNext}
               className="p-2 rounded bg-zinc-900 border border-white/5 disabled:opacity-50 hover:border-orange-500 active:scale-90 active:bg-orange-500/20 active:text-orange-500 text-zinc-300 disabled:hover:border-white/5 transition-all duration-200"
            >
               <ChevronDown className="h-4 w-4" />
            </button>
        </div>
      </div>

      {/* Reader Content */}
      <div className="flex-1 flex flex-col items-center justify-start w-full relative min-h-screen">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32">
            <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-4" />
            <p className="text-zinc-500 font-black text-xs uppercase tracking-widest">Loading Chapter Data</p>
          </div>
        ) : error ? (
           <ErrorDisplay 
             title="Failed to Load Chapter"
             message={`We couldn't scrape the images for this chapter. ${error}`}
             onRetry={loadData}
           />
        ) : (
          <div className="w-full max-w-4xl mx-auto flex flex-col">
            {pages.map((p, i) => (
              <img 
                key={i} 
                src={p} 
                alt={`Page ${i+1}`} 
                loading="lazy"
                className="w-full h-auto object-contain block bg-zinc-900/50" 
              />
            ))}
            
             <div className="p-12 flex justify-center items-center gap-4 border-t border-white/5 mt-12 w-full max-w-4xl mx-auto">
               {hasPrev && (
                 <button onClick={onPrev} className="flex-1 sm:flex-none px-8 py-4 bg-zinc-900 hover:bg-zinc-800 active:scale-95 active:bg-orange-600/20 active:text-orange-500 border border-white/5 text-white text-xs font-black uppercase tracking-widest rounded transition-all duration-200">
                    Previous Chapter
                 </button>
               )}
               {hasNext && (
                 <button onClick={onNext} className="flex-1 sm:flex-none px-8 py-4 bg-orange-600 hover:bg-orange-500 active:scale-95 text-black text-xs font-black uppercase tracking-widest rounded transition-all duration-200 shadow-lg shadow-orange-600/20">
                    Next Chapter
                 </button>
               )}
               {!hasNext && (
                 <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">End of Manga</p>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
