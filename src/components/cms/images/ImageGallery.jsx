import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageGallery = ({ refModel, refId }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const endpoint = `${BASE_URL}/image`

   
    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${endpoint}/${refModel}/${refId}`)
                console.log(response)
                const { data } = response
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

    const openImage = (image) => {
        setSelectedImage(image);
    };

    const closeImage = () => {
        setSelectedImage(null);
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
            <h2 className="text-xl font-semibold mb-4">Image Gallery</h2>

            {images.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No images to display</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div
                            key={image._id}
                            className="relative group cursor-pointer border rounded-lg overflow-hidden"
                            onClick={() => openImage(image)}
                        >
                            <img
                                src={image.url || "/api/placeholder/400/300"}
                                alt={image.alt || `Image`}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {image.title || `Untitled Image`}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for enlarged image view */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeImage}>
                    <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImage.url || "/api/placeholder/800/600"}
                            alt={selectedImage.alt || "Enlarged image"}
                            className="max-w-full max-h-90vh object-contain"
                        />
                        <div className="bg-white p-4 text-center">
                            <h3 className="font-semibold">{selectedImage.title || "Image"}</h3>
                            {selectedImage.description && <p className="text-gray-600">{selectedImage.description}</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;