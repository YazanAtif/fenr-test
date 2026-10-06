import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  playTactileClick,
  playShutterSnap,
  playPrismRefract,
  playScanlinePulse,
  getSoundEnabled,
  setSoundEnabled,
} from '../utils/audio';
import { Volume2, VolumeX, Eye, Radio, Sparkles, Crosshair } from 'lucide-react';

export type CoutureAestheticMode = 'prism' | 'slitscan' | 'xray';

export const ChronoRefractiveHeroCanvas: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Couture Interactive Mode
  const [activeMode, setActiveMode] = useState<CoutureAestheticMode>('prism');
  const [isHovered, setIsHovered] = useState(false);
  const [soundActive, setSoundActive] = useState(getSoundEnabled());
  const [pulseCount, setPulseCount] = useState(0);

  // 3D Parallax Tilt States (Spring Interpolation)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const targetTiltRef = useRef({ rx: 0, ry: 0 });
  const currentTiltRef = useRef({ rx: 0, ry: 0 });

  // Physics, Fluid Grid, and Animation Loop Refs
  const animFrameIdRef = useRef<number | null>(null);
  const modeRef = useRef<CoutureAestheticMode>('prism');
  const themeRef = useRef(theme);
  const logoImageRef = useRef<HTMLImageElement | null>(null);
  const isImageLoadedRef = useRef(false);

  // Mouse & Loupe State
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
    speed: 0,
    isHovering: false,
    isDown: false,
  });

  // Wave Simulation Dual-Buffers (downsampled grid for fluid 60-120fps performance)
  const GRID_W = 160;
  const GRID_H = 52;
  const buffer1Ref = useRef<Float32Array>(new Float32Array(GRID_W * GRID_H));
  const buffer2Ref = useRef<Float32Array>(new Float32Array(GRID_W * GRID_H));

  // Slit-scan laser sweep state
  const scanSweepRef = useRef({
    x: 0,
    direction: 1,
    active: true,
  });

  // Keep refs in sync
  useEffect(() => {
    modeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Preload logo based on theme
  useEffect(() => {
    const img = new Image();
    img.src = isLight ? '/images/fenr-logo-dark.png' : '/images/fenr-logo-white.png';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      logoImageRef.current = img;
      isImageLoadedRef.current = true;
    };
  }, [isLight]);

  // Spring Lerp for 3D perspective tilt
  useEffect(() => {
    let frame: number;
    const updateTilt = () => {
      const cur = currentTiltRef.current;
      const target = targetTiltRef.current;
      cur.rx += (target.rx - cur.rx) * 0.1;
      cur.ry += (target.ry - cur.ry) * 0.1;

      setTilt({ rx: cur.rx, ry: cur.ry });
      frame = requestAnimationFrame(updateTilt);
    };
    frame = requestAnimationFrame(updateTilt);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Deposit wave energy helper
  const addWaveImpulse = (canvasX: number, canvasY: number, power: number, radius: number) => {
    const gx = Math.floor((canvasX / 820) * GRID_W);
    const gy = Math.floor((canvasY / 260) * GRID_H);

    const buf = buffer1Ref.current;
    const rInt = Math.max(1, Math.floor((radius / 820) * GRID_W));

    for (let dy = -rInt; dy <= rInt; dy++) {
      for (let dx = -rInt; dx <= rInt; dx++) {
        const nx = gx + dx;
        const ny = gy + dy;
        if (nx >= 0 && nx < GRID_W && ny >= 0 && ny < GRID_H) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= rInt) {
            const factor = Math.cos((dist / rInt) * (Math.PI / 2));
            buf[ny * GRID_W + nx] += power * factor;
          }
        }
      }
    }
  };

  // Main 60-120FPS Optical Refraction & Fluid Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const CANVAS_W = 820;
    const CANVAS_H = 260;

    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    ctx.scale(dpr, dpr);

    // Offscreen canvas for rendering the clean pristine logo
    const offCanvas = document.createElement('canvas');
    offCanvas.width = CANVAS_W;
    offCanvas.height = CANVAS_H;
    const offCtx = offCanvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      const mouse = mouseRef.current;
      const mode = modeRef.current;
      const isCurLight = themeRef.current === 'light';
      const img = logoImageRef.current;

      // 1. Solve Wave Equation on Dual-Buffers
      let b1 = buffer1Ref.current;
      let b2 = buffer2Ref.current;
      const damping = mode === 'prism' ? 0.974 : 0.962;

      for (let y = 1; y < GRID_H - 1; y++) {
        const row = y * GRID_W;
        for (let x = 1; x < GRID_W - 1; x++) {
          const idx = row + x;
          const val =
            (b1[idx - 1] + b1[idx + 1] + b1[idx - GRID_W] + b1[idx + GRID_W]) * 0.5 - b2[idx];
          b2[idx] = val * damping;
        }
      }

      // Swap buffers
      buffer1Ref.current = b2;
      buffer2Ref.current = b1;
      b1 = buffer2Ref.current; // now b1 is the updated heightmap

      // 2. Continuous ambient pulse / subtle breathing wave
      const time = performance.now() * 0.0018;
      const ambientPulseX = Math.floor((Math.sin(time) * 0.35 + 0.5) * GRID_W);
      const ambientPulseY = Math.floor((Math.cos(time * 0.8) * 0.25 + 0.5) * GRID_H);
      b1[ambientPulseY * GRID_W + ambientPulseX] += 0.8;

      // 3. Render base logo onto offscreen canvas with razor-sharp scaling
      if (offCtx && img && img.complete && img.naturalWidth > 0) {
        offCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        const logoTargetW = 730;
        const logoTargetH = Math.round((logoTargetW * img.naturalHeight) / img.naturalWidth);
        const posX = Math.round((CANVAS_W - logoTargetW) / 2);
        const posY = Math.round((CANVAS_H - logoTargetH) / 2);
        offCtx.drawImage(img, posX, posY, logoTargetW, logoTargetH);
      }

      // 4. Render Mode Graphics: PRISM vs SLITSCAN vs XRAY
      if (mode === 'prism') {
        // --- MODE 1: OPTICAL PRISM & CHROMATIC REFRACTION ---
        // Draw underlying subtle chromatic ghost
        ctx.save();
        ctx.globalAlpha = isCurLight ? 0.12 : 0.18;
        ctx.fillStyle = '#E62846';
        ctx.drawImage(offCanvas, -2, 0);
        ctx.fillStyle = '#00F0FF';
        ctx.drawImage(offCanvas, 2, 0);
        ctx.restore();

        // Slice-based refractive rasterization: fast, gorgeous chromatic displacement
        const sliceH = 5;
        const numSlices = Math.floor(CANVAS_H / sliceH);

        for (let s = 0; s < numSlices; s++) {
          const sy = s * sliceH;
          const gy = Math.floor((sy / CANVAS_H) * GRID_H);

          // Sample displacement across horizontal grid
          let avgDisplacementX = 0;
          let avgDisplacementY = 0;
          const sampleCount = 6;
          for (let k = 0; k < sampleCount; k++) {
            const gx = Math.floor(((k + 1) / (sampleCount + 1)) * GRID_W);
            const idx = gy * GRID_W + gx;
            if (gx > 0 && gx < GRID_W - 1 && gy > 0 && gy < GRID_H - 1) {
              avgDisplacementX += (b1[idx + 1] - b1[idx - 1]) * 0.5;
              avgDisplacementY += (b1[idx + GRID_W] - b1[idx - GRID_W]) * 0.5;
            }
          }
          avgDisplacementX /= sampleCount;
          avgDisplacementY /= sampleCount;

          const dispX = avgDisplacementX * 0.45;
          const dispY = avgDisplacementY * 0.45;

          // Prismatic chromatic split if wave activity is present
          if (Math.abs(dispX) > 0.4 || Math.abs(dispY) > 0.4) {
            // Red channel shift
            ctx.save();
            ctx.globalAlpha = 0.85;
            ctx.drawImage(
              offCanvas,
              0,
              sy,
              CANVAS_W,
              sliceH,
              dispX * 1.35,
              sy + dispY * 1.35,
              CANVAS_W,
              sliceH
            );
            ctx.restore();

            // Cyan/Blue channel shift
            ctx.save();
            ctx.globalAlpha = 0.85;
            ctx.drawImage(
              offCanvas,
              0,
              sy,
              CANVAS_W,
              sliceH,
              -dispX * 0.85,
              sy - dispY * 0.85,
              CANVAS_W,
              sliceH
            );
            ctx.restore();
          } else {
            // Pure pristine rendering
            ctx.drawImage(offCanvas, 0, sy, CANVAS_W, sliceH, 0, sy, CANVAS_W, sliceH);
          }
        }

        // Anamorphic Specular Glint sweeps across wave peaks
        if (mouse.isHovering) {
          const glintX = mouse.x;
          const glintGrad = ctx.createLinearGradient(glintX - 120, 0, glintX + 120, 0);
          glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          glintGrad.addColorStop(0.5, isCurLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.6)');
          glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.save();
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = glintGrad;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          ctx.restore();
        }
      } else if (mode === 'slitscan') {
        // --- MODE 2: SLIT-SCAN LASER SCANNER & TIME DISPLACEMENT ---
        const sweep = scanSweepRef.current;
        if (mouse.isHovering) {
          sweep.x += (mouse.x - sweep.x) * 0.12;
        } else {
          sweep.x += 3.2 * sweep.direction;
          if (sweep.x > CANVAS_W + 40) sweep.direction = -1;
          if (sweep.x < -40) sweep.direction = 1;
        }

        // Render base logo
        ctx.drawImage(offCanvas, 0, 0);

        // Slit-scan wave echo trails
        const scanWidth = 140;
        const trailGradient = ctx.createLinearGradient(
          sweep.x - scanWidth,
          0,
          sweep.x + scanWidth,
          0
        );
        trailGradient.addColorStop(0, 'rgba(230, 40, 70, 0)');
        trailGradient.addColorStop(0.48, 'rgba(230, 40, 70, 0.45)');
        trailGradient.addColorStop(0.5, isCurLight ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)');
        trailGradient.addColorStop(0.52, 'rgba(0, 240, 255, 0.45)');
        trailGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');

        // Draw horizontal scanline beam
        ctx.save();
        ctx.fillStyle = trailGradient;
        ctx.fillRect(sweep.x - scanWidth, 0, scanWidth * 2, CANVAS_H);

        // Laser beam center hair line
        ctx.fillStyle = isCurLight ? '#111111' : '#FFFFFF';
        ctx.fillRect(sweep.x - 1, 0, 2, CANVAS_H);
        ctx.restore();

        // Chromatic split slices trailing the laser
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.55;
        ctx.drawImage(offCanvas, sweep.direction * 6, 0);
        ctx.restore();
      } else if (mode === 'xray') {
        // --- MODE 3: TACTICAL ARCHIVE X-RAY & BLUEPRINT LOUPE ---
        // Render base logo
        ctx.drawImage(offCanvas, 0, 0);

        // If hovering, render the interactive tactical loupe lens
        if (mouse.isHovering && mouse.x > 0 && mouse.x < CANVAS_W) {
          const lx = mouse.x;
          const ly = mouse.y;
          const loupeRadius = 90;

          ctx.save();
          // Clip circular loupe
          ctx.beginPath();
          ctx.arc(lx, ly, loupeRadius, 0, Math.PI * 2);
          ctx.clip();

          // Inverted / Blueprint garment fill inside loupe
          ctx.fillStyle = isCurLight ? '#121212' : '#0A0A0A';
          ctx.fillRect(lx - loupeRadius, ly - loupeRadius, loupeRadius * 2, loupeRadius * 2);

          // Technical micro-grid inside loupe
          ctx.strokeStyle = isCurLight ? 'rgba(255, 255, 255, 0.15)' : 'rgba(217, 208, 193, 0.15)';
          ctx.lineWidth = 1;
          const gridSize = 14;
          for (let gx = lx - loupeRadius; gx <= lx + loupeRadius; gx += gridSize) {
            ctx.beginPath();
            ctx.moveTo(gx, ly - loupeRadius);
            ctx.lineTo(gx, ly + loupeRadius);
            ctx.stroke();
          }
          for (let gy = ly - loupeRadius; gy <= ly + loupeRadius; gy += gridSize) {
            ctx.beginPath();
            ctx.moveTo(lx - loupeRadius, gy);
            ctx.lineTo(lx + loupeRadius, gy);
            ctx.stroke();
          }

          // Magnified logo 1.45x
          ctx.save();
          ctx.translate(lx, ly);
          ctx.scale(1.45, 1.45);
          ctx.translate(-lx, -ly);
          ctx.drawImage(offCanvas, 0, 0);
          ctx.restore();

          // Blueprint fiber contour overlay
          ctx.restore();

          // Loupe ring & crosshair telemetry
          ctx.save();
          ctx.beginPath();
          ctx.arc(lx, ly, loupeRadius, 0, Math.PI * 2);
          ctx.strokeStyle = '#E62846';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Corner brackets
          const bracket = 12;
          ctx.strokeStyle = isCurLight ? '#111111' : '#FFFFFF';
          ctx.lineWidth = 1.5;

          // Crosshairs
          ctx.beginPath();
          ctx.moveTo(lx - loupeRadius - 8, ly);
          ctx.lineTo(lx - loupeRadius + bracket, ly);
          ctx.moveTo(lx + loupeRadius - bracket, ly);
          ctx.lineTo(lx + loupeRadius + 8, ly);
          ctx.moveTo(lx, ly - loupeRadius - 8);
          ctx.lineTo(lx, ly - loupeRadius + bracket);
          ctx.moveTo(lx, ly + loupeRadius - bracket);
          ctx.lineTo(lx, ly + loupeRadius + 8);
          ctx.stroke();

          ctx.restore();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Pointer position tracking helper
  const getCanvasCoords = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 820 / rect.width;
    const scaleY = 260 / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Pointer Move: Injects fluid ripples & updates 3D tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const mouse = mouseRef.current;

    const dx = coords.x - mouse.x;
    const dy = coords.y - mouse.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = coords.x;
    mouse.y = coords.y;
    mouse.speed = speed;
    mouse.isHovering = true;

    // Inject fluid wave energy along cursor trajectory
    if (activeMode === 'prism' || activeMode === 'slitscan') {
      const impulsePower = Math.min(22, 5 + speed * 0.35);
      addWaveImpulse(coords.x, coords.y, impulsePower, 36);

      // Play soft glass resonance if moving swiftly
      if (speed > 16) {
        playPrismRefract(Math.min(1, speed / 40));
      }
    }

    // Update 3D perspective tilt
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      const maxTilt = 16;
      targetTiltRef.current = {
        rx: -normY * maxTilt,
        ry: normX * maxTilt,
      };
    }
  };

  const handlePointerEnter = () => {
    mouseRef.current.isHovering = true;
    setIsHovered(true);
    playTactileClick();
  };

  const handlePointerLeave = () => {
    mouseRef.current.isHovering = false;
    mouseRef.current.isDown = false;
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
    setIsHovered(false);
    targetTiltRef.current = { rx: 0, ry: 0 };
  };

  // Click Detonation: Hydraulic Shockwave Snap
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    mouseRef.current.isDown = true;
    const coords = getCanvasCoords(e.clientX, e.clientY);

    // Acoustic Shutter Snap
    playShutterSnap();
    setPulseCount((prev) => prev + 1);

    // Deep hydraulic wave blast
    addWaveImpulse(coords.x, coords.y, 65, 80);
    // Adjacent secondary wave ring
    setTimeout(() => {
      addWaveImpulse(coords.x, coords.y, -38, 120);
    }, 45);
  };

  const handlePointerUp = () => {
    mouseRef.current.isDown = false;
  };

  // Mode change handler
  const handleModeChange = (newMode: CoutureAestheticMode) => {
    playTactileClick();
    if (newMode === 'slitscan') {
      playScanlinePulse();
    } else {
      playPrismRefract(0.8);
    }
    setActiveMode(newMode);
  };

  // Audio Toggle
  const toggleSound = () => {
    const newState = !soundActive;
    setSoundEnabled(newState);
    setSoundActive(newState);
    if (newState) {
      playTactileClick();
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto my-1 select-none group touch-none"
      style={{
        perspective: '1400px',
      }}
    >
      {/* 3D KINETIC PERSPECTIVE STAGE */}
      <div
        className="relative w-full aspect-[820/260] flex items-center justify-center cursor-crosshair transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Layer 1: Ambient Architectural Depth Aura */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-700 rounded-3xl blur-3xl ${
            activeMode === 'slitscan'
              ? 'bg-gradient-to-r from-cyan-500/15 via-[#E62846]/20 to-purple-500/15'
              : activeMode === 'xray'
              ? 'bg-gradient-to-r from-red-600/15 via-neutral-600/15 to-amber-600/15'
              : isLight
              ? 'bg-black/5 opacity-50'
              : 'bg-white/10 opacity-40'
          }`}
          style={{ transform: 'translateZ(-30px)' }}
        />

        {/* Layer 2: High-Performance Optical Refraction Canvas */}
        <canvas
          ref={canvasRef}
          className="relative z-10 w-full h-full block cursor-crosshair active:scale-[0.99] transition-transform duration-100"
          style={{
            transform: 'translateZ(25px)',
            width: '100%',
            height: '100%',
          }}
        />

        {/* Central Crimson [X] Targeting Reticle HUD */}
        <div
          className="absolute z-20 pointer-events-none flex items-center justify-center transition-all duration-300"
          style={{
            transform: `translateZ(45px) translate(${tilt.ry * 1.2}px, ${-tilt.rx * 1.2}px)`,
          }}
        >
          <div
            className={`relative w-8 h-8 rounded-full border border-dashed border-[#E62846]/40 flex items-center justify-center transition-all duration-500 ${
              isHovered ? 'scale-125 border-[#E62846] rotate-45' : 'scale-90 opacity-40'
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#E62846] animate-ping" />
          </div>
        </div>
      </div>

      {/* BOTTOM COUTURE MODE CONTROLLER */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3 px-2">
        <div
          className={`flex items-center p-1 backdrop-blur-md transition-colors ${
            isLight
              ? 'bg-black/5 border border-black/15'
              : 'bg-kuro-charcoal/90 border border-kuro-divider'
          }`}
        >
          {/* Mode 1: Optical Prism */}
          <button
            onClick={() => handleModeChange('prism')}
            className={`px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] tracking-[0.2em] font-mono uppercase transition-all flex items-center space-x-1.5 ${
              activeMode === 'prism'
                ? isLight
                  ? 'bg-black text-white font-bold shadow-md'
                  : 'bg-canvas-offwhite text-kuro-base font-bold shadow-md'
                : isLight
                ? 'text-neutral-600 hover:text-black hover:bg-black/5'
                : 'text-canvas-cream/50 hover:text-white hover:bg-white/5'
            }`}
            title="Optical Glass & Liquid Crystal Dispersion"
          >
            <Sparkles className="w-3 h-3 text-[#E62846]" />
            <span>PRISM GLASS</span>
          </button>

          {/* Mode 2: Slit-Scan */}
          <button
            onClick={() => handleModeChange('slitscan')}
            className={`px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] tracking-[0.2em] font-mono uppercase transition-all flex items-center space-x-1.5 ${
              activeMode === 'slitscan'
                ? 'bg-[#E62846] text-white font-bold shadow-md shadow-[#E62846]/25'
                : isLight
                ? 'text-neutral-600 hover:text-black hover:bg-black/5'
                : 'text-canvas-cream/50 hover:text-white hover:bg-white/5'
            }`}
            title="Cinematic Anamorphic Laser Scanner"
          >
            <Radio className="w-3 h-3" />
            <span>SLIT-SCAN ECHO</span>
          </button>

          {/* Mode 3: Tactical X-Ray */}
          <button
            onClick={() => handleModeChange('xray')}
            className={`px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] tracking-[0.2em] font-mono uppercase transition-all flex items-center space-x-1.5 ${
              activeMode === 'xray'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/25'
                : isLight
                ? 'text-neutral-600 hover:text-black hover:bg-black/5'
                : 'text-canvas-cream/50 hover:text-white hover:bg-white/5'
            }`}
            title="Tactical Garment Inspection Loupe"
          >
            <Crosshair className="w-3 h-3" />
            <span>TACTICAL X-RAY</span>
          </button>
        </div>

        {/* Detonation / Shutter Trigger */}
        <button
          onClick={(e) => {
            handlePointerDown(e as unknown as React.PointerEvent<HTMLDivElement>);
            setTimeout(() => handlePointerUp(), 100);
          }}
          className={`px-3 py-1.5 border text-[9px] sm:text-[10px] tracking-[0.2em] font-mono uppercase transition-all flex items-center space-x-1.5 active:scale-95 ${
            isLight
              ? 'border-black/20 hover:border-black bg-white/70 hover:bg-black hover:text-white text-black'
              : 'border-kuro-divider hover:border-canvas-cream/70 bg-kuro-charcoal/60 hover:bg-white/10 text-canvas-cream'
          }`}
          title="Trigger Hydraulic Shockwave"
        >
          <Eye className="w-3 h-3 text-[#E62846]" />
          <span>SHOCKWAVE</span>
        </button>
      </div>
    </div>
  );
};
