import { useApiService } from "./apiService";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  role?: string;
}

interface UpdateProfileRequest {
  fullName?: string;
  username?: string;
  email?: string;
  mobileNumber?: string;
  age?: number;
  dateOfBirth?: string;
  bio?: string;
  location?: string;
  state?: string;
  pinCode?: string;
  gender?: string;
  avatar?: File | string;
}

interface UserProfile {
  id: number;
  fullName: string;
  username?: string;
  email: string;
  contactNumber: string;
  age?: number;
  dateOfBirth?: string;
  bio?: string;
  location?: string;
  state?: string;
  pinCode?: string;
  gender?: string;
  avatar?: string;
  role: string;
  createdAt: string;
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
        const response = await api.post("/Users/login", credentials);
        if (response.token) {
          // Store the auth token and user data
          localStorage.setItem("AuthToken", response.token);
          localStorage.setItem("UserData", JSON.stringify(response.user));
        }
        return response;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
      try {
        const response = await api.post("/Users/register", {
          ...userData,
          role: userData.role || "User", // Set default role if not provided
        });
        if (response.token) {
          // Store the auth token and user data after successful registration
          localStorage.setItem("AuthToken", response.token);
          localStorage.setItem("UserData", JSON.stringify(response.user));
        }
        return response;
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },

    // 🔹 UPDATE PROFILE (multipart/form-data)
    updateProfile: async (id: number, payload: UpdateProfileRequest): Promise<UserProfile> => {
      try {
        const formData = new FormData();

        for (const key in payload) {
          const value = payload[key as keyof UpdateProfileRequest];
          if (value !== undefined && value !== null) {
            if (key === "avatar" && value instanceof File) {
              formData.append("Avatar", value);
            } else {
              formData.append(key, value.toString());
            }
          }
        }

        const response = await api.put(`/Users/update-profile/${id}`, formData);

        const updatedUser = response?.user ?? response;

        // Update localStorage if current user
        const current = localStorage.getItem("UserData");
        if (current) {
          const currentUser = JSON.parse(current);
          if (currentUser?.id === id) {
            localStorage.setItem("UserData", JSON.stringify(updatedUser));
          }
        }

        return updatedUser;
      } catch (error) {
        console.error("Update profile failed:", error);
        throw error;
      }
    },

    getProfile: async (id: number): Promise<UserProfile> => {
      try {
        const response = await api.get(`/Users/profile/${id}`);
        return response.user ?? response; // support both formats
      } catch (error) {
        console.error("Get profile failed:", error);
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem("AuthToken");
      localStorage.removeItem("UserData");
    },

    isAuthenticated: (): boolean => {
      const token = localStorage.getItem("AuthToken");
      return !!token;
    },

    getCurrentUser: () => {
      const userData = localStorage.getItem("UserData");
      return userData ? JSON.parse(userData) : null;
    },
  };

  return authService;
};
