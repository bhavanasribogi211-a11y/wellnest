import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserAuth,
  StoreProduct,
  CartItem,
  AppNotification,
  NotificationSettings,
  PeriodDailyLog,
  BookingRecord,
  OrderRecord,
  CyclePhase,
  RideOption,
} from '../types';
import { initialDefaultProfile, sampleNotifications, sampleProducts } from '../data/mockData';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface ActiveRide {
  option: RideOption;
  status: 'Searching' | 'Driver Assigned' | 'On the way' | 'Arrived' | 'Completed';
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  otp: string;
  etaMinutes: number;
}

interface PhaseCalculation {
  cycleDay: number;
  currentPhase: CyclePhase;
  phaseTitle: string;
  phaseDescription: string;
  nextPeriodDate: string;
  daysUntilPeriod: number;
  phaseColor: string;
  energyLevel: string;
  selfCareTip: string;
  recommendedWorkout: string;
}

interface AppContextType {
  // Profile & Auth
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  userAuth: UserAuth;
  login: (email: string, displayName: string) => void;
  logout: () => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: StoreProduct, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  snoozeNotification: (id: string, mins?: number) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => void;

  // Period Tracker & Cycles
  periodLogs: PeriodDailyLog[];
  addOrUpdatePeriodLog: (log: PeriodDailyLog) => void;
  deletePeriodLog: (id: string) => void;
  phaseInfo: PhaseCalculation;

  // Bookings & Orders
  bookings: BookingRecord[];
  addBooking: (booking: Omit<BookingRecord, 'id' | 'bookingRef'>) => string;
  orders: OrderRecord[];
  addOrder: (order: Omit<OrderRecord, 'id' | 'orderNumber' | 'date'>) => OrderRecord;
  activeOrderForTracking: OrderRecord | null;
  setActiveOrderForTracking: (order: OrderRecord | null) => void;

  // Rides
  activeRide: ActiveRide | null;
  bookRide: (option: RideOption) => void;
  cancelRide: () => void;

  // Meal Plan
  mealPlan: string[];
  toggleMealPlan: (recipeId: string) => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isGlobalDrawerOpen: boolean;
  setIsGlobalDrawerOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Calculation helpers
  calculateBmi: (heightCm: number, weightKg: number) => {
    bmi: number;
    category: 'Underweight' | 'Healthy Weight' | 'Overweight' | 'Obesity Range';
    color: string;
    advice: string;
  };
}

const defaultSettings: NotificationSettings = {
  period: true,
  diet: true,
  water: true,
  exercise: true,
  medicines: true,
  store: true,
  appointments: true,
  sound: true,
  vibration: true,
};

