import { Check, AlertCircle, X } from 'lucide-react';
import React from 'react';

interface NotificationProps {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export const NotificationBanner: React.FC<{ 
  notification: NotificationProps | null 
}> = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className={`mb-6 p-4 border-l-4 shadow-sm transition-all duration-300 ${
      notification.type === 'success' 
        ? 'bg-green-50 border-green-400 text-green-800' 
        : notification.type === 'warning'
        ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
        : 'bg-red-50 border-red-400 text-red-800'
    }`}>
      <div className="flex items-center space-x-3">
        {notification.type === 'success' ? (
          <Check className="w-5 h-5" />
        ) : notification.type === 'warning' ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <X className="w-5 h-5" />
        )}
        <span className="font-medium">{notification.message}</span>
      </div>
    </div>
  );
};