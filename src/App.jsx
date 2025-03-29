// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import BaseLayout from './layout/BaseLayout'
import Appliance from './pages/Appliance';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appliance" element={<Appliance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;