import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  LogIn,
  Heart,
  ShoppingBag,
  Sparkles,
  Home,
  Compass,
} from 'lucide-react';
import { NestyMascot } from '../common/NestyMascot';

export const LogoutScreen: React.FC = () => {
  const { userAuth, logout, profile, cart, wishlist, showToast } = useApp();
  const navigate = useNavigate();
  const [loggedOut, setLoggedOut] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    setLoggedOut(true);
    showToast('You have been safely logged out. See you soon! 🐣', 'info');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-pink-100 overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 text-white text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <NestyMascot
                mood={loggedOut ? 'waving' : 'thinking'}
                size="md"
                animate={true}
              />
              <h1 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
                {loggedOut ? 'Safe Travels from the Nest!' : 'Sign Out of WellNest'}
              </h1>
              <p className="text-xs text-pink-100 mt-1 max-w-xs font-medium">
                {loggedOut
                  ? 'Your personal health data remains safely secured on this device.'
                  : 'Take a mindful breath. Nesty will keep your cycle predictions ready for your return.'}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {!loggedOut ? (
              <>
                {/* Active Session Info Card */}
                {userAuth.isLoggedIn ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                        {userAuth.displayName ? userAuth.displayName[0] : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Active Account
                        </p>
                        <h3 className="text-sm font-extrabold text-slate-800 truncate">
                          {userAuth.displayName || 'Wellness Explorer'}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{userAuth.email}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <ShoppingBag className="w-3.5 h-3.5 text-pink-500" />
                        <span>
                          {cart.reduce((a, b) => a + b.quantity, 0)} items in Cart
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Heart className="w-3.5 h-3.5 text-violet-500 fill-violet-50" />
                        <span>{wishlist.length} Wishlisted items</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <p className="font-semibold">
                      You are currently in Demo Guest Mode. Logging out will clear any unsaved session tokens.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleConfirmLogout}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Confirm Log Out</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    Cancel & Return to Dashboard
                  </button>
                </div>
              </>
            ) : (
              /* State After Successful Log Out */
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    You have successfully signed out
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Thank you for nurturing your well-being today with Nesty. What would you like to do next?
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    to="/login"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign Back In / Switch User</span>
                  </Link>

                  <Link
                    to="/store"
                    className="w-full py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-pink-500" />
                    <span>Browse Well Store Catalog</span>
                  </Link>

                  <Link
                    to="/welcome"
                    className="w-full py-2.5 rounded-2xl text-slate-500 hover:text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Explore as Guest</span>
                  </Link>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>WellNest Privacy Guard • Local Session Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
