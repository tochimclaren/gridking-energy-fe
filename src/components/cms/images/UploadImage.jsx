import React, { useState } from 'react';
import axios from 'axios';

const UploadImage = ({refModel, refId}) => {
    const [dragging, setDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const endpoint = `${BASE_URL}/image`

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        const newFiles = Array.from(e.dataTransfer.files);
        handleFiles(newFiles);
    };

    const handleFileSelect = (e) => {
        const newFiles = Array.from(e.target.files);
        handleFiles(newFiles);
    };

    const handleFiles = (newFiles) => {
        // Filter for image files only
        const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length !== newFiles.length) {
            setError("Only image files are allowed");
            setTimeout(() => setError(null), 3000);
        }

        // Check file size limit (5MB)
        const validFiles = imageFiles.filter(file => file.size <= 5 * 1024 * 1024);
        if (validFiles.length !== imageFiles.length) {
            setError("Some files exceed the 5MB size limit");
            setTimeout(() => setError(null), 3000);
        }

        setFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFile = async (file, index) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', file.name);

        try {
            const response = await axios.post(endpoint, formData)
            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            console.error(`Error uploading file ${index}:`, err);
            throw err;
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setError(null);
        setSuccess(false);

        // Initialize progress tracking for each file
        const initialProgress = {};
        files.forEach((_, index) => {
            initialProgress[index] = 0;
        });
        setUploadProgress(initialProgress);

        try {
            // Upload files one by one
            const uploadPromises = files.map((file, index) => {
                // Simulate progress updates
                const updateProgress = () => {
                    setUploadProgress(prev => {
                        if (prev[index] < 90) {
                            return { ...prev, [index]: prev[index] + 10 };
                        }
                        return prev;
                    });
                };

                const progressInterval = setInterval(updateProgress, 300);

                return uploadFile(file, index)
                    .then(result => {
                        clearInterval(progressInterval);
                        setUploadProgress(prev => ({ ...prev, [index]: 100 }));
                        return result;
                    })
                    .catch(err => {
                        clearInterval(progressInterval);
                        throw err;
                    });
            });

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);

            setSuccess(true);
            setFiles([]);
        } catch (err) {
            setError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Upload Images</h2>

            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    Images uploaded successfully!
                </div>
            )}

            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="mb-2">Drag and drop images here, or</p>
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                />
                <label
                    htmlFor="fileInput"
                    className="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Browse Files
                </label>
                <p className="mt-2 text-xs text-gray-500">Max file size: 5MB</p>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {files.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-medium mb-2">Selected Files ({files.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto p-2">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <div className="flex items-center flex-grow mr-3">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="h-12 w-12 object-cover rounded mr-3"
                                    />
                                    <div className="truncate max-w-xs flex-grow">
                                        <p className="truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>

                                        {uploading && (
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${uploadProgress[index] || 0}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {!uploading && (
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 text-right">
                        <button
                            onClick={handleUpload}
                            disabled={uploading || files.length === 0}
                            className={`px-4 py-2 rounded-md transition-colors ${uploading || files.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                        >
                            {uploading ? 'Uploading...' : 'Upload Files'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadImage;