import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  X,
  UserCheck,
  LayoutDashboard,
  UtensilsCrossed,
  ShieldAlert,
  ShoppingBag,
  Bot,
  LogIn,
  LogOut,
  Settings,
  Sparkles,
  ChevronRight,
  Heart,
  Droplet,
  Dumbbell,
  Clock,
} from 'lucide-react';
import { NestyMascot } from './NestyMascot';

export const GlobalDrawer: React.FC = () => {
  const { isGlobalDrawerOpen, setIsGlobalDrawerOpen, profile, userAuth, setIsSettingsOpen } = useApp();
  const location = useLocation();

  if (!isGlobalDrawerOpen) return null;

  const screens = [
    {
      num: 'SC1',
      path: '/welcome',
      title: 'Welcome & Wellness Profile',
      desc: 'Set height, weight, BMI, skin, scalp, and period cycle data',
      icon: UserCheck,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      num: 'SC2',
      path: '/dashboard',
      title: 'Personalized Predictions',
      desc: 'Hormonal, skin, hair, and cycle wellness cards with insights',
      icon: LayoutDashboard,
      color: 'from-violet-500 to-pink-500',
    },
    {
      num: 'SC3',
      path: '/healing-plan',
      title: 'Diet Lab, Exercise & Period Tracker',
      desc: 'Meal plans, 4-phase period wheel, interactive timer & recipes',
      icon: UtensilsCrossed,
      color: 'from-pink-500 to-rose-500',
    },
    {
      num: 'SC4',
      path: '/sos',
      title: 'Emergency SOS & Hospitals',
      desc: 'Find nearby clinics, doctor appointments, demo rides & 112 SOS',
      icon: ShieldAlert,
      color: 'from-rose-500 to-red-600',
    },
    {
      num: 'SC5',
      path: '/store',
      title: 'Well Store (20+ Products)',
      desc: 'Shop skin, hair, period essentials, supplements & medicines',
      icon: ShoppingBag,
      color: 'from-fuchsia-500 to-pink-600',
    },
    {
      num: 'SC6',
      path: '/chat',
      title: 'Ask Nesty AI & Notifications',
      desc: '24/7 smart wellness companion, notification center & settings',
      icon: Bot,
      color: 'from-amber-500 to-pink-500',
    },
    {
      num: 'AUTH',
      path: '/login',
      title: 'User Login & Account',
      desc: 'Switch profiles, sign in, or manage your personal wellness credentials',
      icon: LogIn,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      num: 'EXIT',
      path: '/logout',
      title: 'Log Out Session',
      desc: 'Safely sign out, clear session, or transition to guest mode',
      icon: LogOut,
      color: 'from-rose-500 to-red-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsGlobalDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
          {/* Header */}
          <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-violet-50 to-pink-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NestyMascot mood="happy" size="sm" animate={true} />
              <div>
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                  WellNest Navigator
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                    All Screens Unlocked
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Jump directly to any section</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsGlobalDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile capsule */}
          <div className="p-4 mx-4 mt-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm">
                {profile.name[0] || 'A'}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">{profile.name}</p>
                <p className="text-[11px] text-pink-100">
                  {profile.skinType} Skin • {profile.hairType} Hair • Cycle {profile.cycleLengthDays}d
                </p>
              </div>
            </div>
            <Link
              to="/welcome"
              onClick={() => setIsGlobalDrawerOpen(false)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-xs transition"
            >
              Edit
            </Link>
          </div>

          {/* Quick Metrics ribbon */}
          <div className="grid grid-cols-3 gap-2 px-4 mt-3">
            <div className="p-2.5 rounded-xl bg-violet-50 border border-violet-100 text-center">
              <span className="text-[10px] uppercase font-bold text-violet-600 block">Height / Weight</span>
              <span className="text-xs font-extrabold text-slate-700">
                {profile.heightCm}cm • {profile.weightKg}kg
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-100 text-center">
              <span className="text-[10px] uppercase font-bold text-pink-600 block">Cycle Length</span>
              <span className="text-xs font-extrabold text-slate-700">{profile.cycleLengthDays} Days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-600 block">Auth Status</span>
              <span className="text-xs font-extrabold text-slate-700">
                {userAuth.isLoggedIn ? 'Signed In' : 'Guest'}
              </span>
            </div>
          </div>

          {/* Screen list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">App Screens (SC1 - SC6)</p>
            {screens.map((screen) => {
              const isActive = location.pathname === screen.path;
              const Icon = screen.icon;

              return (
                <Link
                  key={screen.path}
                  to={screen.path}
                  onClick={() => setIsGlobalDrawerOpen(false)}
                  className={`group flex items-start gap-3.5 p-3 rounded-2xl transition-all border ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-50 to-pink-50 border-pink-200 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${screen.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 group-hover:bg-pink-100 group-hover:text-pink-600 transition">
                        {screen.num}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-pink-600 transition">
                        {screen.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{screen.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-500 group-hover:translate-x-0.5 transition self-center" />
                </Link>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setIsGlobalDrawerOpen(false);
                setIsSettingsOpen(true);
              }}
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-purple-600 transition"
            >
              <Settings className="w-4 h-4" />
              <span>Notification Settings</span>
            </button>

            <span className="text-[11px] text-slate-400 font-medium">WellNest v2.5 Unlocked</span>
          </div>
        </div>
      </div>
    </div>
  );
};
