import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  Clock,
  ExternalLink,
  Settings,
  Sparkles,
  CalendarHeart,
  UtensilsCrossed,
  ShoppingBag,
  ShieldAlert,
  Heart,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    snoozeNotification,
    setIsSettingsOpen,
  } = useApp();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'Period' | 'Diet' | 'Store' | 'SOS'>('All');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isNotificationOpen) return null;

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'All') return true;
    return notif.category === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Period':
        return <CalendarHeart className="w-4 h-4 text-pink-500" />;
      case 'Diet':
        return <UtensilsCrossed className="w-4 h-4 text-emerald-500" />;
      case 'Store':
        return <ShoppingBag className="w-4 h-4 text-violet-500" />;
      case 'SOS':
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      default:
        return <Heart className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleActionClick = (notifId: string, url?: string) => {
    markNotificationAsRead(notifId);
    setIsNotificationOpen(false);
    if (url) {
      navigate(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-violet-50 via-pink-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                  Notification Center
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500 text-white">
                      {unreadCount} unread
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400">Personalized wellness alerts & updates</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="p-2 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-white transition"
                title="Notification Settings"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsNotificationOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar">
            {(['All', 'Period', 'Diet', 'Store', 'SOS'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Controls Bar: Mark All Read & Clear All */}
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1 font-semibold text-violet-600 hover:text-violet-700 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>

            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-rose-600 font-semibold">Clear all?</span>
                <button
                  type="button"
                  onClick={() => {
                    notifications.forEach((n) => deleteNotification(n.id));
                    setShowClearConfirm(false);
                  }}
                  className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 mx-auto flex items-center justify-center mb-3">
                  <Bell className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">All caught up!</h3>
                <p className="text-xs text-slate-400 mt-1">No notifications in {activeTab}. Nesty is keeping an eye on your wellness.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    notif.isRead
                      ? 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                      : 'bg-gradient-to-br from-violet-50/50 via-pink-50/40 to-white border-pink-200/80 shadow-xs ring-1 ring-pink-100/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white shadow-xs border border-slate-100">
                        {getCategoryIcon(notif.category)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {notif.category}
                      </span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 mt-2">{notif.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</p>

                  {/* Actions bar */}
                  <div className="mt-3 pt-2 border-t border-slate-100/70 flex items-center justify-between text-xs">
                    {notif.actionUrl && (
                      <button
                        type="button"
                        onClick={() => handleActionClick(notif.id, notif.actionUrl)}
                        className="flex items-center gap-1 font-bold text-pink-600 hover:text-pink-700 transition"
                      >
                        <span>{notif.actionLabel || 'View'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        type="button"
                        onClick={() => snoozeNotification(notif.id, 60)}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-violet-600 px-2 py-1 rounded-md hover:bg-violet-50 transition"
                        title="Snooze for 1 hour"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Snooze</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-emerald-600 px-2 py-1 rounded-md hover:bg-emerald-50 transition"
                        title="Mark as read"
                      >
                        Done
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteNotification(notif.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded transition"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <p className="text-[11px] text-slate-400">
              Live in-app notifications are active. Turn off sound or vibration anytime in settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
