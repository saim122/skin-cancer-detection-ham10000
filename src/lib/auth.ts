// Authentication service using localStorage
// Ready to be replaced with backend API calls

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'Other';
  createdAt: Date | string; // Date object or ISO string from localStorage
  lastLogin?: Date | string; // Date object or ISO string from localStorage
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

const USERS_KEY = 'skin_health_users';
const CURRENT_USER_KEY = 'skin_health_current_user';
const AUTH_TOKEN_KEY = 'skin_health_auth_token';

// Get all users from localStorage
function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Generate simple token (in production, this would be JWT from backend)
function generateToken(): string {
  return btoa(`${Date.now()}-${Math.random().toString(36)}`);
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getUsers();

  // Check if user already exists
  if (users.find(u => u.email === data.email)) {
    return {
      success: false,
      message: 'Email already registered',
    };
  }

  if (users.find(u => u.username === data.username)) {
    return {
      success: false,
      message: 'Username already taken',
    };
  }

  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}`,
    email: data.email,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    createdAt: new Date(),
    role: 'patient',
  };

  // Store password separately (in production, hash this!)
  // For demo purposes only - NEVER store passwords in localStorage in production!
  const passwordStore = localStorage.getItem('skin_health_passwords') || '{}';
  const passwords = JSON.parse(passwordStore);
  passwords[newUser.email] = btoa(data.password); // Base64 encode for demo
  localStorage.setItem('skin_health_passwords', JSON.stringify(passwords));

  users.push(newUser);
  saveUsers(users);

  const token = generateToken();
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  return {
    success: true,
    message: 'Registration successful',
    user: newUser,
    token,
  };
}

// Login user
export async function login(email: string, password: string): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  // Check password
  const passwordStore = localStorage.getItem('skin_health_passwords') || '{}';
  const passwords = JSON.parse(passwordStore);
  const storedPassword = passwords[email];

  if (!storedPassword || storedPassword !== btoa(password)) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  // Update last login
  user.lastLogin = new Date();
  saveUsers(users);

  const token = generateToken();
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  return {
    success: true,
    message: 'Login successful',
    user,
    token,
  };
}

// Logout user
export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(CURRENT_USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
}

// Update user profile
export async function updateProfile(userId: string, data: Partial<User>): Promise<AuthResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found',
    };
  }

  // Update user
  users[userIndex] = { ...users[userIndex], ...data };
  saveUsers(users);

  // Update current user in localStorage
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]));

  return {
    success: true,
    message: 'Profile updated successfully',
    user: users[userIndex],
  };
}

// Change password
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<AuthResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = getCurrentUser();
  if (!user || user.id !== userId) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }

  // Check current password
  const passwordStore = localStorage.getItem('skin_health_passwords') || '{}';
  const passwords = JSON.parse(passwordStore);
  const storedPassword = passwords[user.email];

  if (!storedPassword || storedPassword !== btoa(currentPassword)) {
    return {
      success: false,
      message: 'Current password is incorrect',
    };
  }

  // Update password
  passwords[user.email] = btoa(newPassword);
  localStorage.setItem('skin_health_passwords', JSON.stringify(passwords));

  return {
    success: true,
    message: 'Password changed successfully',
  };
}

// Request password reset (email would be sent in production)
export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    // Don't reveal if email exists (security best practice)
    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  // In production, send email with reset token
  // For demo, just return success
  return {
    success: true,
    message: 'Password reset link sent to your email.',
  };
}

// Delete account
export async function deleteAccount(userId: string, password: string): Promise<AuthResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = getCurrentUser();
  if (!user || user.id !== userId) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }

  // Verify password
  const passwordStore = localStorage.getItem('skin_health_passwords') || '{}';
  const passwords = JSON.parse(passwordStore);
  const storedPassword = passwords[user.email];

  if (!storedPassword || storedPassword !== btoa(password)) {
    return {
      success: false,
      message: 'Incorrect password',
    };
  }

  // Delete user
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  saveUsers(filteredUsers);

  // Delete password
  delete passwords[user.email];
  localStorage.setItem('skin_health_passwords', JSON.stringify(passwords));

  // Logout
  logout();

  return {
    success: true,
    message: 'Account deleted successfully',
  };
}

