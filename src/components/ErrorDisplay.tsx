import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ title = "Something went wrong", message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex-1 flex w-full flex-col items-center justify-center py-16 px-4">
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8 max-w-md w-full flex flex-col items-center text-center shadow-[0_0_30px_rgba(239,68,68,0.05)]">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-red-500 font-black text-lg italic uppercase tracking-tighter mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-6">
          {message}
        </p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xs font-black uppercase tracking-widest transition-all rounded shadow-lg shadow-red-500/20"
          >
            Retry Request
          </button>
        )}
      </div>
    </div>
  );
}
