import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { playSuccessChime, playTactileClick } from '../utils/audio';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kuro_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('kuro_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        playTactileClick();
        return prev.filter((p) => p.id !== product.id);
      } else {
        playSuccessChime();
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    playTactileClick();
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const openWishlist = () => {
    playTactileClick();
    setIsWishlistOpen(true);
  };

  const closeWishlist = () => {
    playTactileClick();
    setIsWishlistOpen(false);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
