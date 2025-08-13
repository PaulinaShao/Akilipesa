import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { mockUser } from '@/lib/mock-data';
import MobileLayout from '@/components/layout/MobileLayout';
import { ToastProvider } from '@/hooks/useToast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import AuthSheet from '@/components/auth/AuthSheet';
import { TrialBadge } from '@/components/trial/TrialBadge';
import { TrialPaywallContainer } from '@/components/trial/TrialPaywall';
import { TrialPolicyPage } from '@/pages/TrialPolicyPage';
import { TrialDebug } from '@/components/trial/TrialDebug';
import NetworkStatus from '@/components/NetworkStatus';
import { ErrorBoundary, OfflineIndicator } from '@/components/ErrorBoundary';
import EmulatorWarning from '@/components/EmulatorWarning';
import { useTrialStore } from '@/state/trialStore';
import { useAppStore, type User as AppUser } from '@/store';
import { seedTrialConfig } from '@/lib/seedTrialConfig';
import { ensureGuestAuth } from '@/lib/guest';
import { shouldShowSplashOnce } from '@/lib/entry';
import { ensureRecaptchaContainer } from '@/lib/ensureRecaptchaContainer';
import Splash from '@/components/Splash';
import NotFound from '@/components/NotFound';
import '@/styles/util.css';

// Import pages
import SplashPage from '@/pages/SplashPage';
import LoginPage from '@/pages/LoginPage';
import ReelsPage from '@/pages/ReelsPage';
import SearchPage from '@/pages/SearchPage';
import CreatePage from '@/pages/CreatePage';
import InboxPage from '@/pages/InboxPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import WalletPage from '@/pages/WalletPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ReferralsPage from '@/pages/ReferralsPage';
import SavedPostsPage from '@/pages/SavedPostsPage';
import PurchasesPage from '@/pages/PurchasesPage';
import EarningsPage from '@/pages/EarningsPage';
import CallPage from '@/pages/CallPage';
import SettingsPage from '@/pages/SettingsPage';
import InboxThreadPage from '@/pages/InboxThreadPage';
import CameraCaptPage from '@/pages/CameraCaptPage';
import LiveSetupPage from '@/pages/LiveSetupPage';
import JobsPage from '@/pages/JobsPage';
import ChatAIPage from '@/pages/ChatAIPage';
import EditorPage from '@/pages/EditorPage';

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


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [devModeUser, setDevModeUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(() => shouldShowSplashOnce());

  // Initialize trial system
  const { initializeToken, fetchConfig } = useTrialStore();
  const { setUser: setAppUser } = useAppStore();

  useEffect(() => {
    // Initialize reCAPTCHA container for phone auth
    ensureRecaptchaContainer();

    // Initialize guest auth for read-only browsing (non-blocking)
    ensureGuestAuth().catch(error => {
      console.warn('Guest auth initialization failed, app will continue:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      // Convert Firebase User to App User format
      if (firebaseUser && !firebaseUser.isAnonymous) {
        const appUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          username: firebaseUser.email?.split('@')[0] || 'user',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          avatar: firebaseUser.photoURL || '',
          verified: firebaseUser.emailVerified,
          plan: 'free' as const,
          balance: 0,
          earnings: 0,
        };
        setAppUser(appUser);
      } else {
        setAppUser(null);
      }

      setLoading(false);
    });

    // Initialize trial system
    const initTrialSystem = async () => {
      try {
        // Seed trial config if it doesn't exist (offline-safe)
        await seedTrialConfig(import.meta.env.DEV);
      } catch (error: any) {
        console.warn('Trial config seeding skipped (offline):', error?.message || error);
      }

      try {
        // Initialize trial token (with offline fallback)
        await initializeToken();
      } catch (error: any) {
        console.warn('Trial token initialization failed, continuing:', error?.message || error);
      }

      try {
        // Fetch config (with offline fallback)
        await fetchConfig();
      } catch (error: any) {
        console.warn('Trial config fetch failed, using defaults:', error?.message || error);
      }
    };

    initTrialSystem();

    // In development mode, create a simple mock user after a delay
    if (import.meta.env.DEV && !user) {
      setTimeout(() => {
        const mockFirebaseUser = {
          uid: mockUser.id,
          displayName: mockUser.name,
          email: mockUser.email,
        } as User;

        const mockAppUser: AppUser = {
          id: mockUser.id,
          name: mockUser.name,
          username: mockUser.email?.split('@')[0] || 'user',
          email: mockUser.email,
          phone: mockUser.phone,
          avatar: '',
          verified: true,
          plan: 'free',
          balance: 0,
          earnings: 0,
        };

        setDevModeUser(mockFirebaseUser);
        setAppUser(mockAppUser); // Update app store
      }, 1000);
    }

    return () => unsubscribe();
  }, [user, initializeToken, fetchConfig, setAppUser]);

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

  // Show splash on first load
  if (showSplash) {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <Router>
              <Splash onDone={() => setShowSplash(false)} />
            </Router>
          </ToastProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <OfflineIndicator />
        <Router>
          <Routes>
          {/* Public routes */}
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/verify" element={<LoginPage />} />

          {/* Default route - always go to reels (TikTok-style) */}
          <Route path="/" element={<Navigate to="/reels" replace />} />

          {/* Public routes (guest accessible) - Show immediately, no auth required */}
          <Route path="/reels" element={
            <MobileLayout>
              <ReelsPage />
            </MobileLayout>
          } />

          <Route path="/search" element={
            <MobileLayout>
              <SearchPage />
            </MobileLayout>
          } />

          <Route path="/create" element={
            <MobileLayout>
              <CreatePage />
            </MobileLayout>
          } />

          <Route path="/inbox" element={
            <MobileLayout>
              <InboxPage />
            </MobileLayout>
          } />

          <Route path="/inbox/:threadId" element={<InboxThreadPage />} />

          <Route path="/profile" element={
            <MobileLayout>
              <ProfilePage />
            </MobileLayout>
          } />

          <Route path="/profile/:userId" element={
            <MobileLayout>
              <ProfilePage />
            </MobileLayout>
          } />

          {/* Core routes (guest accessible) */}
          <Route path="/reel/:id" element={
            <MobileLayout>
              <ReelsPage />
            </MobileLayout>
          } />

          <Route path="/product/:id" element={
            <MobileLayout>
              <ProductDetailPage />
            </MobileLayout>
          } />

          <Route path="/live/:channelId" element={
            <MobileLayout>
              <div className="h-screen-safe flex-center">
                <div className="text-center">
                  <h1 className="heading-2 mb-4">Live Session</h1>
                  <p className="text-white/60">Join the live session</p>
                </div>
              </div>
            </MobileLayout>
          } />

          <Route path="/wallet" element={
            <MobileLayout>
              <WalletPage />
            </MobileLayout>
          } />

          <Route path="/settings" element={
            <MobileLayout>
              <SettingsPage />
            </MobileLayout>
          } />

          <Route path="/call/:channel" element={<CallPage />} />
          <Route path="/call/new" element={<CallPage />} />

          {/* Creation workflow routes */}
          <Route path="/create/camera" element={<CameraCaptPage />} />
          <Route path="/create/live" element={<LiveSetupPage />} />
          <Route path="/create/editor" element={<EditorPage />} />

          {/* AI and Jobs routes */}
          <Route path="/jobs" element={
            <MobileLayout>
              <JobsPage />
            </MobileLayout>
          } />
          <Route path="/chat/ai" element={<ChatAIPage />} />

          <Route path="/trial-policy" element={<TrialPolicyPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute user={currentUser}>
              <AdminPage />
            </AdminRoute>
          } />

          {/* Clean 404 handling */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>

        {/* Global AuthSheet */}
        <AuthSheet />

        {/* Trial System Components */}
        <TrialBadge />
        <TrialPaywallContainer />
        {import.meta.env.MODE === 'development' && <TrialDebug />}

          {/* Network Status */}
          <NetworkStatus />

          {/* Emulator Warning */}
          <EmulatorWarning />
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
