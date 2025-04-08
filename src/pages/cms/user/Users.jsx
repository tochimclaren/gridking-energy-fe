import UserCreateForm from "../../../components/cms/user/UserCreateForm"
import React, { useState, useEffect } from 'react';

const Users = ({ onUserDeleted, refreshTrigger }) => {
  // State for users list
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Delete operation states
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch users on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    setLoadError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/user`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const result = await response.json();
      setUsers(result.data);
    } catch (error) {
      setLoadError('Failed to load users. Please try again later.');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (userId) => {
    setUserToDelete(userId);
  };

  // Cancel delete operation
  const cancelDelete = () => {
    setUserToDelete(null);
    setDeleteError(null);
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!userId) return;
    
    setIsDeleting(true);
    setDeleteSuccess(false);
    setDeleteError(null);
    
    try {
      // Delete user via API
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      
      setDeleteSuccess(true);
      
      // Update users list by filtering out the deleted user
      setUsers(users.filter(user => user.id !== userId));
      
      // Notify parent component
      if (onUserDeleted) {
        onUserDeleted();
      }
      
      // Reset user to delete
      setUserToDelete(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
    } catch (error) {
      setDeleteError(error.message || 'Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Users List</h2>
        
        {deleteSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            User deleted successfully!
          </div>
        )}
        
        {loadError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {loadError}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.admin ? 'Admin' : user.staff ? 'Staff' : 'User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => confirmDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            
            {deleteError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {deleteError}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(userToDelete)}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-md text-white ${
                  isDeleting ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;