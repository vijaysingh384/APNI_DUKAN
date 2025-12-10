import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'shopkeeper';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/sign-in', { state: { from: window.location.pathname } });
    } else if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate, requiredRole, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

