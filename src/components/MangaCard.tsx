import React, { useState } from 'react';
import { Star, ImageIcon } from 'lucide-react';
import type { MangaItem } from '../api';

interface MangaCardProps {
  manga: MangaItem;
  onClick: (id: string) => void;
}

const PLACEHOLDER_IMAGE = "https://placehold.co/300x400/18181b/52525b?text=No+Image";

export function MangaCard({ manga, onClick }: MangaCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      console.error(`Failed to load image for manga: ${manga.title} (${manga.id}) - URL: ${manga.image}`);
      setImgError(true);
    }
  };

  return (
    <div 
      className="flex flex-col gap-3 group cursor-pointer"
      onClick={() => onClick(manga.id)}
    >
      <div className="relative aspect-[3/4] bg-zinc-800 rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-orange-600/50 transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
        {imgError || !manga.image ? (
          <div className="absolute inset-0 w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-zinc-500">
            <ImageIcon className="h-8 w-8 mb-2 opacity-30" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">No Image</span>
          </div>
        ) : (
          <img 
            src={manga.image} 
            alt={manga.title} 
            onError={handleImageError}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        
        {manga.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-black/80 px-2 py-0.5 text-[10px] font-black tracking-tighter text-orange-500 z-20 shadow-md border border-orange-500/20 backdrop-blur-md">
            <Star className="h-3 w-3 fill-orange-500" />
            {manga.rating}
          </div>
        )}
      </div>

      <div className="flex flex-col px-1">
        <h4 className="font-bold truncate text-sm text-zinc-100 group-hover:text-orange-500 transition-colors duration-300">
          {manga.title}
        </h4>
        {manga.genres && manga.genres.length > 0 && (
          <div className="text-[10px] text-zinc-500 mt-0.5 truncate tracking-wide">
            {manga.genres.join(', ')}
          </div>
        )}
        {manga.latestChapter && (
           <span className="text-[11px] text-zinc-400 mt-1 truncate font-medium">
             {manga.latestChapter}
           </span>
        )}
      </div>
    </div>
  );
}
