import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { mockUser } from '@/lib/mock-data';
import MobileLayout from '@/components/layout/MobileLayout';
import { ToastProvider } from '@/hooks/useToast';
import ProtectedRoute from '@/components/ProtectedRoute';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import AuthSheet from '@/components/auth/AuthSheet';
import { TrialBadge } from '@/components/trial/TrialBadge';
import { TrialPaywall } from '@/components/trial/TrialPaywall';
import { TrialPolicyPage } from '@/pages/TrialPolicyPage';
import { useTrialStore } from '@/state/trialStore';
import { useUIStore } from '@/state/uiStore';
import { useAuthStore } from '@/store';
import { seedTrialConfig } from '@/lib/seedTrialConfig';

// Import pages
import SplashPage from '@/pages/SplashPage';
import LoginPage from '@/pages/LoginPage';
import ReelsPage from '@/pages/ReelsPage';
import SearchPage from '@/pages/SearchPage';
import CreatePage from '@/pages/CreatePage';
import InboxPage from '@/pages/InboxPage';
import ProfilePage from '@/pages/ProfilePage';
import MarketPage from '@/pages/MarketPage';
import AdminPage from '@/pages/AdminPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrdersPage from '@/pages/OrdersPage';
import WalletPage from '@/pages/WalletPage';
import CallPage from '@/pages/CallPage';
import CameraCaptPage from '@/pages/CameraCaptPage';
import SavedPostsPage from '@/pages/SavedPostsPage';
import PurchasesPage from '@/pages/PurchasesPage';
import EarningsPage from '@/pages/EarningsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ReferralsPage from '@/pages/ReferralsPage';
import SettingsPage from '@/pages/SettingsPage';
import ChatPage from '@/pages/ChatPage';
import PlansPage from '@/pages/PlansPage';

// Admin Guard Component
function AdminRoute({ children, user }: { children: React.ReactNode; user: User | null }) {
  // In development mode, allow admin access for any authenticated user
  // In production, check if user has admin role from Firebase claims
  const isAdmin = user && (
    import.meta.env.DEV ||
    user.email?.includes('admin') ||
    user.email?.includes('paulina')
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/reels" replace />;
  }

  return <>{children}</>;
}

// Trial Paywall Container Component
function TrialPaywallContainer() {
  const { trialPaywall, closeTrialPaywall, openAuthSheet } = useUIStore();

  const handleSignUp = () => {
    closeTrialPaywall();
    openAuthSheet(() => {}, 'follow'); // Default action for signup
  };

  const handleClose = () => {
    closeTrialPaywall();
  };

  if (!trialPaywall.feature) return null;

  return (
    <TrialPaywall
      isOpen={trialPaywall.isOpen}
      feature={trialPaywall.feature}
      onClose={handleClose}
      onSignUp={handleSignUp}
    />
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [devModeUser, setDevModeUser] = useState<User | null>(null);

  // Initialize trial system
  const { initializeToken, fetchConfig } = useTrialStore();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setUser(firebaseUser); // Update auth store
      setLoading(false);
    });

    // Initialize trial system
    const initTrialSystem = async () => {
      try {
        // Seed trial config if it doesn't exist
        await seedTrialConfig(import.meta.env.DEV);

        // Initialize trial token and fetch config
        await initializeToken();
        await fetchConfig();
      } catch (error) {
        console.error('Failed to initialize trial system:', error);
      }
    };

    initTrialSystem();

    // In development mode, create a simple mock user after a delay
    if (import.meta.env.DEV && !user) {
      setTimeout(() => {
        const mockUserObject = {
          uid: mockUser.id,
          displayName: mockUser.name,
          email: mockUser.email,
        } as User;
        setDevModeUser(mockUserObject);
        setUser(mockUserObject); // Update auth store
      }, 1000);
    }

    return () => unsubscribe();
  }, [user, initializeToken, fetchConfig, setUser]);

  const currentUser = user || devModeUser;

  if (loading) {
    return (
      <div className="h-screen-safe flex-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-medium">AkiliPesa</p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-2" />
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <Routes>
          {/* Public routes */}
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Public feed (guest accessible) */}
          <Route path="/" element={<Navigate to="/splash" replace />} />
          <Route path="/reels" element={
            <MobileLayout>
              <ReelsPage />
            </MobileLayout>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <SearchPage />
              </MobileLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/create" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <CreatePage />
              </MobileLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inbox" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <InboxPage />
              </MobileLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <ProfilePage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          {/* Additional routes */}
          <Route path="/market" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <MarketPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          {/* Dynamic routes */}
          <Route path="/reel/:id" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <ReelsPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile/:userId" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <ProfilePage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/product/:id" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <ProductDetailPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/checkout/:id" element={
            <ProtectedRoute user={currentUser}>
              <CheckoutPage />
            </ProtectedRoute>
          } />

          <Route path="/orders/:id" element={
            <ProtectedRoute user={currentUser}>
              <OrdersPage />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <div className="h-screen-safe flex-center">
                  <div className="text-center">
                    <h1 className="heading-2 mb-4">All Orders</h1>
                    <p className="text-white/60">Order history page</p>
                  </div>
                </div>
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/wallet" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <WalletPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/plans" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <PlansPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/live/:channelId" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <div className="h-screen-safe flex-center">
                  <div className="text-center">
                    <h1 className="heading-2 mb-4">Live Session</h1>
                    <p className="text-white/60">Live video call implementation</p>
                  </div>
                </div>
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/call/:channel" element={
            <ProtectedRoute user={currentUser}>
              <CallPage />
            </ProtectedRoute>
          } />

          <Route path="/call/new" element={
            <ProtectedRoute user={currentUser}>
              <CallPage />
            </ProtectedRoute>
          } />

          <Route path="/create/camera" element={
            <ProtectedRoute user={currentUser}>
              <CameraCaptPage />
            </ProtectedRoute>
          } />

          <Route path="/create/edit" element={
            <ProtectedRoute user={currentUser}>
              <div className="h-screen-safe flex-center">
                <div className="text-center">
                  <h1 className="heading-2 mb-4">Edit Media</h1>
                  <p className="text-white/60">Media editing coming soon</p>
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/create/ai" element={
            <ProtectedRoute user={currentUser}>
              <div className="h-screen-safe flex-center">
                <div className="text-center">
                  <h1 className="heading-2 mb-4">AI Creation</h1>
                  <p className="text-white/60">AI-powered content creation coming soon</p>
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/create/live" element={
            <ProtectedRoute user={currentUser}>
              <div className="h-screen-safe flex-center">
                <div className="text-center">
                  <h1 className="heading-2 mb-4">Go Live</h1>
                  <p className="text-white/60">Live streaming coming soon</p>
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/stories/:username" element={
            <ProtectedRoute user={currentUser}>
              <div className="h-screen-safe flex-center">
                <div className="text-center">
                  <h1 className="heading-2 mb-4">Stories</h1>
                  <p className="text-white/60">Stories viewer coming soon</p>
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/agents" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <div className="h-screen-safe flex-center">
                  <div className="text-center">
                    <h1 className="heading-2 mb-4">AI Agents</h1>
                    <p className="text-white/60">AI agents directory</p>
                  </div>
                </div>
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/agent/:id" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <div className="h-screen-safe flex-center">
                  <div className="text-center">
                    <h1 className="heading-2 mb-4">Agent Details</h1>
                    <p className="text-white/60">AI agent detail page</p>
                  </div>
                </div>
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/chat/:id" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <ChatPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <SettingsPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/saved-posts" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <SavedPostsPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/purchases" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <PurchasesPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/earnings" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <EarningsPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <AnalyticsPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/trial-policy" element={<TrialPolicyPage />} />

          <Route path="/referrals" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <ReferralsPage />
              </MobileLayout>
            </ProtectedRoute>
          } />

          {/* Admin routes (no mobile layout) */}
          <Route path="/admin" element={
            <AdminRoute user={currentUser}>
              <AdminPage />
            </AdminRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={
            <div className="h-screen-safe flex-center text-center p-8">
              <div>
                <h1 className="heading-2 mb-4">Page Not Found</h1>
                <p className="text-white/60 mb-8">The page you're looking for doesn't exist.</p>
                <Link to="/reels" className="btn-primary">
                  Go Home
                </Link>
              </div>
            </div>
          } />
          </Routes>
        </Router>

        {/* Global AuthSheet */}
        <AuthSheet />

        {/* Trial System Components */}
        <TrialBadge />
        <TrialPaywallContainer />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
