import React, { useState, useEffect } from 'react';
import { Timer, Bell, Check, Sparkles } from 'lucide-react';
import { DROPS } from '../data/drops';
import { playSuccessChime, playTactileClick } from '../utils/audio';

export const DropsCountdown: React.FC = () => {
  const upcomingDrop = DROPS[0];
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 19,
  });
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const targetDate = new Date(upcomingDrop.releaseDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [upcomingDrop.releaseDate]);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playSuccessChime();
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <section id="drops" className="py-20 bg-kuro-base relative border-b border-kuro-divider overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-kuro-divider bg-kuro-off p-8 sm:p-12 relative overflow-hidden">
          {/* Halftone ambient background */}
          <div className="absolute inset-0 halftone-overlay opacity-10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Drop Details & Ticking Countdown */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.3em] text-accent-rose uppercase">
                <Timer className="w-3.5 h-3.5" />
                <span>UPCOMING ARCHIVE RELEASE // LIMITED DROP</span>
              </div>

              <h2 className="font-display text-4xl sm:text-6xl tracking-[0.12em] text-white uppercase leading-none">
                {upcomingDrop.title}
              </h2>

              <p className="text-xs sm:text-sm text-canvas-cream/80 font-body leading-relaxed max-w-xl">
                {upcomingDrop.description}
              </p>

              {/* Ticking Countdown Boxes */}
              <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md">
                <div className="bg-kuro-base border border-kuro-divider p-3 sm:p-4 text-center">
                  <div className="font-display text-3xl sm:text-4xl text-white">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] font-mono tracking-widest text-canvas-cream/50 uppercase mt-1">
                    DAYS
                  </div>
                </div>

                <div className="bg-kuro-base border border-kuro-divider p-3 sm:p-4 text-center">
                  <div className="font-display text-3xl sm:text-4xl text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] font-mono tracking-widest text-canvas-cream/50 uppercase mt-1">
                    HOURS
                  </div>
                </div>

                <div className="bg-kuro-base border border-kuro-divider p-3 sm:p-4 text-center">
                  <div className="font-display text-3xl sm:text-4xl text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] font-mono tracking-widest text-canvas-cream/50 uppercase mt-1">
                    MINS
                  </div>
                </div>

                <div className="bg-kuro-base border border-kuro-divider p-3 sm:p-4 text-center">
                  <div className="font-display text-3xl sm:text-4xl text-accent-amber">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] font-mono tracking-widest text-canvas-cream/50 uppercase mt-1">
                    SECS
                  </div>
                </div>
              </div>

              {/* Notification Form */}
              <div className="pt-2">
                {isSubscribed ? (
                  <div className="flex items-center space-x-2 text-xs font-mono text-accent-olive bg-accent-olive/10 border border-accent-olive/30 p-3 max-w-md">
                    <Check className="w-4 h-4" />
                    <span>PRIORITY ACCESS CONFIRMED. SMS & EMAIL ALERT ARMED.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="flex max-w-md space-x-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email for drop alert..."
                      className="flex-1 bg-kuro-base border border-kuro-divider px-3.5 py-2.5 text-xs text-white placeholder-canvas-cream/40 focus:outline-none focus:border-canvas-cream font-mono"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-canvas-cream hover:bg-white text-kuro-base font-heading text-xs tracking-widest uppercase font-bold transition-all flex items-center space-x-1.5 shadow"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>NOTIFY ME</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Teaser Gallery */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] bg-kuro-gray overflow-hidden border border-kuro-divider">
                <img
                  src={upcomingDrop.images[0]}
                  alt="Drop preview 1"
                  className="w-full h-full object-cover filter contrast-110"
                />
              </div>
              <div className="aspect-[3/4] bg-kuro-gray overflow-hidden border border-kuro-divider mt-6">
                <img
                  src={upcomingDrop.images[1]}
                  alt="Drop preview 2"
                  className="w-full h-full object-cover filter contrast-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
