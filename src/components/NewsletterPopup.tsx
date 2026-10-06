import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Mail } from 'lucide-react';
import { playSuccessChime, playTactileClick } from '../utils/audio';

export const NewsletterPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('kuro_newsletter_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000); // 10 seconds per requirements

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    playTactileClick();
    setIsOpen(false);
    localStorage.setItem('kuro_newsletter_dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playSuccessChime();
    setIsSubmitted(true);
    localStorage.setItem('kuro_newsletter_dismissed', 'true');
    setTimeout(() => {
      setIsOpen(false);
    }, 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kuro-base/80 backdrop-blur-md animate-fade-in">
      {/* VINTAGE POSTCARD / MAGAZINE CLIPPING STYLING */}
      <div className="relative w-full max-w-lg bg-[#F5F0EB] text-[#0A0A0A] border-4 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] p-6 sm:p-10 animate-slide-up">
        {/* Subtle Ben-Day texture overlay on the postcard */}
        <div className="absolute inset-0 comic-dots opacity-20 pointer-events-none" />

        {/* Close Button as a stamped badge */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 bg-[#0A0A0A] text-white p-1.5 hover:bg-accent-rose transition-colors"
          title="Dismiss postcard"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Postcard Stamp Box in Top Left */}
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase mb-4 border-b border-[#0A0A0A]/30 pb-3">
          <span className="comic-stamp bg-[#0A0A0A] text-white px-2 py-0.5">
            NEWSLETTER // ARCHIVE DISPATCH
          </span>
          <span className="text-[#0A0A0A]/60">OFFICIAL ARCHIVE DISPATCH</span>
        </div>

        {/* Headline */}
        <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-[#0A0A0A] leading-tight mb-2">
          TAKE 10% OFF YOUR FIRST ARCHIVE PIECE
        </h3>

        <p className="font-editorial text-sm sm:text-base text-[#0A0A0A]/80 leading-relaxed mb-6">
          Subscribe to confidential drops, restock frequencies, and receive voucher code <strong className="font-mono text-[#0A0A0A] underline">FENR10</strong> directly in your inbox.
        </p>

        {isSubmitted ? (
          <div className="p-4 bg-[#0A0A0A] text-white text-xs font-mono flex items-center space-x-2 animate-fade-in">
            <Check className="w-4 h-4 text-accent-olive" />
            <span>WELCOME TO THE CLAN. CODE "FENR10" HAS BEEN APPLIED!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-white border-2 border-[#0A0A0A] px-3.5 py-3 text-xs text-[#0A0A0A] placeholder-[#0A0A0A]/40 font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#0A0A0A] hover:bg-[#222222] text-white font-heading text-xs tracking-widest uppercase font-bold transition-all shadow"
              >
                CLAIM 10%
              </button>
            </div>
            <p className="text-[10px] font-mono text-[#0A0A0A]/50">
              No junk mail. Ever. Only heavyweight releases and secret drops.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
