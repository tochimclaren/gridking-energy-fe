// src/components/auth/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

type ProtectionLevel = 'auth' | 'admin' | 'staff';

interface ProtectedRouteProps {
  level: ProtectionLevel;
  redirectPath?: string;
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  level = 'auth',
  redirectPath = '/login',
  children
}) => {
  const { isAuthenticated, isAdmin, isStaff, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  let hasAccess = false;

  switch (level) {
    case 'auth':
      hasAccess = isAuthenticated;
      break;
    case 'admin':
      hasAccess = isAuthenticated && isAdmin;
      break;
    case 'staff':
      hasAccess = isAuthenticated && (isStaff || isAdmin);
      break;
  }

  if (!hasAccess) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;