import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { mockUser } from '@/lib/mock-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/hooks/useToast';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import CallsPage from '@/pages/CallsPage';
import JobsPage from '@/pages/JobsPage';
import BillingPage from '@/pages/BillingPage';
import SettingsPage from '@/pages/SettingsPage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // For development, use mock user if no Firebase user and in dev mode
  const currentUser = user || (import.meta.env.DEV ? {
    uid: mockUser.id,
    displayName: mockUser.name,
    email: mockUser.email,
    photoURL: undefined,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => '',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
  } as User : null);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading AkiliPesa...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
          <Navbar 
            user={currentUser ? {
              name: currentUser.displayName || mockUser.name,
              avatar: currentUser.photoURL || undefined
            } : null}
            onSignOut={handleSignOut}
          />
          
          <main className="flex-grow pt-16">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute user={currentUser}>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/calls" element={
                <ProtectedRoute user={currentUser}>
                  <CallsPage />
                </ProtectedRoute>
              } />
              <Route path="/jobs" element={
                <ProtectedRoute user={currentUser}>
                  <JobsPage />
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <ProtectedRoute user={currentUser}>
                  <BillingPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute user={currentUser}>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={
                <div className="container-responsive section-padding text-center">
                  <h1 className="heading-2 mb-4">Page Not Found</h1>
                  <p className="text-slate-600 mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              } />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
