// src/components/auth/UserUpdateForm.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserCog, Mail, Check, AlertCircle, UserCheck, Shield, CheckCheck } from 'lucide-react';


type UserUpdateFormProps = {
  user: {
    _id: string;
    email: string;
    admin: boolean;
    staff: boolean;
    active: boolean;
  };
  onUpdateUser: (userId: string, data: User) => Promise<void>;
};

const UserUpdateForm = ({ user, onUpdateUser }: UserUpdateFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<User>({
    defaultValues: {
      email: user.email,
      admin: user.admin,
      staff: user.staff,
      active: user.active
    }
  });

  const watchAdmin = watch('admin');
  const watchStaff = watch('staff');
  const watchActive = watch('active');

  useEffect(() => {
    reset({
      email: user.email,
      admin: user.admin,
      staff: user.staff,
      active: user.active
    });
  }, [user, reset]);

  const onSubmit = async (data: User) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      await onUpdateUser(user._id, data);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <UserCog className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Update User</h2>
            <p className="text-blue-100 text-sm">Modify user details and permissions</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start text-red-700">
            <AlertCircle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start text-green-700">
            <Check size={18} className="mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="user@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please enter a valid email address',
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Permissions Section */}
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">User Permissions</h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              {/* Admin Permission */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-gray-700 text-sm" htmlFor="admin">
                  <Shield size={18} className="text-indigo-500 mr-2.5" />
                  <div>
                    <span className="font-medium">Administrator</span>
                    <p className="text-xs text-gray-500 mt-0.5">Full system access and control</p>
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="admin"
                    type="checkbox"
                    className="sr-only"
                    {...register('admin')}
                  />
                  <div
                    onClick={() => document.getElementById('admin')?.click()}
                    className={`block w-10 h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${watchAdmin ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${watchAdmin ? 'transform translate-x-4' : ''}`}
                  ></div>
                </div>
              </div>

              {/* Staff Permission */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center text-gray-700 text-sm" htmlFor="staff">
                  <UserCheck size={18} className="text-indigo-500 mr-2.5" />
                  <div>
                    <span className="font-medium">Staff Member</span>
                    <p className="text-xs text-gray-500 mt-0.5">Access to staff features</p>
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="staff"
                    type="checkbox"
                    className="sr-only"
                    {...register('staff')}
                  />
                  <div
                    onClick={() => document.getElementById('staff')?.click()}
                    className={`block w-10 h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${watchStaff ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${watchStaff ? 'transform translate-x-4' : ''}`}
                  ></div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center text-gray-700 text-sm" htmlFor="active">
                  <CheckCheck size={18} className="text-indigo-500 mr-2.5" />
                  <div>
                    <span className="font-medium">Active Account</span>
                    <p className="text-xs text-gray-500 mt-0.5">User can access the system</p>
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="active"
                    type="checkbox"
                    className="sr-only"
                    {...register('active')}
                  />
                  <div
                    onClick={() => document.getElementById('active')?.click()}
                    className={`block w-10 h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${watchActive ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${watchActive ? 'transform translate-x-4' : ''}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !isDirty}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <UserCog size={18} className="mr-2" />
              )}
              {isLoading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateForm;