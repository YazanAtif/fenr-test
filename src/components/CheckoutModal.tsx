import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  CreditCard,
  Smartphone,
  Banknote,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { PaymentMethodType, ShippingDetails, Order } from '../types';
import { playSuccessChime, playTactileClick } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted?: (order: Order) => void;
}

const PAKISTAN_PROVINCES = [
  'Sindh',
  'Punjab',
  'Islamabad Capital Territory',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
  'International',
];

const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Other / International',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const {
    items,
    subtotalPKR,
    subtotalUSD,
    discountPKR,
    discountUSD,
    shippingPKR,
    shippingUSD,
    totalPKR,
    totalUSD,
    clearCart,
  } = useCart();

  const { formatPrice, currency } = useCurrency();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    phone: '',
    province: 'Punjab',
    city: 'Lahore',
    address: '',
    postalCode: '',
    deliveryNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('easypaisa');
  const [paymentDetails, setPaymentDetails] = useState({
    walletNumber: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  if (!isOpen) return null;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.email || !shipping.phone || !shipping.address) {
      alert('Please fill in all required shipping fields.');
      return;
    }
    playTactileClick();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();
    setStep(3);
  };

  const handlePlaceOrder = () => {
    playSuccessChime();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `FENR-${randomDigits}`;
      const trackingNumber = `TCS-PK-${Math.floor(100000000 + Math.random() * 900000000)}`;

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber,
        items: [...items],
        shipping,
        paymentMethod,
        subtotalPKR,
        subtotalUSD,
        shippingPKR,
        shippingUSD,
        discountPKR,
        discountUSD,
        totalPKR,
        totalUSD,
        currency,
        status: 'confirmed',
        courier: 'TCS Express',
        trackingNumber,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setCompletedOrder(newOrder);
      setStep(4);
      clearCart();

      if (onOrderCompleted) {
        onOrderCompleted(newOrder);
      }

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D9D0C1', '#6B7C5E', '#A67C52', '#9E6B6B'],
      });
    }, 1200);
  };

  const copyTracking = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-kuro-base/95 backdrop-blur-xl animate-fade-in p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="relative w-full max-w-4xl bg-kuro-off border border-kuro-divider shadow-2xl p-6 sm:p-10 my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-kuro-divider pb-5 mb-8">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 flex items-center justify-center border border-canvas-cream/30 text-xs font-mono font-bold text-canvas-offwhite bg-kuro-base">
              F
            </span>
            <div>
              <h2 className="font-display text-2xl tracking-[0.2em] text-white uppercase">
                CHECKOUT // DISPATCH TERMINAL
              </h2>
              <p className="text-[10px] font-mono text-accent-olive">
                ENCRYPTED 256-BIT SSL SAFE TRANSACTION
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="text-canvas-cream/60 hover:text-white p-2 border border-kuro-divider"
            title="Exit checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR (Steps 1 to 3) */}
        {step < 4 && (
          <div className="grid grid-cols-3 gap-2 mb-8 text-[11px] font-mono uppercase tracking-wider">
            <div
              className={`p-2 border text-center ${
                step === 1
                  ? 'border-canvas-cream bg-white text-kuro-base font-bold'
                  : step > 1
                  ? 'border-accent-olive text-accent-olive bg-kuro-base'
                  : 'border-kuro-divider text-canvas-cream/40'
              }`}
            >
              1. SHIPPING INFO
            </div>
            <div
              className={`p-2 border text-center ${
                step === 2
                  ? 'border-canvas-cream bg-white text-kuro-base font-bold'
                  : step > 2
                  ? 'border-accent-olive text-accent-olive bg-kuro-base'
                  : 'border-kuro-divider text-canvas-cream/40'
              }`}
            >
              2. PAYMENT METHOD
            </div>
            <div
              className={`p-2 border text-center ${
                step === 3
                  ? 'border-canvas-cream bg-white text-kuro-base font-bold'
                  : 'border-kuro-divider text-canvas-cream/40'
              }`}
            >
              3. REVIEW & CONFIRM
            </div>
          </div>
        )}

        {/* STEP 1: SHIPPING INFORMATION */}
        {step === 1 && (
          <form onSubmit={handleShippingSubmit} className="space-y-6 animate-fade-in">
            <div className="text-xs font-mono tracking-widest text-canvas-cream uppercase mb-4">
              STEP 1: RECIPIENT & DELIVERY DETAILS (PAKISTAN & GLOBAL)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                  FULL NAME *
                </label>
                <input
                  required
                  type="text"
                  value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  placeholder="e.g. Bilal Tariq"
                  className="w-full bg-kuro-base border border-kuro-divider px-3.5 py-2.5 text-xs text-white placeholder-canvas-cream/30 focus:outline-none focus:border-canvas-cream"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                  EMAIL ADDRESS (FOR RECEIPT) *
                </label>
                <input
                  required
                  type="email"
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  placeholder="bilal@example.com"
                  className="w-full bg-kuro-base border border-kuro-divider px-3.5 py-2.5 text-xs text-white placeholder-canvas-cream/30 focus:outline-none focus:border-canvas-cream"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                  PHONE NUMBER (+92) *
                </label>
                <input
                  required
                  type="tel"
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  placeholder="0300 1234567"
                  className="w-full bg-kuro-base border border-kuro-divider px-3.5 py-2.5 text-xs text-white placeholder-canvas-cream/30 focus:outline-none focus:border-canvas-cream font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                  PROVINCE / REGION *
                </label>
                <select
                  value={shipping.province}
                  onChange={(e) => setShipping({ ...shipping, province: e.target.value })}
                  className="w-full bg-kuro-base border border-kuro-divider px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-canvas-cream font-mono cursor-pointer"
                >
                  {PAKISTAN_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                  CITY *
                </label>
                <select
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="w-full bg-kuro-base border border-kuro-divider px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-canvas-cream font-mono cursor-pointer"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                COMPLETE STREET ADDRESS / SECTOR / PHASE *
              </label>
              <input
                required
                type="text"
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                placeholder="House #, Street #, Phase 5 DHA / Gulberg / Sector F-7"
                className="w-full bg-kuro-base border border-kuro-divider px-3.5 py-2.5 text-xs text-white placeholder-canvas-cream/30 focus:outline-none focus:border-canvas-cream"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                  POSTAL / ZIP CODE
                </label>
                <input
                  type="text"
                  value={shipping.postalCode}
                  onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                  placeholder="54000"
                  className="w-full bg-kuro-base border border-kuro-divider px-3.5 py-2.5 text-xs text-white placeholder-canvas-cream/30 focus:outline-none focus:border-canvas-cream font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                  DELIVERY INSTRUCTIONS (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={shipping.deliveryNotes}
                  onChange={(e) => setShipping({ ...shipping, deliveryNotes: e.target.value })}
                  placeholder="e.g. Call before arrival, leave with security"
                  className="w-full bg-kuro-base border border-kuro-divider px-3.5 py-2.5 text-xs text-white placeholder-canvas-cream/30 focus:outline-none focus:border-canvas-cream"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-kuro-divider flex items-center justify-between">
              <div className="text-[11px] font-mono text-canvas-cream/50">
                GUEST CHECKOUT ENABLED — NO ACCOUNT REQUIRED
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-canvas-offwhite hover:bg-white text-kuro-base font-heading text-xs tracking-widest uppercase font-bold transition-all shadow-md flex items-center space-x-2"
              >
                <span>CONTINUE TO PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD (EASYPAISA, SADAPAY, NAYAPAY, VISA/MC, COD) */}
        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} className="space-y-6 animate-fade-in">
            <div className="text-xs font-mono tracking-widest text-canvas-cream uppercase mb-4">
              STEP 2: SELECT APPROVED PAYMENT GATEWAY
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* EasyPaisa Card */}
              <div
                onClick={() => {
                  playTactileClick();
                  setPaymentMethod('easypaisa');
                }}
                className={`p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'easypaisa'
                    ? 'border-accent-olive bg-kuro-base ring-1 ring-accent-olive'
                    : 'border-kuro-divider bg-kuro-charcoal/40 hover:border-canvas-cream/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#00A859] text-white text-[9px] font-bold flex items-center justify-center">
                      EP
                    </span>
                    <span className="font-heading text-xs font-bold text-white uppercase">
                      EASYPAISA
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-accent-olive/20 text-accent-olive border border-accent-olive/40">
                    INSTANT WALLET
                  </span>
                </div>
                <p className="text-[11px] text-canvas-cream/60 font-body">
                  Pay directly via EasyPaisa mobile account or OTP approval prompt.
                </p>
              </div>

              {/* SadaPay Card */}
              <div
                onClick={() => {
                  playTactileClick();
                  setPaymentMethod('sadapay');
                }}
                className={`p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'sadapay'
                    ? 'border-canvas-cream bg-kuro-base ring-1 ring-canvas-cream'
                    : 'border-kuro-divider bg-kuro-charcoal/40 hover:border-canvas-cream/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded bg-[#FF7043] text-white text-[9px] font-bold flex items-center justify-center">
                      SP
                    </span>
                    <span className="font-heading text-xs font-bold text-white uppercase">
                      SADAPAY
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-canvas-cream/10 text-canvas-cream border border-canvas-cream/30">
                    ZERO MARKUP
                  </span>
                </div>
                <p className="text-[11px] text-canvas-cream/60 font-body">
                  Numberless Mastercard / instant SadaPay app request.
                </p>
              </div>

              {/* NayaPay Card */}
              <div
                onClick={() => {
                  playTactileClick();
                  setPaymentMethod('nayapay');
                }}
                className={`p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'nayapay'
                    ? 'border-accent-indigo bg-kuro-base ring-1 ring-accent-indigo'
                    : 'border-kuro-divider bg-kuro-charcoal/40 hover:border-canvas-cream/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded bg-[#0066FF] text-white text-[9px] font-bold flex items-center justify-center">
                      NP
                    </span>
                    <span className="font-heading text-xs font-bold text-white uppercase">
                      NAYAPAY
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/40">
                    DIGITAL WALLET
                  </span>
                </div>
                <p className="text-[11px] text-canvas-cream/60 font-body">
                  Pay seamlessly with your NayaPay wallet or linked Visa card.
                </p>
              </div>

              {/* Cash on Delivery (COD) Card */}
              <div
                onClick={() => {
                  playTactileClick();
                  setPaymentMethod('cod');
                }}
                className={`p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-accent-amber bg-kuro-base ring-1 ring-accent-amber'
                    : 'border-kuro-divider bg-kuro-charcoal/40 hover:border-canvas-cream/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Banknote className="w-5 h-5 text-accent-amber" />
                    <span className="font-heading text-xs font-bold text-white uppercase">
                      CASH ON DELIVERY (COD)
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-accent-amber/20 text-accent-amber border border-accent-amber/40">
                    PAKISTAN TOP CHOICE
                  </span>
                </div>
                <p className="text-[11px] text-canvas-cream/60 font-body">
                  Inspect upon doorstep arrival. Hand payment in cash to courier.
                </p>
              </div>

              {/* Visa / MasterCard */}
              <div
                onClick={() => {
                  playTactileClick();
                  setPaymentMethod('visa_mastercard');
                }}
                className={`sm:col-span-2 p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'visa_mastercard'
                    ? 'border-canvas-cream bg-kuro-base ring-1 ring-canvas-cream'
                    : 'border-kuro-divider bg-kuro-charcoal/40 hover:border-canvas-cream/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-canvas-cream" />
                    <span className="font-heading text-xs font-bold text-white uppercase">
                      VISA & MASTERCARD (CREDIT / DEBIT)
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-kuro-charcoal text-white border border-kuro-divider">
                      3D SECURE OTP
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-canvas-cream/60 font-body">
                  Domestic & International cards accepted via 256-bit encrypted gateway.
                </p>
              </div>
            </div>

            {/* Dynamic Inputs based on selected method */}
            <div className="p-4 bg-kuro-base border border-kuro-divider">
              {paymentMethod === 'easypaisa' && (
                <div>
                  <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                    EASYPAISA REGISTERED MOBILE NUMBER
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="03XX XXXXXXX"
                    value={paymentDetails.walletNumber}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, walletNumber: e.target.value })
                    }
                    className="w-full bg-kuro-off border border-kuro-divider px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-canvas-cream"
                  />
                  <p className="text-[10px] font-mono text-canvas-cream/40 mt-1">
                    You will receive an in-app confirmation popup or SMS OTP to authorize the payment.
                  </p>
                </div>
              )}

              {paymentMethod === 'sadapay' && (
                <div>
                  <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                    SADAPAY REGISTERED PHONE NUMBER OR IBAN
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="03XX XXXXXXX"
                    value={paymentDetails.walletNumber}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, walletNumber: e.target.value })
                    }
                    className="w-full bg-kuro-off border border-kuro-divider px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-canvas-cream"
                  />
                  <p className="text-[10px] font-mono text-canvas-cream/40 mt-1">
                    Open your SadaPay app to approve the payment request.
                  </p>
                </div>
              )}

              {paymentMethod === 'nayapay' && (
                <div>
                  <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                    NAYAPAY NAYATAG OR MOBILE NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@yourtag or 03XX XXXXXXX"
                    value={paymentDetails.walletNumber}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, walletNumber: e.target.value })
                    }
                    className="w-full bg-kuro-off border border-kuro-divider px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-canvas-cream"
                  />
                </div>
              )}

              {paymentMethod === 'visa_mastercard' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                      CARD NUMBER
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      value={paymentDetails.cardNumber}
                      onChange={(e) =>
                        setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                      }
                      className="w-full bg-kuro-off border border-kuro-divider px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-canvas-cream"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                        EXPIRY DATE
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={paymentDetails.expiry}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, expiry: e.target.value })
                        }
                        className="w-full bg-kuro-off border border-kuro-divider px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-canvas-cream"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-canvas-cream/70 uppercase mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        placeholder="•••"
                        value={paymentDetails.cvc}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, cvc: e.target.value })
                        }
                        className="w-full bg-kuro-off border border-kuro-divider px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-canvas-cream"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="flex items-center space-x-3 text-xs font-mono text-canvas-cream">
                  <CheckCircle2 className="w-5 h-5 text-accent-olive flex-shrink-0" />
                  <span>
                    No online transaction needed now. Our courier will collect exact cash of{' '}
                    <strong className="text-white">{formatPrice(totalPKR, totalUSD)}</strong> at delivery.
                  </span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-kuro-divider flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setStep(1);
                }}
                className="px-6 py-3 border border-kuro-divider text-xs font-mono text-canvas-cream/70 hover:text-white uppercase flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO SHIPPING</span>
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 bg-canvas-offwhite hover:bg-white text-kuro-base font-heading text-xs tracking-widest uppercase font-bold transition-all shadow-md flex items-center space-x-2"
              >
                <span>REVIEW ORDER DETAILS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER REVIEW & CONFIRM */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-xs font-mono tracking-widest text-canvas-cream uppercase mb-4">
              STEP 3: FINAL AUDIT & CONFIRMATION
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping & Payment Summary */}
              <div className="p-5 bg-kuro-base border border-kuro-divider space-y-4">
                <div className="border-b border-kuro-divider pb-3">
                  <span className="text-[10px] font-mono tracking-widest text-accent-olive uppercase block mb-1">
                    DESTINATION ADDRESS
                  </span>
                  <h4 className="font-heading text-sm font-bold text-white uppercase">
                    {shipping.fullName}
                  </h4>
                  <p className="text-xs text-canvas-cream/70 font-mono mt-1">
                    {shipping.address}, {shipping.city}, {shipping.province} {shipping.postalCode}
                  </p>
                  <p className="text-xs text-canvas-cream/70 font-mono">
                    Tel: {shipping.phone} | {shipping.email}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono tracking-widest text-accent-olive uppercase block mb-1">
                    PAYMENT SELECTION
                  </span>
                  <div className="font-mono text-xs font-bold text-white uppercase">
                    {paymentMethod.toUpperCase().replace('_', ' / ')}
                  </div>
                  <div className="text-[11px] font-mono text-canvas-cream/50 mt-1">
                    Status: PENDING FINAL AUTHORIZATION
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="p-5 bg-kuro-base border border-kuro-divider flex flex-col justify-between">
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {items.map((i) => (
                    <div
                      key={`${i.product.id}-${i.selectedSize}-${i.selectedColor.hex}`}
                      className="flex items-center justify-between text-xs font-mono border-b border-kuro-divider/40 pb-2"
                    >
                      <div>
                        <div className="text-white font-bold">{i.product.name}</div>
                        <div className="text-canvas-cream/50 text-[10px]">
                          SIZE {i.selectedSize} • {i.selectedColor.name} • QTY {i.quantity}
                        </div>
                      </div>
                      <div className="text-white font-bold">
                        {formatPrice(i.product.pricePKR * i.quantity, i.product.priceUSD * i.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial breakdown */}
                <div className="border-t border-kuro-divider pt-3 space-y-1.5 text-xs font-mono text-canvas-cream/70 mt-4">
                  <div className="flex justify-between">
                    <span>SUBTOTAL:</span>
                    <span className="text-white">{formatPrice(subtotalPKR, subtotalUSD)}</span>
                  </div>
                  {discountPKR > 0 && (
                    <div className="flex justify-between text-accent-olive">
                      <span>VOUCHER SAVINGS:</span>
                      <span>-{formatPrice(discountPKR, discountUSD)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>COURIER SHIPPING:</span>
                    <span className="text-white">
                      {shippingPKR === 0 ? 'FREE' : formatPrice(shippingPKR, shippingUSD)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-kuro-divider">
                    <span>TOTAL PAYABLE:</span>
                    <span className="text-canvas-cream">{formatPrice(totalPKR, totalUSD)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-kuro-divider flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setStep(2);
                }}
                className="px-6 py-3 border border-kuro-divider text-xs font-mono text-canvas-cream/70 hover:text-white uppercase flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>CHANGE PAYMENT</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="px-10 py-4 bg-accent-olive hover:bg-white text-white hover:text-kuro-base font-heading text-xs tracking-[0.25em] uppercase font-bold transition-all shadow-xl flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>AUTHORIZING TRANSACTION...</span>
                ) : (
                  <>
                    <span>PLACE ORDER — {formatPrice(totalPKR, totalUSD)}</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED SCREEN + SIMULATED COURIER TRACKING */}
        {step === 4 && completedOrder && (
          <div className="text-center py-6 space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-accent-olive/20 text-accent-olive border border-accent-olive mx-auto flex items-center justify-center rounded-full">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <div className="text-[11px] font-mono tracking-[0.3em] text-accent-olive uppercase mb-1">
                DISPATCH PROTOCOL INITIATED
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-wider">
                ORDER CONFIRMED #{completedOrder.orderNumber}
              </h2>
              <p className="text-xs sm:text-sm text-canvas-cream/70 font-body max-w-lg mx-auto mt-2">
                Thank you, {completedOrder.shipping.fullName}. Confirmation details and receipt have been dispatched to{' '}
                <strong className="text-white">{completedOrder.shipping.email}</strong>.
              </p>
            </div>

            {/* Courier Tracking Status Box */}
            <div className="max-w-xl mx-auto bg-kuro-base border border-kuro-divider p-6 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-kuro-divider pb-3">
                <div>
                  <div className="text-[10px] font-mono text-canvas-cream/50 uppercase">
                    ASSIGNED COURIER
                  </div>
                  <div className="font-heading text-sm font-bold text-white uppercase">
                    {completedOrder.courier} (AIR EXPRESS)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-canvas-cream/50 uppercase">
                    TRACKING NUMBER
                  </div>
                  <button
                    onClick={copyTracking}
                    className="flex items-center space-x-1.5 text-xs font-mono text-canvas-cream hover:text-white"
                  >
                    <span>{completedOrder.trackingNumber}</span>
                    {copiedTracking ? (
                      <Check className="w-3.5 h-3.5 text-accent-olive" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="relative pl-6 space-y-4 text-xs font-mono before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-accent-olive">
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-accent-olive" />
                  <div className="font-bold text-white">ORDER VERIFIED & SECURED</div>
                  <div className="text-[11px] text-canvas-cream/50">Karachi Atelier Hub // {completedOrder.createdAt}</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-accent-olive animate-pulse" />
                  <div className="font-bold text-accent-olive">QUALITY INSPECTION & PACKAGING</div>
                  <div className="text-[11px] text-canvas-cream/50">Milled Combed Cotton Folded into Frosted Archive Bag</div>
                </div>

                <div className="relative opacity-50">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-kuro-divider" />
                  <div className="font-bold text-white">OUT FOR LOCAL DELIVERY</div>
                  <div className="text-[11px] text-canvas-cream/50">Dispatched to {completedOrder.shipping.city} Logistics Depot</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 border border-kuro-divider bg-kuro-base hover:bg-kuro-charcoal text-xs font-mono text-white uppercase flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT ORDER SUMMARY</span>
              </button>

              <button
                onClick={() => {
                  playTactileClick();
                  onClose();
                }}
                className="w-full sm:w-auto px-8 py-3 bg-canvas-cream text-kuro-base font-heading text-xs tracking-widest uppercase font-bold hover:bg-white transition-all shadow"
              >
                RETURN TO ARCHIVE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
