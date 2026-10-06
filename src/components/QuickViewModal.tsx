import React, { useState } from 'react';
import { X, Check, Heart, Plus, Minus, ArrowRight } from 'lucide-react';
import { Product, ProductSize, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { playSuccessChime, playTactileClick } from '../utils/audio';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onViewFullDetail: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onViewFullDetail,
}) => {
  if (!isOpen || !product) return null;

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes.find((s) => s.inStock)?.size || 'M'
  );
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.availableColors[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    playSuccessChime();
    addItem(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kuro-base/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-kuro-off border border-kuro-divider shadow-2xl p-6 sm:p-8 animate-slide-up">
        {/* Close */}
        <button
          onClick={() => {
            playTactileClick();
            onClose();
          }}
          className="absolute top-5 right-5 text-canvas-cream/60 hover:text-white p-1"
          title="Close quick view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Image */}
          <div className="aspect-[3/4] bg-kuro-gray overflow-hidden border border-kuro-divider relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <div className="absolute top-3 left-3">
                <span className="comic-stamp bg-kuro-base text-white text-[9px] px-2 py-0.5 border">
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Quick Info & Action */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-accent-olive uppercase">
                {product.category}
              </span>
              <h3 className="font-display text-2xl text-white uppercase tracking-wider">
                {product.name}
              </h3>
              <div className="font-mono text-lg font-bold text-canvas-cream mt-1">
                {formatPrice(product.pricePKR, product.priceUSD)}
              </div>
            </div>

            <p className="text-xs text-canvas-cream/70 font-body line-clamp-3">
              {product.description}
            </p>

            {/* Size Selector */}
            <div>
              <span className="block text-[10px] font-mono text-canvas-cream/60 uppercase mb-2">
                CHOOSE PROPORTION:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={!s.inStock}
                    onClick={() => {
                      playTactileClick();
                      setSelectedSize(s.size);
                    }}
                    className={`py-2 text-xs font-mono font-bold uppercase border transition-all ${
                      !s.inStock
                        ? 'border-kuro-divider bg-kuro-charcoal text-canvas-cream/20 line-through cursor-not-allowed'
                        : selectedSize === s.size
                        ? 'border-canvas-cream bg-white text-kuro-base'
                        : 'border-kuro-divider bg-kuro-base text-canvas-offwhite hover:border-canvas-cream/40'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Add CTA */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleAdd}
                className="w-full py-3 bg-canvas-cream hover:bg-white text-kuro-base font-heading text-xs tracking-widest uppercase font-bold transition-all shadow flex items-center justify-center space-x-2"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <span>QUICK ADD — {formatPrice(product.pricePKR, product.priceUSD)}</span>
                )}
              </button>

              <button
                onClick={() => {
                  playTactileClick();
                  onClose();
                  onViewFullDetail(product);
                }}
                className="w-full py-2 text-xs font-mono text-canvas-cream/70 hover:text-white uppercase tracking-wider flex items-center justify-center space-x-1"
              >
                <span>VIEW COMPLETE SPECIFICATION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
