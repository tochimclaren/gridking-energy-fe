import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';


const CreateAccountForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    staff: false,
    admin: false
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  
  // Check if current user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Replace with your actual authentication logic
        const response = await axios.get('/api/auth/current-user', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const userData = await response.json();
        setUser(userData);
        
        // Redirect if not admin
        if (!userData.admin) {
          navigate('/unauthorized');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please provide a valid email address';
    return '';
  };
  
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!passwordRegex.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    
    if (!validateForm()) return;
    
    try {
      // Replace with your actual API endpoint
      const response = await axios.post('/api/users', formData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
      
      setSubmitSuccess('User created successfully!');
      // Reset form
      setFormData({
        email: '',
        password: '',
        staff: false,
        admin: false
      });
    } catch (error) {
      console.error('Error creating user:', error);
      setSubmitError(error.message || 'An error occurred while creating the user');
    }
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New User</h2>
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {submitError}
        </div>
      )}
      
      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {submitSuccess}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`w-full px-3 py-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="staff"
              checked={formData.staff}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-gray-700">Staff User</span>
          </label>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="admin"
              checked={formData.admin}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-gray-700">Admin User</span>
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateAccountForm;