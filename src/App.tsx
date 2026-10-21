import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { GlobalDrawer } from './components/common/GlobalDrawer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { NotificationSettingsModal } from './components/common/NotificationSettingsModal';
import { CartDrawer } from './components/common/CartDrawer';
import { WishlistModal } from './components/common/WishlistModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { OrderTrackingModal } from './components/modals/OrderTrackingModal';
import { ToastContainer } from './components/common/Toast';

// Screens
import { LoginScreen } from './components/screens/LoginScreen';
import { LogoutScreen } from './components/screens/LogoutScreen';
import { WelcomeProfileScreen } from './components/screens/WelcomeProfileScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { HealingPlanScreen } from './components/screens/HealingPlanScreen';
import { SosScreen } from './components/screens/SosScreen';
import { WellStoreScreen } from './components/screens/WellStoreScreen';
import { NestyChatScreen } from './components/screens/NestyChatScreen';

/**
 * Protected Route Guard:
 * Ensures users are prompted to login before accessing the main dashboard.
 */
const ProtectedDashboardRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userAuth } = useApp();

  if (!userAuth.isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          fromDashboard: true,
          message: 'Please log in or sign up before accessing your personalized wellness dashboard.',
        }}
      />
    );
  }

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const { addNotification, notificationSettings } = useApp();
  const location = useLocation();

  // Periodic demo notification banner simulator (runs cleanup-safe)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notificationSettings.water) {
        addNotification({
          category: 'Health',
          title: 'Hydration Check 💧',
          message: 'Time for a fresh glass of warm water or herbal infusion.',
          actionUrl: '/healing-plan',
          actionLabel: 'View Diet Lab',
        });
      }
    }, 45000); // 45 seconds after launch

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-20 lg:pb-6 relative selection:bg-pink-500 selection:text-white">
      {/* Sticky Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/logout" element={<LogoutScreen />} />
          <Route path="/welcome" element={<WelcomeProfileScreen />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedDashboardRoute>
                <DashboardScreen />
              </ProtectedDashboardRoute>
            }
          />
          <Route path="/healing-plan" element={<HealingPlanScreen />} />
          <Route path="/sos" element={<SosScreen />} />
          <Route path="/store" element={<WellStoreScreen />} />
          <Route path="/chat" element={<NestyChatScreen />} />
          {/* Default route points to dashboard (which prompts login if logged out) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Drawers & Modals */}
      <GlobalDrawer />
      <NotificationDrawer />
      <NotificationSettingsModal />
      <CartDrawer />
      <WishlistModal />
      <CheckoutModal />
      <OrderTrackingModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
