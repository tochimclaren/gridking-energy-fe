import React, { useState } from 'react';
import axios from 'axios';

const CategoryForm = ({ title, endpoint }) => {
    const [formData, setFormData] = useState({
        name: '',
        wattage: ''
    });
    const [status, setStatus] = useState({
        message: '',
        type: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ message: '', type: '' });

        try {
            const response = await axios.post(endpoint, {
                name: formData.name,
                wattage: Number(formData.wattage)
            });

            console.log(response)

            setStatus({
                message: 'Appliance added successfully!',
                type: 'success'
            });

            // Clear form after successful submission
            setFormData({ name: '', wattage: '' });

        } catch (error) {
            setStatus({
                message: error.response?.data?.message || 'An error occurred while adding the appliance.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Appliance Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-sky-50 transition-colors"
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
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-sky-50 transition-colors"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </span>
                    ) : 'Submit'}
                </button>
            </form>

            {status.message && (
                <div
                    className={`mt-6 p-4 rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default CategoryForm;