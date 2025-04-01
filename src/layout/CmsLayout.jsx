// src/components/BaseLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './cms/Navigation';
import Sidebar from './cms/Sidebar';
import Footer from './cms/Footer';

function CmsLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10">
                <Navigation />
            </header>

            <main className="flex h-screen">
                <Sidebar />
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default CmsLayout;