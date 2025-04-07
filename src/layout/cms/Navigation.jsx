// src/components/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side - Home & Appliance */}
        <div className="flex space-x-6">
          <Link to="/cms/dashboard" className="font-bold text-white hover:text-gray-300 transition">
            Home
          </Link>
          <Link to="/appliance" className="text-white hover:text-gray-300 transition">
            Appliance
          </Link>
        </div>        
        {/* Right side - About & Contact */}
        <div className="flex space-x-6">
        <Link to="/" className="font-bold text-white hover:text-gray-500 transition">
            Main
          </Link>
          <Link to="/login" className="text-white hover:text-gray-300 transition">
            Login
          </Link>
          <Link to="/logout" className="text-white hover:text-gray-300 transition">
            Logout
          </Link>
          <Link to="/profile" className="text-white hover:text-gray-300 transition">
            Profile
          </Link>
          <Link to="/register" className="text-white hover:text-gray-300 transition">
            Register
          </Link>
          <Link to="/create-account" className="text-white hover:text-gray-300 transition">
            Create Account
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;