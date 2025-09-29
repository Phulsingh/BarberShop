import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';
interface ProtectedRouteProps {
    children: ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    // Show loading while authentication status is being determined
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }
    // If user is not authenticated, redirect to login page with return URL
    if (!isAuthenticated) {
        // Check if this is a clean logout
        const isCleanLogout = sessionStorage.getItem('cleanLogout') === 'true';
        if (isCleanLogout) {
            // Clear the flag and redirect to clean login page
            sessionStorage.removeItem('cleanLogout');
            return <Navigate to="/" replace />;
        }
        // Normal unauthenticated access - preserve the full location for return URL
        const returnUrl = encodeURIComponent(`${location.pathname}${location.search}${location.hash}`);
        return <Navigate
            to={`/?returnURL=${returnUrl}`}
            replace
        />;
    }
    // If user is authenticated, render the protected content
    return <>{children}</>;
};
export default ProtectedRoute;