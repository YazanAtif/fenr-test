import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check if touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let targetX = -100;
    let targetY = -100;
    let trailingX = -100;
    let trailingY = -100;
    let isVisible = false;
    let isHovered = false;
    let isClicking = false;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.hasAttribute('data-clickable'))
      ) {
        if (!isHovered) {
          isHovered = true;
          ring.style.backgroundColor = 'rgba(217, 208, 193, 0.08)';
          ring.style.borderColor = 'rgba(217, 208, 193, 0.8)';
        }
      } else if (isHovered) {
        isHovered = false;
        ring.style.backgroundColor = 'transparent';
        ring.style.borderColor = 'rgba(217, 208, 193, 0.3)';
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
    };
    const handleMouseUp = () => {
      isClicking = false;
    };
    const handleMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Hardware-accelerated 60-120 FPS render loop without React re-renders
    const render = () => {
      // Lerp trailing coordinates
      trailingX += (targetX - trailingX) * 0.22;
      trailingY += (targetY - trailingY) * 0.22;

      const dotScale = isClicking ? 0.7 : isHovered ? 1.4 : 1;
      const ringScale = isClicking ? 0.8 : isHovered ? 1.6 : 1;

      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      ring.style.transform = `translate3d(${trailingX}px, ${trailingY}px, 0) translate(-50%, -50%) scale(${ringScale})`;

      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-white mix-blend-difference will-change-transform opacity-0"
        style={{
          width: '6px',
          height: '6px',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Smooth Magnetic Outer Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-canvas-cream/30 will-change-transform opacity-0"
        style={{
          width: '32px',
          height: '32px',
          transition: 'background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease',
        }}
      />
    </>
  );
};
