import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/cms/auth/ProtectedRoute';
import MainAppliance from './pages/main/Appliance';
import Dashboard from './pages/cms/Dashboard';
import MainLayout from './layout/MainLayout';
import CmsLayout from './layout/CmsLayout';
import CMSAppliance from './pages/cms/appliance/Appliances';
import ApplianceUpdate from './pages/cms/appliance/ApplianceUpdate';
import ApplianceDetail from './pages/cms/appliance/ApplianceDetail';
import Products from './pages/cms/product/Products';
import ApplianceCreate from './pages/cms/appliance/ApplianceCreate';
import ProductUpdate from './pages/cms/product/ProductUpdate';
import ProductDetail from './pages/cms/product/ProductDetail';
import ProductCreate from './pages/cms/product/ProductCreate';
import Categories from './pages/cms/category/Categories';
import CategoryUpdate from './pages/cms/category/CategoryUpdate';
import CategoryDetail from './pages/cms/category/CategoryDetail';
import CategoryCreate from './pages/cms/category/CategoryCreate';
import Carousels from './pages/cms/carousel/Carousels';
import CarouselUpdate from './pages/cms/carousel/CarouselUpdate';
import CarouselDetail from './pages/cms/carousel/CarouselDetail';
import CarouselCreate from './pages/cms/carousel/CarouselCreate';
import Images from './pages/cms/image/Images';
import Galleries from './pages/cms/gallery/Galleries';
import GalleryUpdate from './pages/cms/gallery/GalleryUpdate';
import GalleryDetail from './pages/cms/gallery/GalleryDetail';
import GalleryCreate from './pages/cms/gallery/GalleryCreate';
import Login from './pages/auth/Login';
import Logout from './pages/auth/Logout';
import Profile from './pages/auth/UserProfile';
import Users from './pages/auth/Users';
import UserCreate from './pages/auth/UserCreate';
import UserUpdate from './pages/auth/UserUpdate';
import UserDetail from './pages/auth/UserDetail';
import Quotes from './pages/cms/quote/Quotes';
import QuoteDetail from './pages/cms/quote/QuoteDetail';
import QuoteUpdate from './pages/cms/quote/QuoteUpdate';
import QuoteCreate from './pages/cms/quote/QuoteCreate';
import Enquiries from './pages/cms/enquiry/Enquiries';
import EnquiryDetail from './pages/cms/enquiry/EnquiryDetail';
import EnquiryUpdate from './pages/cms/enquiry/EnquiryUpdate';
import EnquiryCreate from './pages/cms/enquiry/EnquiryCreate';
import Downloads from './pages/cms/download/Downloads';
import ForgotPasswordForm from './components/cms/auth/ForgotPasswordForm';
// import UserCreateForm from './components/cms/auth/UserCreateForm';

import NotFoundPage from './pages/errors/NotFoundPage';
import Newsletters from './pages/cms/newsletter/Newsletters';



