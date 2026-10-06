import React, { useState } from 'react';
import { Heart, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useWishlist } from '../context/WishlistContext';
import { playTactileClick } from '../utils/audio';

interface ProductCardProps {
  product: Product;
  onOpenProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenProduct,
  onQuickView,
}) => {
  const { formatPrice } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const favorited = isInWishlist(product.id);

  return (
    <div
      className="group relative flex flex-col bg-kuro-off border border-kuro-divider hover:border-canvas-cream/40 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <div
        onClick={() => onOpenProduct(product)}
        className="relative aspect-[3/4] w-full bg-kuro-gray overflow-hidden cursor-pointer"
      >
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
            isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Second Alternate Angle (fades in on hover) */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate angle`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        )}

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-kuro-base/80 via-transparent to-transparent opacity-40 pointer-events-none" />

        {/* Badge (NEW DROP / SELLING FAST / LIMITED) */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className="comic-stamp px-2 py-0.5 text-[9px] font-bold text-white uppercase"
              style={{
                backgroundColor: '#0A0A0A',
                borderColor: product.badgeColor || '#6B7C5E',
                color: '#F0EDE8',
              }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            favorited
              ? 'bg-accent-rose text-white shadow-md'
              : 'bg-kuro-base/60 backdrop-blur-sm text-canvas-cream/70 hover:text-white hover:bg-kuro-base'
          }`}
          title={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${favorited ? 'fill-current scale-110' : ''}`}
          />
        </button>

        {/* Quick View Button (fades in at bottom of image on hover) */}
        <div
          className={`absolute inset-x-3 bottom-3 z-10 transition-all duration-300 transform ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              playTactileClick();
              onQuickView(product);
            }}
            className="w-full py-2.5 bg-kuro-base/90 backdrop-blur-md hover:bg-white hover:text-kuro-base text-canvas-offwhite text-[11px] font-heading tracking-[0.2em] uppercase font-bold transition-all border border-kuro-divider flex items-center justify-center space-x-1.5 shadow-xl"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>QUICK VIEW</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Category Subtitle */}
          <div className="text-[9px] sm:text-[10px] font-mono tracking-widest text-accent-olive/80 uppercase mb-1">
            {product.category}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onOpenProduct(product)}
            className="font-heading text-xs sm:text-base text-white tracking-wide uppercase hover:text-canvas-cream transition-colors cursor-pointer line-clamp-1 mb-1.5 sm:mb-2 font-medium"
          >
            {product.name}
          </h3>

          {/* Color Swatches */}
          <div className="flex items-center space-x-1.5 mb-2.5 sm:mb-3">
            {product.availableColors.map((c, idx) => (
              <span
                key={idx}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-kuro-divider"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-[8px] sm:text-[9px] font-mono text-canvas-cream/40 pl-0.5 sm:pl-1">
              {product.availableColors.length} TONES
            </span>
          </div>
        </div>

        {/* Price & Stock Indicator */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-kuro-divider mt-auto">
          <div className="flex items-baseline space-x-1.5 sm:space-x-2">
            <span className="font-mono text-xs sm:text-base font-bold text-canvas-offwhite">
              {formatPrice(product.pricePKR, product.priceUSD)}
            </span>
            {product.originalPricePKR && (
              <span className="font-mono text-[10px] sm:text-xs text-canvas-cream/40 line-through">
                {formatPrice(product.originalPricePKR, product.originalPriceUSD || 0)}
              </span>
            )}
          </div>

          <div className="text-[8px] sm:text-[10px] font-mono text-accent-olive uppercase tracking-wider hidden xs:block">
            {product.category}
          </div>
        </div>
      </div>
    </div>
  );
};
