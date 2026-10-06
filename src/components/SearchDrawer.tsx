import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { playTactileClick } from '../utils/audio';

interface SearchDrawerProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({
  products,
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '460GSM Hoodie',
    'Phantom Ghost',
    'Discharge Print',
    'Graphic Tees',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.japaneseName.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectRecent = (term: string) => {
    playTactileClick();
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 bg-kuro-base/95 backdrop-blur-2xl animate-fade-in flex flex-col p-6 sm:p-12 overflow-y-auto">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-kuro-divider pb-6 mb-8">
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.3em] text-accent-olive uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PREDICTIVE ARCHIVE SEARCH</span>
        </div>
        <button
          onClick={() => {
            playTactileClick();
            onClose();
          }}
          className="text-canvas-cream/60 hover:text-white p-2 border border-kuro-divider bg-kuro-off"
          title="Close search"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Search Input */}
      <div className="max-w-4xl mx-auto w-full mb-10">
        <div className="relative">
          <Search className="w-7 h-7 text-canvas-cream/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by silhouette, GSM, title (e.g. '460GSM', 'Phantom', 'Hoodie')..."
            className="w-full bg-kuro-off border-2 border-kuro-divider pl-16 pr-12 py-5 text-lg sm:text-2xl text-white placeholder-canvas-cream/30 focus:outline-none focus:border-canvas-cream font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-canvas-cream/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center flex-wrap gap-2 mt-4">
          <span className="text-[11px] font-mono text-canvas-cream/50 uppercase mr-2">
            SUGGESTED ARCHIVES:
          </span>
          {recentSearches.map((term, i) => (
            <button
              key={i}
              onClick={() => handleSelectRecent(term)}
              className="px-3 py-1 bg-kuro-off border border-kuro-divider hover:border-canvas-cream/40 text-xs font-mono text-canvas-cream/70 hover:text-white transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      <div className="max-w-4xl mx-auto w-full">
        {query.trim() && (
          <div className="mb-4 text-xs font-mono tracking-widest text-canvas-cream/60 uppercase">
            {filteredProducts.length} MATCHING ARCHIVE PIECES FOUND
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  playTactileClick();
                  onSelectProduct(p);
                  onClose();
                }}
                className="bg-kuro-off border border-kuro-divider hover:border-canvas-cream/50 p-4 transition-all group cursor-pointer"
              >
                <div className="aspect-[3/4] bg-kuro-gray overflow-hidden mb-3">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-[10px] font-mono text-accent-olive uppercase">
                  {p.category}
                </div>
                <h4 className="font-heading text-xs font-bold text-white uppercase line-clamp-1 mb-1 group-hover:text-canvas-cream">
                  {p.name}
                </h4>
                <div className="font-mono text-xs text-canvas-cream">
                  {formatPrice(p.pricePKR, p.priceUSD)}
                </div>
              </div>
            ))}
          </div>
        ) : query.trim() ? (
          <div className="py-16 text-center border border-kuro-divider bg-kuro-off">
            <p className="font-heading text-lg text-white mb-2 uppercase">
              NO MATCHES FOR "{query}"
            </p>
            <p className="text-xs font-mono text-canvas-cream/60">
              Try searching for "460GSM", "Heavyweight", or "Tee".
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
