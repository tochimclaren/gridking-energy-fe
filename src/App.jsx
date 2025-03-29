// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import MainAppliance from './pages/main/Appliance';
import Dashboard from './pages/cms/Dashboard';
import MainLayout from './layout/MainLayout';
import CmsLayout from './layout/CmsLayout';
import CMSAppliance from './pages/cms/Appliances';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        {/* main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appliance" element={<MainAppliance />} />
        </Route>
        <Route element={<CmsLayout />}>
          <Route path="/cms/dashboard" element={<Dashboard />} />
          <Route path="/cms/appliances" element={<CMSAppliance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;