import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};

    const [status, setStatus] = useState({
        loading: false,
        error: '',
    });

    useEffect(() => {
        // If no product data was passed, redirect to products list
        if (!product) {
            navigate('/cms/products');
        }
    }, [product, navigate]);

    const handleDelete = async () => {
        setStatus({
            loading: true,
            error: '',
        });

        try {
            await axios.delete(`/product/${product._id}`);

            // Show brief success message then redirect
            setTimeout(() => {
                navigate('/cms/product', {
                    state: { message: `${product.name} has been deleted successfully.` }
                });
            }, 500);

        } catch (error) {
            setStatus({
                loading: false,
                error: error.response?.data?.message || 'An error occurred while deleting the product.',
            });
        }
    };

    const handleCancel = () => {
        navigate('/cms/products');
    };

    if (!product) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center">
                <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">Delete product</h3>

                <div className="mt-4 mb-6">
                    <p className="text-gray-600">
                        Are you sure you want to delete <span className="font-semibold text-gray-800">"{product.name}"</span>?
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        This action cannot be undone. This will permanently delete the product from the database.
                    </p>
                </div>

                {status.error && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 text-left">
                        <p>{status.error}</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={status.loading}
                        className="inline-flex justify-center items-center w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                    >
                        {status.loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </span>
                        ) : 'Delete product'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex justify-center w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProduct;