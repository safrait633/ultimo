import { apiRequest } from "./queryClient";
import { LoginData, User } from "@shared/schema";

interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/simple/login", credentials);
    const data = await response.json();
    // Backend returns {success, message, data: {user, tokens}}, we need {user, token}
    if (data.success) {
      return {
        user: data.data.user,
        token: data.data.tokens.accessToken
      };
    }
    throw new Error(data.message || 'Login failed');
  },

  register: async (userData: any): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/simple/register", userData);
    const data = await response.json();
    // Backend returns {success, message, data: {user, tokens}}, we need {user, token}
    if (data.success) {
      return {
        user: data.data.user,
        token: data.data.tokens.accessToken
      };
    }
    throw new Error(data.message || 'Registration failed');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiRequest("GET", "/api/simple/me");
    const data = await response.json();
    if (data.success) {
      return data.data.user;
    }
    throw new Error(data.message || 'Failed to get user');
  },
};

// Helper function to safely check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const getAuthToken = (): string | null => {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage not available, returning null for auth token');
      return null;
    }
    return localStorage.getItem("auth_token");
  } catch (error) {
    console.warn('Failed to get auth token from localStorage:', error);
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage not available, cannot set auth token');
      return;
    }
    localStorage.setItem("auth_token", token);
  } catch (error) {
    console.warn('Failed to set auth token in localStorage:', error);
  }
};

export const removeAuthToken = (): void => {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage not available, cannot remove auth token');
      return;
    }
    localStorage.removeItem("auth_token");
  } catch (error) {
    console.warn('Failed to remove auth token from localStorage:', error);
  }
};

export const isAuthenticated = (): boolean => {
  try {
    const token = getAuthToken();
    return !!token;
  } catch (error) {
    console.warn('Failed to check authentication status:', error);
    return false;
  }
};
