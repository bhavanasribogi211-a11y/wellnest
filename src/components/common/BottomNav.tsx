import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ShieldAlert, ShoppingBag, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { cart } = useApp();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const tabs = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/healing-plan', label: 'Diet Lab', icon: UtensilsCrossed },
    { path: '/sos', label: 'SOS', icon: ShieldAlert, isSos: true },
    { path: '/store', label: 'Well Store', icon: ShoppingBag, badge: cartCount > 0 ? cartCount : undefined },
    { path: '/chat', label: 'Nesty Chat', icon: Bot, isMascot: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-pink-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 px-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          if (tab.isSos) {
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="relative -top-3 flex flex-col items-center justify-center group"
                aria-label="SOS Emergency Help"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform transform active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-rose-600 to-red-500 ring-4 ring-rose-100'
                      : 'bg-gradient-to-tr from-red-500 to-pink-600 hover:scale-105'
                  }`}
                >
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-0.5 ${
                    isActive ? 'text-rose-600' : 'text-slate-500'
                  }`}
                >
                  SOS
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`relative flex flex-col items-center justify-center py-1 transition-colors select-none ${
                isActive ? 'text-pink-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-3.5 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
                {tab.isMascot && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium transition-all ${
                  isActive ? 'font-bold text-pink-600 scale-105' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
