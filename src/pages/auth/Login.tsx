
// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/cms/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = (location.state as { from?: string })?.from || '/cms/dashboard';

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setLoginError(null);
      await login(data.email, data.password);
      
      // After successful login, redirect to the intended page
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed. Please try again.');
      throw error; // Re-throw to let the LoginForm component handle the UI state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>
        
        <LoginForm onLogin={handleLogin} />
        
        {/* <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;