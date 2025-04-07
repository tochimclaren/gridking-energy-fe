import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    staff: false,
    admin: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate form using Joi schema
  const validateForm = () => {
    try {
      const { error } = registerSchema.validate(formData, { abortEarly: false });
      
      if (!error) {
        setFormErrors({});
        return true;
      }
      
      const validationErrors = {};
      error.details.forEach(detail => {
        validationErrors[detail.path[0]] = detail.message;
      });
      
      setFormErrors(validationErrors);
      return false;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: newValue
    }));
    
    // Clear specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data against Joi schema
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Remove confirmPassword as it's not part of the API data
      const { confirmPassword, ...registrationData } = formData;
      
      // Make API request using axios
      const response = await axios.post('/api/auth/register', registrationData);
      
      // If request is successful, update auth context
      if (response.data && response.data.token) {
        // Call the register function from auth context with the token
        const success = await register(response.data.token, response.data.user);
        
        if (success) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle error responses
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setApiError(error.response.data.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        setApiError('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request
        setApiError('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  formErrors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  formErrors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
              />
              {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
            </div>
            
            {/* Admin role fields are typically only shown in admin forms, but included here for completeness */}
            {/* You may want to hide these based on user permissions */}
            <div className="mb-4 pt-2">
              <div className="flex items-center">
                <input
                  id="staff"
                  name="staff"
                  type="checkbox"
                  checked={formData.staff}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="staff" className="ml-2 block text-sm text-gray-900">
                  Staff member
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="admin"
                  name="admin"
                  type="checkbox"
                  checked={formData.admin}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="admin" className="ml-2 block text-sm text-gray-900">
                  Administrator
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign up'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;