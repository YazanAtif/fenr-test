import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { playTactileClick, playDetonationSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Zap, Flame, RefreshCw } from 'lucide-react';

export type LogoParticleMode = 'titanium' | 'glitch' | 'embers';

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  baseAlpha: number;
  alpha: number;
  friction: number;
  spring: number;
  channel?: 'red' | 'cyan' | 'brand-red' | 'white';
  isRedX?: boolean;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const InteractiveFenrCanvas: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<LogoParticleMode>('titanium');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);

  // References to keep 60fps animation loop free of state re-renders
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isHovering: false, isDown: false });
  const animFrameIdRef = useRef<number | null>(null);
  const modeRef = useRef<LogoParticleMode>('titanium');
  const themeRef = useRef(theme);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Color generator based on mode & theme (Tokyo Lights Daylight vs Kuro Night)
  const getParticleColor = useCallback((channel?: 'red' | 'cyan' | 'brand-red' | 'white', isRedX?: boolean) => {
    if (isRedX || channel === 'brand-red') {
      return '#E62846'; // Iconic FENR Crimson Red X
    }
    const curMode = modeRef.current;
    const isLight = themeRef.current === 'light';

    if (curMode === 'titanium') {
      const colors = isLight
        ? ['#111111', '#1A1816', '#25221E', '#322E29', '#0F0E0D']
        : ['#FFFFFF', '#F0EDE8', '#E6E1D8', '#D9D0C1', '#CCCCCC'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    if (curMode === 'glitch') {
      if (channel === 'red') return '#FF0055';
      if (channel === 'cyan') return isLight ? '#0077EE' : '#00F0FF';
      return isLight ? '#111111' : '#FFFFFF';
    }
    if (curMode === 'embers') {
      const colors = isLight
        ? ['#D97706', '#EA580C', '#C2410C', '#B45309', '#1A1816']
        : ['#FFA336', '#FF6B35', '#A67C52', '#F0EDE8', '#D9D0C1', '#E85D04'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    return isLight ? '#111111' : '#FFFFFF';
  }, []);

  // Reactive Tokyo Lights Ignition/Dimming response on theme change
  useEffect(() => {
    themeRef.current = theme;
    // When Tokyo lights ignite or dim, disperse and energize particles
    particlesRef.current.forEach((p) => {
      p.color = getParticleColor(p.channel, p.isRedX);
      p.vx += (Math.random() - 0.5) * 16;
      p.vy += (Math.random() - 0.5) * 16;
      p.alpha = 1;
    });
  }, [theme, getParticleColor]);

  // Initialize and sample particles from logo PNG image with generous effect margins
  useEffect(() => {
    let isCancelled = false;

    const img = new Image();
    img.src = '/images/fenr-logo-white.png';
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (isCancelled) return;

      const canvasWidth = 760;
      const canvasHeight = 220;
      const logoWidth = 660;
      const logoHeight = Math.round((logoWidth * img.height) / img.width);
      const offsetX = Math.round((canvasWidth - logoWidth) / 2); // 50px breathing room on both sides
      const offsetY = Math.round((canvasHeight - logoHeight) / 2);

      // Offscreen canvas for pixel sampling
      const sampleCanvas = document.createElement('canvas');
      const sampleCtx = sampleCanvas.getContext('2d');
      if (!sampleCtx) return;

      sampleCanvas.width = canvasWidth;
      sampleCanvas.height = canvasHeight;
      sampleCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      sampleCtx.drawImage(img, offsetX, offsetY, logoWidth, logoHeight);

      const imgData = sampleCtx.getImageData(0, 0, canvasWidth, canvasHeight);
      const data = imgData.data;

      const newParticles: Particle[] = [];
      const step = 3; // Fine precision sampling for dense, sharp typography

      for (let y = 0; y < canvasHeight; y += step) {
        for (let x = 0; x < canvasWidth; x += step) {
          const index = (y * canvasWidth + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const alpha = data[index + 3];

          // Sample pixels where letters and red X exist
          if (alpha > 120) {
            const isRedX = (r > 175 && g < 110 && b < 130);
            let channel: 'red' | 'cyan' | 'brand-red' | 'white' = 'white';

            if (isRedX) {
              channel = 'brand-red';
            } else {
              // Chromatic glitch dispersion across ALL letters
              const rand = Math.random();
              if (rand < 0.22) {
                channel = 'red';
              } else if (rand < 0.44) {
                channel = 'cyan';
              }
            }

            const initialX = x + (Math.random() - 0.5) * 5;
            const initialY = y + (Math.random() - 0.5) * 5;

            newParticles.push({
              originX: x,
              originY: y,
              x: initialX,
              y: initialY,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              size: isRedX ? 2.5 : Math.random() * 0.9 + 2.2, // 2.2px - 3.1px
              color: getParticleColor(channel, isRedX),
              baseAlpha: isRedX ? 0.96 : Math.random() * 0.25 + 0.75,
              alpha: 0.9,
              friction: 0.89 + Math.random() * 0.04,
              spring: 0.058 + Math.random() * 0.02,
              channel,
              isRedX,
            });
          }
        }
      }

      particlesRef.current = newParticles;
      setIsLoaded(true);
    };

    return () => {
      isCancelled = true;
    };
  }, [getParticleColor]);

  // Update particle colors when mode changes
  useEffect(() => {
    particlesRef.current.forEach((p) => {
      p.color = getParticleColor(p.channel, p.isRedX);
      // Small burst of energy when switching mode
      p.vx += (Math.random() - 0.5) * 6;
      p.vy += (Math.random() - 0.5) * 6;
    });
  }, [mode, getParticleColor]);

  // Main 60FPS physics and render animation loop
  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasWidth = 760;
    const canvasHeight = 220;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    let lastTime = performance.now();

    const render = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const mouse = mouseRef.current;
      const currentMode = modeRef.current;
      const particles = particlesRef.current;
      const shockwaves = shockwavesRef.current;

      const interactionRadius = mouse.isDown ? 140 : 100;
      const interactionPower = mouse.isDown ? 16 : 9;

      // Update & Draw Shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 7;
        sw.alpha *= 0.92;

        if (sw.radius > sw.maxRadius || sw.alpha < 0.02) {
          shockwaves.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // Physics loop for particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Mouse Repulsion & Liquid Swirl Force
        if (mouse.isHovering) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactionRadius && dist > 0.01) {
            const force = (1 - dist / interactionRadius) * interactionPower;
            const normX = dx / dist;
            const normY = dy / dist;

            // Radial repulsion
            p.vx += normX * force;
            p.vy += normY * force;

            // Liquid vortex / ferrofluid swirl tangential push
            const swirlPower = currentMode === 'embers' ? 3.5 : 2.5;
            p.vx += -normY * force * 0.4 * swirlPower;
            p.vy += normX * force * 0.4 * swirlPower;

            // Energize particle brightness
            p.alpha = Math.min(1, p.alpha + 0.2);
          }
        }

        // 2. Glitch Mode Random Digital Jitter
        if (currentMode === 'glitch' && Math.random() < 0.015) {
          p.vx += (Math.random() - 0.5) * 8;
        }

        // 3. Embers Mode Organic Upward Drift
        if (currentMode === 'embers') {
          p.vy -= 0.06; // slight warm convection
        }

        // 4. Elastic Spring Force toward Letter Origin
        const homeDx = p.originX - p.x;
        const homeDy = p.originY - p.y;
        p.vx += homeDx * p.spring;
        p.vy += homeDy * p.spring;

        // 5. Velocity Drag / Friction
        p.vx *= p.friction;
        p.vy *= p.friction;

        // 6. Update position
        p.x += p.vx;
        p.y += p.vy;

        // 7. Alpha decay back to base
        p.alpha += (p.baseAlpha - p.alpha) * 0.05;

        // 8. Render Particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        if (currentMode === 'glitch' && p.channel !== 'white') {
          // Sharp cyber square points
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          // Smooth rounded micro-dots
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isLoaded]);

  // Pointer position helpers
  const getCanvasCoords = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 760 / rect.width;
    const scaleY = 220 / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    mouseRef.current.x = coords.x;
    mouseRef.current.y = coords.y;
    mouseRef.current.isHovering = true;
    if (!isInteracting) setIsInteracting(true);
    if (hintVisible) setHintVisible(false);
  };

  const handlePointerEnter = () => {
    mouseRef.current.isHovering = true;
    playTactileClick();
  };

  const handlePointerLeave = () => {
    mouseRef.current.isHovering = false;
    mouseRef.current.isDown = false;
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
    setIsInteracting(false);
  };

  // Explosive Detonation Shockwave on Click
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    mouseRef.current.isDown = true;
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const clickX = coords.x;
    const clickY = coords.y;

    playDetonationSound();
    playTactileClick();
    setInteractionCount((prev) => prev + 1);
    if (hintVisible) setHintVisible(false);

    // Add visual shockwave ring
    const swColor =
      modeRef.current === 'glitch'
        ? '#00F0FF'
        : modeRef.current === 'embers'
        ? '#FFA336'
        : theme === 'light'
        ? '#121212'
        : '#FFFFFF';

    shockwavesRef.current.push({
      x: clickX,
      y: clickY,
      radius: 5,
      maxRadius: 240,
      alpha: 0.9,
      color: swColor,
    });

    // Detonate nearby particles with explosive radial velocity
    const blastPower = 48;
    particlesRef.current.forEach((p) => {
      const dx = p.x - clickX;
      const dy = p.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clampedDist = Math.max(8, dist);

      if (dist < 280) {
        const force = (1 - dist / 280) * blastPower;
        const normX = dx / clampedDist;
        const normY = dy / clampedDist;

        p.vx += normX * force + (Math.random() - 0.5) * 14;
        p.vy += normY * force + (Math.random() - 0.5) * 14;
        p.alpha = 1;
      }
    });

    // Stardust confetti burst from click point
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      const originX = (e.clientX) / window.innerWidth;
      const originY = (e.clientY) / window.innerHeight;

      const confettiColors =
        mode === 'glitch'
          ? ['#FF0055', '#00F0FF', '#FFFFFF', '#D9D0C1']
          : mode === 'embers'
          ? ['#FFA336', '#FF6B35', '#A67C52', '#F0EDE8']
          : theme === 'light'
          ? ['#121212', '#2E2A26', '#E62846', '#8A7090']
          : ['#FFFFFF', '#F0EDE8', '#E62846', '#A67C52'];

      confetti({
        particleCount: 26,
        spread: 60,
        startVelocity: 18,
        origin: { x: originX, y: originY },
        colors: confettiColors,
        ticks: 60,
        gravity: 1.1,
        scalar: 0.6,
        disableForReducedMotion: true,
      });
    }
  };

  const handlePointerUp = () => {
    mouseRef.current.isDown = false;
  };

  // Switch modes
  const handleModeChange = (newMode: LogoParticleMode) => {
    playTactileClick();
    setMode(newMode);
  };

  // Reassemble pulse
  const handleReassemble = () => {
    playDetonationSound();
    playTactileClick();
    particlesRef.current.forEach((p) => {
      p.vx = (Math.random() - 0.5) * 35;
      p.vy = (Math.random() - 0.5) * 35;
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full max-w-3xl my-2 select-none group"
    >
      {/* Interactive Canvas Stage with Wide Fluid Aspect */}
      <div className="relative w-full aspect-[760/220] flex items-center justify-center cursor-crosshair">
        {/* Subtle Ambient Radial Backlight Glow */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-700 rounded-full blur-3xl opacity-20 ${
            mode === 'glitch'
              ? 'bg-gradient-to-r from-cyan-500/25 via-rose-500/25 to-purple-500/25'
              : mode === 'embers'
              ? 'bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-yellow-500/25'
              : theme === 'light'
              ? 'bg-black/10'
              : 'bg-white/10'
          }`}
        />

        {/* High-Performance Canvas for Particle Physics (Direct Fluid Interactive System) */}
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="relative z-10 w-full h-full block touch-none cursor-grab active:cursor-grabbing"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Futuristic Interactive Control Deck */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 px-2">
        {/* Mode Selector Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-kuro-charcoal/80 border border-kuro-divider backdrop-blur-md rounded-none">
          <button
            onClick={() => handleModeChange('titanium')}
            className={`px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] font-mono uppercase transition-all flex items-center space-x-1 sm:space-x-1.5 ${
              mode === 'titanium'
                ? 'bg-canvas-offwhite text-kuro-base font-bold shadow-md'
                : 'text-canvas-cream/50 hover:text-white hover:bg-white/5'
            }`}
            title="Monochrome Titanium Physics"
          >
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>TITANIUM</span>
          </button>

          <button
            onClick={() => handleModeChange('glitch')}
            className={`px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] font-mono uppercase transition-all flex items-center space-x-1 sm:space-x-1.5 ${
              mode === 'glitch'
                ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                : 'text-canvas-cream/50 hover:text-white hover:bg-white/5'
            }`}
            title="Cyberpunk RGB Channel Glitch"
          >
            <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>GLITCH</span>
          </button>

          <button
            onClick={() => handleModeChange('embers')}
            className={`px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] font-mono uppercase transition-all flex items-center space-x-1 sm:space-x-1.5 ${
              mode === 'embers'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20'
                : 'text-canvas-cream/50 hover:text-white hover:bg-white/5'
            }`}
            title="Solar Amber Embers"
          >
            <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>EMBERS</span>
          </button>
        </div>

        {/* Action Trigger: Detonate / Reassemble */}
        <button
          onClick={handleReassemble}
          className="px-2.5 sm:px-3 py-1.5 border border-kuro-divider hover:border-canvas-cream/60 bg-kuro-charcoal/60 hover:bg-white/10 text-canvas-cream text-[9px] sm:text-[10px] tracking-[0.2em] font-mono uppercase transition-all flex items-center space-x-1 sm:space-x-1.5"
          title="Blast and reform particles"
        >
          <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span>DETONATE</span>
        </button>
      </div>

      {/* Subtle Interaction Hint */}
      <div className="mt-2.5 text-[9px] tracking-[0.35em] font-mono uppercase text-canvas-cream/40 transition-opacity duration-300">
        {hintVisible ? (
          <span className="animate-pulse">
            SWIPE CURSOR TO SWIRL // CLICK TO BLAST
          </span>
        ) : (
          <span>
            FENR DYNAMICS // {interactionCount} PULSES RECORDED
          </span>
        )}
      </div>
    </div>
  );
};
