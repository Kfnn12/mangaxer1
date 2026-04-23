import React from 'react';

const ALPHABET = ['All', '#', '0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

interface AZListProps {
  currentLetter?: string;
  onSelectLetter: (letter: string) => void;
}

export function AZList({ currentLetter, onSelectLetter }: AZListProps) {
  return (
    <div className="w-full mt-12 flex flex-col items-center bg-zinc-900 border border-white/5 rounded-xl p-4 sm:p-6 shadow-2xl">
      <h3 className="text-sm font-black italic uppercase tracking-widest text-zinc-500 mb-4 text-center">
        A-Z List
      </h3>
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full pb-3 snap-x px-1">
        {ALPHABET.map((char) => (
          <button
            key={char}
            onClick={() => onSelectLetter(char)}
            className={`w-10 h-10 shrink-0 flex items-center justify-center font-bold text-sm rounded transition-colors snap-center ${
              currentLetter === char 
                ? 'bg-orange-600 text-black shadow-[0_0_15px_rgba(234,88,12,0.3)]' 
                : 'bg-black/50 text-white hover:bg-orange-600/20 hover:text-orange-500 border border-white/5'
            }`}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
}
