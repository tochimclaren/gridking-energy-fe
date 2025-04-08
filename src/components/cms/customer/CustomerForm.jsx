import React, { useState } from 'react';
import axios from 'axios';

const CustomerForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    serviceInterestedIn: '',
    state: ''
  });

  // Error state
  const [errors, setErrors] = useState({});
  
  // Loading and success states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Handle input changes
  const handleChange = (e) => {
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

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email must be a valid email address';
    }
    
    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name cannot be more than 100 characters long';
    }
    
    // Nigerian Phone validation
    // Nigerian numbers are typically in the format: +234 XXX XXX XXXX or 0XXX XXX XXXX
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+234|0)[0-9]{10}$/.test(formData.phone.replace(/\s|-/g, ''))) {
      newErrors.phone = 'Please enter a valid Nigerian phone number (e.g., +234 XXX XXX XXXX or 0XXX XXX XXXX)';
    }
    
    // Service validation
    if (!formData.serviceInterestedIn) {
      newErrors.serviceInterestedIn = 'Service interested in is required';
    }
    
    // State validation
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset submission states
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    
    // Validate form before submission
    if (validateForm()) {
      try {
        // Replace with your API endpoint
        const response = await axios.post(`${BASE_URL}/customer`, formData);
        setSubmitSuccess(true);
        
        // Clear form after successful submission
        setFormData({
          email: '',
          name: '',
          phone: '',
          serviceInterestedIn: '',
          state: ''
        });
      } catch (error) {
        setSubmitError(
          error.response?.data?.message || 
          'An error occurred while submitting the form.'
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Registration</h2>
      
      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Your information has been submitted successfully!
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Adekunle Ciroma Chukwuma"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
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
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="adekunle@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Phone Field - Nigerian format */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="+234 XXX XXX XXXX"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        
        {/* Service Interested In Field - as text input */}
        <div>
          <label htmlFor="serviceInterestedIn" className="block text-sm font-medium text-gray-700 mb-1">
            Service Interested In
          </label>
          <input
            type="text"
            id="serviceInterestedIn"
            name="serviceInterestedIn"
            value={formData.serviceInterestedIn}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.serviceInterestedIn ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Inverters, Batteries, Solar Panel etc."
          />
          {errors.serviceInterestedIn && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceInterestedIn}</p>
          )}
        </div>
        
        {/* State Field - as text input */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Lagos, Abuja, etc."
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitting 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;