const defaultInitialPeriodLogs: PeriodDailyLog[] = [
  {
    id: 'log-1',
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    flow: 'Medium',
    mood: 'Crampy',
    painLevel: 6,
    discharge: 'None',
    notes: 'Used lavender cramp roll-on. Warm tea helped significantly.',
  },
  {
    id: 'log-2',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    flow: 'Light',
    mood: 'Calm',
    painLevel: 2,
    discharge: 'None',
    notes: 'Energy started feeling much better in the afternoon.',
  },
  {
    id: 'log-3',
    date: new Date().toISOString().split('T')[0],
    flow: 'Spotting',
    mood: 'Energetic',
    painLevel: 0,
    discharge: 'Creamy',
    notes: 'Smooth morning walk, feeling motivated for work.',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wellnest_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse profile', e);
      }
    }
    return initialDefaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('wellnest_user_profile', JSON.stringify(profile));
  }, [profile]);

  // Auth State (defaults to logged-out so user is prompted to login as requested)
  const [userAuth, setUserAuth] = useState<UserAuth>(() => {
    const saved = localStorage.getItem('wellnest_user_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse auth', e);
      }
    }
    return {
      isLoggedIn: false,
      email: '',
      displayName: '',
    };
  });

  useEffect(() => {
    localStorage.setItem('wellnest_user_auth', JSON.stringify(userAuth));
  }, [userAuth]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('wellnest_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    // Prefill with 1 sample item so user sees working cart immediately
    return [
      { product: sampleProducts[0], quantity: 1 },
      { product: sampleProducts[5], quantity: 1 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('wellnest_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('wellnest_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
    return ['prod-skin-2', 'prod-supp-1'];
  });

  useEffect(() => {
    localStorage.setItem('wellnest_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('wellnest_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    }
    return sampleNotifications;
  });

  useEffect(() => {
    localStorage.setItem('wellnest_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('wellnest_notification_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('wellnest_notification_settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Period Logs
  const [periodLogs, setPeriodLogs] = useState<PeriodDailyLog[]>(() => {
    const saved = localStorage.getItem('wellnest_period_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse period logs', e);
      }
    }
    return defaultInitialPeriodLogs;
  });

  useEffect(() => {
    localStorage.setItem('wellnest_period_logs', JSON.stringify(periodLogs));
  }, [periodLogs]);

  // Bookings
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('wellnest_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse bookings', e);
      }
    }
    return [
      {
        id: 'bk-101',
        type: 'Doctor',
        providerName: 'Apollo Cradle Hospital',
        itemName: 'Dr. Sunita Rao (Gynecologist)',
        date: 'Tomorrow',
        timeSlot: '11:45 AM',
        status: 'Confirmed',
        amount: 850,
        bookingRef: 'WN-DOC-8492',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('wellnest_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Orders
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    const saved = localStorage.getItem('wellnest_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse orders', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('wellnest_orders', JSON.stringify(orders));
  }, [orders]);

  // Meal Plan
  const [mealPlan, setMealPlan] = useState<string[]>(() => {
    const saved = localStorage.getItem('wellnest_meal_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse meal plan', e);
      }
    }
    return ['rec-1', 'rec-2'];
  });

  useEffect(() => {
    localStorage.setItem('wellnest_meal_plan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  // Active Ride
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);
  const [activeOrderForTracking, setActiveOrderForTracking] = useState<OrderRecord | null>(null);

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isGlobalDrawerOpen, setIsGlobalDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Helper: BMI calculation
  const calculateBmi = (heightCm: number, weightKg: number) => {
    if (!heightCm || !weightKg || heightCm < 50) {
      return {
        bmi: 21.1,
        category: 'Healthy Weight' as const,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        advice: 'Maintained through balanced fiber and gentle hydration.',
      };
    }
    const heightM = heightCm / 100;
    const bmiVal = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    if (bmiVal < 18.5) {
      return {
        bmi: bmiVal,
        category: 'Underweight' as const,
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        advice: 'Nourish with dense complex carbs, healthy fats, and adequate protein to support cycle energy.',
      };
    }
    if (bmiVal <= 24.9) {
      return {
        bmi: bmiVal,
        category: 'Healthy Weight' as const,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        advice: 'Optimal range! Continue consistent whole-food meals and regular restorative movement.',
      };
    }
    if (bmiVal <= 29.9) {
      return {
        bmi: bmiVal,
        category: 'Overweight' as const,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        advice: 'Support insulin sensitivity with low-glycemic foods, daily brisk walks, and balanced meals.',
      };
    }
    return {
      bmi: bmiVal,
      category: 'Obesity Range' as const,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      advice: 'Gentle low-impact walks and balanced anti-inflammatory nutrition support hormonal balance comfortably.',
    };
  };

  // Helper: Cycle phase calculation
  const calculatePhaseInfo = (): PhaseCalculation => {
    const lastDate = new Date(profile.lastPeriodDate || new Date().toISOString().split('T')[0]);
    const today = new Date();
    const diffMs = today.getTime() - lastDate.getTime();
    const cycleLength = profile.cycleLengthDays || 28;
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const cycleDay = (diffDays % cycleLength) + 1;

    // Next period estimate
    const nextDateObj = new Date(lastDate);
    const completedCycles = Math.floor(diffDays / cycleLength);
    nextDateObj.setDate(lastDate.getDate() + (completedCycles + 1) * cycleLength);
    const nextPeriodDate = nextDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const daysUntilPeriod = Math.max(0, cycleLength - cycleDay);

    if (cycleDay <= 5) {
      return {
        cycleDay,
        currentPhase: 'Menstrual',
        phaseTitle: 'Menstrual Phase (Rest & Reset)',
        phaseDescription: 'Your body is gently shedding the uterine lining. Progesterone and estrogen are at baseline.',
        nextPeriodDate,
        daysUntilPeriod,
        phaseColor: '#EC4899', // Pink
        energyLevel: 'Gentle & Reflective',
        selfCareTip: 'Prioritize warm soups, magnesium-rich snacks, and soothing heat patches.',
        recommendedWorkout: 'Gentle Pelvic Stretches & Slow Yin Yoga',
      };
    } else if (cycleDay <= 12) {
      return {
        cycleDay,
        currentPhase: 'Follicular',
        phaseTitle: 'Follicular Phase (Renewal & Bloom)',
        phaseDescription: 'Estrogen rises, follicles mature, and brain focus noticeably sharpens.',
        nextPeriodDate,
        daysUntilPeriod,
        phaseColor: '#8B5CF6', // Violet
        energyLevel: 'Climbing & Creative',
        selfCareTip: 'Great time for fresh probiotic salads, planning new habits, and facial Gua Sha.',
        recommendedWorkout: 'Brisk Sunlight Walks & Moderate Cardio',
      };
    } else if (cycleDay <= 16) {
      return {
        cycleDay,
        currentPhase: 'Ovulatory',
        phaseTitle: 'Ovulatory Phase (Peak Radiance)',
        phaseDescription: 'Luteinizing hormone surge triggers egg release. Natural skin glow and confidence are at peak.',
        nextPeriodDate,
        daysUntilPeriod,
        phaseColor: '#F59E0B', // Amber
        energyLevel: 'High Energy & Magnetic',
        selfCareTip: 'Stay hydrated with electrolytes and incorporate leafy greens with zinc.',
        recommendedWorkout: 'Strength Training, Pilates & Dynamic Stride',
      };
    } else {
      return {
        cycleDay,
        currentPhase: 'Luteal',
        phaseTitle: 'Luteal Phase (Nourish & Prepare)',
        phaseDescription: 'Progesterone peaks then gradually dips. Metabolic rate increases slightly.',
        nextPeriodDate,
        daysUntilPeriod,
        phaseColor: '#06B6D4', // Teal/Cyan
        energyLevel: 'Steady, Wind-down Mode',
        selfCareTip: 'Support progesterone with pumpkin seeds, herbal teas, and earlier bedtime.',
        recommendedWorkout: 'Grounding Bodyweight Sits & Scalp Massage',
      };
    }
  };

  const phaseInfo = calculatePhaseInfo();

  // Profile actions
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    showToast('Profile updated successfully!', 'success');
  };

  // Auth actions
  const login = (email: string, displayName: string) => {
    setUserAuth({
      isLoggedIn: true,
      email,
      displayName: displayName || email.split('@')[0],
    });
    setProfile((prev) => ({ ...prev, name: displayName || prev.name }));
    showToast(`Welcome back, ${displayName || 'wellness explorer'}!`, 'success');
  };

  const logout = () => {
    setUserAuth({
      isLoggedIn: false,
      email: '',
      displayName: 'Guest User',
    });
    showToast('Signed out. You are now exploring in Demo Guest Mode.', 'info');
  };

  // Cart actions
  const addToCart = (product: StoreProduct, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name.slice(0, 24)}... to cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to your wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Notification actions
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'success');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast('Notification cleared', 'info');
  };

  const snoozeNotification = (id: string, mins: number = 60) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, timestamp: `Snoozed for ${mins}m`, isRead: true } : n
      )
    );
    showToast(`Snoozed for ${mins} minutes`, 'info');
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateNotificationSettings = (updates: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...updates }));
    showToast('Notification preferences saved', 'success');
  };

  // Period logs actions
  const addOrUpdatePeriodLog = (log: PeriodDailyLog) => {
    setPeriodLogs((prev) => {
      const index = prev.findIndex((p) => p.date === log.date);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = log;
        return updated;
      }
      return [log, ...prev];
    });
    showToast('Daily period log saved successfully!', 'success');
  };

  const deletePeriodLog = (id: string) => {
    setPeriodLogs((prev) => prev.filter((p) => p.id !== id));
    showToast('Log entry removed', 'info');
  };

  // Booking actions
  const addBooking = (booking: Omit<BookingRecord, 'id' | 'bookingRef'>) => {
    const bookingRef = 'WN-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking: BookingRecord = {
      ...booking,
      id: 'bk-' + Date.now(),
      bookingRef,
    };
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Booking Confirmed! Ref: ${bookingRef}`, 'success');
    addNotification({
      category: 'SOS',
      title: 'Appointment Confirmed',
      message: `Your booking for ${booking.itemName} at ${booking.providerName} (${booking.timeSlot}) is confirmed.`,
      actionUrl: '/sos',
      actionLabel: 'View Booking',
    });
    return bookingRef;
  };

  // Orders actions
  const addOrder = (order: Omit<OrderRecord, 'id' | 'orderNumber' | 'date'>) => {
    const orderNumber = 'WN-ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: OrderRecord = {
      ...order,
      id: 'ord-' + Date.now(),
      orderNumber,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveOrderForTracking(newOrder);
    showToast(`Order Placed! #${orderNumber}`, 'success');
    addNotification({
      category: 'Store',
      title: `Order Confirmed #${orderNumber}`,
      message: `Your package with ${order.items.length} items is being packed. Estimated delivery: ${order.estimatedDelivery}`,
      actionUrl: '/store',
      actionLabel: 'Track Order',
    });
    return newOrder;
  };

  // Meal plan actions
  const toggleMealPlan = (recipeId: string) => {
    setMealPlan((prev) => {
      if (prev.includes(recipeId)) {
        showToast('Removed recipe from meal plan', 'info');
        return prev.filter((id) => id !== recipeId);
      }
      showToast('Added recipe to your daily meal plan 🥗', 'success');
      return [...prev, recipeId];
    });
  };

  // Ride actions
  const bookRide = (option: RideOption) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const drivers = [
      { name: 'Ramesh Gowda', phone: '+91 98450 11223', vehicle: 'KA 03 HM 4821' },
      { name: 'Mohammed Imran', phone: '+91 97412 88390', vehicle: 'KA 01 MJ 6512' },
      { name: 'Venkatesh Babu', phone: '+91 99801 44556', vehicle: 'KA 05 AB 3190' },
    ];
    const assigned = drivers[Math.floor(Math.random() * drivers.length)];

    setActiveRide({
      option,
      status: 'Driver Assigned',
      driverName: assigned.name,
      driverPhone: assigned.phone,
      vehicleNumber: assigned.vehicle,
      otp,
      etaMinutes: option.etaMinutes,
    });
    showToast(`${option.name} booked! Driver arriving in ${option.etaMinutes} mins`, 'success');
  };

  const cancelRide = () => {
    setActiveRide(null);
    showToast('Ride cancelled.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        userAuth,
        login,
        logout,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        snoozeNotification,
        addNotification,
        notificationSettings,
        updateNotificationSettings,
        periodLogs,
        addOrUpdatePeriodLog,
        deletePeriodLog,
        phaseInfo,
        bookings,
        addBooking,
        orders,
        addOrder,
        activeOrderForTracking,
        setActiveOrderForTracking,
        activeRide,
        bookRide,
        cancelRide,
        mealPlan,
        toggleMealPlan,
        toasts,
        showToast,
        isCartOpen,
        setIsCartOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isGlobalDrawerOpen,
        setIsGlobalDrawerOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        calculateBmi,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
