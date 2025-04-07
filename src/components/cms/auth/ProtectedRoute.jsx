// File: src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// Base protected route component
export const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// Special route for admin users
export const AdminRoute = ({ redirectPath = '/dashboard' }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// Special route for staff users (includes admin)
export const StaffRoute = ({ redirectPath = '/dashboard' }) => {
  const { isAuthenticated, isStaff, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isStaff && !isAdmin) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// Route that redirects authenticated users (for login, register pages)
export const PublicOnlyRoute = ({ redirectPath = '/dashboard' }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};