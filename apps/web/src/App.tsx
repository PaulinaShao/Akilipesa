import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseEnhanced';
import { mockUser } from '@/lib/mock-data';
import MobileLayout from '@/components/layout/MobileLayout';
import BottomNav from '@/components/layout/BottomNav';
import AppShell from '@/components/AppShell';
import { ToastProvider } from '@/hooks/useToast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import AuthSheet from '@/components/auth/AuthSheet';
import { TrialBadge } from '@/components/trial/TrialBadge';
import { TrialPaywallContainer } from '@/components/trial/TrialPaywall';
import { TrialPolicyPage } from '@/pages/TrialPolicyPage';
import { TrialDebug } from '@/components/trial/TrialDebug';
import { NetworkStatus } from '@/components/NetworkStatus';
import { FirestoreDebug } from '@/components/FirestoreDebug';
import { initializeFetchWrapper } from '@/lib/fetchWrapper';
import { ErrorBoundary, OfflineIndicator } from '@/components/ErrorBoundary';
import EmulatorWarning from '@/components/EmulatorWarning';
import { useTrialStore } from '@/state/trialStore';
import { useAppStore, type User as AppUser } from '@/store';
import { initFirebase } from '@/lib/firebaseEnhanced';
import { seedTrialConfig } from '@/lib/seedTrialConfig';
import { initGuestOnce } from '@/lib/initGuest';
import { loadTrialConfig } from '@/lib/config';
import { runFirebaseHealthCheck } from '@/lib/firebaseHealthCheck';
import { setIncomingCallHandler, acceptCall, declineCall, messageInsteadOfCall, type IncomingCallData } from '@/lib/callUtils';
import { useTrialConfigStore } from '@/store/trialConfigStore';
import { shouldShowSplashOnce } from '@/lib/entry';
import { ensureRecaptchaContainer } from '@/lib/ensureRecaptchaContainer';
import Splash from '@/components/Splash';
import NotFound from '@/components/NotFound';
import '@/styles/util.css';

// Import pages
import SplashPage from '@/pages/SplashPage';
import LoginPage from '@/pages/LoginPage';
import ReelsPage from '@/pages/ReelsPage';
import { FeedScreen } from '@/features/feed';
import HomeFeedPage from '@/pages/HomeFeedPage';
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
import LivePage from '@/pages/LivePage';
import CallEndScreen from '@/pages/CallEndScreen';
import UserNotAvailableScreen from '@/pages/UserNotAvailableScreen';
import CheckoutPage from '@/pages/CheckoutPage';
import ShopPage from '@/pages/ShopPage';
import JoinPage from '@/pages/JoinPage';
import AddFundsPage from '@/pages/AddFundsPage';
import WithdrawPage from '@/pages/WithdrawPage';
import UpgradePlanPage from '@/pages/UpgradePlanPage';
import PaymentMethodsPage from '@/pages/PaymentMethodsPage';
import CallNotification from '@/components/call/CallNotification';
import CallDemoPage from '@/pages/CallDemoPage';

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


// AppContent component to access useLocation inside Router
function AppContent() {
  const location = useLocation();

  // Only hide nav on specific auth routes
  const shouldHideNav = location.pathname === '/login' ||
    location.pathname === '/auth/login' ||
    location.pathname === '/auth/verify';

  return (
    <>

      <Routes>
        {/* All existing routes */}
        {/* Public routes */}
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/verify" element={<LoginPage />} />

        {/* Default route - always go to reels (TikTok-style) */}
        <Route path="/" element={<Navigate to="/reels" replace />} />

        {/* Routes with MobileLayout */}
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
        <Route path="/profile" element={
          <MobileLayout>
            <ProfilePage />
          </MobileLayout>
        } />
        {/* Add other routes as needed */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Bottom navigation - ALWAYS render as direct child of root */}
      {!shouldHideNav && <BottomNav />}
    </>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [devModeUser, setDevModeUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(() => shouldShowSplashOnce());
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);

  // Initialize trial system
  const { initializeToken, fetchConfig } = useTrialStore();
  const { setUser: setAppUser } = useAppStore();
  const { setConfig: setTrialConfig, config: trialConfig, isLoaded: configLoaded } = useTrialConfigStore();

  useEffect(() => {
    // Initialize Firebase first
    initFirebase();

    // Initialize fetch wrapper for problematic environments (like fly.dev with FullStory)
    // Temporarily disabled to fix Firebase Firestore issues
    // TODO: Re-enable with better Firebase isolation if needed
    console.log('🔧 Fetch wrapper temporarily disabled to fix Firebase connectivity');
    // if (import.meta.env.VITE_DISABLE_FETCH_WRAPPER !== 'true') {
    //   initializeFetchWrapper();
    // }

    // Initialize reCAPTCHA container for phone auth
    ensureRecaptchaContainer();

    // Initialize guest sign-in once (prevents duplicate anonymous users)
    initGuestOnce();

    // Set up centralized incoming call handler
    setIncomingCallHandler(setIncomingCall);

    // Load trial configuration
    let cancelled = false;
    (async () => {
      try {
        const cfg = await loadTrialConfig();
        if (!cancelled) {
          setTrialConfig(cfg);
          console.log('Trial config loaded:', cfg);
        }
      } catch (error) {
        if (!cancelled) {
          console.warn('Trial config loading failed, app will continue:', error);
          // Set empty config to mark as loaded
          setTrialConfig({});
        }
      }
    })();

    const cleanupBootstrap = () => { cancelled = true; };

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
          role: 'user' as const,
          balance: 0,
          earnings: 0,
        };
        setAppUser(appUser);
      } else {
        setAppUser(null);
      }

      setLoading(false);
    });

    // Run Firebase health check
    const checkFirebaseHealth = async () => {
      try {
        const healthStatus = await runFirebaseHealthCheck();
        if (healthStatus.overall) {
          console.log('🔥 Firebase services are healthy and ready');
        } else {
          console.warn('⚠️ Some Firebase services may have issues, but app will continue');
        }
      } catch (error: any) {
        // Don't let health check errors block the app
        console.warn('Firebase health check encountered an error:', error?.message || error);
      }
    };

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
    checkFirebaseHealth();

    // Demo incoming call - only show if explicitly enabled in trial config
    // No auto-retry, no loops - check config once after load

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
          role: 'admin' as const,
          balance: 0,
          earnings: 0,
        };

        setDevModeUser(mockFirebaseUser);
        setAppUser(mockAppUser); // Update app store
      }, 1000);
    }

    return () => {
      unsubscribe();
      cleanupBootstrap();
    };
  }, [user, initializeToken, fetchConfig, setAppUser]);

  const currentUser = user || devModeUser;

  // Show demo incoming call when config is loaded and conditions are met
  // Demo incoming call removed - will only be triggered by explicit user actions like call buttons

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
          {(() => {
            const showDebug =
              import.meta.env.VITE_SHOW_FIRESTORE_DEBUG === "1" ||
              new URL(location.href).searchParams.get("debug") === "1" ||
              localStorage.getItem("enableFirestoreDebug") === "1";
            return showDebug && <FirestoreDebug />;
          })()}
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
          <Route path="/reels" element={<FeedScreen />} />

          <Route path="/home-feed" element={
            <HomeFeedPage />
          } />

          <Route path="/search" element={
            <AppShell>
              <SearchPage />
            </AppShell>
          } />

          <Route path="/create" element={
            <AppShell>
              <CreatePage />
            </AppShell>
          } />

          <Route path="/inbox" element={
            <AppShell>
              <InboxPage />
            </AppShell>
          } />

          <Route path="/inbox/:threadId" element={<InboxThreadPage />} />

          <Route path="/profile" element={
            <AppShell>
              <ProfilePage />
            </AppShell>
          } />

          <Route path="/profile/:userId" element={
            <MobileLayout>
              <ProfilePage />
            </MobileLayout>
          } />

          {/* Core routes (guest accessible) */}
          <Route path="/reel/:id" element={<FeedScreen />} />

          <Route path="/product/:id" element={
            <MobileLayout>
              <ProductDetailPage />
            </MobileLayout>
          } />

          <Route path="/live/:channelId" element={<LivePage />} />

          <Route path="/wallet" element={
            <MobileLayout>
              <WalletPage />
            </MobileLayout>
          } />

          <Route path="/add-funds" element={<AddFundsPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/upgrade-plan" element={<UpgradePlanPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />

          <Route path="/settings" element={
            <MobileLayout>
              <SettingsPage />
            </MobileLayout>
          } />

          {/* Profile sub-pages */}
          <Route path="/analytics" element={
            <MobileLayout>
              <AnalyticsPage />
            </MobileLayout>
          } />
          <Route path="/referrals" element={
            <MobileLayout>
              <ReferralsPage />
            </MobileLayout>
          } />
          <Route path="/saved-posts" element={
            <MobileLayout>
              <SavedPostsPage />
            </MobileLayout>
          } />
          <Route path="/purchases" element={
            <MobileLayout>
              <PurchasesPage />
            </MobileLayout>
          } />
          <Route path="/earnings" element={
            <MobileLayout>
              <EarningsPage />
            </MobileLayout>
          } />

          <Route path="/call/:channel" element={<CallPage />} />
          <Route path="/call/new" element={<CallPage />} />
          <Route path="/call/end" element={<CallEndScreen />} />
          <Route path="/call/unavailable" element={<UserNotAvailableScreen />} />

          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/join" element={<JoinPage />} />

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
          <Route path="/chat/akili" element={<ChatAIPage />} />
          <Route path="/call-demo" element={<CallDemoPage />} />

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

          {/* Call Notification */}
          <CallNotification
            isVisible={!!incomingCall}
            caller={incomingCall?.caller || { id: '', name: '', avatar: '', username: '' }}
            callType={incomingCall?.callType || 'audio'}
            onAccept={() => {
              if (incomingCall && trialConfig?.callsEnabled !== false) {
                acceptCall(incomingCall);
              } else if (trialConfig?.callsEnabled === false) {
                console.log('Calls are disabled in trial config');
                declineCall();
              }
            }}
            onDecline={declineCall}
            onMessage={() => {
              if (incomingCall) {
                messageInsteadOfCall(incomingCall);
              }
            }}
          />
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
