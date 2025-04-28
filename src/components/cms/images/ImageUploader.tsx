import React, { useState, useRef, ChangeEvent } from 'react';
import axios from 'axios';

interface ImageUploaderProps {
  refModel: string;
  refId: string;
  apiUrl: string;
  onSuccess?: (uploadedImage: any) => void;
  onError?: (error: any) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  refModel, 
  refId, 
  apiUrl,
  onSuccess, 
  onError 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Clear previous errors
    setError(null);
    setImageToUpload(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageToUpload) {
      setError('Please select an image to upload');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Create FormData for the upload
      const formData = new FormData();
      formData.append('image', imageToUpload);
      formData.append('refModel', refModel);
      formData.append('refId', refId);
      formData.append('primary', String(isPrimary));

      // Upload the image
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        }
      });

      // Handle success
      if (onSuccess) onSuccess(response.data);
      
      // Reset form
      setImageToUpload(null);
      setPreview(null);
      setIsPrimary(false);
      setUploadProgress(0);
      setShowUploadForm(false);
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
      if (onError) onError(err);
    } finally {
      setIsUploading(false);
    }
  };

  const renderUploadForm = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Upload New Image</h3>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image File (Max 5MB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          {preview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview
              </label>
              <div className="w-full max-h-48 overflow-hidden rounded-md border border-gray-200">
                <img src={preview} alt="Preview" className="w-full h-auto object-contain" />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Set as primary image</span>
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
              <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !imageToUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="w-full p-4 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {showUploadForm ? 'Cancel' : 'Add Image'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showUploadForm ? renderUploadForm() : null}
    </div>
  );
};

export default ImageUploader;