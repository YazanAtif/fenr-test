import React from 'react';
import { X, Clock, Calendar, Sparkles, ArrowRight, MessageSquareQuote, Zap, ShoppingBag, ShieldCheck, Layers } from 'lucide-react';
import { Article } from '../types';
import { PRODUCTS } from '../data/products';
import { playTactileClick } from '../utils/audio';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (productId: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  if (!isOpen || !article) return null;

  const relatedProducts = (article.relatedProductIds || [])
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-kuro-base/95 backdrop-blur-xl animate-fade-in p-3 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="relative w-full max-w-4xl bg-kuro-off border-2 sm:border-4 border-kuro-base shadow-[12px_12px_0px_#0A0A0A] p-5 sm:p-10 my-6 text-kuro-base">
        {/* Vintage comic texture background overlay */}
        <div className="absolute inset-0 comic-dots-amber opacity-15 pointer-events-none" />

        {/* Close Button Styled like a Comic Corner Tab */}
        <button
          onClick={() => {
            playTactileClick();
            onClose();
          }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 bg-kuro-base text-white p-2.5 border-2 border-kuro-base shadow-[4px_4px_0px_#A67C52] hover:bg-accent-amber hover:text-kuro-base transition-colors"
          title="Close comic issue"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vintage Comic Magazine Header Banner */}
        <div className="relative z-10 border-b-2 sm:border-b-4 border-kuro-base pb-5 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono font-bold tracking-widest text-canvas-offwhite uppercase">
            <div className="flex items-center space-x-2">
              <span className="bg-kuro-base text-white px-3 py-1 comic-stamp border border-canvas-cream/30">
                {article.issue}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-accent-amber/20 text-accent-amber text-[10px] font-mono border border-accent-amber/40">
                FENR ARCHIVE GAZETTE
              </span>
            </div>
            <div className="flex items-center space-x-3 text-canvas-cream/80 text-[11px]">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-accent-amber" />
                <span>{article.readTime}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-accent-amber" />
                <span>{article.date}</span>
              </span>
            </div>
            <span className="text-accent-olive font-bold">{article.category}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-[0.06em] text-white uppercase mt-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-2 mt-2 pt-2 border-t border-kuro-divider/40">
            <div className="text-xs sm:text-sm font-sans tracking-[0.25em] text-accent-amber/90 uppercase font-medium">
              {article.subtitle}
            </div>
            {article.author && (
              <div className="text-[10px] font-mono tracking-widest text-canvas-cream/60 uppercase">
                BY {article.author}
              </div>
            )}
          </div>
        </div>

        {/* Vintage Comic Cover Graphic Frame */}
        <div className="relative z-10 w-full border-4 border-kuro-base shadow-[8px_8px_0px_#0A0A0A] overflow-hidden mb-8 bg-kuro-gray">
          {/* Comic Masthead Top Bar */}
          <div className="bg-kuro-base text-white px-4 py-1.5 flex items-center justify-between text-[10px] font-mono tracking-widest border-b-2 border-kuro-base">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-accent-rose animate-pulse" />
              <span>COLLECTOR PRINT // HIGH FIDELITY DISPATCH</span>
            </div>
            <span className="hidden sm:inline text-canvas-cream/60">APPROVED BY FENR CODE ATELIER</span>
          </div>

          <div className="relative max-h-[580px] w-full flex items-center justify-center bg-[#0d0d0d] overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full max-h-[580px] object-contain sm:object-cover object-center filter contrast-110"
            />
            <div className="absolute inset-0 halftone-overlay opacity-25 mix-blend-overlay pointer-events-none" />

            {/* Comic Stamp Badge */}
            {article.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="comic-stamp bg-accent-rose text-white text-xs sm:text-sm px-3.5 py-1 font-bold tracking-wider">
                  {article.badge}
                </span>
              </div>
            )}

            {/* Faux Vintage Comic Barcode in bottom right */}
            <div className="absolute bottom-3 right-3 z-10 bg-white/90 p-1.5 text-black border border-black hidden sm:flex flex-col items-center shadow-md">
              <div className="text-[7px] font-mono font-bold tracking-tighter leading-none mb-0.5">FENR-MAG</div>
              <div className="h-5 w-20 flex items-center justify-between space-x-0.5 px-0.5">
                <div className="w-1 h-full bg-black" />
                <div className="w-0.5 h-full bg-black" />
                <div className="w-1.5 h-full bg-black" />
                <div className="w-0.5 h-full bg-black" />
                <div className="w-1 h-full bg-black" />
                <div className="w-2 h-full bg-black" />
                <div className="w-0.5 h-full bg-black" />
                <div className="w-1 h-full bg-black" />
                <div className="w-1.5 h-full bg-black" />
                <div className="w-0.5 h-full bg-black" />
              </div>
              <div className="text-[7px] font-mono tracking-widest leading-none mt-0.5">VOL.2026</div>
            </div>
          </div>
        </div>

        {/* Editorial Body */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-canvas-offwhite">
          {/* Excerpt with Comic Stylized Callout */}
          <div className="p-4 sm:p-5 bg-kuro-charcoal/80 border-l-4 border-accent-amber border-y border-r border-kuro-divider shadow-sm">
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.2em] text-accent-amber uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ISSUE SYNOPSIS // EDITORIAL DISPATCH</span>
            </div>
            <p className="font-editorial text-base sm:text-lg italic text-canvas-cream leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* COMIC SPEECH BUBBLE PULL-QUOTE */}
          <div className="my-8">
            <div className="comic-bubble p-6 font-display text-xl sm:text-2xl tracking-wide uppercase leading-snug">
              <MessageSquareQuote className="w-6 h-6 text-accent-amber mb-2 inline-block mr-2" />
              {article.pullQuote}
              <div className="text-right text-xs font-mono tracking-widest text-kuro-base/70 mt-3 font-bold">
                — {article.speaker}
              </div>
            </div>
          </div>

          {/* Article Story Blocks */}
          {article.blocks.map((block, idx) => {
            if (block.type === 'comic-panel') {
              return (
                <div
                  key={idx}
                  className="my-6 p-4 sm:p-5 bg-[#171412] border-2 border-accent-amber/50 relative shadow-[4px_4px_0px_#A67C52] overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10 font-display text-6xl text-accent-amber pointer-events-none select-none">
                    {block.sfx || 'POW'}
                  </div>

                  {block.narrator && (
                    <div className="inline-block bg-accent-amber text-kuro-base px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase mb-2 comic-stamp">
                      [ NARRATOR: {block.narrator} ]
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1">
                    <h4 className="font-display text-lg sm:text-xl text-white tracking-widest uppercase">
                      {block.text}
                    </h4>
                    {block.sfx && (
                      <span className="font-display text-xl sm:text-2xl text-accent-amber tracking-widest drop-shadow-[2px_2px_0px_#0A0A0A] transform -rotate-3">
                        {block.sfx}
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            if (block.type === 'heading') {
              return (
                <h3
                  key={idx}
                  className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wider pt-6 border-b border-kuro-divider pb-2 flex items-center justify-between"
                >
                  <span>{block.text}</span>
                  <span className="text-accent-amber text-sm font-mono tracking-widest hidden sm:inline">
                    // CHAPTER SEC.
                  </span>
                </h3>
              );
            }

            if (block.type === 'paragraph') {
              return (
                <p
                  key={idx}
                  className={`font-editorial text-base sm:text-lg text-canvas-offwhite/90 leading-relaxed ${
                    idx === 0 || idx === 1 ? 'drop-cap' : ''
                  }`}
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === 'quote') {
              return (
                <blockquote
                  key={idx}
                  className="p-5 bg-kuro-base border-l-4 border-accent-olive border-y border-r border-kuro-divider text-xs sm:text-sm font-mono text-canvas-cream/90 italic my-6 shadow-md"
                >
                  <div className="text-accent-olive font-bold text-[10px] tracking-widest uppercase mb-1">
                    ATELIER VERBATIM ARCHIVE
                  </div>
                  "{block.text}" — <strong className="text-white font-sans tracking-wide">{block.speaker}</strong>
                </blockquote>
              );
            }

            if (block.type === 'stat') {
              return (
                <div
                  key={idx}
                  className="my-8 bg-kuro-base border-2 border-kuro-divider p-5 sm:p-6 shadow-[6px_6px_0px_#0A0A0A]"
                >
                  <div className="flex items-center justify-between border-b border-kuro-divider pb-3 mb-4">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-accent-amber uppercase">
                      <Layers className="w-4 h-4" />
                      <span>MAGAZINE TECHNICAL DOSSIER // ARCHIVE SPEC</span>
                    </div>
                    <span className="text-[10px] font-mono text-canvas-cream/50">100% SPEC VERIFIED</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(block.stats || []).map((item, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 bg-kuro-off border border-kuro-divider/60 flex flex-col justify-between"
                      >
                        <span className="text-[10px] font-mono tracking-widest text-canvas-cream/60 uppercase">
                          {item.label}
                        </span>
                        <span className="font-heading text-sm font-bold text-white tracking-wide mt-1">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return null;
          })}

          {/* Panel Grid Images if present */}
          {article.panelGridImages && article.panelGridImages.length > 0 && (
            <div className="my-8 pt-6 border-t border-kuro-divider">
              <div className="text-xs font-mono tracking-widest text-accent-amber uppercase mb-3 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMIC PHOTO REEL // VISUAL CONTACT SHEET</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {article.panelGridImages.map((imgSrc, pIdx) => (
                  <div
                    key={pIdx}
                    className="aspect-[4/5] bg-kuro-gray border-2 border-kuro-base shadow-[4px_4px_0px_#0A0A0A] overflow-hidden relative group"
                  >
                    <img
                      src={imgSrc}
                      alt={`Panel ${pIdx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-105"
                    />
                    <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />
                    <div className="absolute bottom-1.5 left-1.5 bg-kuro-base/80 text-white font-mono text-[9px] px-1.5 py-0.5">
                      FIG. 0{pIdx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Related Products in Comic Issue */}
          {relatedProducts.length > 0 && (
            <div className="my-10 pt-8 border-t-2 border-kuro-base">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-accent-amber uppercase">
                  <ShoppingBag className="w-4 h-4" />
                  <span>GARMENT FEATURED IN THIS ISSUE</span>
                </div>
                <span className="text-[10px] font-mono text-canvas-cream/50 uppercase">ARCHIVE CATALOG</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProducts.map((prod) => prod && (
                  <div
                    key={prod.id}
                    onClick={() => {
                      playTactileClick();
                      if (onSelectProduct) {
                        onSelectProduct(prod.id);
                        onClose();
                      }
                    }}
                    className="bg-kuro-base border-2 border-kuro-base shadow-[6px_6px_0px_#0A0A0A] hover:shadow-[10px_10px_0px_#A67C52] transition-all duration-300 p-4 flex gap-4 cursor-pointer group"
                  >
                    <div className="w-20 aspect-square bg-kuro-gray overflow-hidden border border-kuro-divider flex-shrink-0 relative">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="text-[9px] font-mono text-accent-amber uppercase">
                          {prod.category}
                        </div>
                        <h5 className="font-heading text-xs font-bold text-white uppercase group-hover:text-canvas-cream line-clamp-1">
                          {prod.name}
                        </h5>
                        <div className="text-xs font-mono font-bold text-white mt-1">
                          Rs. {prod.pricePKR.toLocaleString()} <span className="text-[10px] text-canvas-cream/60">(${prod.priceUSD})</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] font-mono text-accent-amber tracking-wider uppercase font-bold mt-2">
                        <span>SHOP PIECE</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 border-t-2 border-kuro-base pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-canvas-cream/60">
            PUBLISHED BY FENR METROPOLIS EDITORIAL
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="px-6 py-2.5 bg-canvas-cream text-kuro-base font-heading text-xs tracking-widest uppercase font-bold hover:bg-white shadow-[4px_4px_0px_#0A0A0A] transition-all"
          >
            RETURN TO ARCHIVE DISPATCH
          </button>
        </div>
      </div>
    </div>
  );
};
