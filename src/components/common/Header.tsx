import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  ShoppingBag,
  Heart,
  Menu,
  Search,
  Sparkles,
  User,
  ShieldAlert,
  CalendarHeart,
  Bot,
  Activity,
  LogOut,
} from 'lucide-react';
import { NestyMascot } from './NestyMascot';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    cart,
    wishlist,
    notifications,
    setIsCartOpen,
    setIsNotificationOpen,
    setIsWishlistOpen,
    setIsGlobalDrawerOpen,
    userAuth,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { path: '/welcome', label: 'My Profile', icon: User },
    { path: '/dashboard', label: 'Predictions', icon: Activity },
    { path: '/healing-plan', label: 'Diet & Cycle', icon: CalendarHeart },
    { path: '/sos', label: 'SOS Emergency', icon: ShieldAlert, badge: '24/7' },
    { path: '/store', label: 'Well Store', icon: ShoppingBag },
    { path: '/chat', label: 'Ask Nesty AI', icon: Bot, isAi: true },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    navigate(`/store?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 border-b border-pink-100/70 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Left: Brand Logo & Mascot */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsGlobalDrawerOpen(true)}
                className="p-2 -ml-1 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition md:hidden"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 group focus:outline-none"
                aria-label="WellNest Home"
              >
                <div className="relative">
                  <NestyMascot mood="happy" size="sm" animate={false} className="scale-105" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                      WellNest
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 uppercase tracking-wider">
                      Pro
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
                    Your Complete Wellness Nest
                  </p>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-violet-600 to-pink-600 shadow-sm shadow-pink-200'
                        : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/80'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold animate-pulse">
                        {link.badge}
                      </span>
                    )}
                    {link.isAi && !isActive && (
                      <Sparkles className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
                title="Search Wellness & Store"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition"
                title="Your Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Notifications Button */}
              <button
                type="button"
                onClick={() => setIsNotificationOpen(true)}
                className="relative p-2 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition"
                title="Notification Center"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Cart Drawer Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold text-xs shadow-sm hover:shadow-md hover:opacity-95 transition"
                title="Shopping Cart"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-white text-purple-700 text-[10px] font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User Login / Logout links */}
              {userAuth.isLoggedIn ? (
                <div className="flex items-center gap-1">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 pl-2 py-1 pr-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition border border-slate-200/70"
                    title="Account Profile"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      {userAuth.displayName ? userAuth.displayName[0] : 'U'}
                    </div>
                    <span className="hidden md:inline max-w-[80px] truncate">
                      {userAuth.displayName.split(' ')[0]}
                    </span>
                  </Link>

                  <Link
                    to="/logout"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 transition border border-violet-200"
                  title="Sign In"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-pink-100 p-4 overflow-hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, recipes, tests, doctors..."
                autoFocus
                className="w-full pl-11 pr-20 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs font-semibold hover:bg-pink-600 transition"
              >
                Search
              </button>
            </form>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Try: "Ceramide", "Chia", "Gynecologist", "Pads"</span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="hover:text-slate-600 font-semibold"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
