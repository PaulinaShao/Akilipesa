import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { mockUser } from '@/lib/mock-data';
import MobileLayout from '@/components/layout/MobileLayout';
import { ToastProvider } from '@/hooks/useToast';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import pages
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

// Admin Guard Component
function AdminRoute({ children, user }: { children: React.ReactNode; user: User | null }) {
  // In a real app, check if user has admin role from Firebase claims
  const isAdmin = user && (user.email?.includes('admin') || import.meta.env.DEV);
  
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // In development mode, create a simple mock user after a delay
    if (import.meta.env.DEV && !user) {
      setTimeout(() => {
        const mockUserObject = {
          uid: mockUser.id,
          displayName: mockUser.name,
          email: mockUser.email,
        } as User;
        setDevModeUser(mockUserObject);
      }, 1000);
    }

    return () => unsubscribe();
  }, [user]);

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
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes with mobile layout */}
          <Route path="/" element={
            <ProtectedRoute user={currentUser}>
              <Navigate to="/reels" replace />
            </ProtectedRoute>
          } />
          
          <Route path="/reels" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <ReelsPage />
              </MobileLayout>
            </ProtectedRoute>
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
              <ProductDetailPage />
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
              <WalletPage />
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
                <div className="h-screen-safe flex-center">
                  <div className="text-center">
                    <h1 className="heading-2 mb-4">Chat</h1>
                    <p className="text-white/60">Chat conversation</p>
                  </div>
                </div>
              </MobileLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute user={currentUser}>
              <MobileLayout>
                <div className="h-screen-safe flex-center">
                  <div className="text-center">
                    <h1 className="heading-2 mb-4">Settings</h1>
                    <p className="text-white/60">App settings and preferences</p>
                  </div>
                </div>
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
                <button 
                  onClick={() => window.location.href = '/reels'}
                  className="btn-primary"
                >
                  Go Home
                </button>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
