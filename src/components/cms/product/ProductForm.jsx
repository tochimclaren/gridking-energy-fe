import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Product status enum (imported from your models)
const Status = {
  NewArrival: 'NewArrival',
  InStock: 'InStock',
  OutOfStock: 'OutOfStock',
  Discontinued: 'Discontinued'
};

const ProductForm = ({ productId = null }) => {
  const isEditMode = !!productId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: Status.NewArrival,
    category: '',
    hotSell: false,
    attributes: []
  });

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category`);
        const { data } = response.data
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${BASE_URL}/product/${productId}`);
          setFormData(response.data);
        } catch (err) {
          setError('Failed to load product data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [productId, isEditMode]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Auto-generate slug from name
  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setFormData(prev => ({ ...prev, slug }));
  };

  // Handle attribute changes
  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...formData.attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [field]: value
    };

    setFormData(prev => ({
      ...prev,
      attributes: updatedAttributes
    }));
  };

  // Add new attribute
  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        { name: '', value: '', dataType: 'string', required: false }
      ]
    }));
  };

  // Remove attribute
  const removeAttribute = (index) => {
    const updatedAttributes = [...formData.attributes];
    updatedAttributes.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      attributes: updatedAttributes
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      let response;

      if (isEditMode) {
        response = await axios.put(`${BASE_URL}/product/${productId}`, formData);
        setSuccessMessage('Product updated successfully!');
      } else {
        response = await axios.post(`${BASE_URL}/product/`, formData);
        setSuccessMessage('Product created successfully!');

        // Reset form if creating new product
        if (!isEditMode) {
          setFormData({
            name: '',
            slug: '',
            status: Status.NewArrival,
            category: '',
            hotSell: false,
            attributes: []
          });
        }
      }

      console.log('Response:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!isEditMode || !window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/product/${productId}`);
      setSuccessMessage('Product deleted successfully!');
      // Redirect or other logic after deletion
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Render attribute input based on data type
  const renderAttributeValueInput = (attribute, index) => {
    const { dataType, value } = attribute;

    switch (dataType) {
      case 'string':
        return (
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={value || ''}
            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={value || ''}
            onChange={(e) => handleAttributeChange(index, 'value', Number(e.target.value))}
          />
        );
      case 'boolean':
        return (
          <select
            className="w-full p-2 border rounded"
            value={value === true ? 'true' : value === false ? 'false' : ''}
            onChange={(e) => handleAttributeChange(index, 'value', e.target.value === 'true')}
          >
            <option value="">Select</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={value instanceof Date ? value.toISOString().substr(0, 10) : value || ''}
            onChange={(e) => handleAttributeChange(index, 'value', new Date(e.target.value))}
          />
        );
      default:
        return (
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={value || ''}
            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
          />
        );
    }
  };

  if (loading && isEditMode && !formData.name) {
    return <div className="flex justify-center p-8">Loading product data...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Product' : 'Create New Product'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Product Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => !formData.slug && generateSlug()}
            className="w-full p-2 border rounded"
            required
            minLength={2}
            maxLength={100}
          />
          <p className="text-sm text-gray-500 mt-1">2-100 characters</p>
        </div>

        {/* Product Slug */}
        <div className="mb-4">
          <label htmlFor="slug" className="block text-gray-700 font-medium mb-2">
            Slug*
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              pattern="^[a-z0-9-]+$"
              minLength={2}
              maxLength={100}
            />
            <button
              type="button"
              onClick={generateSlug}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Generate
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens</p>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {Object.values(Status).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Category*
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hot Sell */}
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hotSell"
              name="hotSell"
              checked={formData.hotSell}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="hotSell" className="ml-2 block text-gray-700">
              Hot Selling Product
            </label>
          </div>
        </div>

        {/* Attributes Section */}
        <div className="mb-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Product Attributes</h3>
            <button
              type="button"
              onClick={addAttribute}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Attribute
            </button>
          </div>

          {formData.attributes.length === 0 ? (
            <p className="text-gray-500 italic">No attributes added yet</p>
          ) : (
            <div className="space-y-4">
              {formData.attributes.map((attribute, index) => (
                <div key={index} className="border p-4 rounded bg-gray-50">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Attribute #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Attribute Name */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Name*
                      </label>
                      <input
                        type="text"
                        value={attribute.name || ''}
                        onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>

                    {/* Data Type */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Data Type*
                      </label>
                      <select
                        value={attribute.dataType || 'string'}
                        onChange={(e) => handleAttributeChange(index, 'dataType', e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                      </select>
                    </div>

                    {/* Attribute Value */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Value*
                      </label>
                      {renderAttributeValueInput(attribute, index)}
                    </div>

                    {/* Required Flag */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={attribute.required || false}
                        onChange={(e) => handleAttributeChange(index, 'required', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`required-${index}`} className="ml-2 block text-gray-700 text-sm">
                        Required Attribute
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <div>
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 mr-4"
                disabled={loading}
              >
                Delete Product
              </button>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? 'Processing...' : isEditMode ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;