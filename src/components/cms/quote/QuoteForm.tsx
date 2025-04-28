import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';


interface QuoteFormProps {
  quoteId?: string; // Optional - if provided, form is in edit mode
  initialData?: Quote; // Optional - if provided, prefile the form with data rather fetching from server
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
  } = useForm<Quote>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      content: ''
    }
  });

  // If in edit mode, fetch category data
  useEffect(() => {
    if (quoteId) {
      const fetchCarousel = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${BASE_URL}/quote/${quoteId}`);
          const { data } = response.data
          const { firstName, lastName, email, phone, country, state, content } = data;
          // Populate form with data
          reset({ firstName, lastName, email, phone, country, state, content });
        } catch (err) {
          console.error('Error fetching carousel:', err);
          setError('Failed to load carousel data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchCarousel();
    }
  }, [quoteId, reset]);

  // Form submission handler
  const onSubmit = async (data: Quote) => {
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
      console.error('Error saving Quote:', err);
      setError(err.response?.data?.message || 'Failed to save Quote');
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
          {/* FirstName Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName', {
                required: 'First Name name is required',
                minLength: { value: 2, message: 'First Name must be at least 2 characters' },
                maxLength: { value: 100, message: 'First Name cannot exceed 100 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Your First Name"
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>
          <div className="col-span-1 w-full">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName', {
                required: 'Last Name name is required',
                minLength: { value: 2, message: 'Last Name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Last Name cannot exceed 100 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Your Last Name"
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
          <div className="col-span-1 w-full">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Your Email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          {/* Phone Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="text"
              {...register('phone', {
                required: 'First Name name is required',
                minLength: { value: 2, message: 'Phone must be at least 2 characters' },
                maxLength: { value: 16, message: 'Phone cannot exceed 16 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Your Phone Number"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
          {/* Country Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              id="country"
              type="text"
              {...register('country', {
                required: 'Country is required',
                minLength: { value: 4, message: 'Country must be at least 4 characters' },
                maxLength: { value: 50, message: 'Country cannot exceed 50 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.country ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Your Country"
              disabled={isLoading}
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
            )}
          </div>
          {/* State Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              id="state"
              type="text"
              {...register('state', {
                required: 'State is required',
                minLength: { value: 4, message: 'State must be at least 4 characters' },
                maxLength: { value: 50, message: 'State cannot exceed 50 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.state ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Your State"
              disabled={isLoading}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>

          {/* Content Field */}
          <div className="col-span-1 md:col-span-2 w-full">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              {...register('content', {
                maxLength: { value: 500, message: 'Content cannot exceed 500 characters' }
              })}
              rows={4}
              className={`block w-full rounded-lg border ${errors.content ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter content here"
              disabled={isLoading}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Max 500 characters
            </p>
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
              'Update Category'
            ) : (
              'Create Category'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarouselForm;