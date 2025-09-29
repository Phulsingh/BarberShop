import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
interface AuthContextType {
    login: (token?: string, returnUrl?: string) => void;
    logout: () => void;
    user: JWTPayload | null;
    token: string | null;
    isAuthenticated: boolean | null;
}
interface JWTPayload extends JwtPayload {
    exp: number;
    nbf: number;
    email: string;
    isReadOnly: string;
    ISEmailVerified: boolean | string; // Can be boolean or string from JWT
}
interface TokenValidationResult {
    isValid: boolean;
    reason: string;
    expiresIn?: number;
    validIn?: number;
    expiresInMinutes?: number;
    expiresInHours?: number;
    error?: string;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const AUTHTOKEN = "AuthToken";
    const navigate = useNavigate();
    const [user, setUser] = useState<JWTPayload | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setAuthentication] = useState<boolean | null>(null);
    useEffect(() => {
        const token = localStorage.getItem(AUTHTOKEN);
        if (token && token !== "null" && token !== "undefined") {
            const decodedToken = jwtDecode<JWTPayload>(token)
            if (isTokenValid(decodedToken as JWTPayload).isValid) {
                setToken(token);
                setAuthentication(true);
                setUser(decodedToken as JWTPayload);
            }
            else {
                logout();
                navigate("/");
            }
        } else {
            setAuthentication(false);
        }
    }, []);
    const getCurrentUTCTimestamp = () => {
        const now = new Date();
        return Math.floor(now.getTime() / 1000);
    };
    const isTokenValid = (payload: JWTPayload): TokenValidationResult => {
        const currentTimestamp = getCurrentUTCTimestamp();
        try {
            const expirationTime = payload.exp;
            const notBeforeTime = payload.nbf;
            if (currentTimestamp > expirationTime) {
                return {
                    isValid: false,
                    reason: 'Token has expired',
                    expiresIn: 0
                };
            }
            if (currentTimestamp < notBeforeTime) {
                return {
                    isValid: false,
                    reason: 'Token is not yet valid',
                    validIn: notBeforeTime - currentTimestamp
                };
            }
            const timeRemaining = expirationTime - currentTimestamp;
            return {
                isValid: true,
                reason: 'Token is valid',
                expiresIn: timeRemaining,
                expiresInMinutes: Math.floor(timeRemaining / 60),
                expiresInHours: Math.floor(timeRemaining / 3600)
            };
        } catch (error) {
            return {
                isValid: false,
                reason: 'Error validating token',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    };

    const login = (token?: string, returnUrl?: string) => {
        // Clear any clean logout flag
        sessionStorage.removeItem('cleanLogout');
        if (token) {
            // Token-based login (original functionality)
            setToken(token);
            localStorage.setItem(AUTHTOKEN, token);
            const decodedToken = jwtDecode<JWTPayload>(token);
            setUser(decodedToken as JWTPayload);
        } else {
            // Simple login without token
            setToken(null);
            setUser(null);
        }
        setAuthentication(true);
        // If returnUrl is provided, navigate to it
        if (returnUrl) {
            // Validate the return URL to prevent open redirects
            const isValidReturnUrl = returnUrl.startsWith('/') && !returnUrl.startsWith('//');
            if (isValidReturnUrl) {
                navigate(returnUrl, { replace: true });
            } else {
                navigate('/home', { replace: true });
            }
        }
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        setAuthentication(false);
        localStorage.removeItem(AUTHTOKEN);
        // Set a flag to indicate this is a clean logout
        sessionStorage.setItem('cleanLogout', 'true');
        // Navigate to login page without any query parameters
        navigate('/', { replace: true });
    };
    return (
        <AuthContext.Provider value={{
            login,
            logout,
            user,
            token,
            isAuthenticated,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;