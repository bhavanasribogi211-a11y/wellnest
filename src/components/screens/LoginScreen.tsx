import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { NestyMascot } from '../common/NestyMascot';

export const LoginScreen: React.FC = () => {
  const { userAuth, login, logout, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'login' or 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if redirected from a protected route
  const redirectReason = (location.state as { fromDashboard?: boolean; message?: string })?.message;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        newErrors.fullName = 'Please enter your full name.';
      } else if (fullName.trim().length < 2) {
        newErrors.fullName = 'Name must be at least 2 characters.';
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }

      if (!agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors in the form.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const displayName = mode === 'signup' ? fullName.trim() : fullName.trim() || email.split('@')[0];
      login(email.trim(), displayName);
      navigate('/dashboard');
    }, 700);
  };

  const handleDemoLogin = (role: 'user' | 'doctor') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (role === 'doctor') {
        login('dr.sunita.rao@wellnest.care', 'Dr. Sunita Rao');
      } else {
        login('ananya.verma@example.com', 'Ananya Verma');
      }
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Redirect Notice Banner if redirected from Dashboard */}
        {redirectReason && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">{redirectReason}</span>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-pink-100 overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -translate-x-4 translate-y-4 w-28 h-28 bg-pink-400/20 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <NestyMascot mood="happy" size="md" animate={true} />
              <h1 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
                {mode === 'login' ? 'Welcome Back to WellNest' : 'Begin Your Wellness Journey'}
              </h1>
              <p className="text-xs text-pink-100 mt-1 max-w-xs font-medium">
                {mode === 'login'
                  ? 'Sign in to access your predictions, cycle wheel, and diet lab'
                  : 'Create your personalized account to unlock all 6 wellness hubs'}
              </p>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 border-b border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrors({});
              }}
              className={`py-2 text-xs font-bold rounded-2xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrors({});
              }}
              className={`py-2 text-xs font-bold rounded-2xl transition-all ${
                mode === 'signup'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Current Auth Status Card if already logged in */}
          {userAuth.isLoggedIn && (
            <div className="p-4 mx-5 mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                  Currently Signed In As
                </p>
                <p className="text-xs font-extrabold text-slate-800">{userAuth.displayName}</p>
                <p className="text-[11px] text-slate-500">{userAuth.email}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  to="/dashboard"
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition text-center"
                >
                  Dashboard
                </Link>
                <Link
                  to="/logout"
                  className="text-[10px] text-rose-600 font-semibold hover:underline text-center"
                >
                  Log Out Page
                </Link>
              </div>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Full Name for Sign Up */}
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="Ananya Verma"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                        : 'border-slate-200 bg-slate-50 focus:ring-pink-500'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.fullName}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50 focus:ring-pink-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() =>
                      showToast('In demo mode: you can use any password or click One-Click Demo below!', 'info')
                    }
                    className="text-[11px] font-semibold text-violet-600 hover:text-violet-700"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50 focus:ring-pink-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password for Sign Up */}
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                        : 'border-slate-200 bg-slate-50 focus:ring-pink-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Remember Me & Terms Checkboxes */}
            {mode === 'login' ? (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span>Remember me on this browser</span>
                </label>
              </div>
            ) : (
              <div>
                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: '' });
                    }}
                    className="mt-0.5 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span>
                    I agree to WellNest's Terms of Service and Privacy Policy. I understand that all predictions are general wellness insights, not medical diagnoses.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.agreeTerms}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:opacity-95 flex items-center justify-center gap-2 transition ${
                isSubmitting ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login Bar */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/80">
            <div className="text-center mb-3">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Or Test Instantly with Demo Profile
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                className="p-2.5 rounded-xl border border-pink-200 bg-white hover:bg-pink-50/60 text-left transition flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 font-bold text-xs group-hover:scale-105 transition">
                  AV
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Ananya Verma</p>
                  <p className="text-[10px] text-slate-400">Regular User</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('doctor')}
                className="p-2.5 rounded-xl border border-violet-200 bg-white hover:bg-violet-50/60 text-left transition flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 font-bold text-xs group-hover:scale-105 transition">
                  SR
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Dr. Sunita Rao</p>
                  <p className="text-[10px] text-slate-400">Consultant OBG</p>
                </div>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero-tracking, privacy-first local session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
