// src/services/auth.service.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

// Types
export type UserData = {
  id: string;
  email: string;
  staff: boolean;
  admin: boolean;
};

export type AuthResponse = {
  success: boolean;
  token?: string;
  user?: UserData;
  message?: string;
};

// Store token in localStorage
const storeToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Remove token from localStorage
const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Set Auth header for axios requests
const setAuthHeader = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize auth header
export const initializeAuth = (): void => {
  const token = getToken();
  setAuthHeader(token);
};

// Register new user
export const register = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, { email, password });
    
    if (response.data.success && response.data.token) {
      storeToken(response.data.token);
      setAuthHeader(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Registration failed. Please try again.');
  }
};

// Login user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, { email, password });

    if (response.data.success && response.data.token) {
      storeToken(response.data.token);
      setAuthHeader(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed. Please try again.');
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/user/logout`);
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    // Always remove token even if API call fails
    removeToken();
    setAuthHeader(null);
  }
};

// Get current user
export const getCurrentUser = async (): Promise<UserData> => {
  try {
    const response = await axios.get(`${BASE_URL}/user/profile`);
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      // Token expired or invalid
      removeToken();
      setAuthHeader(null);
    }
    throw error;
  }
};

// Update user profile
export const updateProfile = async (data: { email: string }): Promise<UserData> => {
  const response = await axios.put(`${BASE_URL}/user/profile`, data);
  return response.data.user;
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await axios.put(`${BASE_URL}/user/change-password`, { 
    currentPassword, 
    newPassword 
  });
};

// Forgot password
export const forgotPassword = async (email: string): Promise<void> => {
  await axios.post(`${BASE_URL}/user/forgot-password`, { email });
};

// Reset password with token
export const resetPassword = async (
  resetToken: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.put(`${BASE_URL}/user/reset-password/${resetToken}`, { password });
  
  if (response.data.success && response.data.token) {
    storeToken(response.data.token);
    setAuthHeader(response.data.token);
  }
  
  return response.data;
};

// Create user (admin only)
export const createUser = async (data: {
  email: string;
  staff: boolean;
  admin: boolean;
}): Promise<AuthResponse> => {
  const response = await axios.post(`${BASE_URL}/user/create`, data);
  return response.data;
};

// Send password reset for user (admin only)
export const sendPasswordReset = async (email: string): Promise<void> => {
  await axios.post(`${BASE_URL}/user/send-password-reset`, { email });
};