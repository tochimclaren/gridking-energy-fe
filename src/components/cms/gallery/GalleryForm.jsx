import React, { useState } from 'react';
import axios from 'axios';

const GalleryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await axios.post(`${BASE_URL}/gallery`, formData);
      alert('Gallery created successfully!');
      setFormData({
        name: '',
        description: '',
        isPublic: false
      });
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to create gallery. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Create Gallery</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">Gallery Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            maxLength={100}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            maxLength={500}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* isPublic */}
        <div className="mb-4 flex items-center">
          <input
            id="isPublic"
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700" htmlFor="isPublic">Make Public</label>
        </div>

        {/* Error message */}
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-2 bg-blue-600 text-white rounded-md ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Gallery'}
        </button>
      </form>
    </div>
  );
};

export default GalleryForm;
