import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PDFFileManager = ({ refModel, refId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: true,
  });
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchFiles();
  }, [refModel, refId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/download/${refModel}/${refId}`);
      setFiles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load files. Please try again later.');
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFormData({
        ...formData,
        title: file.name.replace('.pdf', '')
      });
    } else {
      setError('Please select a valid PDF file');
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formPayload = new FormData();
      formPayload.append('file', selectedFile);
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description || '');
      formPayload.append('refModel', refModel);
      formPayload.append('refId', refId);
      formPayload.append('isPublic', formData.isPublic);

      const response = await axios.post(`${BASE_URL}/download/upload`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setFiles([response.data, ...files]);
      
      // Reset form
      setSelectedFile(null);
      setFormData({
        title: '',
        description: '',
        isPublic: true
      });
      fileInputRef.current.value = '';
      setUploadProgress(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (file) => {
    setSelectedFile(file);
    setFormData({
      title: file.title,
      description: file.description || '',
      isPublic: file.isPublic
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const response = await axios.put(`${BASE_URL}/download/${selectedFile._id}`, {
        title: formData.title,
        description: formData.description,
        isPublic: formData.isPublic
      });

      // Update the files list with the updated file
      const updatedFiles = files.map(file => 
        file._id === selectedFile._id ? response.data : file
      );
      
      setFiles(updatedFiles);
      setIsEditModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update file');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (file) => {
    setSelectedFile(file);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      await axios.delete(`${BASE_URL}/download/${selectedFile._id}`);
      
      // Remove the deleted file from the files list
      const updatedFiles = files.filter(file => file._id !== selectedFile._id);
      setFiles(updatedFiles);
      
      setIsDeleteModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete file');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">PDF File Manager</h2>
      
      {/* Upload Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Upload New PDF</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select PDF File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          {selectedFile && (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                  Make publicly accessible
                </label>
              </div>
            </>
          )}
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !selectedFile}
            className={`px-4 py-2 text-white font-medium rounded-md ${
              loading || !selectedFile ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {/* Files List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">PDF Files</h3>
        
        {loading && files.length === 0 ? (
          <div className="text-center py-4">
            <svg className="animate-spin h-8 w-8 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-500">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No PDF files available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-red-100 text-red-600 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{file.title}</div>
                          <div className="text-sm text-gray-500">{formatFileSize(file.fileSize)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{file.description || 'No description'}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Uploaded: {formatDate(file.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${file.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {file.isPublic ? 'Public' : 'Private'}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Downloads: {file.downloadCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </a>
                        <button
                          onClick={() => openEditModal(file)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(file)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium">Edit PDF Metadata</h3>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsPublic" className="ml-2 block text-sm text-gray-700">
                    Make publicly accessible
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 text-white font-medium rounded-md ${
                    loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete "{selectedFile.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className={`px-4 py-2 text-white font-medium rounded-md ${
                  loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFFileManager;