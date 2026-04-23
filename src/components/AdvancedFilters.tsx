import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface AdvancedFiltersProps {
  sort: string;
  setSort: (val: string) => void;
  status?: string;
  setStatus?: (val: string) => void;
  showStatus?: boolean;
}

export function AdvancedFilters({ sort, setSort, status, setStatus, showStatus = true }: AdvancedFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-zinc-900/50 border border-white/5 p-3 rounded-lg w-full max-w-fit mb-6">
      <div className="flex items-center gap-2 text-zinc-400 mr-2 shrink-0">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Sort</label>
        <select 
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-black border border-white/10 text-zinc-300 text-xs rounded px-2 py-1 outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
        >
          <option value="default">Default</option>
          <option value="latest-updated">Latest Updated</option>
          <option value="score">Top Score / Popular</option>
          <option value="name-az">Name A-Z</option>
          <option value="release-date">Release Date</option>
          <option value="most-viewed">Most Viewed</option>
        </select>
      </div>

      {showStatus && setStatus && (
        <>
          <div className="w-[1px] h-4 bg-white/10 mx-1 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-black border border-white/10 text-zinc-300 text-xs rounded px-2 py-1 outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
              <option value="on-hiatus">On Hiatus</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
