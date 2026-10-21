import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { NestyMascot } from '../common/NestyMascot';

export const OrderTrackingModal: React.FC = () => {
  const { activeOrderForTracking, setActiveOrderForTracking, showToast } = useApp();

  if (!activeOrderForTracking) return null;

  const order = activeOrderForTracking;

  const steps = [
    { title: 'Order Confirmed', time: 'Just now', done: true },
    { title: 'Packed & Disinfected', time: '5m ago', done: true },
    { title: 'Out for Delivery (Express)', time: 'In transit', done: true, current: true },
    { title: 'Delivered', time: 'Est. 25m', done: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-violet-50 to-pink-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <NestyMascot mood="happy" size="sm" animate={true} />
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Simulated Live Tracking
              </span>
              <h2 className="text-base font-extrabold text-slate-800 mt-0.5">
                {order.orderNumber}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveOrderForTracking(null)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Simulated Map Banner */}
          <div className="relative h-36 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-950 p-4 text-white overflow-hidden shadow-inner flex flex-col justify-between">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Rider is on the way (2.4 km away)</span>
              </div>
              <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold">
                ETA: 22 Mins
              </span>
            </div>

            {/* Simulated road dots */}
            <div className="relative py-2 flex items-center justify-between px-4 z-10">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shadow-lg">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] mt-1 text-slate-300 font-medium">Hub</span>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-pink-400/80 mx-2 animate-pulse" />
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center shadow-lg animate-bounce">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] mt-1 text-pink-300 font-bold">Rider</span>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-slate-600 mx-2" />
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] mt-1 text-slate-300 font-medium">Home</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 z-10">
              Delivery partner: <strong>Sunil Verma (Electric EV)</strong> • Contactless PIN:{' '}
              <span className="text-amber-300 font-bold tracking-widest text-xs">4920</span>
            </p>
          </div>

          {/* Timeline steps */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Milestones</h3>
            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {steps.map((st, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      st.current
                        ? 'bg-pink-500 text-white ring-4 ring-pink-100'
                        : st.done
                        ? 'bg-violet-600 text-white'
                        : 'bg-white border-2 border-slate-300 text-slate-300'
                    }`}
                  >
                    {st.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${st.current ? 'text-pink-600' : 'text-slate-800'}`}>
                      {st.title}
                    </p>
                    <p className="text-[11px] text-slate-400">{st.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items summary */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Package Contents ({order.items.length})</h3>
            <div className="space-y-2">
              {order.items.map((it) => (
                <div key={it.product.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                  <span className="font-semibold text-slate-700 truncate pr-2">
                    {it.quantity}x {it.product.name}
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">₹{it.product.price * it.quantity}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-extrabold text-slate-800">
              <span>Total Paid ({order.paymentMethod})</span>
              <span className="text-pink-600 text-sm">₹{order.total}</span>
            </div>
          </div>

          {/* Shipping destination */}
          <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Delivering To</span>
            <p className="font-semibold text-slate-700 leading-tight">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => showToast('Simulated call placed to Sunil Verma (+91 98450 12345)', 'info')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            <Phone className="w-3.5 h-3.5 text-pink-500" />
            <span>Call Driver (Simulated)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveOrderForTracking(null)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
