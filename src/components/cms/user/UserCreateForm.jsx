import React, { useState } from 'react';

const UserCreateForm = ({ onUserCreated }) => {
  // Form state for creating users
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    staff: false,
    admin: false
  });

  // Error state for form
  const [errors, setErrors] = useState({});
  
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for creating user
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset submission states
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    
    // Validate form before submission
    if (validateForm()) {
      try {
        // Create user via API
        const response = await fetch(`${BASE_URL}/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create user');
        }

        setSubmitSuccess(true);
        
        // Notify parent component
        if (onUserCreated) {
          onUserCreated();
        }
        
        // Clear form after successful submission
        setFormData({
          email: '',
          password: '',
          staff: false,
          admin: false
        });
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } catch (error) {
        setSubmitError(error.message || 'An error occurred while creating the user.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New User</h2>
      
      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          User created successfully!
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="user@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters and include uppercase, lowercase, and numbers.
          </p>
        </div>
        
        {/* User Permissions */}
        <div className="pt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">User Permissions</h3>
          
          {/* Staff Checkbox */}
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="staff"
              name="staff"
              checked={formData.staff}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="staff" className="ml-2 block text-sm text-gray-700">
              Staff Member
            </label>
          </div>
          
          {/* Admin Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="admin"
              name="admin"
              checked={formData.admin}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="admin" className="ml-2 block text-sm text-gray-700">
              Administrator
            </label>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitting 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Creating User...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreateForm;