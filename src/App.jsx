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
import CMSAppliance from './pages/cms/appliance/Appliances';
import UpdateAppliance from './pages/cms/appliance/UpdateAppliance';
import DeleteAppliance from './pages/cms/appliance/DeleteAppliance';
import Products from './pages/cms/product/Products';
import DeleteProduct from './pages/cms/product/DeleteProduct';
import UpdateProduct from './pages/cms/product/UpdateProduct';
import Categories from './pages/cms/category/Categories';
import DeleteCategory from './pages/cms/category/DeleteCategory';
import UpdateCategory from './pages/cms/category/UpdateCategory';
import Carousels from './pages/cms/carousel/Carousels';
import UpdateCarousel from './pages/cms/carousel/UpdateCarousel';
import DeleteCarousel from './pages/cms/carousel/DeleteCarousel';
import Images from './pages/cms/Images';
import Galleries from './pages/cms/gallery/Galleries';
import UpdateGallery from './pages/cms/category/UpdateCategory';
import DeleteGallery from './pages/cms/gallery/DeleteGallery';
import Login from './pages/auth/Login';
import Logout from './pages/auth/Logout';
import Profile from './pages/auth/Profile';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Files from './pages/cms/Files';
import Download from './pages/cms/Download';
import Users from './pages/cms/user/Users';
import Customers from './pages/cms/customer/Customers';

function App() {
  return (

    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      <Routes>
        {/* main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appliance" element={<MainAppliance />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route element={<CmsLayout />}>
          <Route path="/cms/dashboard" element={<Dashboard />} />
          {/* Appliance route */}
          <Route path="/cms/appliances" element={<CMSAppliance />} />
          <Route path="/cms/appliances/edit" element={<UpdateAppliance />} />
          <Route path="/cms/appliances/delete" element={<DeleteAppliance />} />
          {/* Product route */}
          <Route path="/cms/products" element={<Products />} />
          <Route path="/cms/products/edit" element={<UpdateProduct />} />
          <Route path="/cms/products/delete" element={<DeleteProduct />} />
          {/* Categories route */}
          <Route path="/cms/categories" element={<Categories />} />
          <Route path="/cms/categories/edit" element={<UpdateCategory />} />
          <Route path="/cms/categories/delete" element={<DeleteCategory />} />
          {/* Carousel route */}
          <Route path="/cms/carousels" element={<Carousels />} />
          <Route path="/cms/carousels/edit" element={<UpdateCarousel />} />
          <Route path="/cms/carousels/delete" element={<DeleteCarousel />} />
          {/* Carousel route */}
          <Route path="/cms/images" element={<Images />} />
          {/* Gallery route */}
          <Route path="/cms/galleries" element={<Galleries />} />
          <Route path="/cms/galleries/edit" element={<UpdateGallery />} />
          <Route path="/cms/galleries/delete" element={<DeleteGallery />} />
          {/* Files route */}
          <Route path="/cms/files" element={<Files />} />
          <Route path="/cms/downloads" element={<Download/>} />
          {/* Users route */}
          <Route path="/cms/users" element={<Users />} />
          {/* Customers route */}
          <Route path="/cms/customers" element={<Customers />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;