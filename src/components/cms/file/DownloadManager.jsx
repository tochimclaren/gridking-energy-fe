import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DownloadManager = ({ isPublic, refModel }) => {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const fetchDownloads = async (query = '') => {
        try {
            setLoading(true);
            // Build query parameters
            const params = {};
            if (isPublic !== undefined) {
                params.isPublic = isPublic;
            }
            if (refModel) {
                params.refModel = refModel;
            }
            if (query) {
                params.search = query; // Add search parameter for server-side filtering
            }

            const response = await axios.get(`${BASE_URL}/download`, { params });
            setDownloads(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load downloads. Please try again later.');
            console.error('Error fetching downloads:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDownloads();
    }, [isPublic, refModel]);

    // Handle search input with debounce
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Clear existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set new timeout to debounce the search
        const timeoutId = setTimeout(() => {
            fetchDownloads(query);
        }, 500);

        setSearchTimeout(timeoutId);
    };

    const handleDownload = (download) => {
        // Create a hidden anchor element to trigger download
        const link = document.createElement('a');
        link.href = download.fileUrl; // Assuming fileUrl is where the file is stored
        link.download = download.fileName || 'download'; // Assuming fileName exists in the download object
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto p-4">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search by title or description..."
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            ) : downloads.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    {searchQuery ? 'No matching downloads found' : 'No downloads available'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {downloads.map((download) => (
                        <div key={download._id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                            <div className="flex flex-col h-full">
                                <div className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">{download.fileName || download.title || 'Unnamed File'}</h3>
                                    {download.description && (
                                        <p className="text-sm text-gray-600 mt-1">{download.description}</p>
                                    )}
                                    {download.fileSize && (
                                        <p className="text-xs text-gray-500 mt-2">Size: {formatFileSize(download.fileSize)}</p>
                                    )}
                                    {download.refModel && (
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-2 inline-block">
                                            {download.refModel}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleDownload(download)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                            />
                                        </svg>
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export default DownloadManager;