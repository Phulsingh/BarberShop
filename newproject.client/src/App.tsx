import './App.css';
import {Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { LoginPage } from '@/components/Auth/login-form';
import ProtectedRoute from '@/components/Auth/protected-route';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import Register from "./components/Auth/register"
import Dashboard from "./components/Users/dashboard"
import Settings from "./components/Users/settings"
import MyAppointment from "./components/Users/my-appointment"
import Offer from "./components/Users/offers"
import BookNow from "./components/Users/book-now"
import Header from "./components/shared/Header"
import Footer from './components/shared/footer';
import Services from './components/Users/services';
import Carts from './components/Users/Carts';
import Profile from './components/Users/Profile';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // If user is authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated && (location.pathname === '/' || location.pathname === '/register')) {
    // Check for returnURL query parameter
    const searchParams = new URLSearchParams(location.search);
    const returnUrl = searchParams.get('returnURL');

    if (returnUrl) {
      const decodedUrl = decodeURIComponent(returnUrl);
      // Ensure it's a safe, relative URL
      if (decodedUrl.startsWith('/') && !decodedUrl.startsWith('//')) {
        return <Navigate to={decodedUrl} replace />;
      }
    }
    return <Navigate to="/home" replace />;
  }

  // For unauthenticated users, show login page and allow home page access
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        {/* Catch all route - redirect to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // For authenticated users, render protected routes
  return (
    <ProtectedRoute>
      <>
        <Header/>
        <Routes>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/appointments" element={<MyAppointment />} />
          <Route path="/offers" element={<Offer />} />
          <Route path="/book-now" element={<BookNow />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cart" element={<Carts />} />
          <Route path="/profile" element={<Profile/>} />

          {/* Catch all route - redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        <Footer />
      </>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;