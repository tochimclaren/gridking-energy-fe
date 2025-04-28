import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Image as ImageIcon, Grid, List, Search, ChevronDown,
  X, Loader2, Star, Trash2, Download, AlertCircle,
  ArrowLeft, ArrowRight, Image as ImagePreview
} from 'lucide-react';

interface ImageGalleryProps {
  refModel?: string;
  refId?: string;
  apiUrl?: string;
  initialView?: 'grid' | 'list';
  onSuccess?: (data: any) => void; // New success callback
}

interface IImage {
  _id: string;
  url: string;
  publicId: string;
  primary: boolean;
  refModel: string;
  refId: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ImageApiResponse {
  success: boolean;
  data: {
    images: IImage[];
    pagination: PaginationData;
  };
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  refModel = 'Product',
  refId,
  apiUrl = '/api/images',
  initialView = 'grid',
  onSuccess
}) => {
  // Main states
  const [images, setImages] = useState<IImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialView);
  const [selectedImage, setSelectedImage] = useState<IImage | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [primaryFilter, setPrimaryFilter] = useState<string>('all');

  // Pagination
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0
  });

  // Fetch images
  useEffect(() => {
    fetchImages();
  }, [apiUrl, refId, refModel, pagination.page, pagination.limit]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (refModel) params.refModel = refModel;
      if (refId) params.refId = refId;

      const response = await axios.get(apiUrl, { params });

      const { data, pagination: paginationObj } = response.data

      setImages(data);
      setPagination(paginationObj);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await axios.delete(`${apiUrl}/${imageId}`);
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }
      // Refresh images list
      fetchImages();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete image');
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      const response = await axios.patch(`${apiUrl}/${imageId}/primary`, {
        primary: true,
        refModel,
        refId
      });
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }
      // Refresh images list
      fetchImages();
    } catch (err) {
      console.error('Set primary error:', err);
      setError('Failed to set image as primary');
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Apply filters and sorting
  const getFilteredImages = () => {
    return images
      .filter(image => {
        // Search filter - by public ID since images don't have titles
        const matchesSearch = image.publicId.toLowerCase().includes(searchQuery.toLowerCase());

        // Primary/secondary filter
        const matchesPrimary =
          primaryFilter === 'all' ||
          (primaryFilter === 'primary' && image.primary) ||
          (primaryFilter === 'secondary' && !image.primary);

        return matchesSearch && matchesPrimary;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'publicId':
            return a.publicId.localeCompare(b.publicId);
          case 'createdAt':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'primary':
            return Number(b.primary) - Number(a.primary);
          default:
            return 0;
        }
      });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination({ ...pagination, page: newPage });
  };

  const renderFilterControls = () => {
    return (

      <div className="bg-white p-4 rounded-lg border border-gray-300 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by public ID"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Primary/Secondary filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Type</label>
            <div className="relative">
              <select
                value={primaryFilter}
                onChange={(e) => setPrimaryFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Images</option>
                <option value="primary">Primary Only</option>
                <option value="secondary">Secondary Only</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Sort by */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="createdAt">Date (Newest)</option>
                <option value="publicId">Public ID (A-Z)</option>
                <option value="primary">Primary First</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* View mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 py-2 flex items-center justify-center gap-1 ${viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Grid className="h-4 w-4" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 py-2 flex items-center justify-center gap-1 ${viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGridView = () => {
    const filteredImages = getFilteredImages();

    if (filteredImages.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-300 p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <div key={image._id} className="bg-white rounded-lg border-gray-300 border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            {/* Image Preview */}
            <div
              className="relative cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={image.url}
                  alt={`Image ${image.publicId}`}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              </div>
              {image.primary && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>Primary</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex-grow">
              <h3 className="font-semibold text-lg line-clamp-2">
                {image.publicId}
              </h3>

              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <div className="flex items-center">
                  <span className="font-medium mr-1">Model:</span>
                  <span className="truncate">{image.refModel}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-1">ID:</span>
                  <span className="truncate">{image.refId.substring(0, 8)}...</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-1">Type:</span>
                  <span className="flex items-center gap-1">
                    {image.primary ? (
                      <>
                        <Star className="h-3 w-3 text-yellow-500" />
                        Primary
                      </>
                    ) : 'Secondary'}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-1">Date:</span>
                  {formatDate(image.createdAt)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-300 p-3 bg-gray-50 flex justify-between">
              {!image.primary ? (
                <button
                  onClick={() => handleSetPrimary(image._id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm mr-2 flex items-center justify-center gap-1"
                >
                  <Star className="h-4 w-4" />
                  Set Primary
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-600 rounded-md text-sm mr-2 flex items-center justify-center gap-1"
                >
                  <Star className="h-4 w-4" />
                  Primary
                </button>
              )}
              <button
                onClick={() => handleDeleteImage(image._id)}
                className="px-3 py-2 bg-white border border-red-600 text-red-600 rounded-md hover:bg-red-50 text-sm flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    const filteredImages = getFilteredImages();

    if (filteredImages.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filteredImages.map((image) => (
          <div key={image._id} className="bg-white rounded-lg border-gray-300 border p-4 flex items-center hover:shadow-md transition-shadow">
            {/* Image thumbnail */}
            <div
              className="mr-4 flex-shrink-0 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative w-24 h-24">
                <img
                  src={image.url}
                  alt={`Image ${image.publicId}`}
                  className="w-24 h-24 object-cover rounded"
                />
                {image.primary && (
                  <div className="absolute top-1 right-1 bg-yellow-400 px-1 py-0.5 rounded text-xs flex items-center gap-1">
                    <Star className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold truncate">{image.publicId}</h3>

              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                <div className="flex items-center">
                  <span className="font-medium mr-1">Model:</span>
                  <span className="truncate">{image.refModel}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-1">ID:</span>
                  <span className="truncate">{image.refId.substring(0, 8)}...</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-1">Type:</span>
                  <span className="flex items-center gap-1">
                    {image.primary ? (
                      <>
                        <Star className="h-3 w-3 text-yellow-500" />
                        Primary
                      </>
                    ) : 'Secondary'}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-1">Date:</span>
                  {formatDate(image.createdAt)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {!image.primary && (
                <button
                  onClick={() => handleSetPrimary(image._id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-1"
                >
                  <Star className="h-4 w-4" />
                  Primary
                </button>
              )}
              <button
                onClick={() => handleDeleteImage(image._id)}
                className="px-3 py-1 bg-white border border-red-600 text-red-600 rounded-md hover:bg-red-50 text-sm flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-6">
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(page => {
              // Show first page, last page, current page, and pages close to current
              return (
                page === 1 ||
                page === pagination.totalPages ||
                Math.abs(page - pagination.page) <= 1
              );
            })
            .map((page, index, array) => {
              // Add ellipsis if there are gaps
              const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;

              return (
                <React.Fragment key={page}>
                  {showEllipsisBefore && (
                    <span className="px-3 py-1">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded flex items-center justify-center w-10 ${page === pagination.page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                      }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 flex items-center gap-1"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-blue-600" />
          Image Gallery
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="inline-block h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Loading images...</p>
        </div>
      ) : (
        <>
          {images.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-300">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No images available</h3>
              <p className="mt-1 text-gray-500">Upload new images to get started</p>
            </div>
          ) : (
            <>
              {renderFilterControls()}
              {viewMode === 'grid' ? renderGridView() : renderListView()}
              {renderPagination()}

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-500 text-right">
                Showing {pagination.page === pagination.totalPages ? (pagination.total % pagination.limit) || pagination.limit : pagination.limit}
                {' '}of {pagination.total} images
              </div>
            </>
          )}
        </>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <ImagePreview className="h-5 w-5 text-blue-600" />
                Image Preview
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-2 bg-gray-100 p-4 rounded flex justify-center">
              <img
                src={selectedImage.url}
                alt="Preview"
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Image Details</h3>
              <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Public ID</dt>
                  <dd className="text-sm text-gray-900 font-mono break-all">{selectedImage.publicId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Reference Model</dt>
                  <dd className="text-sm text-gray-900">{selectedImage.refModel}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Reference ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{selectedImage.refId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900 flex items-center gap-1">
                    {selectedImage.primary ? (
                      <>
                        <Star className="h-4 w-4 text-yellow-500" />
                        Primary Image
                      </>
                    ) : 'Secondary'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date Added</dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(selectedImage.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex space-x-3 justify-end">
              <a
                href={selectedImage.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
              {!selectedImage.primary && (
                <button
                  onClick={() => {
                    handleSetPrimary(selectedImage._id);
                    setSelectedImage(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                >
                  <Star className="h-4 w-4" />
                  Set Primary
                </button>
              )}
              <button
                onClick={() => {
                  handleDeleteImage(selectedImage._id);
                  setSelectedImage(null);
                }}
                className="px-4 py-2 bg-white border border-red-600 text-red-600 rounded-md hover:bg-red-50 flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;