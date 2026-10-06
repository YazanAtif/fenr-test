import React, { useState } from 'react';
import { ArrowUp, Instagram, Twitter, ShieldCheck, Truck, Check } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { playSuccessChime, playTactileClick } from '../utils/audio';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenTracking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTracking }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playSuccessChime();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  const scrollToTop = () => {
    playTactileClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-kuro-base border-t border-kuro-divider pt-16 pb-12 text-canvas-offwhite relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 halftone-overlay opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Column 1 & 2: Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <BrandLogo className="h-8 sm:h-9 w-auto" />
            </div>

            <p className="text-xs sm:text-sm text-canvas-cream/70 font-body max-w-sm leading-relaxed">
              Luxury feel, affordable pricing — premium without the markup. Inspired by contemporary architectural minimalism meets vintage comic book culture. Built different. Priced fair.
            </p>

            <div className="pt-2 text-[11px] font-mono text-accent-olive">
              KARACHI ⇄ LAHORE // DIRECT-TO-COMMUNITY
            </div>
          </div>

          {/* Column 3: Navigation Links */}
          <div>
            <h4 className="text-[11px] font-mono tracking-widest text-canvas-cream/50 uppercase mb-4">
              ARCHIVE INDEX
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="text-canvas-cream/80 hover:text-white transition-colors"
                >
                  SHOP ALL PIECES
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('drops')}
                  className="text-canvas-cream/80 hover:text-white transition-colors"
                >
                  UPCOMING DROPS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lookbook')}
                  className="text-canvas-cream/80 hover:text-white transition-colors"
                >
                  DUAL-SCROLL LOOKBOOK
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('articles')}
                  className="text-canvas-cream/80 hover:text-white transition-colors"
                >
                  VINTAGE COMIC GAZETTE
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Services & Tracking */}
          <div>
            <h4 className="text-[11px] font-mono tracking-widest text-canvas-cream/50 uppercase mb-4">
              COMMUNITY SUPPORT
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="text-accent-olive hover:underline underline-offset-4 flex items-center space-x-1"
                >
                  <span>TRACK ORDER (TCS/LEOPARDS)</span>
                </button>
              </li>
              <li>
                <span className="text-canvas-cream/70">14-DAY SIZE EXCHANGES</span>
              </li>
              <li>
                <span className="text-canvas-cream/70">FREE SHIPPING OVER RS. 5,000</span>
              </li>
              <li>
                <span className="text-canvas-cream/70">WHATSAPP: +92 300 1234567</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div>
            <h4 className="text-[11px] font-mono tracking-widest text-canvas-cream/50 uppercase mb-4">
              CONFIDENTIAL DISPATCH
            </h4>
            <p className="text-xs text-canvas-cream/70 font-body mb-3">
              Never miss a 460GSM restock. No spam. Only archive alerts.
            </p>

            {subscribed ? (
              <div className="p-2.5 bg-kuro-off border border-accent-olive/40 text-[11px] font-mono text-accent-olive flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>FREQUENCY ARMED</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  className="w-full bg-kuro-off border border-kuro-divider px-3 py-2 text-xs text-white placeholder-canvas-cream/30 focus:outline-none focus:border-canvas-cream font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-canvas-cream hover:bg-white text-kuro-base font-heading text-xs tracking-widest uppercase font-bold transition-all shadow"
                >
                  JOIN THE CLAN
                </button>
              </form>
            )}
          </div>
        </div>

        {/* LOGISTICS & PAYMENT PARTNER BADGES */}
        <div className="border-t border-kuro-divider py-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Payment Gateway Logos */}
          <div>
            <span className="text-[10px] font-mono text-canvas-cream/50 uppercase tracking-widest block mb-2">
              ACCEPTED PAYMENT PLATFORMS (PAKISTAN & GLOBAL)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 border border-kuro-divider bg-kuro-off text-[10px] font-mono font-bold text-white">
                EASYPAISA
              </span>
              <span className="px-2.5 py-1 border border-kuro-divider bg-kuro-off text-[10px] font-mono font-bold text-[#FF7043]">
                SADAPAY
              </span>
              <span className="px-2.5 py-1 border border-kuro-divider bg-kuro-off text-[10px] font-mono font-bold text-[#0066FF]">
                NAYAPAY
              </span>
              <span className="px-2.5 py-1 border border-kuro-divider bg-kuro-off text-[10px] font-mono font-bold text-white">
                CASH ON DELIVERY (COD)
              </span>
              <span className="px-2.5 py-1 border border-kuro-divider bg-kuro-off text-[10px] font-mono font-bold text-white">
                VISA / MASTERCARD
              </span>
            </div>
          </div>

          {/* Courier Logistics */}
          <div className="md:text-right">
            <span className="text-[10px] font-mono text-canvas-cream/50 uppercase tracking-widest block mb-2">
              EXPRESS COURIER FULFILLMENT
            </span>
            <div className="flex flex-wrap items-center md:justify-end gap-2">
              <span className="px-2.5 py-1 border border-kuro-divider bg-kuro-off text-[10px] font-mono text-canvas-cream">
                TCS EXPRESS (24H)
              </span>
              <span className="px-2.5 py-1 border border-kuro-divider bg-kuro-off text-[10px] font-mono text-canvas-cream">
                LEOPARDS COURIER
              </span>
              <span className="px-2.5 py-1 border border-kuro-divider bg-kuro-off text-[10px] font-mono text-canvas-cream">
                RIDER PK
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & SCROLL TO TOP */}
        <div className="border-t border-kuro-divider pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-canvas-cream/50 gap-4">
          <div>
            © 2026 FENR STUDIOS. ALL RIGHTS RESERVED. ARCHIVE REGISTER NO. 91823.
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 text-canvas-cream hover:text-white transition-colors"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
