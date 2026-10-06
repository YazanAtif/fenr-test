import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* The "lift" curve used by a lot of Awwwards / Nike-style sites.
   Hand-placed here so the reveal feels weighty, not linear. */
const LIFT_EASE = [0.785, 0.135, 0.15, 0.86] as const;

const PANELS = ["#000000", "#0d0d0d", "#1a1a1a"] as const;

export interface PageLoaderProps {
  words?: string[];
  duration?: number; // seconds for the 0->100 count
  onComplete?: () => void;
}

export default function PageLoader({
  words = ["JUST", "DO", "IT."],
  duration = 2,
  onComplete,
}: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [, setFontsReady] = useState(false);
  const rafRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);
  const reduce = useReducedMotion();

  const handleFinish = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  // 1) Lock scrolling while the curtain is up (prevents the page jumping underneath)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // 2) Font readiness check
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready
        .then(() => setFontsReady(true))
        .catch(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }
  }, []);

  // 3) Drive a smooth 0 -> 100 counter with requestAnimationFrame
  useEffect(() => {
    const start = performance.now();
    const ms = duration * 1000;

    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Small beat at "100" before we swipe away
        setTimeout(() => setExiting(true), 300);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration]);

  // 4) ESC key shortcut to skip immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExiting(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSkip = () => {
    setExiting(true);
  };

  return (
    <>
      {/* --- Multi-panel Staggered Curtain Backgrounds --- */}
      {PANELS.map((bg, i) => (
        <motion.div
          key={`curtain-panel-${i}`}
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundColor: bg,
            zIndex: 9990 + (PANELS.length - 1 - i),
          }}
          initial={{ y: 0, opacity: 1 }}
          animate={
            exiting
              ? reduce
                ? { opacity: 0 }
                : { y: "-100%" }
              : { y: 0, opacity: 1 }
          }
          transition={{
            duration: reduce ? 0.3 : 1,
            ease: LIFT_EASE,
            delay: exiting && !reduce ? i * 0.08 : 0,
          }}
          onAnimationComplete={() => {
            if (i === PANELS.length - 1 && exiting) {
              handleFinish();
            }
          }}
        />
      ))}

      {/* --- Top Layer: Counter + Kinetic Wordmark Content --- */}
      <motion.div
        className="fixed inset-0 z-[9995] flex flex-col justify-between overflow-hidden bg-black px-6 py-8 text-white md:px-12 md:py-10 select-none pointer-events-auto"
        initial={{ y: 0, opacity: 1 }}
        animate={
          exiting
            ? reduce
              ? { opacity: 0 }
              : { y: "-100%" }
            : { y: 0, opacity: 1 }
        }
        transition={{
          duration: reduce ? 0.3 : 1,
          ease: LIFT_EASE,
          delay: 0,
        }}
        onAnimationComplete={() => {
          if (exiting && (!PANELS.length || reduce)) {
            handleFinish();
          }
        }}
      >
        {/* --- Top row: label + live percentage + skip --- */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
            <span className="text-white/80">Loading</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="text-white/40 hover:text-white transition-colors cursor-pointer text-[10px] tracking-[0.2em] font-mono hidden sm:inline-block"
            >
              [ESC TO SKIP]
            </button>
            <span className="tabular-nums text-white font-mono">{progress}%</span>
          </div>
        </div>

        {/* --- Center: stacked wordmark, each line slides in --- */}
        <div className="flex flex-1 items-center">
          <h1 className="text-[15vw] font-bold uppercase leading-[0.82] tracking-tighter md:text-[9vw] font-display">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: exiting ? "-110%" : "0%" }}
                  transition={{
                    duration: reduce ? 0.3 : 0.8,
                    ease: LIFT_EASE,
                    delay: exiting ? 0 : 0.12 * i,
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        {/* --- Bottom: hairline progress bar + metadata --- */}
        <div className="flex flex-col gap-3">
          <div className="h-px w-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full bg-white"
              style={{
                scaleX: progress / 100,
                transformOrigin: "left",
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-white/40">
            <span>FENR / SYSTEM</span>
            <span className="sm:hidden">
              <button
                type="button"
                onClick={handleSkip}
                className="hover:text-white text-white/50"
              >
                SKIP
              </button>
            </span>
            <span className="hidden sm:inline">TOKYO // 2026</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export { PageLoader };
