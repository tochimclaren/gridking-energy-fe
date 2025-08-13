import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AlertCircle, X } from 'lucide-react';

interface Appliance {
  name: string;
  wattage: number;
  isSensitive: boolean;
  isMotorLoad: boolean;
  surgeFactor: number;
  dailyHours: number | null;
  applianceType: 'lighting' | 'HVAC' | 'electronics' | 'motor' | 'other';
  voltage: '12V' | '24V' | '48V' | 'AC';
}

interface ApplianceFormProps {
  applianceId?: string;
  initialData?: Appliance;
  onSuccess?: () => void;
}

interface ValidationError {
  message: string;
  details?: string[];
}

const ApplianceForm: React.FC<ApplianceFormProps> = ({ applianceId, initialData, onSuccess }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ValidationError | null>(null);

  const isEditMode = Boolean(applianceId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Appliance>({
    defaultValues: {
      name: '',
      wattage: 0,
      isSensitive: false,
      isMotorLoad: false,
      surgeFactor: 1,
      dailyHours: null,
      applianceType: 'other',
      voltage: 'AC',
    }
  });

  const isMotorLoad = watch('isMotorLoad');

  useEffect(() => {
    if (applianceId) {
      const fetchAppliance = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await axios.get(`${BASE_URL}/appliance/${applianceId}`);
          const { data } = response.data;
          const { 
            name, 
            wattage, 
            isSensitive, 
            isMotorLoad, 
            surgeFactor, 
            dailyHours, 
            applianceType, 
            voltage 
          } = data;
          reset({ 
            name, 
            wattage, 
            isSensitive, 
            isMotorLoad, 
            surgeFactor, 
            dailyHours, 
            applianceType, 
            voltage 
          });
        } catch (err: any) {
          console.error('Error fetching appliance:', err);
          const errorResponse = err.response?.data;
          if (errorResponse) {
            setError({
              message: errorResponse.message || 'Failed to load appliance data',
              details: errorResponse.details || []
            });
          } else {
            setError({
              message: 'Failed to load appliance data',
              details: []
            });
          }
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
      const errorResponse = err.response?.data;
      
      if (errorResponse) {
        setError({
          message: errorResponse.message || 'Failed to save appliance',
          details: errorResponse.details || []
        });
      } else {
        setError({
          message: 'An unexpected error occurred while saving the appliance',
          details: []
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border-gray-200 p-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
        {isEditMode ? 'Edit Appliance' : 'Create New Appliance'}
      </h2>

      {/* Enhanced error display with detailed validation messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <div className="flex items-start">
            <AlertCircle size={20} className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-red-800">{error.message}</h3>
              {error.details && error.details.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-red-700 font-medium mb-2">Details:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {error.details.map((detail, index) => (
                      <li key={index} className="text-sm text-red-600">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button 
              onClick={() => setError(null)} 
              className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
                maxLength: { value: 250, message: 'Appliance Name cannot exceed 250 characters' }
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
            <label htmlFor="wattage" className="block text-sm font-medium text-gray-700 mb-1">
              Wattage <span className="text-red-500">*</span>
            </label>
            <input
              id="wattage"
              type="number"
              {...register('wattage', {
                required: 'Wattage is required',
                min: { value: 0, message: 'Wattage must be at least 0' },
                valueAsNumber: true
              })}
              className={`block w-full rounded-lg border ${errors.wattage ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter wattage (W)"
              disabled={isLoading}
            />
            {errors.wattage && (
              <p className="mt-1 text-sm text-red-600">{errors.wattage.message}</p>
            )}
          </div>

          {/* Appliance Type Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="applianceType" className="block text-sm font-medium text-gray-700 mb-1">
              Appliance Type
            </label>
            <select
              id="applianceType"
              {...register('applianceType')}
              className={`block w-full rounded-lg border ${errors.applianceType ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              disabled={isLoading}
            >
              <option value="other">Other</option>
              <option value="lighting">Lighting</option>
              <option value="HVAC">HVAC</option>
              <option value="electronics">Electronics</option>
              <option value="motor">Motor</option>
            </select>
            {errors.applianceType && (
              <p className="mt-1 text-sm text-red-600">{errors.applianceType.message}</p>
            )}
          </div>

          {/* Voltage Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="voltage" className="block text-sm font-medium text-gray-700 mb-1">
              Voltage
            </label>
            <select
              id="voltage"
              {...register('voltage')}
              className={`block w-full rounded-lg border ${errors.voltage ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              disabled={isLoading}
            >
              <option value="AC">AC (Mains)</option>
              <option value="12V">12V DC</option>
              <option value="24V">24V DC</option>
              <option value="48V">48V DC</option>
            </select>
            {errors.voltage && (
              <p className="mt-1 text-sm text-red-600">{errors.voltage.message}</p>
            )}
          </div>

          {/* Daily Hours Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="dailyHours" className="block text-sm font-medium text-gray-700 mb-1">
              Daily Usage Hours
            </label>
            <input
              id="dailyHours"
              type="number"
              step="0.1"
              {...register('dailyHours', {
                min: { value: 0, message: 'Daily hours must be at least 0' },
                max: { value: 24, message: 'Daily hours cannot exceed 24' },
                valueAsNumber: true
              })}
              className={`block w-full rounded-lg border ${errors.dailyHours ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Hours per day (optional)"
              disabled={isLoading}
            />
            {errors.dailyHours && (
              <p className="mt-1 text-sm text-red-600">{errors.dailyHours.message}</p>
            )}
          </div>

          {/* Surge Factor Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="surgeFactor" className="block text-sm font-medium text-gray-700 mb-1">
              Surge Factor {isMotorLoad && <span className="text-red-500">*</span>}
            </label>
            <input
              id="surgeFactor"
              type="number"
              step="0.1"
              {...register('surgeFactor', {
                required: isMotorLoad ? 'Surge factor is required for motor loads' : false,
                min: { value: 1, message: 'Surge factor must be at least 1' },
                max: { value: 10, message: 'Surge factor cannot exceed 10' },
                valueAsNumber: true
              })}
              className={`block w-full rounded-lg border ${errors.surgeFactor ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="1.0 - 10.0"
              disabled={isLoading}
            />
            {errors.surgeFactor && (
              <p className="mt-1 text-sm text-red-600">{errors.surgeFactor.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Factor to account for startup current surge (1 = no surge)
            </p>
          </div>
        </div>

        {/* Checkbox Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full">
          {/* isSensitive Field */}
          <div className="col-span-1 w-full">
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isSensitive"
                  type="checkbox"
                  {...register('isSensitive')}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  disabled={isLoading}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isSensitive" className="font-medium text-gray-700">
                  Sensitive to power fluctuations
                </label>
                <p className="text-gray-500">Check if appliance requires stable power supply</p>
              </div>
            </div>
            {errors.isSensitive && (
              <p className="mt-1 text-sm text-red-600">{errors.isSensitive.message}</p>
            )}
          </div>

          {/* isMotorLoad Field */}
          <div className="col-span-1 w-full">
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isMotorLoad"
                  type="checkbox"
                  {...register('isMotorLoad')}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  disabled={isLoading}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isMotorLoad" className="font-medium text-gray-700">
                  Motor load appliance
                </label>
                <p className="text-gray-500">Check if appliance has a motor (requires surge factor)</p>
              </div>
            </div>
            {errors.isMotorLoad && (
              <p className="mt-1 text-sm text-red-600">{errors.isMotorLoad.message}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3 w-full">
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