import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface EnquiryFormProps {
  enquiryId?: string; // Optional - if provided, form is in edit mode
  initialData?: Enquiry; // Optional - if provided, prefill the form with data rather fetching from server
  onSuccess?: () => void; // Optional callback after successful submission
}

const EnquiryForm: React.FC<EnquiryFormProps> = ({ enquiryId, initialData, onSuccess }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(enquiryId);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Enquiry>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      interest: '',
      location: '',
      description: '',
      status: 'new',
      priority: 'medium'
    }
  });

  // If in edit mode, fetch enquiry data
  useEffect(() => {
    if (initialData) {
      // Use initial data if provided
      reset(initialData);
    } else if (enquiryId) {
      const fetchEnquiry = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${BASE_URL}/enquiry/${enquiryId}`);
          const {data} = response.data
          reset(data);
        } catch (err) {
          console.error('Error fetching enquiry:', err);
          setError('Failed to load enquiry data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchEnquiry();
    }
  }, [enquiryId, initialData, reset]);

  // Form submission handler
  const onSubmit = async (data: Enquiry) => {
    try {
      setIsLoading(true);
      setError(null);

      if (isEditMode && enquiryId) {
        await axios.put(`${BASE_URL}/enquiry/${enquiryId}`, data);
      } else {
        await axios.post(`${BASE_URL}/enquiry`, data);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error saving enquiry:', err);
      setError(err.response?.data?.message || 'Failed to save enquiry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border-gray-200 p-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
        {isEditMode ? 'Edit Enquiry' : 'Create New Enquiry'}
      </h2>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Name Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Your Name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
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
                required: 'Phone number is required',
                minLength: { value: 5, message: 'Phone must be at least 5 characters' },
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

          {/* Interest Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
              Interest <span className="text-red-500">*</span>
            </label>
            <input
              id="interest"
              type="text"
              {...register('interest', {
                required: 'Interest is required',
                minLength: { value: 2, message: 'Interest must be at least 2 characters' },
                maxLength: { value: 150, message: 'Interest cannot exceed 150 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.interest ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Your Interest"
              disabled={isLoading}
            />
            {errors.interest && (
              <p className="mt-1 text-sm text-red-600">{errors.interest.message}</p>
            )}
          </div>

          {/* Location Field */}
          <div className="col-span-1 md:col-span-2 w-full">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              {...register('location', {
                required: 'Location is required',
                minLength: { value: 2, message: 'Location must be at least 2 characters' },
                maxLength: { value: 100, message: 'Location cannot exceed 100 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.location ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Your Location"
              disabled={isLoading}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Status Field - Only visible in edit mode */}
          {isEditMode && (
            <div className="col-span-1 w-full">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                {...register('status')}
                className={`block w-full rounded-lg border ${errors.status ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                disabled={isLoading}
              >
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          {/* Priority Field - Only visible in edit mode */}
          {isEditMode && (
            <div className="col-span-1 w-full">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                {...register('priority')}
                className={`block w-full rounded-lg border ${errors.priority ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                disabled={isLoading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          )}

          {/* Description Field */}
          <div className="col-span-1 md:col-span-2 w-full">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' },
                maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' }
              })}
              rows={4}
              className={`block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your description here"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Max 1000 characters
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
              'Update Enquiry'
            ) : (
              'Submit Enquiry'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnquiryForm;