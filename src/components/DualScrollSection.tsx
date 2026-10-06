import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { LOOKBOOK_PANELS, LookbookPanel } from '../data/drops';
import { playTactileClick } from '../utils/audio';

interface DualScrollSectionProps {
  onSelectProduct?: (productId: string) => void;
}

export const DualScrollSection: React.FC<DualScrollSectionProps> = ({ onSelectProduct }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Update progress on scroll
  const handleScroll = () => {
    if (!scrollTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollTrackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = scrollLeft / maxScroll;
      setScrollProgress(progress);
      const index = Math.min(
        LOOKBOOK_PANELS.length - 1,
        Math.round((scrollLeft / maxScroll) * (LOOKBOOK_PANELS.length - 1))
      );
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;
    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSlide = (index: number) => {
    if (!scrollTrackRef.current) return;
    playTactileClick();
    const track = scrollTrackRef.current;
    const slideWidth = track.clientWidth * 0.85;
    track.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const handlePrev = () => {
    scrollToSlide(Math.max(0, activeIndex - 1));
  };

  const handleNext = () => {
    scrollToSlide(Math.min(LOOKBOOK_PANELS.length - 1, activeIndex + 1));
  };

  return (
    <section
      id="lookbook"
      ref={containerRef}
      className="relative bg-kuro-off py-16 sm:py-24 border-y border-kuro-divider overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 comic-dots opacity-10 pointer-events-none" />

      {/* TOP HEADER & SECTION ANNOUNCEMENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-kuro-divider pb-6">
          <div>
            <div className="flex items-center space-x-2 text-[10px] tracking-[0.25em] font-mono text-accent-olive uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>DUAL-SCROLL SHOWCASE // HORIZONTAL EXHIBIT</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl tracking-[0.15em] text-white uppercase">
              LOOKBOOK & ARCHIVE BLUEPRINTS
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            {/* Slide Index Counter */}
            <div className="text-xs font-mono tracking-widest text-canvas-cream/60">
              <span className="text-white font-bold text-sm">
                0{activeIndex + 1}
              </span>
              <span className="mx-1 text-kuro-divider">/</span>
              <span>0{LOOKBOOK_PANELS.length}</span>
            </div>

            {/* Nav Arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="w-10 h-10 border border-kuro-divider hover:border-canvas-cream/50 bg-kuro-base disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                title="Previous Lookbook Card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={activeIndex === LOOKBOOK_PANELS.length - 1}
                className="w-10 h-10 border border-kuro-divider hover:border-canvas-cream/50 bg-kuro-base disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                title="Next Lookbook Card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN DUAL-SCROLL WORKBENCH WITH FIXED WATERMARK */}
      <div className="relative flex items-stretch">
        {/* LEFT FIXED/ROTATED BRAND WATERMARK SIDEBAR (CRITICAL REQUIREMENT) */}
        <div className="hidden lg:flex w-24 flex-shrink-0 items-center justify-center border-r border-kuro-divider bg-kuro-base select-none z-10 py-12">
          <div className="transform -rotate-90 origin-center whitespace-nowrap text-canvas-cream/25 font-display tracking-[0.45em] text-4xl uppercase hover:text-canvas-cream/50 transition-colors flex items-center space-x-6">
            <span>F E N R &nbsp; S T U D I O S &nbsp; // &nbsp; 2 0 2 6</span>
          </div>
        </div>

        {/* HORIZONTAL SCROLL TRACK */}
        <div
          ref={scrollTrackRef}
          className="horizontal-scroll-container flex-1 flex gap-6 sm:gap-8 px-4 sm:px-8 py-4 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: 'smooth' }}
        >
          {LOOKBOOK_PANELS.map((panel: LookbookPanel, idx: number) => (
            <div
              key={panel.id}
              className={`horizontal-panel flex-shrink-0 w-[85vw] sm:w-[540px] md:w-[620px] bg-kuro-base border border-kuro-divider hover:border-canvas-cream/40 transition-all duration-300 flex flex-col group relative overflow-hidden ${
                activeIndex === idx ? 'ring-1 ring-canvas-cream/30' : 'opacity-85 hover:opacity-100'
              }`}
            >
              {/* Card Header Tag */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-kuro-divider bg-kuro-charcoal/40 text-[10px] font-mono tracking-widest text-canvas-cream/70 uppercase">
                <span className="flex items-center space-x-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: panel.accent }}
                  />
                  <span>{panel.tag}</span>
                </span>
                <span className="text-canvas-cream/40 font-mono">
                  [EXHIBIT 0{idx + 1}]
                </span>
              </div>

              {/* Large Imagery with Subtle Scale on Hover */}
              <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-kuro-gray">
                <img
                  src={panel.image}
                  alt={panel.title}
                  className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kuro-base via-transparent to-transparent opacity-80" />

                {/* Subtle Comic Stamp Overlay */}
                <div className="absolute bottom-4 left-4">
                  <span
                    className="px-2.5 py-1 text-[10px] font-display uppercase tracking-widest text-white border"
                    style={{
                      borderColor: panel.accent,
                      backgroundColor: 'rgba(10, 10, 10, 0.75)',
                    }}
                  >
                    ARCHIVE RECORD
                  </span>
                </div>
              </div>

              {/* Content Information */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl tracking-[0.12em] text-white uppercase mb-2">
                    {panel.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-canvas-offwhite/80 leading-relaxed font-body mb-6">
                    {panel.subtitle}
                  </p>

                  {/* Bullet details */}
                  <div className="space-y-1.5 border-t border-kuro-divider pt-4 mb-6">
                    {panel.details.map((detail, dIdx) => (
                      <div
                        key={dIdx}
                        className="text-[11px] font-mono text-canvas-cream/60 flex items-center space-x-2"
                      >
                        <span className="text-accent-olive">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA */}
                {panel.productId && onSelectProduct ? (
                  <button
                    onClick={() => {
                      playTactileClick();
                      onSelectProduct(panel.productId!);
                    }}
                    className="w-full py-3 bg-kuro-charcoal hover:bg-canvas-cream hover:text-kuro-base text-white text-xs font-heading tracking-[0.2em] uppercase font-bold transition-all border border-kuro-divider flex items-center justify-center space-x-2"
                  >
                    <span>{panel.ctaLabel || 'INSPECT SPECIMEN'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="text-[10px] font-mono text-canvas-cream/40 uppercase tracking-widest text-center py-2 border-t border-kuro-divider">
                    FENR ATELIER // ARCHIVAL EDITION
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HORIZONTAL PROGRESS BAR & DOTS (CRITICAL REQUIREMENT) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Progress bar line */}
          <div className="w-full sm:w-80 h-[2px] bg-kuro-gray overflow-hidden relative">
            <div
              className="h-full bg-canvas-cream transition-all duration-150 ease-out"
              style={{
                width: `${Math.max(15, (activeIndex + 1) * (100 / LOOKBOOK_PANELS.length))}%`,
              }}
            />
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-3">
            {LOOKBOOK_PANELS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSlide(idx)}
                className={`transition-all duration-300 ${
                  activeIndex === idx
                    ? 'w-8 h-1.5 bg-canvas-cream'
                    : 'w-2 h-1.5 bg-kuro-divider hover:bg-canvas-cream/40'
                }`}
                title={`Jump to exhibit 0${idx + 1}`}
              />
            ))}
          </div>

          <div className="text-[10px] font-mono tracking-widest text-canvas-cream/40 uppercase">
            SWIPE OR DRAG HORIZONTALLY ← →
          </div>
        </div>
      </div>
    </section>
  );
};
