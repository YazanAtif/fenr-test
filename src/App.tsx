import React, { useState } from 'react';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { PRODUCTS } from './data/products';
import { Product, ProductSize, Order } from './types';

// Components
import { CustomCursor } from './components/CustomCursor';
import { TokyoLightingEffect } from './components/TokyoLightingEffect';
import { AnimatePresence } from 'motion/react';
import { TokyoTopographicBackground } from './components/TokyoTopographicBackground';
import { PageLoader } from './components/PageLoader';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DualScrollSection } from './components/DualScrollSection';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { SizeChartModal } from './components/SizeChartModal';
import { SizeChatBot } from './components/SizeChatBot';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { ArticlesSection } from './components/ArticlesSection';
import { DropsCountdown } from './components/DropsCountdown';
import { SocialProofUGC } from './components/SocialProofUGC';
import { AboutSection } from './components/AboutSection';
import { SearchDrawer } from './components/SearchDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { NewsletterPopup } from './components/NewsletterPopup';
import { Footer } from './components/Footer';

export const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Modal & Drawer states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeChartProduct, setSizeChartProduct] = useState<Product | null>(null);
  const [isSizeBotOpen, setIsSizeBotOpen] = useState(false);
  const [selectedSizeOverride, setSelectedSizeOverride] = useState<ProductSize | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Smooth Section Navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleSelectProductId = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  const handleSizeBotSelectSize = (size: ProductSize) => {
    setSelectedSizeOverride(size);
  };

  return (
    <div
      className={`relative min-h-screen transition-colors duration-700 ${
        isLight
          ? 'bg-[#F5F1EB] text-[#121212] selection:bg-black/15 selection:text-black'
          : 'bg-kuro-base text-canvas-offwhite selection:bg-accent-amber/25 selection:text-white'
      }`}
    >
      {/* Precision Custom Cursor */}
      <CustomCursor />

      {/* Cinematic Tokyo Lights Ambient Lighting Effect */}
      <TokyoLightingEffect />

      {/* Architectural Tokyo Topographic & Sonar Wave Background (ACRONYM / Nike ISPA style) */}
      <TokyoTopographicBackground />

      {/* Awwwards / Nike-style Kinetic Multi-Layer Curtain Page Loader */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <PageLoader
            key="preloader"
            words={["JUST", "DO", "IT."]}
            duration={2}
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>

      {/* Fixed Minimal Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Hero Section */}
      <div id="hero">
        <Hero
          onExploreClick={() => handleNavigate('shop')}
          onLookbookClick={() => handleNavigate('lookbook')}
        />
      </div>

      {/* Vintage Comic & Editorial Articles Section */}
      <ArticlesSection onSelectProduct={handleSelectProductId} />

      {/* Product Catalog Grid (Phase 1: Graphic Tees & Hoodies) */}
      <ProductGrid
        products={PRODUCTS}
        onOpenProduct={handleOpenProduct}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Dual-Scroll Lookbook & Blueprint Exhibit (Rotated Watermark on Left) */}
      <DualScrollSection onSelectProduct={handleSelectProductId} />

      {/* Drops Countdown & Early Access Timer */}
      <DropsCountdown />

      {/* Social Proof & UGC Instagram Grid */}
      <SocialProofUGC />

      {/* Brand Ethos & Price Matrix */}
      <AboutSection />

      {/* Minimal Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* INTERACTIVE MODALS & DRAWERS */}

      {/* Full Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        allProducts={PRODUCTS}
        isOpen={selectedProduct !== null}
        onClose={() => {
          setSelectedProduct(null);
          setSelectedSizeOverride(null);
        }}
        onOpenSizeChart={(p) => setSizeChartProduct(p)}
        onOpenFitBot={(p) => {
          setSelectedProduct(p);
          setIsSizeBotOpen(true);
        }}
        onSelectRelatedProduct={(p) => setSelectedProduct(p)}
        selectedSizeOverride={selectedSizeOverride}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetail={(p) => {
          setQuickViewProduct(null);
          setSelectedProduct(p);
        }}
      />

      {/* Size Guide Table Modal */}
      {sizeChartProduct && (
        <SizeChartModal
          product={sizeChartProduct}
          isOpen={sizeChartProduct !== null}
          onClose={() => setSizeChartProduct(null)}
          onOpenAssistant={() => {
            setSizeChartProduct(null);
            setIsSizeBotOpen(true);
          }}
        />
      )}

      {/* Conversational Sizing Assistant Bot (Floating bubble bottom-right) */}
      <SizeChatBot
        currentProduct={selectedProduct || quickViewProduct || PRODUCTS[0]}
        onSelectSize={handleSizeBotSelectSize}
        isOpen={isSizeBotOpen}
        onToggle={() => setIsSizeBotOpen(!isSizeBotOpen)}
        onClose={() => setIsSizeBotOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        onOpenProduct={handleOpenProduct}
      />

      {/* Search Drawer */}
      <SearchDrawer
        products={PRODUCTS}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleOpenProduct}
      />

      {/* Checkout Terminal Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Vintage Postcard Newsletter Popup */}
      <NewsletterPopup />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;
