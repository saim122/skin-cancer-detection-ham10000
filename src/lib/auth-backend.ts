// Updated auth service that uses backend API
import { apiClient, isAuthenticated as checkAuth, getCurrentUserFromStorage } from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'Other';
  createdAt: Date | string;
  lastLogin?: Date | string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Register new user
export async function register(data: {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<AuthResponse> {
  try {
    const response = await apiClient.register(data);
    return {
      success: response.success,
      message: response.message,
      user: response.user,
      token: response.token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Registration failed',
    };
  }
}

// Login user
export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.login(email, password);
    return {
      success: response.success,
      message: response.message,
      user: response.user,
      token: response.token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Login failed',
    };
  }
}

// Logout user
export async function logout(): Promise<void> {
  try {
    await apiClient.logout();
  } catch (error) {
    console.error('Logout error:', error);
    // Clear local data even if API call fails
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skin_health_token');
      localStorage.removeItem('skin_health_user');
    }
  }
}

// Get current user (from localStorage or API)
export function getCurrentUser(): User | null {
  return getCurrentUserFromStorage();
}

// Refresh user from API
export async function refreshCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.getCurrentUser();
    return response.user || null;
  } catch (error) {
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return checkAuth();
}

// Update user profile
export async function updateProfile(userId: string, data: Partial<User>): Promise<AuthResponse> {
  try {
    const response = await apiClient.updateProfile(data);
    return {
      success: response.success,
      message: response.message,
      user: response.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Profile update failed',
    };
  }
}

