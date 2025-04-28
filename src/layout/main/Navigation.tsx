// src/components/Navigation.jsx
import { Home, LayoutDashboard, Microwave } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side - Home & Appliance */}
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
        </div>

        {/* Right side - About & Contact */}
        <div className="flex space-x-6">
          <Link
            to="/cms/dashboard"
            className="flex items-center gap-2 font-bold text-white hover:text-blue-200 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5 text-blue-300" strokeWidth={2} />
            <span>CMS</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;