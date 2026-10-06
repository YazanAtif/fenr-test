import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Clock,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Palette,
  Layers,
} from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { Article } from '../types';
import { ArticleModal } from './ArticleModal';
import { playTactileClick } from '../utils/audio';

interface ArticlesSectionProps {
  onSelectProduct?: (productId: string) => void;
}

// Procedural halftone comic art palettes matching Skiper 52 & FENR brutalist aesthetic
const COMIC_PALETTES = [
  ['#D97706', '#261C14', '#0D0E11'], // Amber Monolith (MJ-23)
  ['#DC2626', '#271717', '#0D0E11'], // Carmine Halftone (Spidey)
  ['#84CC16', '#1A2315', '#0D0E11'], // Golden Terry / Olive (SBR)
  ['#64748B', '#171B24', '#0D0E11'], // Slate Concrete (Weight of Silence)
  ['#0284C7', '#111F2D', '#0D0E11'], // Shinjuku Rain (Tokyo Nocturnal)
  ['#F59E0B', '#272016', '#0D0E11'], // Vintage Newsprint (Ben-Day Dots)
];

function generateComicHalftoneArt(palette: string[], index: number): string {
  const [primary, secondary, dark] = palette;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="artGrad${index}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.85"/>
        <stop offset="55%" stop-color="${secondary}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </linearGradient>
      <pattern id="halftoneDots${index}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="8" r="3" fill="${primary}" opacity="0.3"/>
      </pattern>
    </defs>
    <rect width="400" height="600" fill="url(#artGrad${index})"/>
    <rect width="400" height="600" fill="url(#halftoneDots${index})"/>
    <circle cx="${110 + (index * 53) % 180}" cy="${155 + index * 18}" r="${55 + index * 4}" fill="${primary}" opacity="0.9"/>
    <path d="M0 420 Q100 ${330 + index * 10} 200 400 T400 ${360 + index * 8} V600 H0Z" fill="${dark}" opacity="0.6"/>
    <path d="M0 480 Q120 ${420 - index * 6} 240 470 T400 440 V600 H0Z" fill="${dark}"/>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Precompute halftone comic art SVGs once
const PRECOMPUTED_HALFTONE_ARTS: string[] = COMIC_PALETTES.map((palette, idx) =>
  generateComicHalftoneArt(palette, idx)
);

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ onSelectProduct }) => {
  const [activeArticleId, setActiveArticleId] = useState<string>(ARTICLES[0]?.id || 'issue-mj-01');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [galleryMode, setGalleryMode] = useState<'curated' | 'halftone'>('curated');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hoverRafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = ARTICLES.findIndex((a) => a.id === activeArticleId);
  const activeArticle = ARTICLES[activeIndex] || ARTICLES[0];

  // Auto Tour playback logic (transitions every 3.5s)
  const nextSlide = useCallback(() => {
    setActiveArticleId((prevId) => {
      const curIdx = ARTICLES.findIndex((a) => a.id === prevId);
      const nextIdx = (curIdx + 1) % ARTICLES.length;
      return ARTICLES[nextIdx].id;
    });
  }, []);

  const prevSlide = useCallback(() => {
    setActiveArticleId((prevId) => {
      const curIdx = ARTICLES.findIndex((a) => a.id === prevId);
      const prevIdx = (curIdx - 1 + ARTICLES.length) % ARTICLES.length;
      return ARTICLES[prevIdx].id;
    });
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        nextSlide();
      }, 3500);
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, nextSlide]);

  // Keyboard navigation across the cards (ArrowLeft / ArrowRight / Enter / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedArticle) return; // Modal open
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        playTactileClick();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        playTactileClick();
        prevSlide();
      } else if ((e.key === 'Enter' || e.key === ' ') && !selectedArticle) {
        if (document.activeElement?.classList.contains('expand-gallery-item')) {
          e.preventDefault();
          playTactileClick();
          setSelectedArticle(activeArticle);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, selectedArticle, activeArticle]);

  // Buttery smooth hover activation via RAF with zero audio stall
  const handleCardHover = (articleId: string) => {
    if (activeArticleId !== articleId) {
      if (hoverRafRef.current) cancelAnimationFrame(hoverRafRef.current);
      hoverRafRef.current = requestAnimationFrame(() => {
        setActiveArticleId(articleId);
      });
    }
  };

  const handleCardClick = (article: Article) => {
    playTactileClick();
    if (activeArticleId === article.id) {
      setSelectedArticle(article);
    } else {
      setActiveArticleId(article.id);
    }
  };

  const toggleAutoTour = () => {
    playTactileClick();
    setIsAutoPlaying((prev) => !prev);
  };

  return (
    <section id="articles" className="py-16 md:py-24 bg-kuro-off relative border-b border-kuro-divider overflow-hidden select-none">
      {/* Background Vintage Halftone Dot Texture */}
      <div className="absolute inset-0 halftone-overlay opacity-15 pointer-events-none" />

      <div className="max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header & Interactive Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6 border-b-2 border-kuro-base pb-6">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.3em] text-accent-amber uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPAND-ON-HOVER GALLERY // RETAIL ARCHIVE</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl tracking-[0.15em] text-white uppercase">
              MAGAZINE & STREET ARTICLES
            </h2>
            <p className="text-xs sm:text-sm font-mono text-canvas-cream/60 mt-1 max-w-xl">
              Hover or tap any card to expand details. Press <kbd className="px-1.5 py-0.5 bg-kuro-base border border-kuro-divider rounded text-[10px] text-white">←</kbd> <kbd className="px-1.5 py-0.5 bg-kuro-base border border-kuro-divider rounded text-[10px] text-white">→</kbd> to cycle through garments.
            </p>
          </div>

          {/* Interactive Controls Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Visuals vs Halftone Mode Toggle */}
            <div className="inline-flex p-1 rounded-full bg-kuro-base border border-kuro-divider text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setGalleryMode('curated');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  galleryMode === 'curated'
                    ? 'bg-accent-amber text-kuro-base font-bold shadow-md'
                    : 'text-canvas-cream/60 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>LOOKBOOK</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setGalleryMode('halftone');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  galleryMode === 'halftone'
                    ? 'bg-accent-amber text-kuro-base font-bold shadow-md'
                    : 'text-canvas-cream/60 hover:text-white'
                }`}
              >
                <Palette className="w-3 h-3" />
                <span>HALFTONE ART</span>
              </button>
            </div>

            {/* Auto Tour Toggle */}
            <button
              type="button"
              onClick={toggleAutoTour}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-medium transition-colors ${
                isAutoPlaying
                  ? 'bg-accent-amber text-kuro-base border-accent-amber font-bold shadow-md'
                  : 'bg-kuro-base border-kuro-divider text-canvas-cream/70 hover:text-white hover:border-white/30'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isAutoPlaying ? 'PAUSE TOUR' : 'AUTO TOUR'}</span>
            </button>

            {/* Navigation Arrows */}
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous article"
                onClick={() => {
                  playTactileClick();
                  prevSlide();
                }}
                className="p-2 rounded-full bg-kuro-base border border-kuro-divider text-canvas-cream/70 hover:text-white hover:border-white/40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next article"
                onClick={() => {
                  playTactileClick();
                  nextSlide();
                }}
                className="p-2 rounded-full bg-kuro-base border border-kuro-divider text-canvas-cream/70 hover:text-white hover:border-white/40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Physical Metallic Rack Rod & Hanging Hooks */}
        <div className="w-full relative mb-3 px-3 hidden sm:block">
          {/* Polished Gunmetal Pipe */}
          <div className="h-2.5 w-full rounded-full bg-gradient-to-b from-[#3E4246] via-[#222426] to-[#0A0A0A] shadow-md border border-[#484D52]/40 relative overflow-hidden">
            <div className="absolute top-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>
        </div>

        {/* THE EXPAND-ON-HOVER GALLERY ROW */}
        <div className="expand-gallery-wrap" ref={containerRef}>
          <div className="expand-gallery-row" role="tablist" aria-label="Interactive Expand-On-Hover Article Gallery">
            {ARTICLES.map((article, idx) => {
              const isActive = article.id === activeArticleId;
              const halftoneFallback = PRECOMPUTED_HALFTONE_ARTS[idx % PRECOMPUTED_HALFTONE_ARTS.length];
              const imgSrc = galleryMode === 'halftone'
                ? halftoneFallback
                : article.coverImage;

              return (
                <div
                  key={article.id}
                  role="tab"
                  tabIndex={0}
                  aria-selected={isActive}
                  aria-label={`${article.title} - ${article.category}`}
                  onMouseEnter={() => handleCardHover(article.id)}
                  onClick={() => handleCardClick(article)}
                  className={`expand-gallery-item ${isActive ? 'active' : ''}`}
                >
                  {/* Background Artwork / Image */}
                  <img
                    src={imgSrc}
                    alt={article.title}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to procedural halftone SVG if local image fails
                      e.currentTarget.src = halftoneFallback;
                    }}
                  />

                  {/* Gradient Shading Overlay */}
                  <div className="expand-gallery-shade" />

                  {/* Compact Inactive Vertical Teaser Tag */}
                  <div className="expand-gallery-inactive-tag">
                    <span className="num">0{idx + 1}</span>
                    <span className="vert-text">{article.badge || article.issue.split('//')[1]?.trim() || `ISSUE // 0${idx + 1}`}</span>
                  </div>

                  {/* Expanded Active Content Card */}
                  <div className="expand-gallery-active-content">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-black/85 border border-accent-amber/40 text-[10px] font-mono tracking-wider text-accent-amber font-bold uppercase">
                          {article.badge || article.category}
                        </span>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-mono text-white/70 uppercase">
                          {article.issue.split('//')[1]?.trim() || article.issue}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-black/75 border border-white/10 text-[10px] font-mono text-canvas-cream/80 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accent-amber" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>

                    {/* Bottom Metadata & CTA */}
                    <div className="flex flex-col gap-2 pt-4">
                      <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-accent-amber/90 font-bold">
                        {article.issue}
                      </p>

                      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-white tracking-wide uppercase line-clamp-2 leading-[0.92]">
                        {article.title}
                      </h3>

                      <p className="font-body text-xs sm:text-sm text-canvas-offwhite/85 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between gap-3 pt-3 mt-1 border-t border-white/15">
                        <span className="text-[11px] font-mono text-canvas-cream/60 hidden sm:inline-block">
                          {article.date} • {article.author}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playTactileClick();
                            setSelectedArticle(article);
                          }}
                          className="px-4 py-2 rounded-full bg-white hover:bg-accent-amber text-kuro-base font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all hover:scale-105 active:scale-95 group/btn ml-auto"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-kuro-base" />
                          <span>READ FULL ARTICLE</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top Hanger Notch on the Card */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-b transition-colors duration-300 pointer-events-none ${
                    isActive ? 'bg-accent-amber shadow-[0_0_8px_#E5A84B]' : 'bg-white/20'
                  }`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Interactive Status Bar */}
        <div className="w-full mt-4 px-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-canvas-cream/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
            <span className="text-white font-semibold uppercase">
              ACTIVE ISSUE: 0{activeIndex + 1} // {activeArticle.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block">
              [←] [→] Keyboard Navigation Active
            </span>
            <button
              onClick={() => {
                if (activeArticle) {
                  playTactileClick();
                  setSelectedArticle(activeArticle);
                }
              }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-amber/15 border border-accent-amber/40 text-accent-amber font-mono font-bold text-xs tracking-wide hover:bg-accent-amber hover:text-kuro-base transition-all group"
            >
              <span>OPEN ARTICLE DOSSIER</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* Full Dossier Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={selectedArticle !== null}
        onClose={() => setSelectedArticle(null)}
        onSelectProduct={onSelectProduct}
      />
    </section>
  );
};
