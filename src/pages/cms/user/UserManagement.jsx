import React, { useState } from 'react';
import UserForm from './UserForm';
import UserList from './UserList';

const UserManagement = () => {
  // State to trigger refreshes in the UserList component
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Handler for when a user is created
  const handleUserCreated = () => {
    // Increment the counter to trigger a refresh in UserList
    setRefreshCounter(prev => prev + 1);
  };

  // Handler for when a user is deleted
  const handleUserDeleted = () => {
    // Any additional logic when a user is deleted could go here
    console.log('User deleted successfully');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">User Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create User Form */}
        <UserForm onUserCreated={handleUserCreated} />
        
        {/* Users List */}
        <UserList 
          onUserDeleted={handleUserDeleted} 
          refreshTrigger={refreshCounter} 
        />
      </div>
    </div>
  );
};

export default UserManagement;