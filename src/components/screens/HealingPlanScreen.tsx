import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Recipe,
  ExerciseItem,
  PeriodDailyLog,
  CyclePhase,
  FlowIntensity,
  MoodType,
} from '../../types';
import { sampleRecipes, sampleExercises, sampleProducts } from '../../data/mockData';
import {
  UtensilsCrossed,
  Activity,
  CalendarHeart,
  Apple,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Check,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  Printer,
  Sparkles,
  Heart,
  Droplet,
  Flame,
  Shield,
  Video,
  AlertCircle,
} from 'lucide-react';
import { NestyMascot } from '../common/NestyMascot';

export const HealingPlanScreen: React.FC = () => {
  const {
    profile,
    updateProfile,
    phaseInfo,
    mealPlan,
    toggleMealPlan,
    addToCart,
    periodLogs,
    addOrUpdatePeriodLog,
    deletePeriodLog,
    showToast,
  } = useApp();

  const navigate = useNavigate();

  // Active top tab
  const [activeTab, setActiveTab] = useState<'diet' | 'exercise' | 'period' | 'foods'>('period');

  // Modals state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
  const [isDailyLogOpen, setIsDailyLogOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedPhaseDetail, setSelectedPhaseDetail] = useState<CyclePhase | null>(null);

  // Diet Lab Filter
  const [dietMealFilter, setDietMealFilter] = useState<'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('All');
  const [selectedDietKit, setSelectedDietKit] = useState<string | null>(null);

  // Exercise Filter
  const [exerciseFilter, setExerciseFilter] = useState<string>('All');

  // Interactive Exercise Timer State
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [initialTimerDuration, setInitialTimerDuration] = useState<number>(300);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      showToast('Movement session completed! Amazing self-care 👏', 'success');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  const handleOpenExerciseModal = (ex: ExerciseItem) => {
    setSelectedExercise(ex);
    setTimerSecondsLeft(ex.durationSeconds);
    setInitialTimerDuration(ex.durationSeconds);
    setIsTimerRunning(false);
  };

  // Format time mm:ss
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Diet Recipes Filtered
  const filteredRecipes = sampleRecipes.filter((r) => {
    if (selectedDietKit && r.category !== selectedDietKit) return false;
    if (dietMealFilter !== 'All' && r.mealType !== dietMealFilter) return false;
    return true;
  });

  // Diet Kits
  const dietKits = [
    { name: 'Hormonal Wellness', desc: 'Seed cycling & low GI carbs', icon: '🌸' },
    { name: 'Weight Management', desc: 'High fiber & protein balance', icon: '🥑' },
    { name: 'Glowing Skin', desc: 'Antioxidants & zinc minerals', icon: '✨' },
    { name: 'Hair Care', desc: 'Biotin & marine omega rich', icon: '🌿' },
    { name: 'Bone Health', desc: 'Bioavailable calcium & iron', icon: '🦴' },
  ];

  // Daily Period Log Form
  const [dailyLogForm, setDailyLogForm] = useState<PeriodDailyLog>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    flow: 'Medium',
    mood: 'Energetic',
    painLevel: 2,
    discharge: 'Creamy',
    notes: '',
  });

  const handleSaveDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdatePeriodLog({
      ...dailyLogForm,
      id: 'log-' + Date.now(),
    });
    setIsDailyLogOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <NestyMascot mood="happy" size="md" animate={true} />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs">
              SC3 • Holistic Healing Plan
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Diet Lab, Movement & Period Wheel
            </h1>
            <p className="text-xs sm:text-sm text-pink-100 max-w-lg mt-0.5">
              Sync your meals, daily exercise routine, and cycle rhythm with nature’s biological clock.
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-black/20 backdrop-blur-md rounded-2xl">
          {[
            { id: 'period', label: 'Period Tracker', icon: CalendarHeart },
            { id: 'diet', label: 'Diet Lab', icon: UtensilsCrossed },
            { id: 'exercise', label: 'Exercise & Timer', icon: Activity },
            { id: 'foods', label: 'Wellness Foods', icon: Apple },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-pink-600 shadow-md'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB A: PERIOD TRACKER & 4-COLOR CIRCULAR PHASE WHEEL */}
      {/* ============================================================== */}
      {activeTab === 'period' && (
        <div className="space-y-6">
          {/* Cycle Parameters Bar */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                <CalendarHeart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Your Current Biological Rhythm</h3>
                <p className="text-xs text-slate-400">
                  Last period: <strong>{profile.lastPeriodDate}</strong> • Cycle:{' '}
                  <strong>{profile.cycleLengthDays} Days</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDailyLogOpen(true)}
                className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log Today's Flow / Mood</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-violet-600" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Interactive Circular 4-Color Phase Wheel & Detail Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 4-Color Wheel (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-pink-100 flex flex-col items-center justify-center text-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                4-Phase Biological Wheel
              </h4>
              <p className="text-[11px] text-slate-500 mb-4">Click any segment to view phase guidance</p>

              <div className="relative w-64 h-64 flex items-center justify-center select-none">
                {/* SVG 4-color Ring */}
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {/* Phase 1: Menstrual (Days 1-5, ~18%) Pink */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="24"
                    strokeDasharray="85 386"
                    strokeDashoffset="0"
                    className="cursor-pointer hover:opacity-85 transition"
                    onClick={() => setSelectedPhaseDetail('Menstrual')}
                  />
                  {/* Phase 2: Follicular (Days 6-12, ~25%) Violet */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="24"
                    strokeDasharray="118 353"
                    strokeDashoffset="-85"
                    className="cursor-pointer hover:opacity-85 transition"
                    onClick={() => setSelectedPhaseDetail('Follicular')}
                  />
                  {/* Phase 3: Ovulatory (Days 13-16, ~14%) Amber */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="24"
                    strokeDasharray="68 403"
                    strokeDashoffset="-203"
                    className="cursor-pointer hover:opacity-85 transition"
                    onClick={() => setSelectedPhaseDetail('Ovulatory')}
                  />
                  {/* Phase 4: Luteal (Days 17-28, ~43%) Cyan */}
                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="24"
                    strokeDasharray="200 271"
                    strokeDashoffset="-271"
                    className="cursor-pointer hover:opacity-85 transition"
                    onClick={() => setSelectedPhaseDetail('Luteal')}
                  />
                </svg>

                {/* Center Wheel Indicator */}
                <div className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-white shadow-inner flex flex-col items-center justify-center p-2 border border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Current Day</span>
                  <span className="text-2xl font-black text-slate-900 leading-none my-0.5">
                    Day {phaseInfo.cycleDay}
                  </span>
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: phaseInfo.phaseColor }}
                  >
                    {phaseInfo.currentPhase}
                  </span>
                </div>
              </div>

              {/* Phase Color Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4 w-full text-left text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPhaseDetail('Menstrual')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-pink-50 hover:bg-pink-100 transition"
                >
                  <span className="w-3 h-3 rounded-full bg-pink-500 shrink-0" />
                  <div>
                    <p className="font-bold text-pink-900 leading-none">Menstrual</p>
                    <p className="text-[10px] text-pink-600">Days 1-5 • Rest</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPhaseDetail('Follicular')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-violet-50 hover:bg-violet-100 transition"
                >
                  <span className="w-3 h-3 rounded-full bg-violet-500 shrink-0" />
                  <div>
                    <p className="font-bold text-violet-900 leading-none">Follicular</p>
                    <p className="text-[10px] text-violet-600">Days 6-12 • Rise</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPhaseDetail('Ovulatory')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 hover:bg-amber-100 transition"
                >
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-900 leading-none">Ovulatory</p>
                    <p className="text-[10px] text-amber-600">Days 13-16 • Peak</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPhaseDetail('Luteal')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 transition"
                >
                  <span className="w-3 h-3 rounded-full bg-cyan-500 shrink-0" />
                  <div>
                    <p className="font-bold text-cyan-900 leading-none">Luteal</p>
                    <p className="text-[10px] text-cyan-600">Days 17-28 • Calm</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Active Phase Details & Forecast (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-pink-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: phaseInfo.phaseColor }}
                    />
                    <h3 className="text-base font-black text-slate-800">{phaseInfo.phaseTitle}</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    Next period est: <strong>{phaseInfo.nextPeriodDate}</strong> ({phaseInfo.daysUntilPeriod}d)
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {phaseInfo.phaseDescription}
                </p>

                {/* 3 Guidance Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                      Energy State
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{phaseInfo.energyLevel}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                      Recommended Movement
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                      {phaseInfo.recommendedWorkout}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                      Nourishment Goal
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                      Iron, Zinc & Fiber balance
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100 text-xs text-pink-900 leading-relaxed">
                  <strong>Nesty Self-Care Protocol:</strong> {phaseInfo.selfCareTip}
                </div>
              </div>

              {/* Adjust Cycle settings inline */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600">Cycle Length:</span>
                  <input
                    type="number"
                    min={21}
                    max={35}
                    value={profile.cycleLengthDays}
                    onChange={(e) =>
                      updateProfile({ cycleLengthDays: parseInt(e.target.value) || 28 })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 font-bold text-slate-800 text-center"
                  />
                  <span className="text-slate-400">Days</span>
                </div>

                <Link
                  to="/sos"
                  className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <span>Severe pain / irregular? Consult OB-GYN</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Monthly Mini Calendar & Saved Daily Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 6-Month Cycle Bar History (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                6-Month Cycle Regularity History
              </h3>
              <div className="space-y-2">
                {[
                  { month: 'Oct 2026', days: 28, status: 'On Time (28d)', flow: 'Normal' },
                  { month: 'Sep 2026', days: 29, status: 'On Time (29d)', flow: 'Medium' },
                  { month: 'Aug 2026', days: 27, status: 'On Time (27d)', flow: 'Light' },
                  { month: 'Jul 2026', days: 28, status: 'On Time (28d)', flow: 'Normal' },
                  { month: 'Jun 2026', days: 30, status: 'On Time (30d)', flow: 'Heavy' },
                  { month: 'May 2026', days: 28, status: 'On Time (28d)', flow: 'Normal' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                  >
                    <span className="font-bold text-slate-700 w-20">{item.month}</span>
                    <div className="flex-1 mx-3">
                      <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                          style={{ width: `${(item.days / 35) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-semibold text-slate-600">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Daily Logs (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Recent Daily Logs ({periodLogs.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDailyLogOpen(true)}
                  className="text-xs font-bold text-pink-600 hover:text-pink-700"
                >
                  + Add New Entry
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {periodLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No daily logs yet.</p>
                ) : (
                  periodLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 text-xs flex items-start justify-between gap-3 group hover:border-pink-200 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800">{log.date}</span>
                          <span className="px-2 py-0.2 rounded-full bg-pink-100 text-pink-700 font-bold text-[10px]">
                            {log.flow} Flow
                          </span>
                          <span className="px-2 py-0.2 rounded-full bg-violet-100 text-violet-700 font-bold text-[10px]">
                            {log.mood}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-slate-500 text-[11px] mt-1 italic">"{log.notes}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400">
                          Pain: {log.painLevel}/10
                        </span>
                        <button
                          type="button"
                          onClick={() => deletePeriodLog(log.id)}
                          className="text-slate-300 hover:text-rose-500 p-1 rounded"
                          title="Delete entry"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB B: DIET LAB & RECIPES */}
      {/* ============================================================== */}
      {activeTab === 'diet' && (
        <div className="space-y-6">
          {/* Diet Kits Row */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Targeted Wellness Diet Kits
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {dietKits.map((kit) => {
                const isSelected = selectedDietKit === kit.name;
                return (
                  <button
                    key={kit.name}
                    type="button"
                    onClick={() => setSelectedDietKit(isSelected ? null : kit.name)}
                    className={`p-3.5 rounded-2xl border text-left transition select-none ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/70 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <span className="text-xl mb-1 block">{kit.icon}</span>
                    <p className="text-xs font-bold text-slate-800">{kit.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{kit.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meal Filters Bar */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const).map((meal) => (
                <button
                  key={meal}
                  type="button"
                  onClick={() => setDietMealFilter(meal)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    dietMealFilter === meal
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Showing {filteredRecipes.length} Recipes
            </span>
          </div>

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecipes.map((rec) => {
              const isAddedToMealPlan = mealPlan.includes(rec.id);
              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={rec.image}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold uppercase">
                        {rec.mealType}
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-extrabold">
                        {rec.calories} kcal
                      </span>
                    </div>

                    <div className="p-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                        {rec.category}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-800 mt-1 line-clamp-1">
                        {rec.title}
                      </h4>

                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {rec.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <ul className="mt-3 space-y-1 text-[11px] text-slate-500">
                        {rec.benefits.slice(0, 2).map((b, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRecipe(rec)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      View Recipe
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleMealPlan(rec.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isAddedToMealPlan
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-xs hover:opacity-95'
                      }`}
                    >
                      {isAddedToMealPlan ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>In Meal Plan</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB C: EXERCISE & WORKING COUNTDOWN TIMER */}
      {/* ============================================================== */}
      {activeTab === 'exercise' && (
        <div className="space-y-6">
          {/* Working Hero Timer if Active */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-pink-400">
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400">
                  Interactive Movement Session
                </span>
                <h3 className="text-lg font-black mt-0.5">
                  {selectedExercise ? selectedExercise.title : 'Gentle Daily Movement Flow'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Boosts oxygenation and soothes cycle tension without elevating stress cortisol.
                </p>
              </div>
            </div>

            {/* Countdown Display & Controls */}
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-mono font-black tracking-wider text-pink-400">
                {formatTimer(timerSecondsLeft)}
              </span>
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSecondsLeft(initialTimerDuration);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Exercise Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleExercises.map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img src={ex.image} alt={ex.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold uppercase">
                      {ex.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-extrabold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-pink-600" />
                      <span>{Math.round(ex.durationSeconds / 60)} mins</span>
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                      Intensity: {ex.difficulty}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-800 mt-1 line-clamp-1">
                      {ex.title}
                    </h4>

                    <ul className="mt-3 space-y-1 text-[11px] text-slate-500">
                      {ex.benefits.slice(0, 2).map((b, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                          <span className="truncate">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => handleOpenExerciseModal(ex)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-xs shadow-xs hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Exercise Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB D: WELLNESS FOODS */}
      {/* ============================================================== */}
      {activeTab === 'foods' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span>Click any superfood item to add it to your daily meal plan or review nutritional benefits.</span>
            <span className="font-bold">Natural Whole Nutrition</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'Ceylon Cinnamon',
                role: 'Blood Sugar Sensitivity',
                desc: 'Blunts post-prandial glycemic spikes',
                cal: '6 kcal / tsp',
                icon: '🍂',
              },
              {
                name: 'Raw Pumpkin Seeds',
                role: 'Zinc & Progesterone Booster',
                desc: 'Rich in magnesium and phytosterols',
                cal: '150 kcal / 28g',
                icon: '🎃',
              },
              {
                name: 'Split Yellow Moong Dal',
                role: 'Gentle Ayurvedic Protein',
                desc: 'Light on gut, high in folate & iron',
                cal: '180 kcal / cup',
                icon: '🥣',
              },
              {
                name: 'Raw Flaxseeds',
                role: 'Lignan Estrogen Harmonizer',
                desc: 'Binds excess estrogen during follicular phase',
                cal: '55 kcal / tbsp',
                icon: '🌾',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-5 rounded-3xl bg-white border border-pink-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl mb-2 block">{f.icon}</span>
                  <h4 className="text-sm font-extrabold text-slate-800">{f.name}</h4>
                  <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wide block mt-0.5">
                    {f.role}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">{f.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">{f.cal}</span>
                  <button
                    type="button"
                    onClick={() => showToast(`Added ${f.name} to your wellness food list!`, 'success')}
                    className="px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 text-xs font-bold hover:bg-pink-100 transition"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* RECIPE DETAIL MODAL */}
      {/* ============================================================== */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="relative h-48 sm:h-56">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                  {selectedRecipe.mealType}
                </span>
                <span className="px-3 py-1 rounded-full bg-white text-slate-900 text-xs font-bold">
                  {selectedRecipe.calories} Calories
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600">
                  {selectedRecipe.category}
                </span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">{selectedRecipe.title}</h3>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Ingredients List
                </h4>
                <div className="space-y-1.5">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="font-bold text-slate-700">{ing.name}</span>
                      <span className="text-slate-400 font-semibold">{ing.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Step-by-Step Preparation
                </h4>
                <div className="space-y-2">
                  {selectedRecipe.instructions.map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-slate-600 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  toggleMealPlan(selectedRecipe.id);
                  setSelectedRecipe(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                {mealPlan.includes(selectedRecipe.id) ? 'Remove from Plan' : 'Add to Meal Plan'}
              </button>

              <button
                type="button"
                onClick={() => {
                  addToCart(sampleProducts[0], 1);
                  showToast('Added organic ingredients to WellNest cart!', 'success');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add Ingredients to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EXERCISE DETAIL & VIDEO MODAL */}
      {/* ============================================================== */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-violet-50 to-pink-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  {selectedExercise.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-1">
                  {selectedExercise.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Illustrative Simulated Video Banner */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900 text-white flex items-center justify-center">
                <img
                  src={selectedExercise.image}
                  alt={selectedExercise.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-lg animate-pulse cursor-pointer">
                    <Play className="w-6 h-6 ml-0.5" />
                  </div>
                  <span className="text-[10px] font-bold mt-2 bg-black/60 px-2 py-0.5 rounded-full">
                    Demo Video Player • HD Guide
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Movement Guidelines
                </h4>
                <div className="space-y-2">
                  {selectedExercise.instructions.map((inst, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-slate-600 leading-relaxed">{inst}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Duration: <strong>{Math.round(selectedExercise.durationSeconds / 60)} minutes</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(true);
                  setSelectedExercise(null);
                  showToast('Timer started! Enjoy your flow.', 'success');
                }}
                className="px-5 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-md hover:bg-pink-600 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start {Math.round(selectedExercise.durationSeconds / 60)}m Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DAILY LOG MODAL */}
      {/* ============================================================== */}
      {isDailyLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-violet-50 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-800">Log Daily Period & Symptoms</h3>
              <button
                type="button"
                onClick={() => setIsDailyLogOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDailyLog} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={dailyLogForm.date}
                  onChange={(e) => setDailyLogForm({ ...dailyLogForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Flow Intensity</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Spotting', 'Light', 'Medium', 'Heavy'] as FlowIntensity[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setDailyLogForm({ ...dailyLogForm, flow: f })}
                      className={`py-2 rounded-xl border font-bold text-center transition ${
                        dailyLogForm.flow === f
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mood</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Calm', 'Happy', 'Energetic', 'Tired', 'Crampy', 'Anxious'] as MoodType[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDailyLogForm({ ...dailyLogForm, mood: m })}
                      className={`py-1.5 rounded-xl border font-semibold text-center transition ${
                        dailyLogForm.mood === m
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-700">Pelvic Cramp / Pain Level</span>
                  <span className="font-bold text-pink-600">{dailyLogForm.painLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={dailyLogForm.painLevel}
                  onChange={(e) =>
                    setDailyLogForm({ ...dailyLogForm, painLevel: parseInt(e.target.value) })
                  }
                  className="w-full accent-pink-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Sensations</label>
                <textarea
                  rows={2}
                  value={dailyLogForm.notes}
                  onChange={(e) => setDailyLogForm({ ...dailyLogForm, notes: e.target.value })}
                  placeholder="e.g. Mild headache, took herbal warm tea..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition"
              >
                Save Daily Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EXPORT PERIOD REPORT MODAL */}
      {/* ============================================================== */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-5 border-b border-pink-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-800">WellNest Menstrual Health Report</h3>
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800 text-sm">Patient: {profile.name}</p>
                <p className="text-slate-500">
                  Age: {profile.age} • BMI: {((profile.weightKg / Math.pow(profile.heightCm / 100, 2))).toFixed(1)}
                </p>
                <p className="text-slate-500">
                  Average Cycle Length: {profile.cycleLengthDays} Days • Regularity: {profile.cycleRegularity}
                </p>
                <p className="text-slate-500">Last Reported Period: {profile.lastPeriodDate}</p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Recorded Symptom Entries ({periodLogs.length})
                </h4>
                <div className="space-y-1.5 border border-slate-100 rounded-xl p-2 max-h-44 overflow-y-auto">
                  {periodLogs.map((p) => (
                    <div key={p.id} className="flex justify-between py-1 border-b border-slate-50 text-[11px]">
                      <span>{p.date}</span>
                      <span className="font-semibold text-slate-700">
                        {p.flow} Flow • Mood: {p.mood} • Pain: {p.painLevel}/10
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                This document is generated by WellNest for informational reference. It can be shared with your healthcare provider during visits.
              </p>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => showToast('Printing simulated PDF report...', 'info')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
