// src/components/auth/UserLogoutButton.tsx
import { LogOut } from 'lucide-react';

type UserLogoutButtonProps = {
  onLogout: () => Promise<void>;
  className?: string;
};

const UserLogoutButton = ({ onLogout, className = '' }: UserLogoutButtonProps) => {
  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className={`flex items-center text-red-600 cursor-pointer transition-colors ${className}`}
    >
      <LogOut size={18} className="mr-2" />
      <span>Logout</span>
    </button>
  );
};

export default UserLogoutButton;