import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Plus, Trash2, Check, X } from 'lucide-react';

enum Status {
  NewArrival = 'NEW_ARRIVAL',
  OnSale = 'ON_SALE',
  OutOfStock = 'OUT_OF_STOCK',
  Featured = 'FEATURED',
  ComingSoon = 'COMING_SOON'
}

interface IProductAttribute {
  name: string;
  value: any;
  dataType: 'string' | 'number' | 'boolean' | 'date';
  required: boolean;
}

interface CategoryAncestor {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryInProduct {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
  ancestors?: CategoryAncestor[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface IProduct {
  _id?: string;
  id:string;
  images?:string[]
  name: string;
  slug: string;
  status: Status;
  category: string | CategoryInProduct;
  hotSell: boolean;
  createdAt?: Date;
  attributes: IProductAttribute[];
  updatedAt?: Date;
}

interface Category {
  _id: string;
  name: string;
  children: Category[];
}

interface ProductFormProps {
  initialData?: IProduct;
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IProduct>({
    defaultValues: {
      name: '',
      slug: '',
      status: Status.NewArrival,
      category: '',
      hotSell: false,
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });

  const statusOptions = Object.values(Status);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category`);
        setCategories(response.data.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      const formData = {
        ...initialData,
        category: typeof initialData.category === 'object' 
          ? initialData.category._id 
          : initialData.category,
        attributes: initialData.attributes || []
      };
      reset(formData);

      if (typeof initialData.category === 'object' && initialData.category.ancestors) {
        const expanded: Record<string, boolean> = {};
        initialData.category.ancestors.forEach((ancestor: CategoryAncestor) => {
          expanded[ancestor._id] = true;
        });
        setExpandedCategories(expanded);
      }
    }
  }, [initialData, reset]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    setValue('slug', generateSlug(name));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const onSubmit = async (data: IProduct) => {
    setLoading(true);
    setError(null);
    const { id, _id, images, createdAt, updatedAt, ...cleanData } = data;

    console.log(data)

    try {
      if (initialData?._id) {
        await axios.put(`${BASE_URL}/product/${initialData._id}`, cleanData);
      } else {
        await axios.post(`${BASE_URL}/product`, cleanData);
      }

      if (onSuccess) {
        reset()
        onSuccess();
      } else {
        navigate('/cms/products');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error saving product', err);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map((category) => {
      const isSelected = watch('category') === category._id;
      const hasChildren = category.children.length > 0;
      const isExpanded = expandedCategories[category._id];
      
      return (
        <React.Fragment key={category._id}>
          <div 
            className={`flex items-center py-2 px-4 ${level > 0 ? 'pl-8' : ''} 
              hover:bg-gray-50 cursor-pointer rounded-md transition-colors
              ${isSelected ? 'bg-blue-50 border border-blue-200' : ''}`}
            onClick={() => setValue('category', category._id)}
          >
            {hasChildren && (
              <button 
                type="button" 
                className="mr-2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category._id);
                }}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            {!hasChildren && <span className="w-6"></span>}
            <span className={`flex-1 ${isSelected ? 'font-semibold text-blue-700' : 'text-gray-800'}`}>
              {category.name}
            </span>
            {isSelected && <Check size={16} className="text-blue-600" />}
          </div>
          {isExpanded && hasChildren && (
            <div className="ml-4 border-l border-gray-200">
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  const addAttribute = () => {
    append({
      name: '',
      value: '',
      dataType: 'string',
      required: false,
    });
  };

  const getInputType = (dataType: string) => {
    switch (dataType) {
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      case 'boolean':
        return 'checkbox';
      default:
        return 'text';
    }
  };

  return (
    <div className="w-full p-5 bg-white border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 pb-2 border-b border-gray-200">
        {initialData ? 'Edit Product' : 'Create New Product'}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
          <div className="flex-1">
            <h3 className="font-medium">Error</h3>
            <p>{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X size={18} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Product Name*</label>
              <input
                {...register('name', { required: 'Product name is required' })}
                type="text"
                className={`block w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                onChange={handleNameChange}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Slug*</label>
              <input
                {...register('slug', { required: 'Slug is required' })}
                type="text"
                className={`block w-full rounded-lg border ${errors.slug ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="product-slug"
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status*</label>
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`block w-full rounded-lg border ${errors.status ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Category & Options</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Category*</label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto bg-gray-50">
                {categories.length > 0 ? (
                  renderCategoryTree(categories)
                ) : (
                  <p className="text-gray-500 text-center py-4">Loading categories...</p>
                )}
              </div>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">Please select a category</p>
              )}
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  {...register('hotSell')}
                  id="hotSell"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="hotSell" className="ml-3 text-sm text-gray-700 font-medium">
                  Mark as Hot Sell
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Hot sell products will be highlighted in the store
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Attributes</h3>
            <button
              type="button"
              onClick={addAttribute}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              Add Attribute
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No attributes added yet</p>
              <button
                type="button"
                onClick={addAttribute}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
              >
                <Plus size={14} className="mr-1" />
                Add your first attribute
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="lg:col-span-4 space-y-1">
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">Name*</label>
                    <input
                      {...register(`attributes.${index}.name`, { required: true })}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Color, Size"
                    />
                  </div>

                  <div className="lg:col-span-2 space-y-1">
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">Type*</label>
                    <select
                      {...register(`attributes.${index}.dataType`, { required: true })}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                    </select>
                  </div>

                  <div className="lg:col-span-4 space-y-1">
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">Value*</label>
                    <Controller
                      name={`attributes.${index}.value`}
                      control={control}
                      render={({ field }) => {
                        const type = watch(`attributes.${index}.dataType`);
                        return (
                          <input
                            {...field}
                            type={getInputType(type)}
                            className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
                              type === 'boolean' ? 'w-5 h-5 mt-2' : ''
                            }`}
                            checked={type === 'boolean' ? field.value === 'true' : undefined}
                            onChange={(e) => {
                              if (type === 'boolean') {
                                field.onChange(e.target.checked ? 'true' : 'false');
                              } else {
                                field.onChange(e.target.value);
                              }
                            }}
                          />
                        );
                      }}
                    />
                  </div>

                  <div className="lg:col-span-2 flex items-end space-x-4">
                    <div className="flex items-center h-full">
                      <input
                        type="checkbox"
                        {...register(`attributes.${index}.required`)}
                        id={`required-${index}`}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`required-${index}`} className="ml-2 text-sm text-gray-700">
                        Required
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Remove attribute"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm