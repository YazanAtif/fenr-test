import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* The "lift" curve used by a lot of Awwwards / Nike-style sites.
   Hand-placed here so the reveal feels weighty, not linear. */
const LIFT_EASE = [0.785, 0.135, 0.15, 0.86] as const;

// Multi-tiered curtain panels using the website's dark Kuro palette
const PANELS = ["#0A0A0A", "#141312", "#1C1B19"] as const;

export interface PageLoaderProps {
  words?: string[];
  duration?: number; // seconds for the 0->100 count
  onComplete?: () => void;
}

export default function PageLoader({
  words = ["FEAR", "NOTHING"],
  duration = 2.8,
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
        className="fixed inset-0 z-[9995] flex flex-col justify-between overflow-hidden bg-[#0A0A0A] px-6 py-8 text-[#F0EDE8] md:px-12 md:py-10 select-none pointer-events-auto"
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
        {/* Ambient atmospheric lighting matching website's Tokyo glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[28rem] bg-[radial-gradient(ellipse_at_center,_rgba(230,40,70,0.08),_transparent_70%)]" />
          <div className="absolute -bottom-24 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_center,_rgba(91,106,138,0.06),_transparent_70%)]" />
        </div>

        {/* --- Top row: category color-matched text + live percentage + skip --- */}
        <div className="relative z-10 flex items-center justify-between text-[11px] uppercase tracking-[0.35em] font-mono">
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E62846] shadow-[0_0_10px_rgba(230,40,70,0.85)] animate-pulse" />
            <span className="text-[#A67C52] font-semibold tracking-[0.3em]">
              FENR
            </span>
            <span className="text-[#5B6A8A]/60 font-mono">//</span>
            <span className="text-[#9E6B6B] font-medium tracking-[0.3em]">
              LOADING
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="text-[#6B7C5E] hover:text-[#F0EDE8] transition-colors cursor-pointer text-[10px] tracking-[0.2em] font-mono"
            >
              [ESC TO SKIP]
            </button>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="tabular-nums text-[#F0EDE8] text-sm font-semibold">{progress}</span>
              <span className="text-[#E62846] text-xs font-bold">%</span>
            </div>
          </div>
        </div>

        {/* --- Center: stacked wordmark, each line slides in --- */}
        <div className="relative z-10 flex flex-1 items-center">
          <h1 className="text-[15vw] font-bold uppercase leading-[0.82] tracking-tighter md:text-[9vw] font-display">
            {words.map((word, i) => {
              const isRed =
                word.toUpperCase().includes("NOTHING") ||
                word.toUpperCase().includes("NONTHING");

              return (
                <span key={`${word}-${i}`} className="block overflow-hidden">
                  <motion.span
                    className={`block ${
                      isRed
                        ? "text-[#E62846] drop-shadow-[0_8px_36px_rgba(230,40,70,0.55)]"
                        : "text-[#F0EDE8] drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                    }`}
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
              );
            })}
          </h1>
        </div>

        {/* --- Bottom: hairline pure white progress bar --- */}
        <div className="relative z-10 w-full pb-2">
          <div className="h-[2px] w-full bg-white/20 overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              style={{
                scaleX: progress / 100,
                transformOrigin: "left",
              }}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export { PageLoader };
