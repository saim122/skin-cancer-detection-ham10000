// API client for backend communication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: any;
  token?: string;
  scans?: any[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('skin_health_token') : null;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // Send cookies
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error(error.message || 'Network error. Please try again.');
    }
  }

  // Auth endpoints
  async register(data: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      localStorage.setItem('skin_health_token', response.token);
      localStorage.setItem('skin_health_user', JSON.stringify(response.user));
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      localStorage.setItem('skin_health_token', response.token);
      localStorage.setItem('skin_health_user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('skin_health_token');
      localStorage.removeItem('skin_health_user');
    }
  }

  async getCurrentUser() {
    const response = await this.request('/auth/me');
    if (response.user) {
      localStorage.setItem('skin_health_user', JSON.stringify(response.user));
    }
    return response;
  }

  async updateProfile(data: any) {
    const response = await this.request('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (response.user) {
      localStorage.setItem('skin_health_user', JSON.stringify(response.user));
    }

    return response;
  }

  // Scan endpoints
  async getScans() {
    return this.request('/scans');
  }

  async saveScan(scanResult: any) {
    return this.request('/scans', {
      method: 'POST',
      body: JSON.stringify({ scanResult }),
    });
  }

  async deleteScan(scanId: string) {
    return this.request(`/scans/${scanId}`, {
      method: 'DELETE',
    });
  }

  async clearAllScans() {
    return this.request('/scans', {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient(API_URL);

// Helper to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('skin_health_token');
}

// Helper to get current user from localStorage (fast check)
export function getCurrentUserFromStorage() {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('skin_health_user');
  return userData ? JSON.parse(userData) : null;
}

