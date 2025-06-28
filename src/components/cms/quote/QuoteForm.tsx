import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';

interface LineItem {
  productId: string;
  quantity: number;
  price?: number;
}

interface FormData {
  fullName: string;
  companyName: string;
  apartment: string;
  townCity: string;
  phoneNumber: string;
  email: string;
  lineItems: LineItem[];
}

interface Product {
  _id: string;
  name: string;
  price?: number;
  // Add other product fields as needed
}

interface QuoteFormProps {
  quoteId?: string; // Optional - if provided, form is in edit mode
  initialData?: FormData; // Optional - if provided, prefill the form with data rather fetching from server
  onSuccess?: () => void; // Optional callback after successful submission
  products?: Product[]; // Optional - list of available products
}

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  quoteId, 
  initialData, 
  onSuccess, 
  products = [] 
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>(products);
  const [fetchingProducts, setFetchingProducts] = useState<boolean>(false);

  const isEditMode = Boolean(quoteId);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      companyName: '',
      apartment: '',
      townCity: '',
      phoneNumber: '',
      email: '',
      lineItems: [{ productId: '', quantity: 1, price: undefined }]
    }
  });

  // Field array for dynamic line items
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems'
  });

  // Watch for product changes to auto-fill prices
  const watchedLineItems = watch('lineItems');

  // Fetch products function
  const fetchProducts = async () => {
    if (!BASE_URL) {
      console.error('BASE_URL is not defined in environment variables');
      setError('Configuration error: BASE_URL not found');
      return;
    }

    try {
      setFetchingProducts(true);
      setError(null);
      
      const response = await axios.get(`${BASE_URL}/product/line/items`);
      
      // Handle your API response structure
      if (response.data.success && Array.isArray(response.data.data)) {
        setAvailableProducts(response.data.data);
        console.log('Products fetched successfully:', response.data.data);
      } else {
        console.error('Unexpected API response structure:', response.data);
        setError('Failed to load products: Unexpected response format');
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setFetchingProducts(false);
    }
  };

  // Fetch products if not provided as props
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    } else {
      setAvailableProducts(products);
    }
  }, [BASE_URL, products.length]);

  // If in edit mode, fetch quote data
  useEffect(() => {
    if (quoteId && !initialData) {
      const fetchQuoteData = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${BASE_URL}/quote/${quoteId}`);
          const { data } = response.data;
          const { fullName, companyName, apartment, townCity, phoneNumber, email, lineItems } = data;
          
          // Populate form with data, ensuring lineItems has at least one item
          const formLineItems = lineItems && lineItems.length > 0 
            ? lineItems.map((item: any) => ({
                productId: item.productId?._id || item.productId,
                quantity: item.quantity,
                price: item.price
              }))
            : [{ productId: '', quantity: 1, price: undefined }];

          reset({ 
            fullName, 
            companyName, 
            apartment, 
            townCity, 
            phoneNumber, 
            email,
            lineItems: formLineItems
          });
        } catch (err) {
          console.error('Error fetching quote data:', err);
          setError('Failed to load quote data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuoteData();
    } else if (initialData) {
      reset(initialData);
    }
  }, [quoteId, initialData, reset, BASE_URL]);

  // Auto-fill price when product is selected
  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = availableProducts.find(p => p._id === productId);
    if (selectedProduct && selectedProduct.price) {
      setValue(`lineItems.${index}.price`, selectedProduct.price);
    }
  };

  // Add new line item
  const addLineItem = () => {
    append({ productId: '', quantity: 1, price: undefined });
  };

  // Remove line item
  const removeLineItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Retry fetching products
  const retryFetchProducts = () => {
    fetchProducts();
  };

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Filter out empty line items
      const validLineItems = data.lineItems.filter(item => 
        item.productId && item.quantity > 0
      );

      if (validLineItems.length === 0) {
        setError('Please add at least one valid line item');
        return;
      }

      const submitData = {
        ...data,
        lineItems: validLineItems
      };

      let endpoint = `${BASE_URL}/quote`;
      let method: 'post' | 'put' = 'post';

      if (isEditMode && quoteId) {
        endpoint = `${BASE_URL}/quote/${quoteId}`;
        method = 'put';
      } else if (validLineItems.length > 0) {
        endpoint = `${BASE_URL}/quote/order`;
      }

      if (method === 'post') {
        await axios.post(endpoint, submitData);
      } else {
        await axios.put(endpoint, submitData);
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
          {error.includes('products') && (
            <button
              onClick={retryFetchProducts}
              className="mt-2 text-sm underline hover:no-underline"
              disabled={fetchingProducts}
            >
              {fetchingProducts ? 'Retrying...' : 'Retry fetching products'}
            </button>
          )}
        </div>
      )}

      {fetchingProducts && (
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
          <p className="font-medium">Loading products...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/* Customer Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h3>
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
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                {...register('companyName', {
                  required: 'Company name is required',
                  minLength: { value: 2, message: 'Company name must be at least 2 characters' },
                  maxLength: { value: 100, message: 'Company name cannot exceed 100 characters' }
                })}
                className={`block w-full rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter company name"
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
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: 'Please provide a valid phone number'
                  }
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
        </div>

        {/* Line Items Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Line Items</h3>
            <button
              type="button"
              onClick={addLineItem}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            >
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Product Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register(`lineItems.${index}.productId`, {
                        required: 'Product is required'
                      })}
                      className={`block w-full rounded-lg border ${errors.lineItems?.[index]?.productId ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      disabled={isLoading || fetchingProducts}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                    >
                      <option value="">
                        {fetchingProducts ? 'Loading products...' : 'Select a product'}
                      </option>
                      {availableProducts.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    {errors.lineItems?.[index]?.productId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lineItems[index]?.productId?.message}
                      </p>
                    )}
                    {availableProducts.length === 0 && !fetchingProducts && (
                      <p className="mt-1 text-sm text-orange-600">
                        No products available. 
                        <button
                          type="button"
                          onClick={retryFetchProducts}
                          className="ml-1 underline hover:no-underline"
                        >
                          Retry loading
                        </button>
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register(`lineItems.${index}.quantity`, {
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Quantity must be at least 1' },
                        valueAsNumber: true
                      })}
                      className={`block w-full rounded-lg border ${errors.lineItems?.[index]?.quantity ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="1"
                      disabled={isLoading}
                    />
                    {errors.lineItems?.[index]?.quantity && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lineItems[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  {/* Price (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register(`lineItems.${index}.price`, {
                        min: { value: 0, message: 'Price cannot be negative' },
                        valueAsNumber: true
                      })}
                      className={`block w-full rounded-lg border ${errors.lineItems?.[index]?.price ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="0.00"
                      disabled={isLoading}
                    />
                    {errors.lineItems?.[index]?.price && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lineItems[index]?.price?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

export default QuoteForm;