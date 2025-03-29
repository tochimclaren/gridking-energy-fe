// src/components/BaseLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './main/Navigation';
import Footer from './main/Footer';

function MainLayout() {
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
      <Footer />
    </div>
  );
}

export default MainLayout;