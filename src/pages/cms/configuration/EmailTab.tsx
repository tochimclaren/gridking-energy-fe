import { Users, UserPlus, Mail, Shield, DollarSign, Trash2, Loader2, Plus } from 'lucide-react';
import React from 'react';

interface Configuration {
  admins: string[];
  sales: string[];
}

interface EmailTabProps {
  config: Configuration;
  newEmail: string;
  setNewEmail: (email: string) => void;
  emailType: 'admin' | 'sales';
  setEmailType: (type: 'admin' | 'sales') => void;
  handleAddEmail: () => void;
  handleRemoveEmail: (email: string, type: 'admin' | 'sales') => void;
  actionLoading: string | null;
  isEmailInputValid: boolean;
}

export const EmailTab: React.FC<EmailTabProps> = ({
  config,
  newEmail,
  setNewEmail,
  emailType,
  setEmailType,
  handleAddEmail,
  handleRemoveEmail,
  actionLoading,
  isEmailInputValid
}) => (
  <div className="space-y-6">
    <div className="overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Email List</span>
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Administrators</h3>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {config?.admins.length || 0}
            </span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {config?.admins.map((email, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{email}</span>
                </div>
                <button
                  onClick={() => handleRemoveEmail(email, 'admin')}
                  disabled={actionLoading === `remove-admin-${email}`}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all disabled:opacity-50"
                >
                  {actionLoading === `remove-admin-${email}` ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
            {(!config?.admins || config.admins.length === 0) && (
              <p className="text-sm text-gray-500 italic text-center py-4">No administrators configured</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Sales Team</h3>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {config?.sales.length || 0}
            </span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {config?.sales.map((email, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{email}</span>
                </div>
                <button
                  onClick={() => handleRemoveEmail(email, 'sales')}
                  disabled={actionLoading === `remove-sales-${email}`}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all disabled:opacity-50"
                >
                  {actionLoading === `remove-sales-${email}` ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
            {(!config?.sales || config.sales.length === 0) && (
              <p className="text-sm text-gray-500 italic text-center py-4">No sales emails configured</p>
            )}
          </div>
        </div>
      </div>
    </div>

    <div className="overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <span>Add Email</span>
        </h2>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Email Type</label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="emailType"
                  value="admin"
                  checked={emailType === 'admin'}
                  onChange={(e) => setEmailType(e.target.value as 'admin' | 'sales')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <Shield className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>Administrator</span>
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="emailType"
                  value="sales"
                  checked={emailType === 'sales'}
                  onChange={(e) => setEmailType(e.target.value as 'admin' | 'sales')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <DollarSign className="w-3 h-3 text-green-600" />
                  </div>
                  <span>Sales Team</span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Email Address</label>
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !actionLoading && isEmailInputValid && handleAddEmail()}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user@example.com"
                />
                <Mail className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
              </div>
              <button
                onClick={handleAddEmail}
                disabled={actionLoading === `add-${emailType}` || !isEmailInputValid}
                className={`px-8 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                  emailType === 'admin' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionLoading === `add-${emailType}` ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Add Email</span>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Press Enter or click "Add Email" to add the email address to the {emailType} list.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);