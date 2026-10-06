import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Tokyo Topographic & Sonar Wave Background
 * Modeled after iconic brutalist luxury & technical fashion sites:
 * - ACRONYM (acrnm.com) — Topographical elevation maps & magnetic grid fields
 * - Nike ISPA (nike.com/ispa) — Environmental contour telemetry
 * - Cav Empt (cavempt.com) — Architectural vector wave interference
 */
export const TokyoTopographicBackground: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse Tracking with smooth spring damping
    const mouse = {
      x: width * 0.5,
      y: height * 0.4,
      targetX: width * 0.5,
      targetY: height * 0.4,
      speed: 0,
      isMoving: false,
    };

    let lastMoveTime = performance.now();
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouse.targetX;
      const dy = e.clientY - mouse.targetY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isMoving = true;
      lastMoveTime = performance.now();
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Periodic Sonar Radar Pulse
    let sonarRadius = 0;
    let sonarMaxRadius = Math.max(width, height) * 0.85;
    let sonarAlpha = 0;
    let sonarOrigin = { x: width * 0.5, y: height * 0.45 };
    let lastSonarTime = performance.now();

    // Trigger radar ping on user click anywhere
    const handlePointerDown = (e: MouseEvent) => {
      sonarOrigin = { x: e.clientX, y: e.clientY };
      sonarRadius = 0;
      sonarAlpha = 0.65;
    };
    window.addEventListener('mousedown', handlePointerDown, { passive: true });

    // Topographic Lines Definition
    const numLines = 22;
    const pointsPerLine = 60;

    let time = 0;

    const render = () => {
      const isCurLight = themeRef.current === 'light';

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      if (performance.now() - lastMoveTime > 3000) {
        // Subtle autonomous ambient cursor wander when idle
        mouse.targetX = width * 0.5 + Math.sin(time * 0.4) * (width * 0.25);
        mouse.targetY = height * 0.45 + Math.cos(time * 0.3) * (height * 0.18);
      }

      time += 0.012;

      // Update Sonar Radar Wave
      if (performance.now() - lastSonarTime > 7500 && sonarAlpha <= 0.01) {
        sonarOrigin = { x: mouse.x, y: mouse.y };
        sonarRadius = 0;
        sonarAlpha = 0.55;
        lastSonarTime = performance.now();
      }

      if (sonarAlpha > 0.01) {
        sonarRadius += 3.8;
        sonarAlpha *= 0.985;

        // Render Sonar Wave Ring
        ctx.save();
        ctx.beginPath();
        ctx.arc(sonarOrigin.x, sonarOrigin.y, sonarRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isCurLight
          ? `rgba(230, 40, 70, ${sonarAlpha * 0.4})`
          : `rgba(230, 40, 70, ${sonarAlpha * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Topographic Contour Isolines
      const lineSpacing = height / (numLines + 2);

      for (let i = 0; i < numLines; i++) {
        const baseY = (i + 1.2) * lineSpacing;
        const normY = i / numLines;

        ctx.beginPath();

        let labelPoint: { x: number; y: number } | null = null;

        for (let j = 0; j <= pointsPerLine; j++) {
          const normX = j / pointsPerLine;
          const x = normX * width;

          // Harmonic topographic wave equations
          const wave1 = Math.sin(normX * 4.5 + time * 1.2 + normY * 3.2) * 18;
          const wave2 = Math.cos(normX * 8.0 - time * 0.8 + normY * 5.0) * 10;
          const wave3 = Math.sin(normX * 12.0 + time * 0.4) * 5;

          // Magnetic Cursor Gravitational Distortion (ACRONYM / Lusion physics)
          const dx = x - mouse.x;
          const dy = baseY - mouse.y;
          const distToMouse = Math.sqrt(dx * dx + dy * dy);
          const maxInfluence = 320;

          let cursorDisplacement = 0;
          if (distToMouse < maxInfluence) {
            const factor = Math.cos((distToMouse / maxInfluence) * (Math.PI / 2));
            cursorDisplacement = -factor * 42 * Math.sin(normX * Math.PI);
          }

          // Sonar Ring Intersection Boost
          const distToSonar = Math.abs(
            Math.sqrt((x - sonarOrigin.x) ** 2 + (baseY - sonarOrigin.y) ** 2) - sonarRadius
          );
          let sonarDisplacement = 0;
          if (sonarAlpha > 0.05 && distToSonar < 40) {
            sonarDisplacement = (1 - distToSonar / 40) * 14 * sonarAlpha;
          }

          const y = baseY + wave1 + wave2 + wave3 + cursorDisplacement + sonarDisplacement;

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Save point for telemetry label on specific lines
          if ((i === 5 || i === 11 || i === 17) && j === Math.floor(pointsPerLine * 0.65)) {
            labelPoint = { x, y };
          }
        }

        // Color and stroke properties
        const distFromCenter = Math.abs(i - numLines / 2) / (numLines / 2);
        const baseAlpha = (1 - distFromCenter * 0.5) * (isCurLight ? 0.08 : 0.09);

        // Check if cursor is close to this line to highlight in Tokyo Crimson
        const lineDistToMouse = Math.abs(baseY - mouse.y);
        const isHoveredLine = lineDistToMouse < 60;

        ctx.strokeStyle = isHoveredLine
          ? isCurLight
            ? 'rgba(230, 40, 70, 0.45)'
            : 'rgba(230, 40, 70, 0.55)'
          : isCurLight
          ? `rgba(18, 18, 18, ${baseAlpha})`
          : `rgba(217, 208, 193, ${baseAlpha})`;

        ctx.lineWidth = isHoveredLine ? 1.4 : 1;
        ctx.stroke();
      }

      // Tokyo Spatial Geographic Crosshairs (ACRONYM / Technical Blueprint style)
      ctx.save();
      const crosshairX = mouse.x;
      const crosshairY = mouse.y;
      ctx.strokeStyle = isCurLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 8]);

      // Vertical line through cursor
      ctx.beginPath();
      ctx.moveTo(crosshairX, 0);
      ctx.lineTo(crosshairX, height);
      ctx.stroke();

      // Horizontal line through cursor
      ctx.beginPath();
      ctx.moveTo(0, crosshairY);
      ctx.lineTo(width, crosshairY);
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handlePointerDown);
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-90 transition-opacity duration-1000 will-change-transform"
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};
