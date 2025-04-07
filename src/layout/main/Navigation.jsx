// src/components/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side - Home & Appliance */}
        <div className="flex space-x-6">
          <Link to="/" className="font-bold text-white hover:text-gray-300 transition">
            Home
          </Link>
          <Link to="/appliance" className="text-white hover:text-gray-300 transition">
            Appliance
          </Link>
        </div>
        
        {/* Right side - About & Contact */}
        <div className="flex space-x-6">
        <Link to="/cms/dashboard" className="font-bold text-white hover:text-gray-500 transition">
            CMS
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;