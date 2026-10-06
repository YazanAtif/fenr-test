import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const TokyoLightingEffect: React.FC = () => {
  const { lightingState } = useTheme();

  if (lightingState === 'idle') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9995] overflow-hidden">
      {/* Tokyo Lights Turning On (Ignition Flash & Streetlight Warm Bloom) */}
      {lightingState === 'igniting' && (
        <>
          {/* Micro electrical pre-strike flicker */}
          <div className="absolute inset-0 bg-amber-100/30 mix-blend-screen animate-tokyo-flicker" />

          {/* Warm Sun/Streetlamp Bloom Expanding from Top */}
          <div
            className="absolute inset-0 animate-tokyo-bloom"
            style={{
              background:
                'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255, 225, 180, 0.65) 0%, rgba(255, 180, 100, 0.25) 45%, transparent 75%)',
            }}
          />

          {/* Ambient Fluorescent Flash */}
          <div className="absolute inset-0 bg-white/40 mix-blend-overlay animate-tokyo-flash" />
        </>
      )}

      {/* Tokyo Lights Dimming (Nocturnal Power-down & Lingering Neon Dusk Afterglow) */}
      {lightingState === 'dimming' && (
        <>
          {/* Deepening Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 animate-tokyo-dim" />

          {/* Lingering Neon Horizon Glow (fades into darkness) */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 animate-tokyo-afterglow"
            style={{
              background:
                'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(255, 90, 95, 0.25) 0%, rgba(138, 112, 144, 0.15) 40%, transparent 80%)',
            }}
          />
        </>
      )}
    </div>
  );
};
