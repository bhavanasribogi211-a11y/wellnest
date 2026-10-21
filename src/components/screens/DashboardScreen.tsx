import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Heart,
  Droplet,
  CalendarHeart,
  Activity,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  X,
  AlertTriangle,
  ShoppingBag,
  UtensilsCrossed,
  ShieldAlert,
  Flame,
  Info,
} from 'lucide-react';
import { NestyMascot } from '../common/NestyMascot';

interface PredictionDetailModalProps {
  cardKey: 'hormonal' | 'skin' | 'hair' | 'bmi' | 'cycle' | null;
  onClose: () => void;
}

export const DashboardScreen: React.FC = () => {
  const { profile, phaseInfo, calculateBmi, setIsNotificationOpen } = useApp();
  const navigate = useNavigate();
  const [selectedPrediction, setSelectedPrediction] = useState<
    'hormonal' | 'skin' | 'hair' | 'bmi' | 'cycle' | null
  >(null);

  const bmiData = calculateBmi(profile.heightCm, profile.weightKg);

  // Predictions definitions based on saved profile
  const cards = [
    {
      id: 'cycle' as const,
      title: 'Period & Cycle Phase Dynamics',
      tag: phaseInfo.phaseTitle,
      gradient: 'from-pink-500 to-rose-500',
      icon: CalendarHeart,
      metric: `Day ${phaseInfo.cycleDay} of ${profile.cycleLengthDays}`,
      summary: `You are in your ${phaseInfo.currentPhase} phase. Est. next cycle in ${phaseInfo.daysUntilPeriod} days (${phaseInfo.nextPeriodDate}).`,
      highlight: phaseInfo.energyLevel,
      actionRoute: '/healing-plan',
      actionLabel: 'Open Phase Wheel & Log',
    },
    {
      id: 'hormonal' as const,
      title: 'Hormonal Wellness Insights',
      tag: 'Metabolic Balance',
      gradient: 'from-violet-600 to-indigo-600',
      icon: Sparkles,
      metric: `${profile.cycleRegularity}`,
      summary: `Estrogen and progesterone synthesis aligned with ${profile.periodMood.toLowerCase()} mood and ${profile.periodFlow.toLowerCase()} flow patterns.`,
      highlight: 'Key Focus: Inositol & Zinc',
      actionRoute: '/healing-plan',
      actionLabel: 'Check Seed Cycling Diet',
    },
    {
      id: 'skin' as const,
      title: 'Skin Wellness & Barrier Analysis',
      tag: `${profile.skinType} Skin Type`,
      gradient: 'from-amber-500 to-pink-500',
      icon: Droplet,
      metric: `${profile.skinConcerns.slice(0, 2).join(' & ')}`,
      summary: `Skin barrier resilience recommendation based on your reported ${profile.skinConcerns.join(', ')}.`,
      highlight: 'Ceramide + SPF Priority',
      actionRoute: '/store',
      actionLabel: 'Shop Skin Solutions',
    },
    {
      id: 'hair' as const,
      title: 'Hair Density & Scalp Biome',
      tag: `${profile.scalpType} Scalp`,
      gradient: 'from-purple-600 to-fuchsia-600',
      icon: Heart,
      metric: `${profile.hairType} Texture`,
      summary: `Follicle nourishment plan for ${profile.hairConcerns.join(' and ')}. Recommended wash cadence: ${profile.hairWashFreq}.`,
      highlight: 'Rosemary & Scalp Acupressure',
      actionRoute: '/healing-plan',
      actionLabel: 'Start Scalp Routine',
    },
    {
      id: 'bmi' as const,
      title: 'BMI & Nutritional Satiety',
      tag: `${bmiData.category}`,
      gradient: 'from-emerald-500 to-teal-600',
      icon: Activity,
      metric: `BMI ${bmiData.bmi}`,
      summary: `${bmiData.advice} Calculated from ${profile.heightCm}cm and ${profile.weightKg}kg.`,
      highlight: 'Optimal Caloric Balance',
      actionRoute: '/healing-plan',
      actionLabel: 'Explore Diet Kits',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Personalized Greeting Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <NestyMascot
              mood="cheering"
              size="lg"
              bubbleText={`Welcome, ${profile.name.split(' ')[0]}! Ready to bloom today? 🌸`}
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs">
                SC2 • Personalized Prediction Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Hello, {profile.name}! 🐣
              </h1>
              <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-lg">
                Your biological rhythm is currently in the <strong>{phaseInfo.phaseTitle}</strong>. All wellness insights below are updated in real-time from your biometrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/welcome"
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition shadow-xs"
            >
              Update Profile
            </Link>
            <Link
              to="/healing-plan"
              className="px-5 py-2.5 rounded-2xl bg-white text-slate-900 text-xs font-extrabold hover:bg-pink-50 transition shadow-md flex items-center gap-1.5"
            >
              <span>Diet & Exercise</span>
              <ArrowRight className="w-4 h-4 text-pink-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Medical Caution Notice */}
      <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-100 flex items-start gap-3">
        <Info className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong>Wellness Insights Disclaimer:</strong> The predictions below are algorithmic lifestyle summaries based on your reported dates, hair and skin types, and BMI. They are designed for educational self-care and do not substitute for clinical diagnoses of PCOS, thyroid disorders, or dermatological conditions.
        </div>
      </div>

      {/* 5 Clickable Insight Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Your 5 Core Wellness Predictions</h2>
            <p className="text-xs text-slate-400">Click any card to inspect full deep-dive explanation and recommended actions</p>
          </div>
          <span className="text-xs font-bold text-pink-600 hidden sm:inline">Tap card to expand details →</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedPrediction(card.id)}
                className="group relative bg-white rounded-3xl p-6 border border-pink-100/70 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Card top */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-pink-100 group-hover:text-pink-700 transition">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-800 group-hover:text-pink-600 transition">
                    {card.title}
                  </h3>

                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded-lg bg-pink-50 border border-pink-100 text-xs font-bold text-pink-700">
                    {card.metric}
                  </div>

                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed line-clamp-3">
                    {card.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-violet-600">{card.highlight}</span>
                  <span className="text-slate-400 group-hover:text-pink-600 flex items-center gap-1 transition">
                    <span>Inspect</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access Action Hubs */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-pink-100/80">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4">
          Direct Wellness Hubs
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/healing-plan"
            className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50/50 border border-pink-100 hover:border-pink-300 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500 text-white mx-auto flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Diet Lab & Recipes</span>
            <span className="text-[10px] text-slate-400">Meal plans & kits</span>
          </Link>

          <Link
            to="/healing-plan"
            className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50/50 border border-violet-100 hover:border-violet-300 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white mx-auto flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Exercise & Timer</span>
            <span className="text-[10px] text-slate-400">Yoga & acupressure</span>
          </Link>

          <Link
            to="/store"
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100 hover:border-amber-300 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white mx-auto flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Well Store</span>
            <span className="text-[10px] text-slate-400">20+ verified products</span>
          </Link>

          <Link
            to="/sos"
            className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50/50 border border-red-100 hover:border-red-300 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white mx-auto flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">SOS & Hospitals</span>
            <span className="text-[10px] text-slate-400">24/7 care & demo rides</span>
          </Link>
        </div>
      </div>

      {/* Modal for Detailed Prediction Card */}
      {selectedPrediction && (
        <PredictionModal
          cardKey={selectedPrediction}
          onClose={() => setSelectedPrediction(null)}
        />
      )}
    </div>
  );
};

// Detailed modal component for SC2 cards
const PredictionModal: React.FC<PredictionDetailModalProps> = ({ cardKey, onClose }) => {
  const { profile, phaseInfo, calculateBmi } = useApp();
  const navigate = useNavigate();

  if (!cardKey) return null;

  const bmiData = calculateBmi(profile.heightCm, profile.weightKg);

  const getContent = () => {
    switch (cardKey) {
      case 'cycle':
        return {
          title: 'Period & Menstrual Cycle Phase Forecast',
          category: 'Cycle Synchronized Wellness',
          summary: `You are in Day ${phaseInfo.cycleDay} of your ${profile.cycleLengthDays}-day cycle. Current phase: ${phaseInfo.currentPhase} (${phaseInfo.phaseTitle}).`,
          explanation: `During the ${phaseInfo.currentPhase} phase, hormone fluctuations significantly modulate serotonin, basal metabolic rate, and ligament laxity. Your estimated next period will begin approximately around ${phaseInfo.nextPeriodDate} (${phaseInfo.daysUntilPeriod} days remaining).`,
          recommendations: [
            phaseInfo.selfCareTip,
            `Optimal workout: ${phaseInfo.recommendedWorkout}`,
            'Track your daily symptom log to increase next month’s phase prediction accuracy.',
          ],
          caution: 'Estimated phase calculations are approximate and should never be used as a method of natural contraception or family planning.',
          primaryActionText: 'Open Period Tracker & Daily Log',
          primaryActionUrl: '/healing-plan',
          secondaryActionText: 'Shop Period Comfort Essentials',
          secondaryActionUrl: '/store',
        };
      case 'hormonal':
        return {
          title: 'Hormonal Wellness & Endocrine Balance',
          category: 'Endocrine Lifestyle Insights',
          summary: `Profile markers: ${profile.cycleRegularity}, reported ${profile.periodMood.toLowerCase()} mood, and ${profile.periodFlow.toLowerCase()} flow.`,
          explanation: `Your endocrine profile indicates active ovulatory responsiveness. Consistent intake of healthy fats, magnesium, and seed cycling (pumpkin & flax in follicular, sesame & sunflower in luteal) assists liver metabolization of circulating estrogen.`,
          recommendations: [
            'Seed cycling: 1 tbsp ground pumpkin seeds daily for gentle zinc support.',
            'Maintain steady blood glucose: Pair morning carbohydrates with protein or fiber.',
            'Aim for 7.5 hours of sleep in dark room to regulate melatonin-LH crosstalk.',
          ],
          caution: 'Irregular cycles, sudden facial hair, or severe painful cramping should be clinically reviewed by an OB-GYN or endocrinologist.',
          primaryActionText: 'View Hormonal Diet Recipes',
          primaryActionUrl: '/healing-plan',
          secondaryActionText: 'Book Consult at Nearby Hospital',
          secondaryActionUrl: '/sos',
        };
      case 'skin':
        return {
          title: 'Skin Barrier & Texture Optimization',
          category: `${profile.skinType} Skin Profile`,
          summary: `Analysis targeted for ${profile.skinConcerns.join(', ')} with ${profile.skinType.toLowerCase()} complexion.`,
          explanation: `With ${profile.skinType.toLowerCase()} skin and reported concerns of ${profile.skinConcerns.join(', ')}, fluctuating cycle hormones (especially mid-luteal progesterone spikes) can increase sebum viscosity in pore linings. Supporting the lipid barrier with ceramides and non-clogging hydration prevents rebound oiliness.`,
          recommendations: [
            'Gentle double-cleansing without stripping naturally occurring antimicrobial lipids.',
            'Daily broad-spectrum SPF 50+ mineral fluid to prevent post-blemish pigmentation.',
            'Targeted 2% BHA wash on chin and T-zone twice a week.',
          ],
          caution: 'Patch test all active cosmetic formulations behind the ear 24 hours prior to full facial application.',
          primaryActionText: 'Shop Skin Care in WellStore',
          primaryActionUrl: '/store',
          secondaryActionText: 'Ask Nesty AI for Routine',
          secondaryActionUrl: '/chat',
        };
      case 'hair':
        return {
          title: 'Hair Density & Scalp Follicle Optimization',
          category: `${profile.scalpType} Scalp • ${profile.hairType} Texture`,
          summary: `Curated for: ${profile.hairConcerns.join(', ')}. Wash frequency: ${profile.hairWashFreq}.`,
          explanation: `Your ${profile.scalpType.toLowerCase()} scalp requires delicate balancing: clearing excess sebum buildup while preventing micro-inflammation at the dermal papilla. Stimulating blood flow via Shiroabhyanga massage increases delivery of biotin and iron to hair roots.`,
          recommendations: [
            'Scalp acupressure massage 3 nights a week using cold-pressed rosemary and pumpkin seed oil.',
            'Avoid tight high ponytails that cause traction alopecia on frontal edges.',
            'Clarifying apple cider vinegar rinse once weekly to remove hard-water salt buildup.',
          ],
          caution: 'Sudden diffuse hair loss (telogen effluvium) exceeding 150 hairs daily warrants a serum ferritin and thyroid panel.',
          primaryActionText: 'Start 4m Scalp Routine Timer',
          primaryActionUrl: '/healing-plan',
          secondaryActionText: 'Shop Hair Care in WellStore',
          secondaryActionUrl: '/store',
        };
      case 'bmi':
        return {
          title: 'Biometric BMI & Nutrition Synchronization',
          category: `BMI ${bmiData.bmi} • ${bmiData.category}`,
          summary: `Height: ${profile.heightCm} cm • Weight: ${profile.weightKg} kg.`,
          explanation: `Your BMI is classified as ${bmiData.category}. ${bmiData.advice} Maintaining balanced macronutrient ratios (complex whole grains, clean protein, and fiber) prevents blood sugar spikes and supports sustained cellular energy.`,
          recommendations: [
            'Incorporate colorful polyphenols (berries, spinach, chia seeds) into morning meals.',
            'Stay hydrated: Aim for 2.2 to 2.5 liters of clean water daily.',
            'Engage in 20 minutes of restorative movement after your heaviest meal.',
          ],
          caution: 'BMI is an epidemiological population indicator and does not account for muscle mass or visceral fat distribution.',
          primaryActionText: 'Explore Diet Kits & Meal Plans',
          primaryActionUrl: '/healing-plan',
          secondaryActionText: 'Ask Nesty AI for Meal Tips',
          secondaryActionUrl: '/chat',
        };
    }
  };

  const content = getContent();

  const handleNavigate = (url: string) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-violet-50 via-pink-50 to-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {content.category}
            </span>
            <h2 className="text-base font-extrabold text-slate-800 mt-1">{content.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Summary Callout */}
          <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100 text-pink-900 font-medium">
            {content.summary}
          </div>

          {/* Deep-dive Explanation */}
          <div>
            <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
              Personalized Physiological Insight
            </h3>
            <p className="text-slate-600 leading-relaxed">{content.explanation}</p>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
              Actionable Lifestyle Protocol
            </h3>
            <div className="space-y-2">
              {content.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 leading-normal">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Caution Card */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-tight text-[11px]">{content.caution}</p>
          </div>
        </div>

        {/* Footer Navigation Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleNavigate(content.secondaryActionUrl)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition text-center"
          >
            {content.secondaryActionText}
          </button>

          <button
            type="button"
            onClick={() => handleNavigate(content.primaryActionUrl)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition flex items-center justify-center gap-1.5"
          >
            <span>{content.primaryActionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
