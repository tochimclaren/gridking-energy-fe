import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FileText, Upload, X, Plus, AlertCircle, Loader2,
  Download, Trash2, Grid, List, Search, ChevronDown,
  FileInput, FileArchive
} from 'lucide-react';

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

interface IProduct {
  _id: string;
  name: string;
  slug: string;
}

interface ProductWithDownloads {
  product: IProduct;
  downloads: Download[];
}

interface CategoryWithProducts {
  category: ICategory;
  products: ProductWithDownloads[];
}

interface DownloadData {
  downloadWithCategory: CategoryWithProducts[];
  downloadWithoutCategory: Download[];
}

interface DownloadManagerProps {
  apiUrl: string;
  refId?: string;
  refModel?: string;
  onSuccess?: (data: any) => void; // New success callback
}

const DownloadManager: React.FC<DownloadManagerProps> = ({
  apiUrl,
  refId,
  refModel,
  onSuccess
}) => {
  const [downloads, setDownloads] = useState<DownloadData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch downloads
  useEffect(() => {
    fetchDownloads();
  }, [apiUrl, refId]);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}`, {
        params: {
          refId,
          refModel
        }
      });
      const { data } = response.data
      setDownloads(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching downloads:', err);
      setError('Failed to load downloads');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      setFileToUpload(file);
      // Auto-set title if empty
      if (!title) {
        setTitle(file.name.replace('.pdf', ''));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileToUpload) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('pdf', fileToUpload);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('isPublic', String(isPublic));

      if (refId) {
        formData.append('refId', refId);
      }

      if (refModel) {
        formData.append('refModel', refModel);
      }

      const response = await axios.post(`${apiUrl}/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        }
      });

      // Reset form
      setFileToUpload(null);
      setTitle('');
      setDescription('');
      setUploadProgress(0);
      setShowUploadForm(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Refresh downloads list
      fetchDownloads();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (download: Download) => {
    try {
      window.open(download.url, '_blank');
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file');
    }
  };

  const handleDelete = async (downloadId: string) => {
    if (!window.confirm('Are you sure you want to delete this download?')) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/${downloadId}`);
      fetchDownloads();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete download');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Extract all available categories
  const getCategories = (): { id: string; name: string }[] => {
    if (!downloads) return [];
    return downloads.downloadWithCategory.map(item => ({
      id: item.category._id,
      name: item.category.name
    }));
  };

  // Get all downloads as a flat array for filtering
  const getAllDownloads = (): {
    download: Download;
    categoryName?: string;
    productName?: string;
  }[] => {
    if (!downloads) return [];

    const result: {
      download: Download;
      categoryName?: string;
      productName?: string;
    }[] = [];

    // Add categorized downloads
    downloads.downloadWithCategory.forEach(categoryGroup => {
      categoryGroup.products.forEach(productGroup => {
        productGroup.downloads.forEach(download => {
          result.push({
            download,
            categoryName: categoryGroup.category.name,
            productName: productGroup.product.name
          });
        });
      });
    });

    // Add uncategorized downloads
    downloads.downloadWithoutCategory.forEach(download => {
      result.push({ download });
    });

    return result;
  };

  // Apply filters and sorting
  const getFilteredDownloads = () => {
    const allDownloads = getAllDownloads();

    return allDownloads
      .filter(item => {
        // Search filter
        const matchesSearch =
          item.download.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.download.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (item.productName?.toLowerCase() || '').includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
          selectedCategory === 'all' ||
          selectedCategory === 'none' && !item.categoryName ||
          item.categoryName === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.download.title.localeCompare(b.download.title);
          case 'date':
            return new Date(b.download.createdAt).getTime() - new Date(a.download.createdAt).getTime();
          case 'downloads':
            return b.download.downloadCount - a.download.downloadCount;
          case 'size':
            return b.download.fileSize - a.download.fileSize;
          default:
            return 0;
        }
      });
  };

  const renderFilterControls = () => {
    const categories = getCategories();

    return (
      <div className="bg-white p-4 mb-6 rounded-lg border-gray-300 border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search downloads..."
                className="w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="none">Uncategorized</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none border-gray-300 focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="title">Title (A-Z)</option>
                <option value="date">Date (Newest)</option>
                <option value="downloads">Most Downloaded</option>
                <option value="size">Largest Size</option>
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
                className={`flex-1 py-2 flex items-center justify-center border-gray-300 gap-1 ${viewMode === 'list'
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

  const renderUploadForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg mb-6 border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload New PDF
          </h3>
          <button
            onClick={() => setShowUploadForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor='pdf'>
              PDF File (Max 10MB)
            </label>
            <div className="mt-1 flex items-center">
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileInput className="h-4 w-4 mr-2" />
                {fileToUpload ? fileToUpload.name : 'Select file'}
              </label>
              <input
                id="pdf-upload"
                type="file"
                name="pdf"
                accept="application/pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="sr-only"
                required
              />
              {fileToUpload && (
                <button
                  type="button"
                  onClick={() => {
                    setFileToUpload(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Make this file publicly available</span>
            </label>
          </div>

          {isUploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Uploading file...</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !fileToUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload PDF
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderGridView = () => {
    const filteredDownloads = getFilteredDownloads();

    if (filteredDownloads.length === 0) {
      return (
        <div className="bg-white rounded-lg border-gray-300 border p-8 text-center">
          <FileArchive className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No downloads found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDownloads.map(({ download, categoryName, productName }) => (
          <div key={download._id} className="bg-white rounded-lg border-gray-300 border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            {/* PDF Icon Header */}
            <div className="bg-gray-50 p-4 flex justify-center items-center border-gray-300 border-b">
              <div className="w-16 h-20 flex items-center justify-center bg-red-50 rounded">
                <FileText className="w-10 h-10 text-red-600" />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-grow">
              <h3 className="font-semibold text-lg line-clamp-2">{download.title}</h3>

              {download.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{download.description}</p>
              )}

              <div className="mt-3 space-y-1 text-xs text-gray-500">
                {categoryName && (
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Category:</span> {categoryName}
                  </div>
                )}

                {productName && (
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Product:</span> {productName}
                  </div>
                )}

                <div className="flex items-center">
                  <span className="font-medium mr-1">Size:</span> {formatFileSize(download.fileSize)}
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-1">Downloads:</span> {download.downloadCount}
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-1">Date:</span> {formatDate(download.createdAt)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-300 p-3 bg-gray-50 flex justify-between">
              <button
                onClick={() => handleDownload(download)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm mr-2 flex items-center justify-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={() => handleDelete(download._id)}
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
    const filteredDownloads = getFilteredDownloads();

    if (filteredDownloads.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <FileArchive className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No downloads found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filteredDownloads.map(({ download, categoryName, productName }) => (
          <div key={download._id} className="bg-white rounded-lg border-gray-300 border p-4 flex items-center hover:shadow-md transition-shadow">
            {/* PDF Icon */}
            <div className="mr-4 flex-shrink-0">
              <div className="w-12 h-16 flex items-center justify-center bg-red-50 rounded">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold truncate">{download.title}</h3>

              {download.description && (
                <p className="text-gray-600 text-sm mt-1 truncate">{download.description}</p>
              )}

              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                {categoryName && (
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Category:</span> {categoryName}
                  </div>
                )}

                {productName && (
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Product:</span> {productName}
                  </div>
                )}

                <div className="flex items-center">
                  <span className="font-medium mr-1">Size:</span> {formatFileSize(download.fileSize)}
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-1">Downloads:</span> {download.downloadCount}
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-1">Date:</span> {formatDate(download.createdAt)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleDownload(download)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={() => handleDelete(download._id)}
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

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          Downloads Manager
        </h2>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 shadow-sm"
        >
          {showUploadForm ? (
            <>
              <X className="h-5 w-5" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Upload PDF
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {showUploadForm && renderUploadForm()}

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="inline-block h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Loading downloads...</p>
        </div>
      ) : (
        <>
          {downloads && (
            downloads.downloadWithCategory.length === 0 && downloads.downloadWithoutCategory.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border-gray-300 border">
                <FileArchive className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No downloads available</h3>
                <p className="mt-1 text-gray-500">Upload your first PDF file to get started</p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <Upload className="h-5 w-5" />
                  Upload PDF
                </button>
              </div>
            ) : (
              <>
                {renderFilterControls()}
                {viewMode === 'grid' ? renderGridView() : renderListView()}

                {/* Results count */}
                <div className="mt-4 text-sm text-gray-500 text-right">
                  Showing {getFilteredDownloads().length} of {getAllDownloads().length} downloads
                </div>
              </>
            )
          )}
        </>
      )}
    </div>
  );
};

export default DownloadManager;