import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface ApplianceFormProps {
  applianceId?: string;
  initialData?: Carousel;
  onSuccess?: () => void;
}

const ApplianceForm: React.FC<ApplianceFormProps> = ({ applianceId, initialData, onSuccess }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(applianceId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Appliance>({
    defaultValues: {
      name: '',
      wattage: 0,
      isSensitive: false,
    }
  });

  useEffect(() => {
    if (applianceId) {
      const fetchAppliance = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${BASE_URL}/appliance/${applianceId}`);
          const { data } = response.data;
          const { name, wattage, isSensitive } = data;
          reset({ name, wattage, isSensitive });
        } catch (err) {
          console.error('Error fetching appliance:', err);
          setError('Failed to load appliance data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchAppliance();
    }
  }, [applianceId, reset]);

  const onSubmit = async (data: Appliance) => {
    try {
      setIsLoading(true);
      setError(null);
      if (isEditMode && applianceId) {
        await axios.put(`${BASE_URL}/appliance/${applianceId}`, data);

      } else {
        await axios.post(`${BASE_URL}/appliance`, data);

        reset();
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error saving appliance:', err);
      setError(err.response?.data?.message || 'Failed to save appliance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border-gray-200 p-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
        {isEditMode ? 'Edit Appliance' : 'Create New Appliance'}
      </h2>

      {/* Error Notification */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/* ... rest of your form fields remain exactly the same ... */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-6 w-full">
          {/* Name Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Appliance Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Appliance Name is required',
                minLength: { value: 2, message: 'Appliance Name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Appliance Name cannot exceed 100 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Eg: Fridge"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Wattage Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Wattage
            </label>
            <input
              id="wattage"
              type="number"
              {...register('wattage', {
                maxLength: { value: 20, message: 'Wattage cannot exceed 500 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.wattage ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter wattage"
              disabled={isLoading}
            />
            {errors.wattage && (
              <p className="mt-1 text-sm text-red-600">{errors.wattage.message}</p>
            )}
          </div>

          {/* isSensitive Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="isSensitive" className="block text-sm font-medium text-gray-700 mb-1">
              Sensitive Appliance? <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-start mt-1">
              <div className="flex items-center h-5">
                <input
                  id="isSensitive"
                  type="checkbox"
                  {...register('isSensitive')}
                  className={`block w-full rounded-lg border ${errors.isSensitive ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  disabled={isLoading}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isSensitive" className="font-medium text-gray-700">
                  Check if appliance is sensitive to power fluctuations
                </label>
              </div>
            </div>
            {errors.isSensitive && (
              <p className="mt-1 text-sm text-red-600">{errors.isSensitive.message}</p>
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
              'Update Appliance'
            ) : (
              'Create Appliance'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplianceForm;