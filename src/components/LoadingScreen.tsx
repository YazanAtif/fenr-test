import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFading(true);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(onComplete, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-kuro-base transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center">
        {/* FENR Brand Logo */}
        <div className="mb-6 flex items-center justify-center">
          <BrandLogo variant="white" className="h-14 sm:h-16 w-auto" alt="FENR" />
        </div>
        <p className="text-[10px] tracking-[0.3em] text-canvas-cream/60 uppercase mb-8 font-mono">
          EST. 2026
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-48 h-[1px] bg-kuro-gray overflow-hidden relative mb-4">
          <div
            className="h-full bg-canvas-cream transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-48 text-[9px] font-mono tracking-widest text-canvas-cream/40">
          <span>INITIALIZING</span>
          <span>{progress}%</span>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="mt-8 text-[10px] uppercase tracking-widest text-canvas-cream/40 hover:text-white transition-colors underline decoration-canvas-cream/20 underline-offset-4"
        >
          SKIP [ESC]
        </button>
      </div>
    </div>
  );
};
