import React, { useState } from 'react';
import {
  X,
  Heart,
  Minus,
  Plus,
  Check,
  ChevronDown,
  ChevronUp,
  Ruler,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Product, ProductSize, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { REVIEWS } from '../data/products';
import { playSuccessChime, playTactileClick } from '../utils/audio';

interface ProductModalProps {
  product: Product | null;
  allProducts: Product[];
  isOpen: boolean;
  onClose: () => void;
  onOpenSizeChart: (product: Product) => void;
  onOpenFitBot: (product: Product) => void;
  onSelectRelatedProduct: (product: Product) => void;
  selectedSizeOverride?: ProductSize | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  allProducts,
  isOpen,
  onClose,
  onOpenSizeChart,
  onOpenFitBot,
  onSelectRelatedProduct,
  selectedSizeOverride,
}) => {
  if (!isOpen || !product) return null;

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    selectedSizeOverride || (product.sizes.find((s) => s.inStock)?.size || 'M')
  );
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.availableColors[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  // Update size if overridden from sizing bot
  React.useEffect(() => {
    if (selectedSizeOverride) {
      setSelectedSize(selectedSizeOverride);
    }
  }, [selectedSizeOverride]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handleAddToCart = () => {
    playSuccessChime();
    addItem(product, selectedSize, selectedColor, quantity);
    setIsAddedRecently(true);
    setTimeout(() => {
      setIsAddedRecently(false);
    }, 1800);
  };

  const isFavorited = isInWishlist(product.id);

  const selectedSizeStock = product.sizes.find((s) => s.size === selectedSize);
  const isOutOfStock = !selectedSizeStock || !selectedSizeStock.inStock;

  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-kuro-base/90 backdrop-blur-xl animate-fade-in">
      <div className="min-h-screen px-4 py-8 sm:py-12 flex items-center justify-center">
        <div className="relative w-full max-w-6xl bg-kuro-off border border-kuro-divider shadow-2xl p-6 sm:p-10 my-8">
          {/* Close button */}
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="absolute top-6 right-6 z-20 text-canvas-cream/60 hover:text-white p-2 transition-colors border border-kuro-divider bg-kuro-base"
            title="Close product detail"
          >
            <X className="w-5 h-5" />
          </button>

          {/* TWO COLUMN WORKBENCH: 60% Left Gallery, 40% Right Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT 60% IMAGE GALLERY */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              {/* Main Image with Zoom on Hover */}
              <div
                className="relative aspect-[4/5] w-full bg-kuro-gray overflow-hidden border border-kuro-divider cursor-crosshair group"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.images[activeImageIndex]}
                  alt={`${product.name} view ${activeImageIndex + 1}`}
                  className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                        }
                      : undefined
                  }
                />

                {/* Badge Overlay */}
                {product.badge && (
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span
                      className="comic-stamp px-3 py-1 text-[10px] font-bold text-white uppercase"
                      style={{
                        backgroundColor: '#0A0A0A',
                        borderColor: product.badgeColor || '#6B7C5E',
                      }}
                    >
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Lens zoom prompt hint */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-kuro-base/80 text-[10px] font-mono text-canvas-cream/60 pointer-events-none">
                  HOVER TO MAGNIFY LENS
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playTactileClick();
                      setActiveImageIndex(idx);
                    }}
                    className={`aspect-square border bg-kuro-gray overflow-hidden transition-all ${
                      activeImageIndex === idx
                        ? 'border-canvas-cream ring-1 ring-canvas-cream'
                        : 'border-kuro-divider opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT 40% PRODUCT DETAILS */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Monogram & Category */}
                <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-canvas-cream/60 uppercase mb-2">
                  <span>ARCHIVAL CLASSIFICATION</span>
                  <span className="text-accent-olive font-bold">{product.category}</span>
                </div>

                {/* Product Title */}
                <h1 className="font-display text-3xl sm:text-4xl tracking-[0.12em] text-white uppercase mb-3">
                  {product.name}
                </h1>

                {/* Price Presentation */}
                <div className="flex items-baseline space-x-3 mb-6">
                  <span className="font-mono text-2xl font-bold text-canvas-offwhite">
                    {formatPrice(product.pricePKR, product.priceUSD)}
                  </span>
                  {product.originalPricePKR && (
                    <span className="font-mono text-sm text-canvas-cream/40 line-through">
                      {formatPrice(product.originalPricePKR, product.originalPriceUSD || 0)}
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-[10px] font-mono text-accent-olive bg-accent-olive/10 border border-accent-olive/30 uppercase">
                    DIRECT-TO-COMMUNITY
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-canvas-offwhite/85 leading-relaxed font-body mb-6">
                  {product.description}
                </p>

                {/* Color Selector */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-canvas-cream uppercase mb-2.5">
                    <span>COLOR TONE:</span>
                    <span className="text-white font-bold">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {product.availableColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => {
                          playTactileClick();
                          setSelectedColor(color);
                        }}
                        className={`w-9 h-9 rounded-full border transition-all flex items-center justify-center ${
                          selectedColor.hex === color.hex
                            ? 'border-white scale-110 shadow-lg'
                            : 'border-kuro-divider hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor.hex === color.hex && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SIZE SELECTOR WITH SIZE GUIDE & FIT ASSISTANT LINKS */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-[11px] font-mono tracking-wider uppercase mb-2.5">
                    <span className="text-canvas-cream">SELECT PROPORTION:</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onOpenSizeChart(product)}
                        className="text-canvas-cream/70 hover:text-white underline underline-offset-4 flex items-center space-x-1"
                      >
                        <Ruler className="w-3 h-3" />
                        <span>SIZE GUIDE</span>
                      </button>
                      <span className="text-kuro-divider">|</span>
                      <button
                        onClick={() => onOpenFitBot(product)}
                        className="text-accent-amber hover:text-white flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>FIT HELP</span>
                      </button>
                    </div>
                  </div>

                  {/* Size buttons */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s.size}
                        disabled={!s.inStock}
                        onClick={() => {
                          playTactileClick();
                          setSelectedSize(s.size);
                        }}
                        className={`py-3 text-xs font-mono font-bold uppercase transition-all border flex flex-col items-center justify-center ${
                          !s.inStock
                            ? 'border-kuro-divider bg-kuro-charcoal text-canvas-cream/30 line-through cursor-not-allowed'
                            : selectedSize === s.size
                            ? 'border-canvas-cream bg-white text-kuro-base shadow-md'
                            : 'border-kuro-divider bg-kuro-base text-canvas-offwhite hover:border-canvas-cream/40'
                        }`}
                      >
                        <span>{s.size}</span>
                        {s.inStock && s.quantity <= 5 && (
                          <span className="text-[9px] text-accent-rose mt-0.5">
                            LOW STOCK
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QUANTITY & ACTIONS */}
                <div className="flex items-center space-x-4 mb-8">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-kuro-divider bg-kuro-base">
                    <button
                      onClick={() => {
                        playTactileClick();
                        setQuantity(Math.max(1, quantity - 1));
                      }}
                      className="p-3 text-canvas-cream/60 hover:text-white transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-mono font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        playTactileClick();
                        setQuantity(quantity + 1);
                      }}
                      className="p-3 text-canvas-cream/60 hover:text-white transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* ADD TO CART BUTTON (Micro-animation checkmark) */}
                  <button
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 font-heading text-xs tracking-[0.2em] uppercase font-bold transition-all flex items-center justify-center space-x-2 ${
                      isAddedRecently
                        ? 'bg-accent-olive text-white'
                        : isOutOfStock
                        ? 'bg-kuro-charcoal text-canvas-cream/40 border border-kuro-divider cursor-not-allowed'
                        : 'bg-canvas-offwhite hover:bg-white text-kuro-base shadow-xl'
                    }`}
                  >
                    {isAddedRecently ? (
                      <>
                        <Check className="w-4 h-4 animate-scale" />
                        <span>ADDED TO ARCHIVE BAG</span>
                      </>
                    ) : isOutOfStock ? (
                      <span>SIZE OUT OF STOCK</span>
                    ) : (
                      <span>ADD TO BAG — {formatPrice(product.pricePKR * quantity, product.priceUSD * quantity)}</span>
                    )}
                  </button>

                  {/* WISHLIST BUTTON */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 border transition-all ${
                      isFavorited
                        ? 'border-accent-rose bg-accent-rose text-white'
                        : 'border-kuro-divider bg-kuro-base text-canvas-cream/70 hover:text-white hover:border-canvas-cream/40'
                    }`}
                    title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>

                {/* ACCORDION SECTIONS */}
                <div className="border-t border-kuro-divider divide-y divide-kuro-divider">
                  {/* Details Accordion */}
                  <div>
                    <button
                      onClick={() =>
                        setActiveAccordion(
                          activeAccordion === 'details' ? null : 'details'
                        )
                      }
                      className="w-full py-3.5 flex items-center justify-between text-xs font-mono tracking-wider uppercase text-canvas-offwhite hover:text-white text-left"
                    >
                      <span>PRODUCT DETAILS & FIT</span>
                      {activeAccordion === 'details' ? (
                        <ChevronUp className="w-4 h-4 text-canvas-cream/60" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-canvas-cream/60" />
                      )}
                    </button>
                    {activeAccordion === 'details' && (
                      <div className="pb-4 text-xs font-body text-canvas-cream/70 space-y-2 animate-fade-in">
                        {product.details.map((d, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <span className="text-accent-olive font-mono">•</span>
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fabric & Care Accordion */}
                  <div>
                    <button
                      onClick={() =>
                        setActiveAccordion(
                          activeAccordion === 'fabric' ? null : 'fabric'
                        )
                      }
                      className="w-full py-3.5 flex items-center justify-between text-xs font-mono tracking-wider uppercase text-canvas-offwhite hover:text-white text-left"
                    >
                      <span>FABRIC & SUSTAINABLE CARE</span>
                      {activeAccordion === 'fabric' ? (
                        <ChevronUp className="w-4 h-4 text-canvas-cream/60" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-canvas-cream/60" />
                      )}
                    </button>
                    {activeAccordion === 'fabric' && (
                      <div className="pb-4 text-xs font-body text-canvas-cream/70 space-y-2 animate-fade-in">
                        {product.fabricCare.map((fc, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <span className="text-accent-amber font-mono">•</span>
                            <span>{fc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Shipping Info Accordion */}
                  <div>
                    <button
                      onClick={() =>
                        setActiveAccordion(
                          activeAccordion === 'shipping' ? null : 'shipping'
                        )
                      }
                      className="w-full py-3.5 flex items-center justify-between text-xs font-mono tracking-wider uppercase text-canvas-offwhite hover:text-white text-left"
                    >
                      <span>PAKISTAN & GLOBAL SHIPPING INFO</span>
                      {activeAccordion === 'shipping' ? (
                        <ChevronUp className="w-4 h-4 text-canvas-cream/60" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-canvas-cream/60" />
                      )}
                    </button>
                    {activeAccordion === 'shipping' && (
                      <div className="pb-4 text-xs font-body text-canvas-cream/70 leading-relaxed animate-fade-in space-y-3">
                        <p>{product.shippingInfo}</p>
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-mono text-canvas-cream/80">
                          <div className="flex items-center space-x-2">
                            <Truck className="w-3.5 h-3.5 text-accent-olive" />
                            <span>TCS & LEOPARDS 24H</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RotateCcw className="w-3.5 h-3.5 text-accent-rose" />
                            <span>14-DAY SIZE EXCHANGE</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VERIFIED CUSTOMER REVIEWS SECTION */}
          <div className="mt-16 pt-12 border-t border-kuro-divider">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-accent-olive uppercase mb-1">
                  ARCHIVE COMMUNITY REVIEWS
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wider">
                  VERIFIED STREET REPORTS ({product.reviewsCount})
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex text-accent-amber">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-white">5.0 / 5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-kuro-base border border-kuro-divider flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5 text-accent-amber">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-canvas-cream/50">
                        {rev.date}
                      </span>
                    </div>

                    <h4 className="font-heading text-sm font-bold text-white mb-2">
                      "{rev.title}"
                    </h4>
                    <p className="text-xs font-body text-canvas-cream/70 leading-relaxed mb-4">
                      {rev.comment}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-canvas-cream/60 border-t border-kuro-divider pt-3">
                    <span className="font-bold text-white">{rev.author} — {rev.city}</span>
                    <span className="text-accent-olive">SIZE {rev.sizePurchased} (VERIFIED)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* "YOU MAY ALSO LIKE" CAROUSEL */}
          <div className="mt-16 pt-12 border-t border-kuro-divider">
            <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wider mb-6">
              YOU MAY ALSO LIKE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    playTactileClick();
                    onSelectRelatedProduct(rel);
                  }}
                  className="bg-kuro-base border border-kuro-divider hover:border-canvas-cream/40 p-4 transition-all group cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-kuro-gray overflow-hidden mb-3">
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-[10px] font-mono text-canvas-cream/50 uppercase">
                    {rel.category}
                  </div>
                  <h4 className="font-heading text-xs uppercase font-bold text-white line-clamp-1 mb-1 group-hover:text-canvas-cream">
                    {rel.name}
                  </h4>
                  <div className="font-mono text-xs text-canvas-cream">
                    {formatPrice(rel.pricePKR, rel.priceUSD)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
