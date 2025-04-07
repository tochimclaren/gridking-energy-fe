// File: src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Configure axios defaults
    axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';

    useEffect(() => {
        // Check if user is already logged in with token
        const verifyUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/user/profile`);
                setCurrentUser(response.data.user);
            } catch (error) {
                console.error("Authentication error:", error);
                logout(); // Auto logout on auth error
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.post(`${BASE_URL}/user/login`, { email, password });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setCurrentUser(user);

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password) => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.post(`${BASE_URL}/user/register`, { email, password });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setCurrentUser(user);

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        try {
            setLoading(true);
            setError('');

            await axios.post(`${BASE_URL}/user/forgot-password`, { email });
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send reset email');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token, password) => {
        try {
            setLoading(true);
            setError('');

            await axios.post(`${BASE_URL}/user/reset-password/${token}`, { password });
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Password reset failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            setLoading(true);
            setError('');

            await axios.post(`${BASE_URL}/user/change-password`, { currentPassword, newPassword });
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to change password');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        currentUser,
        token,
        loading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
        isAdmin: currentUser?.admin || false,
        isStaff: currentUser?.staff || false,
        isAuthenticated: !!currentUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};