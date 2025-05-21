import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface Carousel {
  title: string;
  description?: string;
  buttonText?: string;
  background?: boolean;
  order?: number;
  active?: boolean;
}

interface CarouselFormProps {
  carouselId?: string; // Optional - if provided, form is in edit mode
  initialData?: Carousel; // Optional - if provided, prefile the form with data rather fetching from server
  onSuccess?: () => void; // Optional callback after successful submission
}

const CarouselForm: React.FC<CarouselFormProps> = ({ carouselId, onSuccess }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(carouselId);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Carousel>({
    defaultValues: {
      title: '',
      description: '',
      buttonText: '',
      background: true,
      order: 0,
      active: true
    }
  });

  // If in edit mode, fetch category data
  useEffect(() => {
    if (carouselId) {
      const fetchCarousel = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${BASE_URL}/carousel/${carouselId}`);
          const { title, buttonText, description, background, order, active } = response.data;
          // Populate form with data
          reset({ title, description, buttonText, background, order, active });
        } catch (err) {
          console.error('Error fetching carousel:', err);
          setError('Failed to load carousel data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchCarousel();
    }
  }, [carouselId, reset]);

  const onSubmit = async (data: Carousel) => {
    try {
      setIsLoading(true);
      setError(null);

      if (isEditMode && carouselId) {
        await axios.put(`${BASE_URL}/carousel/${carouselId}`, data);
      } else {
        await axios.post(`${BASE_URL}/carousel`, data);
        reset(); // Reset form only for new submissions (not edits)
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error saving Carousel:', err);
      setError(err.response?.data?.message || 'Failed to save Carousel');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border-gray-200 p-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
        {isEditMode ? 'Edit Carousel' : 'Create New Carousel'}
      </h2>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Title Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Carousel Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register('title', {
                required: 'Title is required',
                maxLength: { value: 255, message: 'Title cannot exceed 255 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter carousel title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Order Field */}
          <div className="col-span-1 w-full">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                Order
              </label>
            </div>
            <input
              id="order"
              type="number"
              {...register('order', {
                valueAsNumber: true,
                min: { value: 0, message: 'Order cannot be negative' }
              })}
              className={`block w-full rounded-lg border ${errors.order ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter display order"
              disabled={isLoading}
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="col-span-1 md:col-span-2 w-full">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register('description', {
                maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' }
              })}
              rows={4}
              className={`block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter carousel description (optional)"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Max 1000 characters
            </p>
          </div>

          {/* ButtonText Field */}
          <div className="col-span-1 w-full">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700">
                Button Text
              </label>
            </div>
            <input
              id="buttonText"
              type="text"
              {...register('buttonText', {
                maxLength: { value: 50, message: 'Button text cannot exceed 50 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.buttonText ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="E.g., Learn More"
              disabled={isLoading}
            />
            {errors.buttonText && (
              <p className="mt-1 text-sm text-red-600">{errors.buttonText.message}</p>
            )}
          </div>

          {/* Checkbox group for boolean values */}
          <div className="col-span-1 w-full">
            <div className="flex flex-col space-y-4">
              {/* Background Field */}
              <div className="flex items-center">
                <input
                  id="background"
                  type="checkbox"
                  {...register('background')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <label htmlFor="background" className="ml-2 block text-sm text-gray-700">
                  Show Background
                </label>
              </div>

              {/* Active Field */}
              <div className="flex items-center">
                <input
                  id="active"
                  type="checkbox"
                  {...register('active')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
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
              'Update Carousel'
            ) : (
              'Create Carousel'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarouselForm;