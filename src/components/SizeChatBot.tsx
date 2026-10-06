import React, { useState, useEffect, useRef } from 'react';
import { Ruler, X, Send, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Product, ProductSize } from '../types';
import { playSuccessChime, playTactileClick } from '../utils/audio';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  buttons?: { label: string; action: () => void }[];
  sizeButtons?: ProductSize[];
}

interface SizeChatBotProps {
  currentProduct?: Product;
  onSelectSize?: (size: ProductSize) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const SizeChatBot: React.FC<SizeChatBotProps> = ({
  currentProduct,
  onSelectSize,
  isOpen,
  onToggle,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<'height' | 'weight' | 'preference' | 'result'>('height');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [fitPref, setFitPref] = useState<'Relaxed' | 'Regular' | 'Snug'>('Relaxed');
  const [inputValue, setInputValue] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize or restart conversation when opened
  useEffect(() => {
    if (isOpen) {
      startChat();
    }
  }, [isOpen, currentProduct?.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = () => {
    setStep('height');
    setHeight('');
    setWeight('');
    const productName = currentProduct?.name || 'our heavyweight garments';
    setMessages([
      {
        sender: 'bot',
        text: `Hey! Let's find your perfect fit 🖤`,
      },
      {
        sender: 'bot',
        text: `We're calculating proportions for ${productName}. What's your height?`,
        buttons: [
          { label: "5'6\" (168 cm)", action: () => handleHeightSelect("5'6\"") },
          { label: "5'8\" (173 cm)", action: () => handleHeightSelect("5'8\"") },
          { label: "5'10\" (178 cm)", action: () => handleHeightSelect("5'10\"") },
          { label: "6'0\" (183 cm)", action: () => handleHeightSelect("6'0\"") },
          { label: "6'2\"+ (188 cm+)", action: () => handleHeightSelect("6'2\"+") },
        ],
      },
    ]);
  };

  const handleHeightSelect = (h: string) => {
    playTactileClick();
    setHeight(h);
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: `I am ${h}` },
      {
        sender: 'bot',
        text: `Got it! What's your weight approximately?`,
        buttons: [
          { label: '55 - 65 kg (120-143 lbs)', action: () => handleWeightSelect('60 kg') },
          { label: '65 - 75 kg (143-165 lbs)', action: () => handleWeightSelect('70 kg') },
          { label: '75 - 85 kg (165-187 lbs)', action: () => handleWeightSelect('80 kg') },
          { label: '85 - 95 kg (187-210 lbs)', action: () => handleWeightSelect('90 kg') },
          { label: '95 kg+ (210 lbs+)', action: () => handleWeightSelect('98 kg') },
        ],
      },
    ]);
    setStep('weight');
  };

  const handleWeightSelect = (w: string) => {
    playTactileClick();
    setWeight(w);
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: `Around ${w}` },
      {
        sender: 'bot',
        text: `Do you prefer a relaxed fit, regular fit, or a snug fit?`,
        buttons: [
          { label: 'Relaxed (Oversized Drape)', action: () => handlePrefSelect('Relaxed') },
          { label: 'Regular (Classic Silhouette)', action: () => handlePrefSelect('Regular') },
          { label: 'Snug (Form Fitted)', action: () => handlePrefSelect('Snug') },
        ],
      },
    ]);
    setStep('preference');
  };

  const handlePrefSelect = (pref: 'Relaxed' | 'Regular' | 'Snug') => {
    playSuccessChime();
    setFitPref(pref);

    // Decision logic
    let recommendedSize: ProductSize = 'M';
    let alternativeSize: ProductSize = 'S';

    const isHeavy = weight.includes('80') || weight.includes('90') || weight.includes('98');
    const isTall = height.includes("6'0") || height.includes("6'2");

    if (isHeavy && isTall) {
      recommendedSize = pref === 'Relaxed' ? 'XL' : 'L';
      alternativeSize = 'L';
    } else if (isHeavy || isTall) {
      recommendedSize = pref === 'Relaxed' ? 'L' : 'M';
      alternativeSize = pref === 'Snug' ? 'M' : 'L';
    } else if (height.includes("5'6")) {
      recommendedSize = pref === 'Relaxed' ? 'M' : 'S';
      alternativeSize = 'S';
    } else {
      // average 5'8 - 5'10, 65-75kg
      recommendedSize = pref === 'Relaxed' ? 'L' : pref === 'Regular' ? 'M' : 'S';
      alternativeSize = pref === 'Relaxed' ? 'M' : 'S';
    }

    const prodName = currentProduct ? currentProduct.name : 'this garment';

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: `I prefer a ${pref} fit` },
      {
        sender: 'bot',
        text: `For ${prodName}, I recommend size **${recommendedSize}** for your ${pref.toLowerCase()} look, or size **${alternativeSize}** for a tighter cut.`,
        sizeButtons: [recommendedSize, alternativeSize].filter(
          (val, idx, arr) => arr.indexOf(val) === idx
        ),
      },
    ]);
    setStep('result');
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');

    if (step === 'height') {
      handleHeightSelect(text);
    } else if (step === 'weight') {
      handleWeightSelect(text);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: 'user', text },
        {
          sender: 'bot',
          text: `Thanks for the input! Would you like to select a recommended size or restart?`,
          buttons: [{ label: 'Restart Fit Quiz', action: startChat }],
        },
      ]);
    }
  };

  const chooseSizeFromBot = (size: ProductSize) => {
    playSuccessChime();
    if (onSelectSize) {
      onSelectSize(size);
    }
    setMessages((prev) => [
      ...prev,
      {
        sender: 'bot',
        text: `✓ Size ${size} has been selected for you! You can add it straight to your cart.`,
      },
    ]);
  };

  return (
    <>
      {/* FLOATING CHAT BUBBLE (BOTTOM-RIGHT) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center">
        {!isOpen && (
          <button
            onClick={() => {
              playTactileClick();
              onToggle();
            }}
            className="group flex items-center space-x-2.5 bg-kuro-off hover:bg-kuro-charcoal border border-kuro-divider hover:border-canvas-cream/50 text-white px-4 py-3 shadow-2xl transition-all duration-300 hover:scale-105"
            title="Launch Sizing Chat Assistant"
          >
            <div className="relative">
              <Ruler className="w-5 h-5 text-accent-amber" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-olive animate-ping" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono tracking-widest text-canvas-cream/60 uppercase">
                AI FIT HELP
              </div>
              <div className="text-xs font-heading tracking-wider font-bold text-white">
                FIND YOUR SIZE
              </div>
            </div>
          </button>
        )}
      </div>

      {/* CHAT WINDOW MODAL */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[380px] bg-kuro-off border border-kuro-divider shadow-2xl flex flex-col h-[520px] max-h-[85vh] animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-kuro-base border-b border-kuro-divider flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 bg-kuro-charcoal border border-kuro-divider flex items-center justify-center">
                <Ruler className="w-4 h-4 text-canvas-cream" />
              </div>
              <div>
                <h4 className="font-heading text-xs uppercase font-bold tracking-wider text-white">
                  FENR FIT ADVISOR
                </h4>
                <p className="text-[10px] font-mono text-accent-olive">
                  {currentProduct ? currentProduct.name : 'ARCHIVE FIT ENGINE'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playTactileClick();
                onClose();
              }}
              className="text-canvas-cream/50 hover:text-white p-1"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-body">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-canvas-cream text-kuro-base font-medium rounded-sm'
                      : 'bg-kuro-base border border-kuro-divider text-canvas-offwhite rounded-sm'
                  }`}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: msg.text.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-white font-bold underline">$1</strong>'
                      ),
                    }}
                  />
                </div>

                {/* Quick Selection Buttons */}
                {msg.buttons && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.buttons.map((btn, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={btn.action}
                        className="px-2.5 py-1.5 bg-kuro-charcoal hover:bg-canvas-cream hover:text-kuro-base border border-kuro-divider text-[11px] font-mono text-canvas-cream transition-colors"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Clickable Size Buttons directly in chat */}
                {msg.sizeButtons && (
                  <div className="flex items-center gap-2 mt-3">
                    {msg.sizeButtons.map((size) => (
                      <button
                        key={size}
                        onClick={() => chooseSizeFromBot(size)}
                        className="px-3.5 py-2 bg-accent-olive hover:bg-white text-white hover:text-kuro-base text-xs font-heading font-bold tracking-widest uppercase transition-all shadow flex items-center space-x-1.5"
                      >
                        <span>SELECT SIZE {size}</span>
                        <Check className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={handleTextSubmit}
            className="p-3 bg-kuro-base border-t border-kuro-divider flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type height or weight..."
              className="flex-1 bg-kuro-off border border-kuro-divider px-3 py-2 text-xs text-white placeholder-canvas-cream/40 focus:outline-none focus:border-canvas-cream/50 font-mono"
            />
            <button
              type="submit"
              className="p-2 bg-canvas-cream text-kuro-base hover:bg-white transition-colors"
              title="Send reply"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
