import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Function to generate slug from the category name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, ''); // Remove any non-word characters
};

const CategoryForm = () => {
  const [categoryData, setCategoryData] = useState({
    name: '',
    slug: '',
    description: '',
    parent: null,
    isParent: false, // Determines if parent selection is needed
  });

  const [parentCategories, setParentCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch parent categories from the API
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category?roots=true`);
        const { data } = response.data
        setParentCategories(data);
      } catch (error) {
        console.error("Error fetching parent categories", error);
      }
    };
    fetchParentCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Automatically generate slug when category name is changed
    if (name === 'name') {
      const generatedSlug = generateSlug(value);
      setCategoryData((prevData) => ({
        ...prevData,
        [name]: value,
        slug: generatedSlug, // Set the generated slug automatically
      }));
    } else {
      setCategoryData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleParentChange = (e) => {
    const parentId = e.target.value;
    setCategoryData((prevData) => ({
      ...prevData,
      parent: parentId ? parentId : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Create category with ancestors dynamically
      const { isParent, ...payload } = categoryData; // remove isParent before sending
      console.log(isParent)
      await axios.post(`${BASE_URL}/category`, payload);
      alert('Category created successfully!');
      setCategoryData({
        name: '',
        slug: '',
        description: '',
        parent: null,
        isParent: false
      });
    } catch (error) {
      setErrorMessage('Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Create Category</h2>
      <p>{console.log(categoryData)}</p>
      <p>{console.log(parentCategories)}</p>

      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Category Slug */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="slug">
            Category Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={categoryData.slug}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Category Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={categoryData.description}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Parent Category Selection (Shown only if NOT a parent category) */}
        {!categoryData.isParent && parentCategories.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="parent">
              Parent Category
            </label>
            <select
              id="parent"
              name="parent"
              value={categoryData.parent || ''}
              onChange={handleParentChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">Select a Parent Category</option>
              {parentCategories.map((parent) => (
                <option key={parent._id} value={parent._id}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>
        )}


        {/* Checkbox to set as Parent */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isParent"
            checked={categoryData.isParent}
            onChange={(e) =>
              setCategoryData((prevData) => ({
                ...prevData,
                isParent: e.target.checked,
              }))
            }
            className="mr-2"
          />
          <label htmlFor="isParent" className="text-sm font-medium text-gray-700">
            Is this a Parent Category?
          </label>
        </div>

        {/* Error message */}
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 bg-blue-600 text-white rounded-md ${isSubmitting ? 'opacity-50' : ''}`}
          >
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
