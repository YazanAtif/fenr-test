import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductSize, ProductColor } from '../types';
import { playSuccessChime, playTactileClick } from '../utils/audio';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: ProductSize, color: ProductColor, quantity?: number) => void;
  removeItem: (productId: string, size: ProductSize, colorHex: string) => void;
  updateQuantity: (productId: string, size: ProductSize, colorHex: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  totalCount: number;
  subtotalPKR: number;
  subtotalUSD: number;
  discountPKR: number;
  discountUSD: number;
  shippingPKR: number;
  shippingUSD: number;
  totalPKR: number;
  totalUSD: number;
  promoCode: string;
  promoDiscountPercent: number;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  freeShippingThresholdPKR: number;
  freeShippingThresholdUSD: number;
  remainingForFreeShippingPKR: number;
  isFreeShipping: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD_PKR = 5000;
const FREE_SHIPPING_THRESHOLD_USD = 50;
const STANDARD_SHIPPING_PKR = 350;
const STANDARD_SHIPPING_USD = 4;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kuro_cart_items');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedPromo = localStorage.getItem('kuro_promo_code');
      if (savedPromo === 'FENR10' || savedPromo === 'KURO10') {
        setPromoCode(savedPromo);
        setPromoDiscountPercent(10);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kuro_cart_items', JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  const openCart = () => {
    playTactileClick();
    setIsCartOpen(true);
  };

  const closeCart = () => {
    playTactileClick();
    setIsCartOpen(false);
  };

  const addItem = (product: Product, size: ProductSize, color: ProductColor, quantity = 1) => {
    playSuccessChime();
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedSize === size &&
          i.selectedColor.hex === color.hex
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, size: ProductSize, colorHex: string) => {
    playTactileClick();
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.product.id === productId &&
            i.selectedSize === size &&
            i.selectedColor.hex === colorHex
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    size: ProductSize,
    colorHex: string,
    delta: number
  ) => {
    playTactileClick();
    setItems((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.hex === colorHex
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem('kuro_cart_items');
    } catch {
      // Ignore
    }
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FENR10' || clean === 'KURO10' || clean === 'ARCHIVE10') {
      setPromoCode(clean);
      setPromoDiscountPercent(10);
      localStorage.setItem('kuro_promo_code', clean);
      playSuccessChime();
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscountPercent(0);
    localStorage.removeItem('kuro_promo_code');
  };

  // Calculations
  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const subtotalPKR = items.reduce(
    (acc, i) => acc + i.product.pricePKR * i.quantity,
    0
  );
  const subtotalUSD = items.reduce(
    (acc, i) => acc + i.product.priceUSD * i.quantity,
    0
  );

  const discountPKR = Math.round((subtotalPKR * promoDiscountPercent) / 100);
  const discountUSD = Math.round((subtotalUSD * promoDiscountPercent) / 100);

  const isFreeShipping = subtotalPKR >= FREE_SHIPPING_THRESHOLD_PKR || items.length === 0;

  const shippingPKR = items.length === 0 || isFreeShipping ? 0 : STANDARD_SHIPPING_PKR;
  const shippingUSD =
    items.length === 0 || subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD ? 0 : STANDARD_SHIPPING_USD;

  const totalPKR = Math.max(0, subtotalPKR - discountPKR + shippingPKR);
  const totalUSD = Math.max(0, subtotalUSD - discountUSD + shippingUSD);

  const remainingForFreeShippingPKR = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_PKR - subtotalPKR
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
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
        freeShippingThresholdPKR: FREE_SHIPPING_THRESHOLD_PKR,
        freeShippingThresholdUSD: FREE_SHIPPING_THRESHOLD_USD,
        remainingForFreeShippingPKR,
        isFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
