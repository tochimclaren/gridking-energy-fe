// src/components/BaseLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

function BaseLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10">
        <Navigation />
      </header>
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Outlet /> {/* This is where child routes will render in a container */}
        </div>
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Your Company</p>
        </div>
      </footer>
    </div>
  );
}

export default BaseLayout;