import React from 'react';
import { Sparkles, Layers, ShieldCheck, Gem } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-kuro-base relative border-b border-kuro-divider overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Brand Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[10px] font-mono tracking-[0.35em] text-canvas-cream/50 uppercase">
              PHILOSOPHY // 001
            </div>

            <h2 className="font-display text-4xl sm:text-5xl tracking-[0.12em] text-white uppercase leading-tight">
              ARCHITECTURAL FORM. RAW INTEGRITY.
            </h2>

            <div className="space-y-5 text-sm text-canvas-offwhite/80 font-body leading-relaxed">
              <p>
                FENR exists at the intersection of contemporary architectural streetwear and precise garment engineering. We design for longevity—rejecting disposable fast fashion and artificial markups in favor of pure textile weight and structural drape.
              </p>
              <p>
                Every piece begins with heavy combed cotton custom-milled to our exact yarn density, finished with archival water-based discharge screenprinting that breathes naturally with the fabric rather than sitting stiffly on top.
              </p>
            </div>
          </div>

          {/* Right Column: Architectural Specifications */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-kuro-off border border-kuro-divider/60">
              <div className="text-[10px] font-mono text-canvas-cream/40 uppercase tracking-widest mb-2">
                01 // TEXTILE
              </div>
              <div className="font-display text-2xl text-white mb-2">460GSM TERRY</div>
              <p className="text-xs text-canvas-cream/60 leading-relaxed font-body">
                Ultra-dense diagonal loopback French Terry. Heavyweight warmth with natural breathability.
              </p>
            </div>

            <div className="p-6 bg-kuro-off border border-kuro-divider/60">
              <div className="text-[10px] font-mono text-canvas-cream/40 uppercase tracking-widest mb-2">
                02 // DISCHARGE
              </div>
              <div className="font-display text-2xl text-white mb-2">SOFT HALFTONE</div>
              <p className="text-xs text-canvas-cream/60 leading-relaxed font-body">
                Water-based inks that bleach and replace fiber pigment for a completely weightless handfeel.
              </p>
            </div>

            <div className="p-6 bg-kuro-off border border-kuro-divider/60">
              <div className="text-[10px] font-mono text-canvas-cream/40 uppercase tracking-widest mb-2">
                03 // SILHOUETTE
              </div>
              <div className="font-display text-2xl text-white mb-2">BOXY DRAPE</div>
              <p className="text-xs text-canvas-cream/60 leading-relaxed font-body">
                Engineered drop-shoulder proportions with double-needle reinforced collar and hems.
              </p>
            </div>

            <div className="p-6 bg-kuro-off border border-kuro-divider/60">
              <div className="text-[10px] font-mono text-canvas-cream/40 uppercase tracking-widest mb-2">
                04 // INTEGRITY
              </div>
              <div className="font-display text-2xl text-white mb-2">ZERO FILLER</div>
              <p className="text-xs text-canvas-cream/60 leading-relaxed font-body">
                100% pre-shrunk combed cotton. Designed to improve with age and repeated wash cycles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
