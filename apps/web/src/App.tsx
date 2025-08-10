import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { mockUser } from '@/lib/mock-data';
import MobileLayout from '@/components/layout/MobileLayout';
import { ToastProvider } from '@/hooks/useToast';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import DiscoverPage from '@/pages/DiscoverPage';
import CreatePage from '@/pages/CreatePage';
import InboxPage from '@/pages/InboxPage';
import ProfilePage from '@/pages/ProfilePage';

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

  // Note: handleSignOut would be used in settings or profile menu
  // const handleSignOut = async () => {
  //   try {
  //     await auth.signOut();
  //     setDevModeUser(null);
  //   } catch (error) {
  //     console.error('Error signing out:', error);
  //   }
  // };

  if (loading) {
    return (
      <div className="h-screen-safe bg-gem-dark flex-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500/30 border-t-accent-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-lg font-medium">AkiliPesa</p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-600 to-glow-500 rounded-full mx-auto mt-2" />
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Router>
        <MobileLayout hideBottomNav={!currentUser}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute user={currentUser}>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/discover" element={
              <ProtectedRoute user={currentUser}>
                <DiscoverPage />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute user={currentUser}>
                <CreatePage />
              </ProtectedRoute>
            } />
            <Route path="/inbox" element={
              <ProtectedRoute user={currentUser}>
                <InboxPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute user={currentUser}>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={
              <div className="h-screen-safe flex-center bg-gem-dark text-center p-8">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
                  <p className="text-white/60 mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-gem">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </MobileLayout>
      </Router>
    </ToastProvider>
  );
}

export default App;
