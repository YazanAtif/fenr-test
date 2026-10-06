import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ArrowRight,
  Scissors,
  Check,
  Disc
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import {
  getSoundEnabled,
  setSoundEnabled,
  playTactileClick,
  playFabricRollSound,
  playThreadStitchSound,
} from '../utils/audio';
import {
  FabricRollCategoryItem,
  FabricCategoryConfig,
} from './FabricRollCategoryItem';

interface NavbarProps {
  onOpenSearch: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

// 5 Core Textile Categories with Couture Sub-Items & Fabric Dye Concepts
const FABRIC_CATEGORIES: FabricCategoryConfig[] = [
  {
    id: 'men',
    name: 'MEN',
    japaneseLabel: '',
    dyeColor: '#F0EDE8',
    dyeLightColor: '#121212',
    fabricSpecs: '480 GSM LOOPBACK FRENCH TERRY',
    subItems: [
      { label: '480GSM Heavyweight Hoodies', inchMark: '01"', badge: 'SIGNATURE' },
      { label: 'Boxy Drop-Shoulder Graphic Tees', inchMark: '02"' },
      { label: 'Tactical Cargos & Parachute Pants', inchMark: '03"' },
      { label: 'Raw Selvedge Overshirts', inchMark: '04"' },
    ],
  },
  {
    id: 'women',
    name: 'WOMEN',
    japaneseLabel: '',
    dyeColor: '#9E6B6B',
    dyeLightColor: '#844D4D',
    fabricSpecs: '380 GSM COMBED COTTON',
    subItems: [
      { label: 'Cropped Archival Hoodies', inchMark: '01"', badge: 'BESTSELLER' },
      { label: 'Vintage Oversized Boxy Tees', inchMark: '02"' },
      { label: 'Technical Parachute Trousers', inchMark: '03"' },
      { label: 'Minimalist Two-Piece Atelier Sets', inchMark: '04"' },
    ],
  },
  {
    id: 'accessories',
    name: 'ACCESSORIES',
    japaneseLabel: '',
    dyeColor: '#5B6A8A',
    dyeLightColor: '#364768',
    fabricSpecs: 'CORDURA® 1000D NYLON',
    subItems: [
      { label: 'Weatherproof Balaclavas & Beanies', inchMark: '01"' },
      { label: 'Cordura® Crossbody Chest Bags', inchMark: '02"', badge: 'WATERPROOF' },
      { label: 'Tactical Quick-Release Belts', inchMark: '03"' },
      { label: 'Embroidered Archive Caps', inchMark: '04"' },
    ],
  },
  {
    id: 'new-arrivals',
    name: 'NEW ARRIVALS',
    japaneseLabel: '',
    dyeColor: '#E62846',
    dyeLightColor: '#C41E3A',
    fabricSpecs: 'SPECIMEN 001',
    subItems: [
      { label: 'Collection 001 [A/W 2026]', inchMark: '01"', badge: 'RUNWAY' },
      { label: 'Mineral Discharge Screenprints', inchMark: '02"' },
      { label: 'Raw Mineral Wash Pieces', inchMark: '03"' },
      { label: 'Weatherproof Rainwear Capsule', inchMark: '04"' },
    ],
  },
  {
    id: 'sale',
    name: 'SALE',
    japaneseLabel: '',
    dyeColor: '#A67C52',
    dyeLightColor: '#8C5E33',
    fabricSpecs: 'ARCHIVE CLEARANCE',
    subItems: [
      { label: 'Archive Vault Clearance [-40%]', inchMark: '01"', badge: '-40%' },
      { label: 'Last Run Archive Sizes', inchMark: '02"' },
      { label: 'Sample Room Factory Overruns', inchMark: '03"' },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onNavigate, activeSection }) => {
  const { openCart, totalCount } = useCart();
  const { openWishlist, wishlist } = useWishlist();
  const { currency, setCurrency } = useCurrency();
  const { theme, lightingState, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  // State: Scroll Position & Scroll Direction (for Spool Mechanics)
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSpooled, setIsSpooled] = useState(false);
  const lastScrollYRef = useRef(0);

  // Active Category State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('men');
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);

  // Mobile Fabric Swatch Navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  // Track Scroll for Textile Spooling Interaction
  useEffect(() => {
    setSoundActive(getSoundEnabled());

    const handleScroll = () => {
      const curY = window.scrollY;
      const lastY = lastScrollYRef.current;
      const delta = curY - lastY;

      setIsScrolled(curY > 30);

      // Scroll Down -> Spool away text (roll onto bolt)
      // Scroll Up -> Unspool text back into full navigation
      if (curY > 80 && delta > 4) {
        setIsSpooled(true);
      } else if (delta < -4 || curY < 40) {
        setIsSpooled(false);
      }

      lastScrollYRef.current = curY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    if (next) playTactileClick();
  };

  const handleCategorySelect = (categoryId: string, subLabel?: string) => {
    setSelectedCategoryId(categoryId);
    setActiveSubItem(subLabel || null);
    onNavigate('shop');
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    playTactileClick();
    onNavigate('hero');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? isLight
              ? 'bg-[#F7F4EE]/95 backdrop-blur-md border-b border-black/10 shadow-sm py-2.5 sm:py-3'
              : 'bg-kuro-base/92 backdrop-blur-md border-b border-kuro-divider shadow-sm py-2.5 sm:py-3'
            : isLight
            ? 'bg-[#F7F4EE]/90 backdrop-blur-sm border-b border-black/5 py-4 sm:py-5'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LEFT: Wordmark Logo & Spool Status Indicator */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogoClick}
                className="group flex items-center space-x-2.5 text-left focus:outline-none"
              >
                <BrandLogo
                  interactive="nav"
                  className="h-6 sm:h-7.5 w-auto max-w-[115px] sm:max-w-[125px] transition-opacity"
                />
              </button>
            </div>

            {/* CENTER: DESKTOP FABRIC ROLL NAVIGATION */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-5 relative">
              {/* If Spooled Down: Show sleek minimal spool indicator */}
              <div
                className={`transition-all duration-400 flex items-center space-x-2 lg:space-x-5 ${
                  isSpooled
                    ? 'opacity-30 hover:opacity-100 scale-95 cursor-pointer'
                    : 'opacity-100 scale-100'
                }`}
                onClick={() => {
                  if (isSpooled) {
                    playFabricRollSound();
                    setIsSpooled(false);
                  }
                }}
              >
                {FABRIC_CATEGORIES.map((cat) => (
                  <FabricRollCategoryItem
                    key={cat.id}
                    category={cat}
                    isActive={selectedCategoryId === cat.id}
                    onSelectCategory={handleCategorySelect}
                    isCompactSpool={isSpooled}
                  />
                ))}
              </div>

              {/* Spooled Minimal Pill Bar Overlay */}
              {isSpooled && (
                <div
                  onClick={() => {
                    playFabricRollSound();
                    setIsSpooled(false);
                  }}
                  className={`absolute -bottom-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 border text-[8px] font-mono tracking-widest uppercase rounded-full cursor-pointer animate-pulse transition-colors ${
                    isLight
                      ? 'bg-black/10 border-black/20 text-black hover:bg-black hover:text-white'
                      : 'bg-kuro-charcoal border-kuro-divider text-canvas-cream hover:border-white'
                  }`}
                  title="Click to unspool navigation"
                >
                  ▲ UNSPOOL NAV
                </div>
              )}
            </nav>

            {/* RIGHT: Actions & Mobile Fabric Swatch Trigger */}
            <div className="flex items-center space-x-1.5 sm:space-x-3.5">
              {/* Currency Switcher (Desktop) */}
              <button
                onClick={() => {
                  playTactileClick();
                  setCurrency(currency === 'PKR' ? 'USD' : 'PKR');
                }}
                className={`hidden sm:flex items-center space-x-1 px-2.5 py-1.5 border text-[10px] font-mono tracking-wider transition-colors ${
                  isLight
                    ? 'border-black/20 text-black hover:border-black bg-black/5'
                    : 'border-kuro-divider text-canvas-offwhite/80 hover:text-white hover:border-canvas-cream/40'
                }`}
                title="Toggle Currency (PKR / USD)"
              >
                <span className={currency === 'PKR' ? (isLight ? 'text-black font-bold' : 'text-canvas-cream font-bold') : 'opacity-40'}>
                  PKR
                </span>
                <span className="opacity-30">/</span>
                <span className={currency === 'USD' ? (isLight ? 'text-black font-bold' : 'text-canvas-cream font-bold') : 'opacity-40'}>
                  USD
                </span>
              </button>

              {/* Sound Toggle (Desktop) */}
              <button
                onClick={toggleSound}
                className={`hidden sm:flex p-2 transition-colors ${
                  isLight ? 'text-black hover:opacity-75' : 'text-canvas-offwhite/70 hover:text-white'
                }`}
                title={soundActive ? 'Mute tactile clicks' : 'Enable tactile clicks'}
              >
                {soundActive ? <Volume2 className="w-4 h-4 text-[#E62846]" /> : <VolumeX className="w-4 h-4 opacity-50" />}
              </button>

              {/* Tokyo Lights Dark / Light Mode Reactive Toggle */}
              <button
                onClick={() => {
                  playTactileClick();
                  toggleTheme();
                }}
                className={`relative p-2 rounded-full border transition-all duration-300 ${
                  lightingState === 'igniting'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-500 shadow-[0_0_18px_rgba(255,191,0,0.6)] scale-110'
                    : lightingState === 'dimming'
                    ? 'border-purple-500/40 bg-purple-500/10 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : isLight
                    ? 'border-black/20 text-black hover:bg-black/5'
                    : 'border-kuro-divider hover:border-canvas-cream/40 text-canvas-offwhite/80 hover:text-white'
                }`}
                title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className={`w-4 h-4 ${lightingState === 'igniting' ? 'animate-spin' : ''}`} />
                ) : (
                  <Moon className="w-4 h-4 text-black" />
                )}
                {lightingState === 'igniting' && (
                  <span className="absolute inset-0 rounded-full animate-ping border border-amber-400 opacity-60 pointer-events-none" />
                )}
              </button>

              {/* Search Trigger */}
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenSearch();
                }}
                className={`p-2 transition-colors ${
                  isLight ? 'text-black hover:opacity-75' : 'text-canvas-offwhite/70 hover:text-white'
                }`}
                title="Search archive"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist Trigger */}
              <button
                onClick={openWishlist}
                className={`hidden sm:flex relative p-2 transition-colors ${
                  isLight ? 'text-black hover:opacity-75' : 'text-canvas-offwhite/70 hover:text-white'
                }`}
                title="View Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Trigger */}
              <button
                onClick={openCart}
                className={`relative flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 border transition-colors ${
                  isLight
                    ? 'bg-black/10 hover:bg-black/15 border-black/20 text-black font-bold'
                    : 'bg-kuro-off hover:bg-kuro-charcoal border-kuro-divider hover:border-canvas-cream/40 text-white'
                }`}
                title="View Cart"
              >
                <ShoppingBag className={`w-4 h-4 ${isLight ? 'text-black' : 'text-canvas-cream'}`} />
                <span className={`text-xs font-mono tracking-wider ${isLight ? 'text-black font-bold' : ''}`}>
                  {totalCount}
                </span>
              </button>

              {/* MOBILE: FABRIC SWATCH ICON BUTTON (Replacing generic hamburger) */}
              <button
                onClick={() => {
                  playFabricRollSound();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className={`md:hidden relative flex items-center space-x-1.5 px-2.5 py-1.5 border transition-all duration-300 ${
                  mobileMenuOpen
                    ? 'border-[#E62846] bg-[#E62846]/10 text-[#E62846]'
                    : isLight
                    ? 'border-black/25 bg-black/5 text-black hover:border-black'
                    : 'border-kuro-divider bg-kuro-off text-canvas-offwhite hover:border-canvas-cream/50'
                }`}
                title="Fabric Swatch Menu"
                aria-label="Toggle Textile Swatch Menu"
              >
                {/* Visual Tailor's Swatch Card Icon */}
                <div className="relative w-4 h-4 flex flex-col justify-between py-0.5">
                  <span className="w-full h-0.5 bg-current rounded-none" />
                  <span className="w-3/4 h-0.5 bg-current rounded-none opacity-80" />
                  <span className="w-full h-0.5 bg-current rounded-none" />
                  {/* Miniature Pinked Serrated Edge */}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 swatch-pinked-edge text-current opacity-60" />
                </div>
                <span className="text-[9px] font-mono tracking-widest font-bold">
                  {mobileMenuOpen ? 'CLOSE' : 'SWATCH'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN FABRIC SWATCH UNFURL MENU */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col justify-between p-5 pt-20 overflow-y-auto woven-texture ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-6'
        } ${isLight ? 'bg-[#F9F7F2]/98 text-black' : 'bg-kuro-base/98 text-canvas-offwhite'}`}
      >
        <div className="flex flex-col space-y-4">
          {/* Header Specs Bar */}
          <div
            className={`flex items-center justify-between text-[9px] font-mono tracking-[0.25em] uppercase border-b pb-2 pt-2 ${
              isLight ? 'border-black/15 text-neutral-600' : 'border-kuro-divider text-canvas-cream/50'
            }`}
          >
            <span>COLLECTION DIRECTORY</span>
            <span>5 CATEGORIES</span>
          </div>

          {/* Quick Search */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 border text-xs font-mono tracking-wider transition-colors ${
              isLight
                ? 'bg-black/5 border-black/15 text-neutral-800'
                : 'bg-kuro-off border-kuro-divider text-canvas-cream/60'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-[#E62846]" />
              <span>SEARCH ARCHIVAL PIECES...</span>
            </span>
            <span className="text-[9px] font-mono opacity-50">OPEN</span>
          </button>

          {/* FABRIC SWATCH SAMPLE CARDS: Alternating Left & Right Roll-In */}
          <div className="space-y-3 pt-1">
            {FABRIC_CATEGORIES.map((cat, idx) => {
              const isEven = idx % 2 === 0;
              const isSelected = selectedCategoryId === cat.id;
              const activeDye = isLight ? cat.dyeLightColor : cat.dyeColor;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`relative p-3.5 border transition-all duration-400 cursor-pointer overflow-hidden group ${
                    mobileMenuOpen
                      ? 'translate-x-0 opacity-100'
                      : isEven
                      ? '-translate-x-12 opacity-0'
                      : 'translate-x-12 opacity-0'
                  } ${
                    isSelected
                      ? isLight
                        ? 'border-black bg-black/10'
                        : 'border-[#E62846] bg-kuro-charcoal'
                      : isLight
                      ? 'border-black/15 bg-white/60 hover:bg-black/5'
                      : 'border-kuro-divider bg-kuro-off hover:bg-kuro-charcoal/80'
                  }`}
                  style={{
                    transitionDelay: `${idx * 50}ms`,
                  }}
                >
                  {/* Measuring Tape Left Ruler Markings */}
                  <div className="absolute left-0 top-0 bottom-0 w-2.5 measuring-tape-ruler border-r border-current/10 opacity-40" />

                  {/* Swatch Header: Spec */}
                  <div className="flex items-center justify-between pl-3 text-[9px] font-mono tracking-widest opacity-60 mb-1">
                    <span>{cat.fabricSpecs}</span>
                  </div>

                  {/* Main Category Wordmark with Running Stitch Line */}
                  <div className="flex items-center justify-between pl-3">
                    <span
                      className="font-display text-2xl sm:text-3xl tracking-[0.14em] uppercase transition-colors"
                      style={{ color: isSelected ? activeDye : undefined }}
                    >
                      {cat.name}
                    </span>

                    <div className="flex items-center space-x-2">
                      {isSelected && (
                        <span className="flex items-center space-x-1 text-[9px] font-mono text-[#E62846] font-bold">
                          <Check className="w-3 h-3" />
                          <span>SELECTED</span>
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Running Stitch Underline for active state */}
                  {isSelected && (
                    <div className="ml-3 mt-1.5 h-[2px] bg-[#E62846] animate-pulse" />
                  )}

                  {/* Sub-Items Preview */}
                  <div className="pl-3 mt-2 flex flex-wrap gap-1.5">
                    {cat.subItems.slice(0, 2).map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className={`text-[9px] font-mono px-1.5 py-0.5 border ${
                          isLight
                            ? 'border-black/10 bg-black/5 text-neutral-700'
                            : 'border-kuro-divider bg-kuro-charcoal/60 text-canvas-cream/70'
                        }`}
                      >
                        {sub.inchMark} {sub.label}
                      </span>
                    ))}
                  </div>

                  {/* Pinked Zig-Zag Serrated Edge at Bottom */}
                  <div className="absolute -bottom-1 left-0 right-0 h-1 swatch-pinked-edge text-current opacity-30 pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Settings & Footer Specs */}
        <div className={`border-t pt-4 mt-4 space-y-3 ${isLight ? 'border-black/15' : 'border-kuro-divider'}`}>
          <div className="grid grid-cols-2 gap-2">
            {/* Wishlist */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openWishlist();
              }}
              className={`flex items-center justify-center space-x-2 py-2 px-3 border text-xs font-mono ${
                isLight ? 'border-black/20 bg-black/5 text-black' : 'border-kuro-divider bg-kuro-off text-canvas-cream'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-accent-rose" />
              <span>WISHLIST ({wishlist.length})</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`flex items-center justify-center space-x-2 py-2 px-3 border text-xs font-mono ${
                isLight ? 'border-black/20 bg-black/5 text-black' : 'border-kuro-divider bg-kuro-off text-canvas-cream'
              }`}
            >
              {soundActive ? (
                <Volume2 className="w-3.5 h-3.5 text-[#E62846]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 opacity-50" />
              )}
              <span>{soundActive ? 'SOUND ON' : 'MUTED'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono opacity-60">
            <span>STORE CURRENCY: {currency}</span>
            <span>AUTUMN / WINTER 2026</span>
          </div>
        </div>
      </div>
    </>
  );
};
