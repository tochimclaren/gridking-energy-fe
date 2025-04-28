// src/components/Navigation.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../../components/cms/auth/LogoutButton';
import { Home, Microwave, Sparkles, User, UserPlus } from 'lucide-react';


function Navigation() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side - Home & Appliance */}
        <>
          {currentUser ?
            <div className="flex space-x-6">
              <Link
                to="/"
                className="font-bold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5"
              >
                <Home className="h-5 w-5" strokeWidth={2.5} />
                Home
              </Link>
              <Link
                to="/appliance"
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors group relative"
              >
                <Microwave className="h-5 w-5 text-blue-200" strokeWidth={1.8} />
                <span className="relative">
                  Appliance
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-blue-300 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </div> : ""
          }

        </>
        {/* Right side - About & Contact */}
        <>
          {currentUser ?
            <div className="flex space-x-6">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors group"
              >
                <User
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                  strokeWidth={1.5}
                />
                <span className="font-medium">Profile</span>
              </Link>
              {isAdmin ?
                <div className="flex space-x-6">
                  <Link to="/cms/users/create" className="flex items-center text-white hover:text-gray-300 transition">
                    <UserPlus size={16} className="mr-2" />
                    User
                  </Link>
                </div> : ''
              }
              <LogoutButton onLogout={handleLogout} />
            </div>
            : <div>
              <Link to="/login" className="text-white hover:text-gray-300 transition">
                Login
              </Link>
            </div>}
        </>
      </div>
    </nav>
  );
}

export default Navigation;