function App() {
  return (

    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* main layout */}
          <Route element={<MainLayout />}>
            <Route path="/appliance" element={<MainAppliance />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm onForgotPassword={async (email) => {
              console.log(email)
            }} />} />
            <Route path="/logout" element={
              <ProtectedRoute level="auth">
                <Logout />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute level="auth">
                <Profile />
              </ProtectedRoute>
            } />
          </Route>
          <Route element={
            <ProtectedRoute level="auth">
              <CmsLayout />
            </ProtectedRoute>
          }>
            <Route path="/cms/dashboard" element={
              <ProtectedRoute level="auth">
                <Dashboard />
              </ProtectedRoute>
            } />
            {/* Appliance route */}
            <Route path="/cms/appliances" element={
              <ProtectedRoute level="auth">
                <CMSAppliance />
              </ProtectedRoute>
            } />
            <Route path="/cms/appliances/create" element={
              <ProtectedRoute level="auth">
                <ApplianceCreate />
              </ProtectedRoute>
            } />
            <Route path="/cms/appliances/:id/update" element={
              <ProtectedRoute level="auth">
                <ApplianceUpdate />
              </ProtectedRoute>
            } />
            <Route path="/cms/appliances/:id/detail" element={
              <ProtectedRoute level="auth">
                <ApplianceDetail />
              </ProtectedRoute>
            } />
            {/* Product route */}
            <Route path="/cms/products" element={
              <ProtectedRoute level="auth">
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/cms/products/create" element={
              <ProtectedRoute level="auth">
                <ProductCreate />
              </ProtectedRoute>
            } />
            <Route path="/cms/products/:id/update" element={
              <ProtectedRoute level="auth">
                <ProductUpdate />
              </ProtectedRoute>
            } />
            <Route path="/cms/products/:id/detail" element={
              <ProtectedRoute level="auth">
                <ProductDetail />
              </ProtectedRoute>
            } />
            {/* Categories route */}
            <Route path="/cms/categories" element={
              <ProtectedRoute level="auth">
                <Categories />
              </ProtectedRoute>
            } />
            <Route path="/cms/categories/create" element={
              <ProtectedRoute level="auth">
                <CategoryCreate />
              </ProtectedRoute>
            } />
            <Route path="/cms/categories/:id/update" element={
              <ProtectedRoute level="auth">
                <CategoryUpdate />
              </ProtectedRoute>
            } />
            <Route path="/cms/categories/:id/detail" element={
              <ProtectedRoute level="auth">
                <CategoryDetail />
              </ProtectedRoute>
            } />
            {/* Carousel route */}
            <Route path="/cms/carousels" element={
              <ProtectedRoute level="auth">
                <Carousels />
              </ProtectedRoute>
            } />
            <Route path="/cms/carousels/create" element={
              <ProtectedRoute level="auth">
                <CarouselCreate />
              </ProtectedRoute>
            } />
            <Route path="/cms/carousels/:id/update" element={
              <ProtectedRoute level="auth">
                <CarouselUpdate />
              </ProtectedRoute>
            } />
            <Route path="/cms/carousels/:id/detail" element={
              <ProtectedRoute level="auth">
                <CarouselDetail />
              </ProtectedRoute>
            } />
            {/* Carousel route */}
            <Route path="/cms/images" element={
              <ProtectedRoute level="auth">
                <Images />
              </ProtectedRoute>
            } />
            {/* Gallery route */}
            <Route path="/cms/galleries" element={
              <ProtectedRoute level="auth">
                <Galleries />
              </ProtectedRoute>
            } />
            <Route path="/cms/galleries/create" element={
              <ProtectedRoute level="auth">
                <GalleryCreate />
              </ProtectedRoute>
            } />
            <Route path="/cms/galleries/:id/update" element={
              <ProtectedRoute level="auth">
                <GalleryUpdate />
              </ProtectedRoute>
            } />
            <Route path="/cms/galleries/:id/detail" element={
              <ProtectedRoute level="auth">
                <GalleryDetail />
              </ProtectedRoute>
            } />
            {/* Users route */}

            <Route path="/cms/users" element={
              <ProtectedRoute level="admin">
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/cms/users/:id/update" element={
              <ProtectedRoute level="admin">
                <UserUpdate />
              </ProtectedRoute>
            } />
            <Route path="/cms/users/:id/detail" element={
              <ProtectedRoute level="admin">
                <UserDetail />
              </ProtectedRoute>
            } />
            <Route path="/cms/users/create" element={
              <ProtectedRoute level="admin">
                <UserCreate />
              </ProtectedRoute>
            } />
            {/* Quotes route */}
            <Route path="/cms/quotes" element={
              <ProtectedRoute level="auth">
                <Quotes />
              </ProtectedRoute>
            } />
            <Route path="/cms/quotes/create" element={
              <ProtectedRoute level="admin">
                <QuoteCreate />
              </ProtectedRoute>
            } />
            <Route path="/cms/quotes/:id/detail" element={
              <ProtectedRoute level="auth">
                <QuoteDetail />
              </ProtectedRoute>
            } />
            <Route path="/cms/quotes/:id/update" element={
              <ProtectedRoute level="admin">
                <QuoteUpdate />
              </ProtectedRoute>
            } />
            {/* Enquiry route */}
            <Route path="/cms/enquiries" element={
              <ProtectedRoute level="auth">
                <Enquiries />
              </ProtectedRoute>
            } />
            <Route path="/cms/enquiries/create" element={
              <ProtectedRoute level='admin'>
                <EnquiryCreate />
              </ProtectedRoute>
            }
            />
            <Route path="/cms/enquiries/:id/detail" element={
              <ProtectedRoute level="auth">
                <EnquiryDetail />
              </ProtectedRoute>

            } />
            <Route path="/cms/enquiries/:id/update" element={
              <ProtectedRoute level="admin">
                <EnquiryUpdate />
              </ProtectedRoute>
            } />
            {/* Downloads route */}
            <Route path="/cms/downloads" element={
              <ProtectedRoute level="auth">
                <Downloads />
              </ProtectedRoute>
            } />
                      {/* Newsletter route */}
          <Route path="/cms/newsletters" element={
            <ProtectedRoute level="admin">
              <Newsletters />
            </ProtectedRoute>
          } />
          </Route>

          {/* Authenticated routes */}
          <Route path="/" element={<Navigate to="/cms/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </AuthProvider>
  );
}

export default App;