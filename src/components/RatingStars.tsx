import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { api } from '../api';

interface RatingStarsProps {
  id: string;
  initialRating?: string;
  onRated?: (newRating: string) => void;
}

export function RatingStars({ id, initialRating, onRated }: RatingStarsProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  
  // We check local storage to see if they rated this manga previously
  // We rely on the initialRating from props if valid
  const currentDisplayedRating = hoverRating || rating || parseFloat(initialRating || "0");

  const handleRate = async (value: number) => {
    if (isSubmitting || hasRated) return;
    
    setIsSubmitting(true);
    try {
      const result = await api.rateManga(id, value);
      setRating(value);
      setHasRated(true);
      if (onRated) {
        onRated(result.average);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={isSubmitting || hasRated}
            className={`p-1 transition-all focus:outline-none ${
              hasRated ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
             onMouseEnter={() => !hasRated && setHoverRating(star)}
             onMouseLeave={() => !hasRated && setHoverRating(0)}
             onClick={() => handleRate(star)}
          >
            <Star 
              className={`h-5 w-5 ${
                star <= currentDisplayedRating 
                  ? 'fill-orange-500 text-orange-500' 
                  : 'fill-transparent text-zinc-600'
              } transition-colors`} 
            />
          </button>
        ))}
      </div>
      <div className="flex flex-col">
        <span className="text-orange-500 font-black text-sm tracking-tighter">
           {initialRating ? initialRating : '0.0'}
        </span>
        {hasRated && (
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none">Rated</span>
        )}
      </div>
    </div>
  );
}
