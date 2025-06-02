import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface FormData {
  fullName: string;
  companyName: string;
  apartment: string;
  townCity: string;
  phoneNumber: string;
  email: string;
}

interface QuoteFormProps {
  quoteId?: string; // Optional - if provided, form is in edit mode
  initialData?: FormData; // Optional - if provided, prefill the form with data rather fetching from server
  onSuccess?: () => void; // Optional callback after successful submission
}

const CarouselForm: React.FC<QuoteFormProps> = ({ quoteId, initialData, onSuccess }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(quoteId);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      companyName: '',
      apartment: '',
      townCity: '',
      phoneNumber: '',
      email: ''
    }
  });

  // If in edit mode, fetch data
  useEffect(() => {
    if (quoteId) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${BASE_URL}/quote/${quoteId}`);
          const { data } = response.data;
          const { fullName, companyName, apartment, townCity, phoneNumber, email } = data;
          // Populate form with data
          reset({ fullName, companyName, apartment, townCity, phoneNumber, email });
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to load data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [quoteId, reset]);

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (isEditMode && quoteId) {
        await axios.put(`${BASE_URL}/quote/${quoteId}`, data);
      } else {
        await axios.post(`${BASE_URL}/quote`, data);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error saving data:', err);
      setError(err.response?.data?.message || 'Failed to save data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border-gray-200 p-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
        {isEditMode ? 'Edit Quote' : 'Create New Quote'}
      </h2>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Full Name Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Full name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Full name cannot exceed 100 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          {/* Company Name Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              {...register('companyName', {
                maxLength: { value: 100, message: 'Company name cannot exceed 100 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter company name (optional)"
              disabled={isLoading}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
            )}
          </div>

          {/* Email Address Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              {...register('phoneNumber', {
                required: 'Phone number is required',
                minLength: { value: 10, message: 'Phone number must be at least 10 characters' },
                maxLength: { value: 16, message: 'Phone number cannot exceed 16 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Apartment Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
              Apartment/Unit
            </label>
            <input
              id="apartment"
              type="text"
              {...register('apartment', {
                maxLength: { value: 50, message: 'Apartment/Unit cannot exceed 50 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.apartment ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter apartment/unit number (optional)"
              disabled={isLoading}
            />
            {errors.apartment && (
              <p className="mt-1 text-sm text-red-600">{errors.apartment.message}</p>
            )}
          </div>

          {/* Town/City Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="townCity" className="block text-sm font-medium text-gray-700 mb-1">
              Town/City <span className="text-red-500">*</span>
            </label>
            <input
              id="townCity"
              type="text"
              {...register('townCity', {
                required: 'Town/City is required',
                minLength: { value: 2, message: 'Town/City must be at least 2 characters' },
                maxLength: { value: 50, message: 'Town/City cannot exceed 50 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.townCity ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your town or city"
              disabled={isLoading}
            />
            {errors.townCity && (
              <p className="mt-1 text-sm text-red-600">{errors.townCity.message}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-3 w-full">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isEditMode ? (
              'Update Quote'
            ) : (
              'Create Quote'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarouselForm;