import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, MapPin, Package } from 'lucide-react';
import { playSuccessChime, playTactileClick } from '../utils/audio';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [trackingInput, setTrackingInput] = useState('');
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    playSuccessChime();
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kuro-base/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-kuro-off border border-kuro-divider shadow-2xl p-6 sm:p-8 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => {
            playTactileClick();
            onClose();
          }}
          className="absolute top-5 right-5 text-canvas-cream/60 hover:text-white p-1"
          title="Close tracking"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.3em] text-accent-olive uppercase mb-2">
          <Truck className="w-3.5 h-3.5" />
          <span>COURIER SATELLITE DISPATCH TRACKER</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wider mb-2">
          TRACK YOUR ARCHIVE SHIPMENT
        </h3>
        <p className="text-xs text-canvas-cream/70 font-body mb-6">
          Enter your FENR Order ID (e.g. <strong className="text-white">#FENR-84920</strong>) or TCS / Leopards tracking number.
        </p>

        {/* Search Input */}
        <form onSubmit={handleTrackSubmit} className="flex space-x-2 mb-8">
          <input
            type="text"
            required
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            placeholder="e.g. FENR-84920 or TCS-PK-98214"
            className="flex-1 bg-kuro-base border border-kuro-divider px-3.5 py-3 text-xs text-white uppercase font-mono placeholder-canvas-cream/30 focus:outline-none focus:border-canvas-cream"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-canvas-cream hover:bg-white text-kuro-base font-heading text-xs tracking-widest uppercase font-bold transition-all shadow"
          >
            TRACK
          </button>
        </form>

        {/* Simulated Live Tracking Response */}
        {searched && (
          <div className="bg-kuro-base border border-kuro-divider p-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-kuro-divider pb-4">
              <div>
                <span className="text-[10px] font-mono text-canvas-cream/50 uppercase block">
                  ORDER REFERENCE
                </span>
                <span className="font-mono text-sm font-bold text-white uppercase">
                  {trackingInput.toUpperCase().startsWith('FENR-') ? trackingInput.toUpperCase() : `#FENR-84920`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-canvas-cream/50 uppercase block">
                  LOGISTICS CARRIER
                </span>
                <span className="font-mono text-xs text-accent-olive font-bold">
                  TCS EXPRESS AIR DISPATCH
                </span>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="space-y-4 pl-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-accent-olive">
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-accent-olive" />
                <div className="text-xs font-mono font-bold text-white">ORDER VERIFIED & MILLED COTTON PACKAGED</div>
                <div className="text-[10px] font-mono text-canvas-cream/50">Karachi Atelier Hub // Complete</div>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-accent-olive" />
                <div className="text-xs font-mono font-bold text-white">DISPATCHED TO DESTINATION LOGISTICS DEPOT</div>
                <div className="text-[10px] font-mono text-canvas-cream/50">TCS Air Cargo // In Transit</div>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-accent-amber animate-pulse" />
                <div className="text-xs font-mono font-bold text-accent-amber">OUT FOR DOORSTEP DELIVERY</div>
                <div className="text-[10px] font-mono text-canvas-cream/50">Courier Rider Assigned // Expected Today before 6:00 PM</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
