import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MapPin,
  Phone,
  User,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    profile,
    addOrder,
    showToast,
  } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    phone: profile.contactNumber || '+91 98765 43210',
    address: profile.fullAddress || '#42, Lotus Residency, 4th Cross, Indiranagar',
    area: profile.areaLandmark || 'Indiranagar',
    pincode: profile.pincode || '560038',
    paymentMethod: 'UPI' as 'UPI' | 'Card' | 'COD',
    upiId: 'ananya@oksbi',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = Math.floor(subtotal * 0.1);
  const deliveryFee = subtotal > 499 ? 0 : 40;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.address || !formData.pincode) {
        showToast('Please fill all delivery address fields', 'warning');
        return;
      }
      setStep(2);
      return;
    }

    // Step 2: Finalize Order
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCheckoutOpen(false);
      setStep(1);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#EC4899', '#F59E0B'],
        });
      } catch (e) {
        // Confetti fallback
      }

      addOrder({
        items: [...cart],
        subtotal,
        deliveryFee,
        discount,
        total,
        deliveryMethod: 'Express WellNest Care (30-45m)',
        status: 'Packing',
        estimatedDelivery: 'Today, within 45 mins',
        shippingAddress: `${formData.address}, ${formData.area} - ${formData.pincode}`,
        paymentMethod: formData.paymentMethod,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-violet-50 to-pink-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-violet-600 text-white uppercase">
                Demo Checkout
              </span>
              <span className="text-xs text-slate-400">Step {step} of 2</span>
            </div>
            <h2 className="text-base font-extrabold text-slate-800 mt-1">
              {step === 1 ? 'Shipping Address & Contact' : 'Select Payment Method'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === 1 ? (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-100 flex items-center gap-2.5 text-xs text-pink-900">
                <Truck className="w-4 h-4 text-pink-600 shrink-0" />
                <span>Express 45-minute wellness delivery available in your area.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Receiver's name"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Address / Flat / Street</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="House/Flat number, apartment name, street"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Area / Landmark</label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g. Indiranagar"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="560038"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Simulated Sandbox Environment: No real card or bank details are charged.</span>
              </div>

              <div className="space-y-2">
                {/* UPI Option */}
                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    formData.paymentMethod === 'UPI'
                      ? 'border-violet-500 bg-violet-50/50 ring-1 ring-violet-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Instant UPI (GPay / PhonePe / Paytm)</p>
                      <p className="text-[11px] text-slate-500">Fast 1-click simulated QR authorization</p>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.paymentMethod === 'UPI' ? 'border-violet-600 bg-violet-600' : 'border-slate-300'
                    }`}
                  >
                    {formData.paymentMethod === 'UPI' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Card' })}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    formData.paymentMethod === 'Card'
                      ? 'border-pink-500 bg-pink-50/50 ring-1 ring-pink-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Credit / Debit Card</p>
                      <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, Amex</p>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.paymentMethod === 'Card' ? 'border-pink-600 bg-pink-600' : 'border-slate-300'
                    }`}
                  >
                    {formData.paymentMethod === 'Card' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    formData.paymentMethod === 'COD'
                      ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Cash on Delivery</p>
                      <p className="text-[11px] text-slate-500">Pay cash or scan QR upon delivery</p>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}
                  >
                    {formData.paymentMethod === 'COD' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </div>
              </div>

              {/* Order total reminder */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Cart Items ({cart.length})</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Wellness Promo Savings</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Speed</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-sm">
                  <span>Total Amount Payable</span>
                  <span className="text-pink-600">₹{total}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:opacity-95 flex items-center justify-center gap-2 transition ${
                isSubmitting ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isSubmitting ? (
                <span>Generating Order Confirmation...</span>
              ) : step === 1 ? (
                <>
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Order (₹{total})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
