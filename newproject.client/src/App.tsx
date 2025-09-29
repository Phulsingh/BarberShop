import './App.css';
import {Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { LoginPage } from '@/components/Auth/login-form';
import ProtectedRoute from '@/components/Auth/protected-route';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import Register from "./components/Auth/register"
import Dashboard from "./components/Dashboard/dashboard"
import Settings from "./components/Dashboard/settings"
import MyAppointment from "./components/Dashboard/my-appointment"
import Search from "./components/Dashboard/search"
import BookNow from "./components/Dashboard/book-now"

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
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/my-appointment" element={<MyAppointment />} />
        <Route path="/search" element={<Search />} />
        <Route path="/book-now" element={<BookNow />} />

        {/* Catch all route - redirect to Dashboard */}  
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
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