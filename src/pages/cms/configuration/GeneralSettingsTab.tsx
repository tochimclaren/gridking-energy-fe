import { Bell, Wrench, Loader2, Check } from 'lucide-react';
import React from 'react';

interface Configuration {
  adminReceiveQuoteNotifications: boolean;
  maintainanceMode: boolean;
  productsPerPage: number;
}

interface GeneralSettingsTabProps {
  config: Configuration;
  actionLoading: string | null;
  updateQuoteNotifications: (enabled: boolean) => void;
  updateMaintenanceMode: (enabled: boolean) => void;
  updateProductsPerPage: (count: number) => void;
}

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
  config,
  actionLoading,
  updateQuoteNotifications,
  updateMaintenanceMode,
  updateProductsPerPage
}) => (
  <div className="space-y-6">
    <div className="overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Quote Notifications</span>
        </h2>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Admin Quote Notifications</h3>
            <p className="text-sm text-gray-500 mt-1">
              Receive email notifications when new quotes are submitted
            </p>
          </div>
          <button
            onClick={() => updateQuoteNotifications(!config.adminReceiveQuoteNotifications)}
            disabled={actionLoading === 'updateQuoteNotifications'}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              config.adminReceiveQuoteNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                config.adminReceiveQuoteNotifications ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              <span
                className={`absolute inset-0 h-full w-full flex items-center justify-center transition-opacity ${
                  config.adminReceiveQuoteNotifications
                    ? 'opacity-100 ease-in duration-200'
                    : 'opacity-0 ease-out duration-100'
                }`}
              >
                {actionLoading === 'updateQuoteNotifications' ? (
                  <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
                ) : (
                  <Check className="w-3 h-3 text-blue-600" />
                )}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
<br />
    <div className="overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Wrench className="w-5 h-5" />
          <span>System Settings</span>
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
            <p className="text-sm text-gray-500 mt-1">
              Enable to take the system offline for maintenance
            </p>
          </div>
          <button
            onClick={() => updateMaintenanceMode(!config.maintainanceMode)}
            disabled={actionLoading === 'updateMaintenanceMode'}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              config.maintainanceMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                config.maintainanceMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              <span
                className={`absolute inset-0 h-full w-full flex items-center justify-center transition-opacity ${
                  config.maintainanceMode
                    ? 'opacity-100 ease-in duration-200'
                    : 'opacity-0 ease-out duration-100'
                }`}
              >
                {actionLoading === 'updateMaintenanceMode' ? (
                  <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
                ) : (
                  <Check className="w-3 h-3 text-blue-600" />
                )}
              </span>
            </span>
          </button>
        </div>
<br />
        <div>
          <label htmlFor="productsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
            Products Per Page
          </label>
          <div className="mt-1 relative rounded-md shadow-sm max-w-xs">
            <input
              type="number"
              min="1"
              max="100"
              value={config.productsPerPage}
              onChange={(e) => updateProductsPerPage(parseInt(e.target.value))}
              disabled={actionLoading === 'updateProductsPerPage'}
              className="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">items</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Number of products displayed per page in product listings
          </p>
        </div>
      </div>
    </div>
  </div>
);