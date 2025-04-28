import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface GalleryFormProps {
  galleryId?: string;
  initialData?: Gallery; // Changed from Carousel to Gallery for consistency
  onSuccess?: () => void;
}

const CarouselForm: React.FC<GalleryFormProps> = ({ galleryId, initialData, onSuccess }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(galleryId) || Boolean(initialData);

  // React Hook Form setup with proper Gallery type
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Gallery>({
    defaultValues: {
      name: '',
      description: '',
      isPublic: false,
    }
  });

  // Populate form with initial data (either from props or API)
  useEffect(() => {
    if (initialData) {
      // If initialData is provided, use it directly
      reset(initialData);
    } else if (galleryId) {
      // Otherwise fetch from API if in edit mode
      const fetchGallery = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${BASE_URL}/gallery/${galleryId}`);
          const { data } = response.data
          const { name, description, isPublic } = data;
          reset({ name, description, isPublic });
        } catch (err) {
          console.error('Error fetching Gallery:', err);
          setError('Failed to load gallery data');
        } finally {
          setIsLoading(false);
        }
      };
      fetchGallery();
    }
  }, [galleryId, initialData, reset]);

  // Form submission handler
  const onSubmit = async (data: Gallery) => {
    try {
      setIsLoading(true);
      setError(null);

      if (isEditMode && galleryId) {
        await axios.put(`${BASE_URL}/gallery/${galleryId}`, data);
      } else {
        await axios.post(`${BASE_URL}/gallery`, data);
        reset(); // Reset form after successful creation
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error saving Gallery:', err);
      setError(err.response?.data?.message || 'Failed to save Gallery');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border-gray-200 p-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
        {isEditMode ? 'Edit Gallery' : 'Create New Gallery'}
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
              Gallery Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Gallery name is required',
                minLength: { value: 10, message: 'Gallery Name must be at least 10 characters' },
                maxLength: { value: 100, message: 'Gallery Name cannot exceed 100 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter gallery name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* isPublic Field */}
          <div className="col-span-1 w-full flex items-center">
            <div className="flex items-center h-5">
              <input
                id="isPublic"
                type="checkbox"
                {...register('isPublic')}
                className={`block w-full rounded-lg border ${errors.isPublic ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                disabled={isLoading}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isPublic" className="font-medium text-gray-700">
                Publish Gallery
              </label>
            </div>
            {errors.isPublic && (
              <p className="mt-1 text-sm text-red-600">{errors.isPublic.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="col-span-1 md:col-span-2 w-full">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              {...register('description', {
                required: 'Description is required',
                maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
              })}
              rows={4}
              className={`block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter description"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
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
              'Update Gallery'
            ) : (
              'Create Gallery'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarouselForm;