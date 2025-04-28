// src/hooks/useProtectedRoute.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type ProtectionLevel = 'auth' | 'admin' | 'staff';

export const useProtectedRoute = (
  level: ProtectionLevel = 'auth',
  redirectPath: string = '/login'
): void => {
  const { isAuthenticated, isAdmin, isStaff, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    let shouldRedirect = false;

    switch (level) {
      case 'auth':
        shouldRedirect = !isAuthenticated;
        break;
      case 'admin':
        shouldRedirect = !isAuthenticated || !isAdmin;
        break;
      case 'staff':
        shouldRedirect = !isAuthenticated || (!isStaff && !isAdmin);
        break;
    }

    if (shouldRedirect) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, isAdmin, isStaff, loading, navigate, level, redirectPath]);
};
