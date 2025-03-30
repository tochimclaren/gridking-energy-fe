import React, { useState, useEffect } from 'react';

const DeleteImage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState({ success: false, message: null });

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/images');
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setImages(data);
                setError(null);
            } catch (err) {
                setError('Failed to load images. Please try again later.');
                console.error('Error fetching images:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const toggleImageSelection = (imageId) => {
        setSelectedImages(prev =>
            prev.includes(imageId)
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
        );
    };

    const selectAll = () => {
        if (selectedImages.length === images.length) {
            setSelectedImages([]);
        } else {
            setSelectedImages(images.map(img => img.id));
        }
    };

    const handleDelete = async () => {
        if (selectedImages.length === 0) return;

        setIsDeleting(true);
        setDeleteStatus({ success: false, message: null });

        try {
            // Make API call to delete selected images
            const response = await fetch('/api/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: selectedImages }),
            });

            if (!response.ok) {
                throw new Error(`Delete failed: ${response.status}`);
            }

            // Update local state to remove deleted images
            setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
            setDeleteStatus({
                success: true,
                message: `Successfully deleted ${selectedImages.length} image${selectedImages.length !== 1 ? 's' : ''}.`
            });

            setSelectedImages([]);
            setConfirmDelete(false);
        } catch (error) {
            console.error("Delete failed:", error);
            setDeleteStatus({
                success: false,
                message: "Failed to delete images. Please try again."
            });
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4 text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="h-48 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="bg-red-50 p-4 rounded-md text-red-600 border border-red-200">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Manage Images</h2>

            {deleteStatus.message && (
                <div className={`mb-4 p-3 rounded-md ${deleteStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {deleteStatus.message}
                </div>
            )}

            {images.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No images to display</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={selectAll}
                            className="text-sm text-blue-500 hover:text-blue-700"
                        >
                            {selectedImages.length === images.length ? 'Deselect All' : 'Select All'}
                        </button>

                        {selectedImages.length > 0 && (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                                Delete Selected ({selectedImages.length})
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className={`relative border rounded-lg overflow-hidden ${selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : ''
                                    }`}
                            >
                                <div className="absolute top-2 left-2 z-10">
                                    <input
                                        type="checkbox"
                                        id={`img-${image.id}`}
                                        checked={selectedImages.includes(image.id)}
                                        onChange={() => toggleImageSelection(image.id)}
                                        className="h-4 w-4"
                                    />
                                </div>
                                <img
                                    src={image.url || "/api/placeholder/400/300"}
                                    alt={image.alt || "Image"}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-2 bg-white">
                                    <p className="truncate text-sm font-medium">{image.title || "Untitled"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
                        <p className="mb-4">Are you sure you want to delete {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''}? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className={`px-4 py-2 rounded-md text-white ${isDeleting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                                    }`}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteImage;