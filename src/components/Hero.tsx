import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { ChronoRefractiveHeroCanvas } from './ChronoRefractiveHeroCanvas';
import { useTheme } from '../context/ThemeContext';
import { playTactileClick } from '../utils/audio';

interface HeroProps {
  onExploreClick: () => void;
  onLookbookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onLookbookClick }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-8 sm:pb-12 overflow-hidden transition-colors duration-700 bg-transparent"
    >
      {/* Background Subtle Gradient Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isLight
              ? 'bg-gradient-to-b from-[#F5F1EB]/90 via-transparent to-[#F5F1EB]'
              : 'bg-gradient-to-b from-kuro-base/80 via-transparent to-kuro-base'
          }`}
        />
        <div className="absolute inset-0 halftone-overlay opacity-15 pointer-events-none" />
      </div>

      {/* CENTERPIECE: BRAND WORDMARK & REFINED ACTIONS */}
      <div className="relative z-10 text-center flex flex-col items-center my-auto py-3 sm:py-6 w-full max-w-5xl">
        {/* Couture Chrono-Refractive Hero Animation */}
        <div className="my-1 w-full flex items-center justify-center">
          <ChronoRefractiveHeroCanvas />
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-2 sm:px-0">
          <button
            onClick={() => {
              playTactileClick();
              onExploreClick();
            }}
            className={`w-full sm:w-auto px-8 sm:px-9 py-3.5 font-heading text-xs tracking-[0.25em] uppercase font-bold transition-all transform active:scale-95 sm:hover:-translate-y-0.5 shadow-xl ${
              isLight
                ? 'bg-black hover:bg-neutral-800 text-white'
                : 'bg-canvas-offwhite hover:bg-white text-kuro-base'
            }`}
          >
            EXPLORE COLLECTION
          </button>

          <button
            onClick={() => {
              playTactileClick();
              onLookbookClick();
            }}
            className={`w-full sm:w-auto px-8 sm:px-9 py-3.5 font-heading text-xs tracking-[0.25em] uppercase transition-all active:scale-95 ${
              isLight
                ? 'bg-transparent hover:bg-black/5 border border-black/30 hover:border-black text-black'
                : 'bg-transparent hover:bg-white/5 border border-kuro-divider hover:border-canvas-cream/60 text-canvas-offwhite'
            }`}
          >
            VIEW LOOKBOOK
          </button>
        </div>
      </div>

      {/* BOTTOM SUBTLE LINE */}
      <div className="relative z-10 flex flex-col items-center">
        <button
          onClick={() => {
            playTactileClick();
            onExploreClick();
          }}
          className={`group flex flex-col items-center space-y-2 text-[9px] tracking-[0.35em] font-mono uppercase transition-colors ${
            isLight ? 'text-neutral-600 hover:text-black' : 'text-canvas-cream/40 hover:text-white'
          }`}
        >
          <span>SCROLL</span>
          <span
            className={`w-[1px] h-6 transition-colors ${
              isLight ? 'bg-black/30 group-hover:bg-black' : 'bg-canvas-cream/30 group-hover:bg-white'
            }`}
          />
        </button>
      </div>
    </section>
  );
};
