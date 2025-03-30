import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteCarousel = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const endpoint = `${BASE_URL}/carousel`
  const location = useLocation();
  const navigate = useNavigate();
  const carouselData = location.state?.carousel;
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if no data was passed
  if (!carouselData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">No Carousel Data</h1>
          <p className="text-gray-600 mb-6">
            No carousel data was provided. Please select a carousel to delete.
          </p>
          <button
            onClick={() => navigate('/cms/carousels')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Carousels
          </button>
        </div>
      </div>
    );
  }
  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    
    try {
      await axios.delete(`${endpoint}/${carouselData._id}`);
      navigate('/cms/carousels', { 
        state: { 
          message: `Carousel "${carouselData.title}" was successfully deleted.`,
          type: 'success'
        }
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete carousel. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/cms/carousels');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Delete Carousel</h2>
            
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete the carousel <span className="font-semibold">"{carouselData.title}"</span>? This action cannot be undone.
            </p>
            
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-800 rounded">
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleCancel}
                className="w-1/2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-1/2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-300"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">
                This will permanently delete the carousel and all associated data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCarousel;