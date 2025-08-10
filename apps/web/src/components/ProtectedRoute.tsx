import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User } from 'firebase/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  user: User | null;
}

export default function ProtectedRoute({ children, user }: ProtectedRouteProps) {
  const location = useLocation();

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
