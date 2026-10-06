import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { Product, ProductSize } from '../types';
import { ProductCard } from './ProductCard';
import { playTactileClick } from '../utils/audio';

interface ProductGridProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onOpenProduct,
  onQuickView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Graphic Tees' | 'Hoodies' | 'Limited'>('All');
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const categories = ['All', 'Graphic Tees', 'Hoodies', 'Limited'] as const;
  const availableSizes: ProductSize[] = ['S', 'M', 'L', 'XL'];
  const availableColors = [
    { label: 'Deep Black', hex: '#0A0A0A' },
    { label: 'Muted Olive', hex: '#6B7C5E' },
    { label: 'Dusty Rose', hex: '#9E6B6B' },
    { label: 'Washed Indigo', hex: '#5B6A8A' },
    { label: 'Burnt Amber', hex: '#A67C52' },
    { label: 'Faded Mauve', hex: '#8A7090' },
  ];

  const toggleSize = (size: ProductSize) => {
    playTactileClick();
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleCategoryChange = (cat: typeof selectedCategory) => {
    playTactileClick();
    setSelectedCategory(cat);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory === 'Graphic Tees' && p.category !== 'Graphic Tees') return false;
        if (selectedCategory === 'Hoodies' && p.category !== 'Hoodies') return false;
        if (selectedCategory === 'Limited' && p.badge !== 'LIMITED') return false;

        if (selectedSizes.length > 0) {
          const hasInStockSize = p.sizes.some(
            (s) => selectedSizes.includes(s.size) && s.inStock
          );
          if (!hasInStockSize) return false;
        }

        if (selectedColor) {
          const hasColor = p.availableColors.some((c) => c.hex === selectedColor);
          if (!hasColor) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePKR - b.pricePKR;
        if (sortBy === 'price-desc') return b.pricePKR - a.pricePKR;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, selectedCategory, selectedSizes, selectedColor, sortBy]);

  const clearFilters = () => {
    playTactileClick();
    setSelectedCategory('All');
    setSelectedSizes([]);
    setSelectedColor(null);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSizes.length > 0 ||
    selectedColor !== null ||
    sortBy !== 'featured';

  return (
    <section id="shop" className="py-20 bg-kuro-base relative border-b border-kuro-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-kuro-divider pb-6">
          <div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-canvas-cream/50 uppercase mb-2">
              COLLECTION // 001
            </div>
            <h2 className="font-display text-4xl sm:text-5xl tracking-[0.15em] text-white uppercase">
              ALL GARMENTS
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                playTactileClick();
                setIsFilterDrawerOpen(!isFilterDrawerOpen);
              }}
              className={`flex items-center space-x-2 px-4 py-2 border text-xs font-mono uppercase tracking-wider transition-all ${
                hasActiveFilters
                  ? 'border-canvas-cream bg-kuro-off text-white'
                  : 'border-kuro-divider hover:border-canvas-cream/40 text-canvas-cream/70'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTERS {hasActiveFilters && `(${selectedSizes.length + (selectedColor ? 1 : 0) + (selectedCategory !== 'All' ? 1 : 0)})`}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  playTactileClick();
                  setSortBy(e.target.value as typeof sortBy);
                }}
                className="appearance-none bg-kuro-off border border-kuro-divider hover:border-canvas-cream/40 text-white text-xs font-mono uppercase tracking-wider px-4 py-2 pr-8 focus:outline-none cursor-pointer"
              >
                <option value="featured">SORT: FEATURED</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
                <option value="rating">TOP RATED</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-canvas-cream/50 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-heading tracking-widest uppercase transition-all whitespace-nowrap border shrink-0 ${
                  selectedCategory === cat
                    ? 'border-canvas-cream bg-white text-kuro-base font-bold shadow-md'
                    : 'border-kuro-divider bg-kuro-off text-canvas-cream/70 hover:text-white hover:border-canvas-cream/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden sm:block text-[11px] font-mono text-canvas-cream/50 uppercase tracking-widest shrink-0">
            {filteredProducts.length} ITEMS
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {isFilterDrawerOpen && (
          <div className="mb-10 p-6 bg-kuro-off border border-kuro-divider animate-fade-in">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-kuro-divider">
              <span className="text-xs font-mono tracking-widest text-canvas-cream uppercase">
                SPECIFICATION FILTERS
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-mono text-accent-rose hover:text-white flex items-center space-x-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>RESET ALL</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Size Selectors */}
              <div>
                <label className="block text-[11px] font-mono tracking-widest text-canvas-cream/60 uppercase mb-3">
                  SELECT SIZES
                </label>
                <div className="flex items-center space-x-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-10 h-10 border text-xs font-mono font-bold transition-all flex items-center justify-center ${
                        selectedSizes.includes(size)
                          ? 'border-canvas-cream bg-canvas-cream text-kuro-base shadow'
                          : 'border-kuro-divider text-canvas-offwhite hover:border-canvas-cream/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Tones Filter */}
              <div>
                <label className="block text-[11px] font-mono tracking-widest text-canvas-cream/60 uppercase mb-3">
                  MUTED PALETTE TONES
                </label>
                <div className="flex items-center space-x-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => {
                        playTactileClick();
                        setSelectedColor(selectedColor === color.hex ? null : color.hex);
                      }}
                      className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                        selectedColor === color.hex
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-kuro-divider hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    >
                      {selectedColor === color.hex && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  ))}
                  {selectedColor && (
                    <button
                      onClick={() => setSelectedColor(null)}
                      className="text-[10px] font-mono text-canvas-cream/50 hover:text-white"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Layout (2-column on mobile, 3-column on desktop) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenProduct={onOpenProduct}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-kuro-divider bg-kuro-off">
            <p className="font-heading text-lg text-white mb-2 uppercase tracking-wider">
              NO MATCHING ARCHIVE PIECES
            </p>
            <p className="text-xs text-canvas-cream/60 font-mono mb-6">
              Try adjusting your size or color filter parameters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-canvas-cream text-kuro-base font-heading text-xs tracking-widest uppercase font-bold"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
