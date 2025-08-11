import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AlertCircle, X } from 'lucide-react';

interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
}

interface CategoryFormProps {
  categoryId?: string; // Optional - if provided, form is in edit mode
  onSuccess?: () => void; // Optional callback after successful submission
}

// Updated error interface to handle detailed validation errors
interface ValidationError {
  message: string;
  details?: string[];
}

interface Category {
  _id: string;
  name: string;
  parent?: string;
  children?: Category[];
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, onSuccess }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ValidationError | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [autoGenerateSlug, setAutoGenerateSlug] = useState<boolean>(true);

  const isEditMode = Boolean(categoryId);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parent: null,
    }
  });

  // Watch name field for slug auto-generation
  const nameValue = watch('name');

  // Fetch categories for parent selection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/category`);

        const {data}=response.data
        // Convert flat list to tree structure
        setCategories(buildCategoryTree(data));
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError({
          message: 'Failed to load categories',
          details: []
        });
      } finally {
        setIsLoading(false);
        reset()
      }
    };

    fetchCategories();
  }, []);

  // If in edit mode, fetch category data
  useEffect(() => {
    if (categoryId) {
      const fetchCategory = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${BASE_URL}/category/${categoryId}`);
          const { name, slug, description, parent } = response.data.data;          
          // Populate form with category data
          reset({ name, slug, description, parent });
          setAutoGenerateSlug(false);
        } catch (err: any) {
          console.error('Error fetching category:', err);
          const errorResponse = err.response?.data;
          
          if (errorResponse) {
            setError({
              message: errorResponse.message || 'Failed to load category data',
              details: errorResponse.details || []
            });
          } else {
            setError({
              message: 'Failed to load category data',
              details: []
            });
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategory();
    }
  }, [categoryId, reset]);

  // Generate slug from name if auto-generation is enabled
  useEffect(() => {
    if (autoGenerateSlug && nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      setValue('slug', generatedSlug);
    }
  }, [nameValue, setValue, autoGenerateSlug]);

  // Form submission handler
  const onSubmit = async (data: CategoryFormData) => {
    if (data.parent === '') {
      data.parent = null;
    }
    try {
      setIsLoading(true);
      setError(null);

      if (isEditMode && categoryId) {
        await axios.put(`${BASE_URL}/category/${categoryId}`, data);
      } else {
        await axios.post(`${BASE_URL}/category`, data);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error saving category:', err);
      
      // Enhanced error handling to capture detailed validation errors
      const errorResponse = err.response?.data;
      
      if (errorResponse) {
        setError({
          message: errorResponse.message || 'Failed to save category',
          details: errorResponse.details || []
        });
      } else {
        setError({
          message: 'An unexpected error occurred',
          details: []
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to build a tree structure from flat category list
  const buildCategoryTree = (flatCategories: Category[]): Category[] => {
    const categoriesMap: Record<string, Category> = {};
    const rootCategories: Category[] = [];

    // First pass: create map of categories by ID
    flatCategories.forEach(category => {
      categoriesMap[category._id] = { ...category, children: [] };
    });

    // Second pass: build tree structure
    flatCategories.forEach(category => {
      const currentCategory = categoriesMap[category._id];
      
      if (category.parent && categoriesMap[category.parent]) {
        // Add as child to parent
        categoriesMap[category.parent].children = categoriesMap[category.parent].children || [];
        categoriesMap[category.parent].children?.push(currentCategory);
      } else {
        // Add to root categories
        rootCategories.push(currentCategory);
      }
    });

    return rootCategories;
  };

  // Render category options recursively for select dropdown
  const renderCategoryOptions = (categories: Category[], level = 0, currentId?: string) => {
    return categories.map(category => {
      // Skip the current category if in edit mode to prevent circular reference
      if (currentId && category._id === currentId) {
        return null;
      }

      const indent = '—'.repeat(level);
      const optionElement = (
        <option key={category._id} value={category._id} disabled={category._id === currentId}>
          {level > 0 ? indent + ' ' : ''}{category.name}
        </option>
      );

      const childrenElements = category.children && category.children.length > 0
        ? renderCategoryOptions(category.children, level + 1, currentId)
        : null;

      return (
        <React.Fragment key={category._id}>
          {optionElement}
          {childrenElements}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="w-full bg-white border-gray-200 p-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-200">
        {isEditMode ? 'Edit Category' : 'Create New Category'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Name Field */}
          <div className="col-span-1 w-full">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { 
                required: 'Category name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
              })}
              className={`block w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter category name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Slug Field */}
          <div className="col-span-1 w-full">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  id="autoSlug"
                  type="checkbox"
                  checked={autoGenerateSlug}
                  onChange={() => setAutoGenerateSlug(!autoGenerateSlug)}
                  className={` ${errors.slug ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                <label htmlFor="autoSlug" className="ml-2 text-xs text-gray-600">
                  auto-generate
                </label>
              </div>
            </div>
            <input
              id="slug"
              type="text"
              {...register('slug', { 
                required: 'Slug is required',
                minLength: { value: 2, message: 'Slug must be at least 2 characters' },
                maxLength: { value: 100, message: 'Slug cannot exceed 100 characters' },
                pattern: { value: /^[a-z0-9-]+$/, message: 'Slug must be URL-friendly' }
              })}
              className={`w-full px-4 py-2 border ${errors.slug ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="url-friendly-slug"
              disabled={isLoading || autoGenerateSlug}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          {/* Parent Category Field */}
          <div className="col-span-2 w-full">
            <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            <select
              id="parent"
              {...register('parent')}
              className={`block w-full rounded-lg border ${errors.parent ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              disabled={isLoading}
            >
              <option value="">None (Top Level Category)</option>
              {renderCategoryOptions(categories, 0, categoryId)}
            </select>
            {errors.parent && (
              <p className="mt-1 text-sm text-red-600">{errors.parent.message}</p>
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
                maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
              })}
              rows={4}
              className={`block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter category description (optional)"
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

export default CategoryForm;