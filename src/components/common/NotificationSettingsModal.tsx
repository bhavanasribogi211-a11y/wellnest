import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, Volume2, Smartphone, Sparkles, Check } from 'lucide-react';

export const NotificationSettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, notificationSettings, updateNotificationSettings, showToast } =
    useApp();

  if (!isSettingsOpen) return null;

  const toggleItem = (key: keyof typeof notificationSettings) => {
    updateNotificationSettings({ [key]: !notificationSettings[key] });
  };

  const categories = [
    { key: 'period', label: 'Period & Phase Reminders', desc: 'Upcoming cycle alerts, phase transitions, and daily log reminders' },
    { key: 'diet', label: 'Diet & Meal Reminders', desc: 'Breakfast, lunch, seed cycling, and post-workout nutrition alerts' },
    { key: 'water', label: 'Hydration & Water Alerts', desc: 'Gentle hydration nudges to drink water throughout the day' },
    { key: 'exercise', label: 'Exercise & Movement', desc: 'Daily stretches, brisk walking prompts, and facial Gua Sha routines' },
    { key: 'medicines', label: 'Medicines & Supplements', desc: 'Morning inositol, iron, evening magnesium chew alerts' },
    { key: 'store', label: 'WellStore Refill & Delivery', desc: 'Low stock warnings, replenishment suggestions & package tracking' },
    { key: 'appointments', label: 'Doctor & Lab Appointments', desc: 'Confirmations, demo ride updates & diagnostic report ready alerts' },
  ] as const;

  const systemToggles = [
    { key: 'sound', label: 'Notification Chime / Sound', icon: Volume2 },
    { key: 'vibration', label: 'Haptic Touch / Vibration', icon: Smartphone },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-violet-50 to-pink-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Notification Preferences</h2>
              <p className="text-xs text-slate-500">Customize how and when Nesty reminds you</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Wellness Alert Categories
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => {
                const isEnabled = notificationSettings[cat.key];
                return (
                  <div
                    key={cat.key}
                    onClick={() => toggleItem(cat.key)}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 cursor-pointer transition select-none"
                  >
                    <div className="pr-3">
                      <span className="text-xs font-bold text-slate-800 block">{cat.label}</span>
                      <span className="text-[11px] text-slate-400 leading-tight">{cat.desc}</span>
                    </div>

                    <button
                      type="button"
                      aria-checked={isEnabled}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEnabled ? 'bg-gradient-to-r from-violet-600 to-pink-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Device Feedback
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {systemToggles.map((item) => {
                const isEnabled = notificationSettings[item.key];
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleItem(item.key)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition select-none ${
                      isEnabled
                        ? 'border-violet-300 bg-violet-50/50 text-violet-900'
                        : 'border-slate-100 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-violet-600" />
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isEnabled ? 'bg-violet-600 text-white' : 'bg-slate-300 text-slate-500'
                      }`}
                    >
                      {isEnabled ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Settings are saved locally on this browser.</span>
          <button
            type="button"
            onClick={() => {
              setIsSettingsOpen(false);
              showToast('Preferences saved!', 'success');
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
