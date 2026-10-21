import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  Truck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setIsCheckoutOpen,
    showToast,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'standard'>('standard');

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = discountApplied ? Math.min(100, Math.floor(subtotal * 0.15)) : 0;
  const deliveryFee = deliveryMethod === 'express' ? 49 : subtotal > 499 ? 0 : 40;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const freeShippingThreshold = 499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'NESTLOVE' || promoCode.toUpperCase() === 'WELLNEST10') {
      setDiscountApplied(true);
      showToast('Promo code applied! 15% discount granted 🎉', 'success');
    } else {
      showToast('Invalid promo code. Try "NESTLOVE"', 'warning');
    }
  };

  const handleProceedCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-violet-50 via-pink-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-600 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-800">Your Wellness Cart</h2>
                <p className="text-xs text-slate-500">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="px-5 py-3 bg-pink-50/50 border-b border-pink-100/70">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-pink-700 font-semibold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-bold">You unlocked Free Standard Shipping! 🎉</span>
                ) : (
                  <span>Add ₹{freeShippingThreshold - subtotal} more for Free Shipping</span>
                )}
              </span>
              <span className="text-slate-500 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-16 h-16 rounded-3xl bg-pink-50 text-pink-500 mx-auto flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-700">Your cart is currently empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Explore our Well Store for soothing teas, organic bamboo pads, targeted serums, and cycle supplements.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold shadow-md hover:opacity-95"
                >
                  Explore Well Store
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-2xl border border-slate-100 hover:border-pink-200 bg-white shadow-xs flex gap-3 group transition"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 bg-slate-50 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                            {item.product.brand}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-300 hover:text-rose-500 p-1 rounded transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-sm font-extrabold text-slate-900">
                          ₹{item.product.price}
                        </span>
                        {item.product.originalPrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{item.product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-700">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals & checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-3">
              {/* Promo Code Form */}
              <form onSubmit={applyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter NESTLOVE for discount"
                    className="w-full pl-8 pr-2 py-1.5 rounded-xl border border-slate-200 bg-white text-xs uppercase font-medium focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition"
                >
                  Apply
                </button>
              </form>

              {/* Delivery Speed Picker */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('standard')}
                  className={`p-2 rounded-xl border text-left transition ${
                    deliveryMethod === 'standard'
                      ? 'border-violet-400 bg-violet-50 text-violet-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <p className="text-[11px] font-bold">Standard Delivery</p>
                  <p className="text-[10px] text-slate-500">{subtotal > 499 ? 'FREE' : '₹40'} (2-3 days)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-2 rounded-xl border text-left transition ${
                    deliveryMethod === 'express'
                      ? 'border-pink-400 bg-pink-50 text-pink-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <p className="text-[11px] font-bold flex items-center gap-1">
                    <span>Express Delivery</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-pink-200 text-pink-700">Demo</span>
                  </p>
                  <p className="text-[10px] text-slate-500">₹49 (Within 45 mins)</p>
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount (Promo)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-base text-pink-600">₹{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-pink-200 hover:opacity-95 flex items-center justify-center gap-2 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
