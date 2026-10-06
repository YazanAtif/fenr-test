import React, { useState } from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { playTactileClick } from '../utils/audio';

interface SizeChartModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onOpenAssistant: () => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  product,
  isOpen,
  onClose,
  onOpenAssistant,
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kuro-base/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-kuro-off border border-kuro-divider p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            playTactileClick();
            onClose();
          }}
          className="absolute top-5 right-5 text-canvas-cream/60 hover:text-white transition-colors"
          title="Close size guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] text-accent-olive uppercase mb-2">
          <Ruler className="w-3.5 h-3.5" />
          <span>SPECIFICATION & SIZING MATRIX</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl tracking-[0.12em] text-white uppercase mb-2">
          {product.name}
        </h3>
        <p className="text-xs text-canvas-cream/70 font-body mb-6">
          Measurements are taken with the garment laid flat. For an oversized boxy drape, choose your true size. For a snugger fit, size down one step.
        </p>

        {/* Unit Selector (Inches / Centimeters) */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-kuro-divider">
          <span className="text-xs font-mono uppercase tracking-wider text-canvas-cream">
            MEASUREMENT UNIT
          </span>
          <div className="flex space-x-1 border border-kuro-divider p-0.5 bg-kuro-base">
            <button
              onClick={() => {
                playTactileClick();
                setUnit('in');
              }}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                unit === 'in'
                  ? 'bg-canvas-cream text-kuro-base font-bold'
                  : 'text-canvas-cream/60 hover:text-white'
              }`}
            >
              INCHES (")
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setUnit('cm');
              }}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                unit === 'cm'
                  ? 'bg-canvas-cream text-kuro-base font-bold'
                  : 'text-canvas-cream/60 hover:text-white'
              }`}
            >
              CENTIMETERS (CM)
            </button>
          </div>
        </div>

        {/* Size Chart Table */}
        <div className="overflow-x-auto mb-8 border border-kuro-divider bg-kuro-base">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-kuro-divider bg-kuro-charcoal/50 text-[11px] font-mono tracking-wider text-canvas-cream uppercase">
                <th className="py-3 px-4 font-bold">SIZE</th>
                <th className="py-3 px-4">CHEST</th>
                <th className="py-3 px-4">LENGTH</th>
                <th className="py-3 px-4">SHOULDER</th>
                <th className="py-3 px-4">SLEEVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kuro-divider text-xs font-mono text-canvas-offwhite">
              {product.measurements.map((m) => (
                <tr key={m.size} className="hover:bg-kuro-off/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-canvas-cream">{m.size}</td>
                  <td className="py-3 px-4">
                    {unit === 'in' ? `${m.chestInches}"` : `${m.chestCm} cm`}
                  </td>
                  <td className="py-3 px-4">
                    {unit === 'in' ? `${m.lengthInches}"` : `${m.lengthCm} cm`}
                  </td>
                  <td className="py-3 px-4">
                    {unit === 'in' ? `${m.shoulderInches}"` : `${m.shoulderCm} cm`}
                  </td>
                  <td className="py-3 px-4">
                    {unit === 'in' ? `${m.sleeveInches}"` : `${m.sleeveCm} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Guide Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-mono text-canvas-cream/60 mb-8 border-t border-kuro-divider pt-4">
          <div>
            <span className="text-white font-bold block mb-1">CHEST MEASUREMENT:</span>
            Measure flat from armpit seam to armpit seam across the fullest part of the garment.
          </div>
          <div>
            <span className="text-white font-bold block mb-1">LENGTH MEASUREMENT:</span>
            Measure from highest point of the shoulder seam straight down to the bottom hem.
          </div>
        </div>

        {/* CTA TO SIZING CHAT BOT */}
        <div className="p-4 bg-kuro-base border border-kuro-divider flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-heading font-bold text-white uppercase">
              <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
              <span>UNSURE ABOUT YOUR BODY MEASUREMENTS?</span>
            </div>
            <p className="text-[11px] text-canvas-cream/60 font-body">
              Chat with our automated Fit Assistant bot in 15 seconds.
            </p>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
              onOpenAssistant();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-canvas-cream text-kuro-base hover:bg-white text-xs font-heading tracking-widest uppercase font-bold transition-all shadow"
          >
            LAUNCH FIT CHAT
          </button>
        </div>
      </div>
    </div>
  );
};
