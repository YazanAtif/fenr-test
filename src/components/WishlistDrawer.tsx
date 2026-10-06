import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { Product } from '../types';
import { playSuccessChime, playTactileClick } from '../utils/audio';

interface WishlistDrawerProps {
  onOpenProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onOpenProduct }) => {
  const { wishlist, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { addItem, openCart } = useCart();
  const { formatPrice } = useCurrency();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (product: Product) => {
    playSuccessChime();
    const defaultSize = product.sizes.find((s) => s.inStock)?.size || 'M';
    const defaultColor = product.availableColors[0];
    addItem(product, defaultSize, defaultColor, 1);
    removeFromWishlist(product.id);
    closeWishlist();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeWishlist}
        className="absolute inset-0 bg-kuro-base/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-kuro-off border-l border-kuro-divider shadow-2xl flex flex-col justify-between animate-slide-left">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-kuro-divider bg-kuro-base flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-accent-rose fill-current" />
              <h3 className="font-heading text-sm uppercase tracking-[0.2em] font-bold text-white">
                SAVED ARCHIVE WISHLIST ({wishlist.length})
              </h3>
            </div>
            <button
              onClick={closeWishlist}
              className="text-canvas-cream/60 hover:text-white p-1"
              title="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-kuro-divider space-y-4">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Heart className="w-12 h-12 text-canvas-cream/20 mb-4" />
                <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-2">
                  YOUR WISHLIST IS EMPTY
                </h4>
                <p className="text-xs text-canvas-cream/60 font-body max-w-xs mb-6">
                  Save pieces you love to track releases and secure sizes before they sell out.
                </p>
                <button
                  onClick={closeWishlist}
                  className="px-6 py-2.5 bg-canvas-cream text-kuro-base font-heading text-xs tracking-widest uppercase font-bold"
                >
                  DISCOVER CATALOG
                </button>
              </div>
            ) : (
              wishlist.map((product) => (
                <div key={product.id} className="pt-4 first:pt-0 flex space-x-4">
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      closeWishlist();
                      onOpenProduct(product);
                    }}
                    className="w-20 h-24 bg-kuro-gray overflow-hidden border border-kuro-divider flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4
                          onClick={() => {
                            closeWishlist();
                            onOpenProduct(product);
                          }}
                          className="font-heading text-xs font-bold text-white uppercase line-clamp-1 pr-2 hover:text-canvas-cream cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="text-canvas-cream/40 hover:text-accent-rose transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="font-mono text-xs font-bold text-canvas-cream mt-1">
                        {formatPrice(product.pricePKR, product.priceUSD)}
                      </div>
                    </div>

                    {/* Move to Cart */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="w-full py-2 bg-kuro-base hover:bg-canvas-cream hover:text-kuro-base border border-kuro-divider text-[11px] font-mono tracking-wider text-white uppercase transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>MOVE TO BAG</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-kuro-divider bg-kuro-base">
              <button
                onClick={closeWishlist}
                className="w-full py-3 bg-canvas-cream text-kuro-base font-heading text-xs tracking-widest uppercase font-bold hover:bg-white transition-all shadow"
              >
                CONTINUE BROWSING
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
