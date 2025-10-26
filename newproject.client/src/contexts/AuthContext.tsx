import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface JWTPayload extends JwtPayload {
    exp: number;
    nbf: number;
    email?: string;
    isReadOnly?: string;
    ISEmailVerified?: boolean | string;
}

// Shape of the richer user object stored by authService ("UserData")
interface LocalUser {
    id?: number;
    fullName?: string;
    username?: string;
    email?: string;
    contactNumber?: string;
    avatar?: string;
    role?: string;
    [key: string]: any;
}

interface AuthContextType {
    login: (token?: string, returnUrl?: string) => void;
    logout: () => void;
    user: LocalUser | null;
    token: string | null;
    isAuthenticated: boolean | null;
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
    const [user, setUser] = useState<LocalUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setAuthentication] = useState<boolean | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem(AUTHTOKEN);
        const storedUser = localStorage.getItem("UserData");

        if (storedToken && storedToken !== "null" && storedToken !== "undefined") {
            // prefer the richer stored user object if available
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser) as LocalUser;
                    setUser(parsed);
                } catch {
                    // fallback to decoded token when UserData is malformed
                    try {
                        const decodedToken = jwtDecode<JWTPayload>(storedToken);
                        setUser({ email: decodedToken.email ?? undefined });
                    } catch {
                        setUser(null);
                    }
                }
            } else {
                // no stored user, decode token for minimal info
                try {
                    const decodedToken = jwtDecode<JWTPayload>(storedToken);
                    // set minimal user data from token payload
                    setUser({ email: decodedToken.email ?? undefined });
                } catch {
                    setUser(null);
                }
            }

            // validate token
            try {
                const decodedToken = jwtDecode<JWTPayload>(storedToken);
                if (isTokenValid(decodedToken).isValid) {
                    setToken(storedToken);
                    setAuthentication(true);
                } else {
                    logoutInternal();
                    navigate("/");
                }
            } catch {
                logoutInternal();
                navigate("/");
            }
        } else {
            setAuthentication(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCurrentUTCTimestamp = () => Math.floor(new Date().getTime() / 1000);

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

    // internal logout helper that doesn't navigate (used during init)
    const logoutInternal = () => {
        localStorage.removeItem("UserData");
        sessionStorage.removeItem('rememberedEmail');
        sessionStorage.removeItem('cleanLogout');
        setUser(null);
        setToken(null);
        setAuthentication(false);
        localStorage.removeItem(AUTHTOKEN);
    };

    const login = (token?: string, returnUrl?: string) => {
        sessionStorage.removeItem('cleanLogout');
        if (token) {
            setToken(token);
            localStorage.setItem(AUTHTOKEN, token);

            // authService already stores UserData; prefer that
            const storedUser = localStorage.getItem("UserData");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser) as LocalUser);
                } catch {
                    // fallback to token decode
                    try {
                        const decodedToken = jwtDecode<JWTPayload>(token);
                        setUser({ email: decodedToken.email ?? undefined });
                    } catch {
                        setUser(null);
                    }
                }
            } else {
                // fallback to token decode
                try {
                    const decodedToken = jwtDecode<JWTPayload>(token);
                    setUser({ email: decodedToken.email ?? undefined });
                } catch {
                    setUser(null);
                }
            }
        } else {
            setToken(null);
            setUser(null);
        }

        setAuthentication(true);

        if (returnUrl) {
            const isValidReturnUrl = returnUrl.startsWith('/') && !returnUrl.startsWith('//');
            if (isValidReturnUrl) {
                navigate(returnUrl, { replace: true });
            } else {
                navigate('/home', { replace: true });
            }
        }
    };

    const logout = () => {
        logoutInternal();
        // mark clean logout and navigate
        sessionStorage.setItem('cleanLogout', 'true');
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