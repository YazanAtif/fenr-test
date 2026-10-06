import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { playTactileClick } from '../utils/audio';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalCount,
    subtotalPKR,
    subtotalUSD,
    discountPKR,
    discountUSD,
    shippingPKR,
    shippingUSD,
    totalPKR,
    totalUSD,
    promoCode,
    promoDiscountPercent,
    applyPromoCode,
    removePromoCode,
    remainingForFreeShippingPKR,
    isFreeShipping,
    freeShippingThresholdPKR,
  } = useCart();

  const { formatPrice } = useCurrency();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (!success) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 2500);
    } else {
      setPromoInput('');
    }
  };

  const freeShippingPercent = Math.min(
    100,
    Math.round(((freeShippingThresholdPKR - remainingForFreeShippingPKR) / freeShippingThresholdPKR) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-kuro-base/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-kuro-off border-l border-kuro-divider shadow-2xl flex flex-col justify-between animate-slide-left">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-kuro-divider bg-kuro-base">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-canvas-cream" />
                <h3 className="font-heading text-sm uppercase tracking-[0.2em] font-bold text-white">
                  ARCHIVE BAG ({totalCount})
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="text-canvas-cream/60 hover:text-white p-1"
                title="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-kuro-charcoal p-3 border border-kuro-divider">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="flex items-center space-x-1.5 text-canvas-cream">
                  <Truck className="w-3.5 h-3.5 text-accent-olive" />
                  <span>
                    {isFreeShipping
                      ? 'FREE EXPRESS SHIPPING UNLOCKED'
                      : `ADD ${formatPrice(remainingForFreeShippingPKR, 12)} FOR FREE SHIPPING`}
                  </span>
                </span>
                <span className="text-canvas-cream/60">{freeShippingPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-kuro-base overflow-hidden">
                <div
                  className="h-full bg-accent-olive transition-all duration-300"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-kuro-divider space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-canvas-cream/20 mb-4" />
                <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-2">
                  YOUR ARCHIVE BAG IS EMPTY
                </h4>
                <p className="text-xs text-canvas-cream/60 font-body max-w-xs mb-6">
                  Explore our Phase 1 drop of 280GSM graphic tees and 460GSM loopback hoodies.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-canvas-cream text-kuro-base font-heading text-xs tracking-widest uppercase font-bold"
                >
                  START EXPLORING
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`}
                  className="pt-4 first:pt-0 flex space-x-4"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-kuro-gray overflow-hidden border border-kuro-divider flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-heading text-xs font-bold text-white uppercase line-clamp-1 pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() =>
                            removeItem(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.hex
                            )
                          }
                          className="text-canvas-cream/40 hover:text-accent-rose transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant tags */}
                      <div className="flex items-center space-x-3 text-[11px] font-mono text-canvas-cream/60 mt-1">
                        <span>SIZE: <strong className="text-white">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span>{item.selectedColor.name}</span>
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls & Line Price */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-kuro-divider/50">
                      <div className="flex items-center border border-kuro-divider bg-kuro-base">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.hex,
                              -1
                            )
                          }
                          className="px-2 py-1 text-canvas-cream/60 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.hex,
                              1
                            )
                          }
                          className="px-2 py-1 text-canvas-cream/60 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-mono text-xs font-bold text-white">
                        {formatPrice(
                          item.product.pricePKR * item.quantity,
                          item.product.priceUSD * item.quantity
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Section */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-kuro-divider bg-kuro-base space-y-4">
              {/* Promo code input */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-kuro-charcoal border border-accent-olive/40 text-xs font-mono text-accent-olive">
                    <span className="flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>PROMO APPLIED: {promoCode} (-{promoDiscountPercent}%)</span>
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-canvas-cream/60 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex space-x-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Coupon Code (e.g. FENR10)"
                      className="flex-1 bg-kuro-off border border-kuro-divider px-3 py-2 text-xs font-mono text-white uppercase placeholder-canvas-cream/40 focus:outline-none focus:border-canvas-cream/60"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-kuro-charcoal hover:bg-canvas-cream hover:text-kuro-base text-white text-xs font-mono tracking-wider transition-colors border border-kuro-divider"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[10px] font-mono text-accent-rose mt-1">
                    Invalid code. Use code "FENR10" for 10% off.
                  </p>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs font-mono text-canvas-cream/70 border-t border-kuro-divider pt-3">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span className="text-white">{formatPrice(subtotalPKR, subtotalUSD)}</span>
                </div>

                {discountPKR > 0 && (
                  <div className="flex justify-between text-accent-olive">
                    <span>DISCOUNT ({promoDiscountPercent}%):</span>
                    <span>-{formatPrice(discountPKR, discountUSD)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>ESTIMATED SHIPPING:</span>
                  <span className="text-white">
                    {shippingPKR === 0 ? 'FREE' : formatPrice(shippingPKR, shippingUSD)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-kuro-divider">
                  <span>ESTIMATED TOTAL:</span>
                  <span className="text-canvas-cream">{formatPrice(totalPKR, totalUSD)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  playTactileClick();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-canvas-offwhite hover:bg-white text-kuro-base font-heading text-xs tracking-[0.25em] uppercase font-bold transition-all shadow-xl flex items-center justify-center space-x-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  onClick={closeCart}
                  className="text-[11px] font-mono text-canvas-cream/50 hover:text-white uppercase tracking-wider"
                >
                  OR CONTINUE SHOPPING
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
