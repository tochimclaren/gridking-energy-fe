import { Mail, Settings, Phone, Share2 } from 'lucide-react';
import React from 'react';

const tabs = [
  { id: 'emails', label: 'Email Management', icon: <Mail className="w-4 h-4" /> },
  { id: 'general', label: 'General Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'contact', label: 'Contact Info', icon: <Phone className="w-4 h-4" /> },
  { id: 'social', label: 'Social Media', icon: <Share2 className="w-4 h-4" /> },
];

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  setActiveTab 
}) => (
  <div className="mb-6">
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  </div>
);