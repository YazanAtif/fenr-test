import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { playTactileClick } from '../utils/audio';
import confetti from 'canvas-confetti';

export type BrandLogoInteractiveMode = 'hero' | 'nav' | 'subtle' | 'none';

export interface BrandLogoProps {
  className?: string;
  variant?: 'white' | 'dark' | 'auto';
  alt?: string;
  interactive?: BrandLogoInteractiveMode | boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showStatusBadge?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'h-7 w-auto',
  variant = 'auto',
  alt = 'FENR',
  interactive = true,
  onClick,
  showStatusBadge = false,
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize interactive mode
  const mode: BrandLogoInteractiveMode =
    typeof interactive === 'boolean'
      ? interactive
        ? 'hero'
        : 'none'
      : interactive;

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [rippleKey, setRippleKey] = useState<number | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  const logoSrc =
    variant === 'white'
      ? '/images/fenr-logo-white.png'
      : variant === 'dark'
      ? '/images/fenr-logo-dark.png'
      : theme === 'light'
      ? '/images/fenr-logo-dark.png'
      : '/images/fenr-logo-white.png';

  // Config parameters per mode
  const maxTilt = mode === 'hero' ? 22 : mode === 'nav' ? 10 : 6;
  const isInteractive = mode !== 'none';

  // Smooth pointer tracking
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isInteractive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
      const normY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));

      setTilt({
        rx: -normY * maxTilt,
        ry: normX * maxTilt,
      });

      setGlarePos({
        x: Math.round((x / rect.width) * 100),
        y: Math.round((y / rect.height) * 100),
      });
    },
    [isInteractive, maxTilt]
  );

  const handlePointerEnter = useCallback(() => {
    if (!isInteractive) return;
    setIsHovered(true);
    if (mode === 'hero') {
      playTactileClick();
    }
  }, [isInteractive, mode]);

  const handlePointerLeave = useCallback(() => {
    if (!isInteractive) return;
    setIsHovered(false);
    setIsPressed(false);
    setTilt({ rx: 0, ry: 0 });
    setGlarePos({ x: 50, y: 50 });
  }, [isInteractive]);

  // Click & tactile shockwave reaction
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isInteractive) return;

      playTactileClick();
      setIsPressed(true);
      setIsGlitching(true);
      setRippleKey(Date.now());
      setInteractionCount((prev) => prev + 1);

      if (mode === 'hero') {
        const phrases = [
          'ARCHIVE // SYNCHRONIZED',
          'ATELIER // MODE ACTIVE',
          'RESONANCE // 100%',
          'FENR // PROTOCOL 001',
        ];
        const randomPhrase = phrases[interactionCount % phrases.length];
        setFeedbackText(randomPhrase);
        setTimeout(() => setFeedbackText(null), 1800);

        // Subtle luxury spark stardust
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const originX = (rect.left + rect.width / 2) / window.innerWidth;
          const originY = (rect.top + rect.height / 2) / window.innerHeight;

          confetti({
            particleCount: 28,
            spread: 55,
            startVelocity: 20,
            origin: { x: originX, y: originY },
            colors: ['#FFFFFF', '#D9D0C1', '#A67C52', '#8A7090', '#2E2E2E'],
            ticks: 65,
            gravity: 1.1,
            scalar: 0.65,
            shapes: ['circle', 'square'],
            disableForReducedMotion: true,
          });
        }
      }

      setTimeout(() => setIsPressed(false), 160);
      setTimeout(() => setIsGlitching(false), 360);

      if (onClick) {
        onClick(e);
      }
    },
    [isInteractive, mode, interactionCount, onClick]
  );

  // Keyboard accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    },
    [handleClick]
  );

  // If not interactive, render standard clean logo
  if (!isInteractive) {
    return (
      <img
        src={logoSrc}
        alt={alt}
        className={`object-contain transition-opacity duration-300 ${className}`}
        loading="eager"
      />
    );
  }

  // Dynamic shadow calculation
  const shadowX = -tilt.ry * (mode === 'hero' ? 1.6 : 0.8);
  const shadowY = tilt.rx * (mode === 'hero' ? 1.6 : 0.8) + (mode === 'hero' ? 20 : 6);
  const shadowBlur = mode === 'hero' ? 36 : 14;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      data-clickable="true"
      aria-label={`${alt} Interactive Logo`}
      className="relative select-none outline-none group cursor-pointer inline-flex flex-col items-center justify-center"
      style={{
        perspective: mode === 'hero' ? '1200px' : '800px',
      }}
    >
      {/* 3D Animated Transform Shell */}
      <div
        className="relative transition-transform ease-out will-change-transform flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(${
            isPressed ? 0.94 : isHovered ? 1.04 : 1
          }, ${isPressed ? 0.94 : isHovered ? 1.04 : 1}, 1)`,
          transitionDuration: isPressed ? '100ms' : isHovered ? '80ms' : '600ms',
        }}
      >
        {/* Base Logo Image with Dynamic Drop Shadow */}
        <img
          src={logoSrc}
          alt={alt}
          className={`object-contain select-none pointer-events-none transition-all duration-300 ${className}`}
          style={{
            filter: `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.92)) ${
              isHovered
                ? 'drop-shadow(0 0 25px rgba(217, 208, 193, 0.25)) brightness(1.06)'
                : 'brightness(1)'
            }`,
          }}
          loading="eager"
        />

        {/* Dynamic Specular Chrome / Hologram Sheen (Masked strictly to logo silhouette) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
          style={{
            WebkitMaskImage: `url(${logoSrc})`,
            maskImage: `url(${logoSrc})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 220px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.95) 0%, rgba(217, 208, 193, 0.45) 30%, transparent 70%)`,
          }}
        />

        {/* Ambient Subtle Diagonal Reflection Beam on Hover */}
        {isHovered && mode === 'hero' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay animate-pulse"
            style={{
              WebkitMaskImage: `url(${logoSrc})`,
              maskImage: `url(${logoSrc})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              background: `linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.8) 50%, transparent 80%)`,
            }}
          />
        )}

        {/* Cyberpunk / Editorial Glitch RGB Channel Split (On Click) */}
        {isGlitching && (
          <>
            {/* Red Shift */}
            <img
              src={logoSrc}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 object-contain pointer-events-none mix-blend-screen opacity-75 ${className}`}
              style={{
                transform: 'translate(-3px, -1px) scale(1.02)',
                filter: 'drop-shadow(-2px 0 #ff0055) hue-rotate(320deg)',
                clipPath: 'polygon(0 0, 100% 0, 100% 48%, 0 48%)',
              }}
            />
            {/* Cyan Shift */}
            <img
              src={logoSrc}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 object-contain pointer-events-none mix-blend-screen opacity-75 ${className}`}
              style={{
                transform: 'translate(3px, 1px) scale(1.02)',
                filter: 'drop-shadow(2px 0 #00ffff) hue-rotate(180deg)',
                clipPath: 'polygon(0 52%, 100% 52%, 100% 100%, 0 100%)',
              }}
            />
          </>
        )}

        {/* Shockwave Expanding Ring on Click */}
        {rippleKey && (
          <span
            key={rippleKey}
            className="absolute rounded-full pointer-events-none border border-canvas-cream/60 animate-ping opacity-60"
            style={{
              width: '100%',
              height: '100%',
              animationDuration: '600ms',
              animationIterationCount: '1',
            }}
          />
        )}
      </div>

      {/* Hero Feedback / Mode Tag */}
      {(showStatusBadge || feedbackText) && mode === 'hero' && (
        <div
          className={`mt-3 text-[10px] tracking-[0.35em] font-mono uppercase transition-all duration-300 ${
            feedbackText
              ? 'opacity-100 text-canvas-cream scale-100'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <span className="px-2.5 py-0.5 border border-kuro-divider bg-kuro-charcoal/80 text-canvas-cream backdrop-blur-md">
            {feedbackText || 'FENR // ARCHIVE'}
          </span>
        </div>
      )}
    </div>
  );
};
