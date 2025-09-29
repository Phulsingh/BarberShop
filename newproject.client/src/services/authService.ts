import { useApiService } from './apiService';

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    contactNumber: string;
    avatar?: string;
    role?: string;
}

interface AuthResponse {
    token: string;
    user: {
        fullName: string;
        email: string;
        contactNumber: string;
        avatar?: string;
        role: string;
    };
}

export const useAuthService = () => {
    const api = useApiService();

    const authService = {
        login: async (credentials: LoginRequest): Promise<AuthResponse> => {
            try {
                const response = await api.post('/Users/login', credentials);
                if (response.token) {
                    // Store the auth token and user data
                    localStorage.setItem('AuthToken', response.token);
                    localStorage.setItem('UserData', JSON.stringify(response.user));
                }
                return response;
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },

        register: async (userData: RegisterRequest): Promise<AuthResponse> => {
            try {
                const response = await api.post('/Users/register', {
                    ...userData,
                    role: userData.role || 'User' // Set default role if not provided
                });
                if (response.token) {
                    // Store the auth token and user data after successful registration
                    localStorage.setItem('AuthToken', response.token);
                    localStorage.setItem('UserData', JSON.stringify(response.user));
                }
                return response;
            } catch (error) {
                console.error('Registration failed:', error);
                throw error;
            }
        },

        logout: () => {
            localStorage.removeItem('AuthToken');
            localStorage.removeItem('UserData');
        },

        isAuthenticated: (): boolean => {
            const token = localStorage.getItem('AuthToken');
            return !!token;
        },

        getCurrentUser: () => {
            const userData = localStorage.getItem('UserData');
            return userData ? JSON.parse(userData) : null;
        }
    };

    return authService;
};
