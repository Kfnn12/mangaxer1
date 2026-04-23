import React from 'react';
import { GENRES } from '../api';

interface GenreIndexViewProps {
  onSelectGenre: (genre: string) => void;
}

export function GenreIndexView({ onSelectGenre }: GenreIndexViewProps) {
  return (
    <section className="flex-1 flex flex-col gap-8 pb-12">
      <div className="flex flex-col mb-4 gap-2">
        <h2 className="text-xl font-black italic tracking-wider flex items-center gap-2">
          <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
          BROWSE BY GENRE
        </h2>
        <p className="text-sm text-zinc-500 font-medium max-w-2xl">
          Explore our massive library perfectly categorized by your favorite genres.
          From heart-pounding action to relaxing slice-of-life, find your next binge here.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className="flex items-center justify-center text-center px-4 py-3 border border-white/5 bg-white/[0.02] hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all rounded-lg text-xs font-bold tracking-widest uppercase text-zinc-300 shadow-sm hover:shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:-translate-y-0.5"
          >
            {genre.replace(/-/g, ' ')}
          </button>
        ))}
      </div>
    </section>
  );
}
