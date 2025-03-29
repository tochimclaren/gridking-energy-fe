import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateCarousel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { carousel } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    wattage: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: ''
  });

  useEffect(() => {
    // If no product data was passed, redirect to products list
    if (!carousel) {
      navigate('/cms/carousels');
      return;
    }

    // Initialize form with product data
    setFormData({
      name: carousel.title || '',
      wattage: product.wattage || ''
    });
  }, [carousel, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      loading: true,
      error: '',
      success: ''
    });

    try {
      const response = await axios.put(`/carousels/${carousel._id}`, {
        name: formData.name,
        wattage: Number(formData.wattage)
      });

      setStatus({
        loading: false,
        error: '',
        success: 'product updated successfully!'
      });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: '' }));
      }, 3000);

    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || 'An error occurred while updating the product.',
        success: ''
      });
    }
  };

  const handleCancel = () => {
    navigate('/cms/carousels');
  };

  if (!carousel) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Update product</h2>
        <button
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {status.error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{status.error}</p>
        </div>
      )}

      {status.success && (
        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p>{status.success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            product Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-sky-50 transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="wattage" className="block text-sm font-medium text-gray-700">
            Wattage (W)
          </label>
          <input
            type="number"
            id="wattage"
            value={formData.wattage}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-sky-50 transition-colors"
            required
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={status.loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {status.loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : 'Update product'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCarousel;