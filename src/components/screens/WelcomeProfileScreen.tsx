import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ScalpType,
  HairType,
  SkinType,
  FlowIntensity,
  MoodType,
  CycleRegularity,
} from '../../types';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Compass,
  Check,
  AlertCircle,
  Activity,
  Heart,
  Droplet,
  Calendar,
  Smile,
  Shield,
  Save,
} from 'lucide-react';
import { NestyMascot } from '../common/NestyMascot';

export const WelcomeProfileScreen: React.FC = () => {
  const { profile, updateProfile, calculateBmi, showToast } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: profile.name || '',
    age: profile.age || 24,
    heightCm: profile.heightCm || 163,
    weightKg: profile.weightKg || 56,
    scalpType: profile.scalpType || ('Combination' as ScalpType),
    hairType: profile.hairType || ('Wavy' as HairType),
    hairConcerns: profile.hairConcerns || ['Hair Thinning', 'Frizz'],
    hairWashFreq: profile.hairWashFreq || '2-3 times a week',
    skinType: profile.skinType || ('Combination' as SkinType),
    skinConcerns: profile.skinConcerns || ['Hormonal Breakouts', 'Dark Spots'],
    lastPeriodDate: profile.lastPeriodDate || new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0],
    cycleLengthDays: profile.cycleLengthDays || 28,
    cycleRegularity: profile.cycleRegularity || ('Regular (26-32 days)' as CycleRegularity),
    periodFlow: profile.periodFlow || ('Medium' as FlowIntensity),
    periodMood: profile.periodMood || ('Energetic' as MoodType),
    areaLandmark: profile.areaLandmark || 'Indiranagar 100ft Road',
    fullAddress: profile.fullAddress || '#42, Lotus Residency, Indiranagar',
    pincode: profile.pincode || '560038',
    contactNumber: profile.contactNumber || '+91 98765 43210',
    locationPermissionGranted: profile.locationPermissionGranted || false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Height conversion helper (cm to ft/in)
  const getFtIn = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet} ft ${inches} in`;
  };

  const bmiInfo = calculateBmi(formData.heightCm, formData.weightKg);

  const hairConcernOptions = [
    'Hair Thinning',
    'Frizz',
    'Dandruff Flakes',
    'Dry Ends',
    'Scalp Itch',
    'Premature Greying',
    'Slow Growth',
  ];

  const skinConcernOptions = [
    'Hormonal Breakouts',
    'Dark Spots',
    'Uneven Texture',
    'Dehydration',
    'Oiliness',
    'Sensitive Redness',
    'Enlarged Pores',
  ];

  const toggleHairConcern = (c: string) => {
    setFormData((prev) => ({
      ...prev,
      hairConcerns: prev.hairConcerns.includes(c)
        ? prev.hairConcerns.filter((item) => item !== c)
        : [...prev.hairConcerns, c],
    }));
  };

  const toggleSkinConcern = (c: string) => {
    setFormData((prev) => ({
      ...prev,
      skinConcerns: prev.skinConcerns.includes(c)
        ? prev.skinConcerns.filter((item) => item !== c)
        : [...prev.skinConcerns, c],
    }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'warning');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setFormData((prev) => ({
          ...prev,
          locationPermissionGranted: true,
          areaLandmark: 'Current GPS Coordinates Detected',
          fullAddress: `Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)}`,
        }));
        showToast('Location permission granted & coordinates verified!', 'success');
      },
      (err) => {
        setIsLocating(false);
        showToast('Location access denied. Please enter your area manually.', 'info');
      },
      { timeout: 8000 }
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Please provide your name.';
    if (!formData.age || formData.age < 12 || formData.age > 100)
      newErrors.age = 'Please enter a valid age (12–100).';
    if (!formData.lastPeriodDate) newErrors.lastPeriodDate = 'Please select your last period date.';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required for delivery & SOS.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please complete all required fields.', 'warning');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      updateProfile({
        ...formData,
        onboardingCompleted: true,
      });
      showToast('Wellness Profile saved! Welcome to your dashboard.', 'success');
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white shadow-xl overflow-hidden mb-8">
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <NestyMascot
            mood="happy"
            size="lg"
            bubbleText="Hi! I am Nesty 🐣 Let's tailor your wellness nest!"
          />
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs">
              SC1 • Personal Wellness Profile
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Meet Nesty, Your 24/7 Wellness Companion
            </h1>
            <p className="text-xs sm:text-sm text-pink-100 max-w-xl leading-relaxed">
              Tell us about your hair, scalp, skin, and menstrual rhythm. We calculate live BMI, cycle phases, and generate tailored diet and exercise insights.
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Section 1: Basic Bio & Live BMI Sliders */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100/80">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Biometrics & Live BMI Calculator</h2>
              <p className="text-xs text-slate-400">Sliders adjust live BMI categorization instantly</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Your Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:ring-pink-500'
                }`}
                placeholder="e.g. Ananya Verma"
              />
              {errors.name && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Age *</label>
              <input
                type="number"
                min={12}
                max={100}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 24 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Height Slider (140 - 180 cm) */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Height (Centimetres)</span>
              <span className="font-extrabold text-violet-700 px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200">
                {formData.heightCm} cm ({getFtIn(formData.heightCm)})
              </span>
            </div>
            <input
              type="range"
              min={140}
              max={180}
              step={1}
              value={formData.heightCm}
              onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>140 cm (4'7")</span>
              <span>160 cm (5'3")</span>
              <span>180 cm (5'11")</span>
            </div>
          </div>

          {/* Weight Slider (30 - 120 kg) */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Weight (Kilograms)</span>
              <span className="font-extrabold text-pink-600 px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200">
                {formData.weightKg} kg ({(formData.weightKg * 2.20462).toFixed(1)} lbs)
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={120}
              step={1}
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>30 kg</span>
              <span>75 kg</span>
              <span>120 kg</span>
            </div>
          </div>

          {/* Live BMI Information Card */}
          <div className={`p-4 rounded-2xl border ${bmiInfo.color} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Calculated BMI</span>
                <span className="text-lg font-black">{bmiInfo.bmi}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 shadow-xs">
                  {bmiInfo.category}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-700 leading-relaxed">{bmiInfo.advice}</p>
            </div>
            <span className="text-[10px] text-slate-500 italic max-w-xs sm:text-right">
              General wellness index. Not an individual medical diagnostic evaluation.
            </span>
          </div>
        </div>

        {/* Section 2: Scalp & Hair Profile */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100/80">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Hair & Scalp Diagnostics</h2>
              <p className="text-xs text-slate-400">Helps us curate custom shampoos, oils, and massages</p>
            </div>
          </div>

          {/* Scalp Type */}
          <div className="mb-5">
            <label className="text-xs font-bold text-slate-700 block mb-2">Scalp Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['Oily', 'Dry', 'Normal', 'Sensitive', 'Combination'] as ScalpType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, scalpType: type })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    formData.scalpType === type
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white border-transparent shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Type */}
          <div className="mb-5">
            <label className="text-xs font-bold text-slate-700 block mb-2">Hair Texture / Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Straight', 'Wavy', 'Curly', 'Coily'] as HairType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, hairType: type })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    formData.hairType === type
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white border-transparent shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Concerns (Multi-Select) */}
          <div className="mb-5">
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Hair Concerns (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {hairConcernOptions.map((c) => {
                const isSelected = formData.hairConcerns.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleHairConcern(c)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-pink-50 border-pink-400 text-pink-700 ring-1 ring-pink-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-pink-600" />}
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wash Frequency */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Hair-Wash Frequency</label>
            <select
              value={formData.hairWashFreq}
              onChange={(e) => setFormData({ ...formData, hairWashFreq: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            >
              <option value="Daily">Daily (Every day)</option>
              <option value="Alternate days">Alternate days (3-4 times a week)</option>
              <option value="2-3 times a week">2-3 times a week</option>
              <option value="Once a week">Once a week</option>
            </select>
          </div>
        </div>

        {/* Section 3: Skin Type & Concerns */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100/80">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Skin Wellness Profile</h2>
              <p className="text-xs text-slate-400">For targeted barrier repair & radiance suggestions</p>
            </div>
          </div>

          {/* Skin Type */}
          <div className="mb-5">
            <label className="text-xs font-bold text-slate-700 block mb-2">Skin Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'] as SkinType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, skinType: type })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    formData.skinType === type
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white border-transparent shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Concerns (Multi-Select) */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Key Skin Concerns (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {skinConcernOptions.map((c) => {
                const isSelected = formData.skinConcerns.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleSkinConcern(c)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 text-amber-800 ring-1 ring-amber-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-amber-600" />}
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Menstrual & Cycle Dynamics */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100/80">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Menstrual & Cycle Dynamics</h2>
              <p className="text-xs text-slate-400">Calculates dynamic phase dates, ovulation, and luteal wind-down</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                First Day of Last Period *
              </label>
              <input
                type="date"
                required
                value={formData.lastPeriodDate}
                onChange={(e) => setFormData({ ...formData, lastPeriodDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-slate-700">Average Cycle Length</span>
                <span className="font-extrabold text-pink-600 px-2 py-0.5 rounded bg-pink-50">
                  {formData.cycleLengthDays} Days
                </span>
              </div>
              <input
                type="range"
                min={21}
                max={35}
                step={1}
                value={formData.cycleLengthDays}
                onChange={(e) => setFormData({ ...formData, cycleLengthDays: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>21 days</span>
                <span>28 days (typical)</span>
                <span>35 days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Cycle Regularity</label>
              <select
                value={formData.cycleRegularity}
                onChange={(e) =>
                  setFormData({ ...formData, cycleRegularity: e.target.value as CycleRegularity })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="Regular (26-32 days)">Regular (26-32 days)</option>
                <option value="Slightly Irregular">Slightly Irregular</option>
                <option value="Irregular">Irregular</option>
                <option value="Not Sure">Not Sure</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Usual Flow Intensity</label>
              <select
                value={formData.periodFlow}
                onChange={(e) => setFormData({ ...formData, periodFlow: e.target.value as FlowIntensity })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="Spotting">Spotting (Very light)</option>
                <option value="Light">Light Flow</option>
                <option value="Medium">Medium Flow</option>
                <option value="Heavy">Heavy Flow</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current Mood / Energy</label>
              <select
                value={formData.periodMood}
                onChange={(e) => setFormData({ ...formData, periodMood: e.target.value as MoodType })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="Calm">Calm & Centered</option>
                <option value="Energetic">Energetic & Productive</option>
                <option value="Tired">Fatigued / Sleepy</option>
                <option value="Crampy">Crampy / Tender</option>
                <option value="Anxious">Anxious / Restless</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Location & Emergency Address */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100/80">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-800">Location & Emergency Care Center</h2>
                <p className="text-xs text-slate-400">Used for fast SOS hospital finding & delivery fulfillment</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-bold transition shrink-0"
            >
              <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting...' : 'Detect GPS'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Street Address</label>
              <input
                type="text"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="#42, Lotus Residency, 4th Cross"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Area / Landmark</label>
                <input
                  type="text"
                  value={formData.areaLandmark}
                  onChange={(e) => setFormData({ ...formData, areaLandmark: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g. Indiranagar 100ft Rd"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pincode *</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => {
                    setFormData({ ...formData, pincode: e.target.value });
                    if (errors.pincode) setErrors({ ...errors, pincode: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 ${
                    errors.pincode ? 'border-rose-400' : 'border-slate-200 focus:ring-pink-500'
                  }`}
                  placeholder="560038"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Contact Number</label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Reminder Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <Shield className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>WellNest Medical Disclaimer:</strong> Predictions, cycle calculations, and diet suggestions are provided as general lifestyle and wellness insights. They do not constitute formal medical diagnoses, prescription advice, or contraception. Always consult a qualified medical professional for health conditions.
          </p>
        </div>

        {/* Submit / Onboarding Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Skip to Dashboard
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-pink-200 hover:opacity-95 flex items-center justify-center gap-2 transition ${
              isSaving ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isSaving ? (
              <span>Personalizing Your Wellness Nest...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile & Open SC2 Predictions</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
