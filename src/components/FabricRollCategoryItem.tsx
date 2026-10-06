import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { playFabricRollSound, playThreadStitchSound, playTactileClick } from '../utils/audio';
import { Scissors, ArrowUpRight } from 'lucide-react';

export interface SubCategoryItem {
  label: string;
  badge?: string;
  inchMark: string;
}

export interface FabricCategoryConfig {
  id: string;
  name: string;
  japaneseLabel: string;
  dyeColor: string;
  dyeLightColor: string;
  fabricSpecs: string;
  subItems: SubCategoryItem[];
}

interface FabricRollCategoryItemProps {
  category: FabricCategoryConfig;
  isActive: boolean;
  onSelectCategory: (categoryId: string, subItemLabel?: string) => void;
  isCompactSpool?: boolean;
}

export const FabricRollCategoryItem: React.FC<FabricRollCategoryItemProps> = ({
  category,
  isActive,
  onSelectCategory,
  isCompactSpool = false,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    playFabricRollSound();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsHovered(false);
    }, 140);
  };

  const handleClick = (subLabel?: string) => {
    playThreadStitchSound();
    playTactileClick();
    onSelectCategory(category.id, subLabel);
    setIsHovered(false);
  };

  // Dye color resolution
  const activeDye = isLight ? category.dyeLightColor : category.dyeColor;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center py-2 group select-none"
      style={{ perspective: '900px' }}
    >
      {/* PRIMARY CATEGORY BUTTON: Fabric Cylindrical Axis */}
      <button
        onClick={() => handleClick()}
        className="relative flex flex-col items-center justify-center px-2 py-1 outline-none focus:outline-none transition-all duration-300"
        aria-expanded={isHovered}
        aria-label={`${category.name} Fabric Category`}
      >
        {/* Cylindrical Spool Container */}
        <div
          className="relative flex items-center overflow-hidden py-1 transition-transform duration-300 ease-out will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: isHovered
              ? 'rotateX(0deg) scaleY(1) translateY(0px)'
              : 'rotateX(28deg) scaleY(0.92) translateY(-1px)',
          }}
        >
          {/* Subtle Fabric Bolt Cylindrical Highlight Sheen Overlay */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              background: isLight
                ? 'linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 40%, rgba(0,0,0,0.08) 100%)'
                : 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.25) 100%)',
            }}
          />

          {/* Letter-by-Letter Staggered Fabric Roll Reveal */}
          <span
            className={`inline-flex items-center text-xs tracking-[0.18em] uppercase transition-all duration-300 ${
              isHovered
                ? 'font-extrabold tracking-[0.24em] skew-y-0'
                : 'font-medium tracking-[0.14em] -skew-y-[1deg]'
            }`}
            style={{
              color: isHovered || isActive ? activeDye : undefined,
            }}
          >
            {category.name.split('').map((char, idx) => {
              if (char === ' ') {
                return <span key={idx} className="w-1.5" />;
              }

              // Cascading Stagger Delay for Fabric Droop Effect
              const staggerDelay = `${idx * 28}ms`;

              return (
                <span
                  key={idx}
                  className="inline-block transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.2)] will-change-transform"
                  style={{
                    transitionDelay: staggerDelay,
                    transform: isHovered
                      ? 'scaleY(1.05) translateY(0px) rotateX(0deg)'
                      : 'scaleY(0.88) translateY(-2px) rotateX(42deg)',
                    transformOrigin: 'top center',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        </div>

        {/* ACTIVE STATE: Running Thread-Stitch Needle Embroidery Underline */}
        {isActive && (
          <div className="absolute -bottom-0.5 left-0 right-0 h-[3px] flex items-center justify-center overflow-visible pointer-events-none">
            <svg
              className="w-full h-[3px] overflow-visible"
              viewBox="0 0 100 3"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="1.5"
                x2="100"
                y2="1.5"
                stroke={activeDye}
                strokeWidth="2"
                className="animate-thread-stitch"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </button>

      {/* SUB-MENU: Measuring Tape Extension with Elastic Overshoot Easing */}
      {isHovered && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 sm:w-72 pt-2 z-50 animate-tape-unfurl"
          style={{ transformOrigin: 'top center' }}
        >
          {/* Textile Card Shell with Woven Pattern */}
          <div
            className={`relative p-3.5 border shadow-2xl backdrop-blur-xl transition-colors duration-300 woven-texture ${
              isLight
                ? 'bg-[#F9F7F2]/95 border-black/15 text-black shadow-black/10'
                : 'bg-kuro-charcoal/95 border-kuro-divider text-canvas-offwhite shadow-black/80'
            }`}
          >
            {/* Measuring Tape Left Edge Ruler (Inches & Metric Ticks) */}
            <div className="absolute left-0 top-0 bottom-0 w-3 measuring-tape-ruler border-r border-current/10 opacity-60" />

            {/* Top Swatch Header */}
            <div className="flex items-center justify-between pl-3 pb-2 mb-2 border-b border-current/10 text-[9px] font-mono uppercase tracking-widest opacity-60">
              <span className="flex items-center space-x-1">
                <Scissors className="w-2.5 h-2.5" />
                <span>SPEC // {category.fabricSpecs}</span>
              </span>
              <span>MEASURING TAPE</span>
            </div>

            {/* Cascading Sub-Items (Staggered Tape Marks) */}
            <div className="pl-3 space-y-1">
              {category.subItems.map((sub, sIdx) => (
                <button
                  key={sIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(sub.label);
                  }}
                  className={`w-full flex items-center justify-between text-left py-1.5 px-2 rounded-none text-[11px] font-mono tracking-wider transition-all duration-200 group/sub ${
                    isLight
                      ? 'hover:bg-black/5 hover:translate-x-1'
                      : 'hover:bg-white/5 hover:translate-x-1'
                  }`}
                  style={{
                    animationDelay: `${sIdx * 45}ms`,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono opacity-40 group-hover/sub:opacity-100 group-hover/sub:text-[#E62846]">
                      {sub.inchMark}
                    </span>
                    <span className="font-heading uppercase group-hover/sub:font-bold transition-all">
                      {sub.label}
                    </span>
                  </div>

                  {sub.badge ? (
                    <span
                      className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none"
                      style={{
                        backgroundColor: `${activeDye}20`,
                        color: activeDye,
                      }}
                    >
                      {sub.badge}
                    </span>
                  ) : (
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>

            {/* Bottom Tailor's Pinked Zig-Zag Fabric Edge */}
            <div className="absolute -bottom-1.5 left-0 right-0 h-1.5 swatch-pinked-edge text-current opacity-40 overflow-hidden pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
};
