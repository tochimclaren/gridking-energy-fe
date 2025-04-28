// src/pages/ProfilePage.tsx - Example of using the UserUpdateForm
import { useState } from 'react';
import UserUpdateForm from '../../components/cms/auth/UserUpdateForm';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/auth.service';

const Profile = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(currentUser);
  
  const handleUpdateUser = async (userId: string, data: { email: string }) => {
    const updatedUser = await updateProfile(data);
    setUser(updatedUser);
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl text-center font-bold mb-6">My Profile</h1>
        <UserUpdateForm user={user} onUpdateUser={handleUpdateUser} />
      </div>
    </div>
  );
};

export default Profile;