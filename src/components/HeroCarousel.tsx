import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { MangaItem } from '../api';
import { Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
  items: MangaItem[];
  onSelect: (id: string) => void;
}

export function HeroCarousel({ items, onSelect }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + items.length) % items.length);
  };

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-zinc-900 group shadow-2xl border border-white/5 mb-12">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 cursor-pointer"
          onClick={() => onSelect(currentItem.id)}
        >
           {/* Dark Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent z-10"></div>
           
           <img 
             src={currentItem.image} 
             alt={currentItem.title}
             className="absolute inset-0 w-full h-full object-cover opacity-60 object-top"
           />
           
           <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                 <span className="px-3 py-1 bg-orange-600/20 text-orange-500 border border-orange-500/30 text-[10px] font-black rounded uppercase tracking-widest backdrop-blur-md">
                   Featured
                 </span>
                 {currentItem.rating && (
                   <span className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-black/60 px-3 py-1 rounded backdrop-blur-md">
                     <Star className="w-4 h-4 fill-orange-500" /> {currentItem.rating}
                   </span>
                 )}
              </div>
              <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-2 line-clamp-2 max-w-3xl drop-shadow-lg">
                {currentItem.title}
              </h2>
              {currentItem.genres && currentItem.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 max-w-2xl">
                  {currentItem.genres.slice(0, 4).map(g => (
                    <span key={g} className="text-xs font-bold text-zinc-300 bg-white/10 px-2 py-0.5 rounded backdrop-blur-md">
                      {g}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4">
                 <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-black text-xs font-black uppercase rounded transition-colors shadow-lg shadow-orange-600/20">
                    <Play className="h-4 w-4 fill-black" />
                    Read Now
                 </button>
              </div>
           </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-600 hover:border-orange-500/50"
        onClick={(e) => { e.stopPropagation(); paginate(-1); }}
      >
         <ChevronLeft className="w-6 h-6 ml-1" />
      </button>
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-600 hover:border-orange-500/50"
        onClick={(e) => { e.stopPropagation(); paginate(1); }}
      >
         <ChevronRight className="w-6 h-6 mr-1" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-8 z-30 flex items-center gap-2">
        {items.map((_, i) => (
           <button 
             key={i}
             onClick={(e) => {
               e.stopPropagation();
               setDirection(i > currentIndex ? 1 : -1);
               setCurrentIndex(i);
             }}
             className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-orange-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
           />
        ))}
      </div>
    </div>
  );
}
