import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Settings, 
  Loader2,
  Check,
} from 'lucide-react';
import { NotificationBanner } from './NotificationBanner';
import { TabNavigation } from './TabNavigation';
import { EmailTab } from './EmailTab';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { ContactInfoTab } from './ContactInfoTab';
import { SocialMediaTab } from './SocialMediaTab';

export interface Configuration {
  admins: string[];
  sales: string[];
  adminReceiveQuoteNotifications: boolean;
  maintainanceMode: boolean;
  productsPerPage: number;
  phoneNumber: string;
  facebookPage: string;
  instagramPage: string;
  twitterPage: string;
  youtubePage: string;
  linkedinPage: string;
  pinterestPage: string;
  tiktokPage: string;
  whatsappNumber: string;
  telegramChannel: string;
  createdAt: string;
  updatedAt: string;
}

const ConfigurationManager: React.FC = () => {
  const [config, setConfig] = useState<Configuration | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [emailType, setEmailType] = useState<'admin' | 'sales'>('admin');
  const [activeTab, setActiveTab] = useState('emails');
  
  const [contactInfo, setContactInfo] = useState({
    phoneNumber: '',
    whatsappNumber: '',
    telegramChannel: ''
  });
  
  const [socialMedia, setSocialMedia] = useState({
    facebookPage: '',
    instagramPage: '',
    twitterPage: '',
    youtubePage: '',
    linkedinPage: '',
    pinterestPage: '',
    tiktokPage: ''
  });
  
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const defaultConfig: Configuration = {
    admins: [],
    sales: [],
    adminReceiveQuoteNotifications: true,
    maintainanceMode: false,
    productsPerPage: 10,
    phoneNumber: '',
    facebookPage: '',
    instagramPage: '',
    twitterPage: '',
    youtubePage: '',
    linkedinPage: '',
    pinterestPage: '',
    tiktokPage: '',
    whatsappNumber: '',
    telegramChannel: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const isEmailInputValid = newEmail.trim() !== '' && isValidEmail(newEmail);

  useEffect(() => {
    if (config) {
      setContactInfo({
        phoneNumber: config.phoneNumber,
        whatsappNumber: config.whatsappNumber,
        telegramChannel: config.telegramChannel
      });
      
      setSocialMedia({
        facebookPage: config.facebookPage,
        instagramPage: config.instagramPage,
        twitterPage: config.twitterPage,
        youtubePage: config.youtubePage,
        linkedinPage: config.linkedinPage,
        pinterestPage: config.pinterestPage,
        tiktokPage: config.tiktokPage
      });
    }
  }, [config]);

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchConfiguration = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/configuration`);
      const data = response.data;
      
      if (data.success && data.data) {
        setConfig(data.data);
      } else {
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error('Error fetching configuration:', error);
      setConfig(defaultConfig);
      showNotification('warning', 'Using default configuration - API unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      showNotification('warning', 'Please enter an email address');
      return;
    }

    if (!isValidEmail(newEmail)) {
      showNotification('error', 'Please enter a valid email address');
      return;
    }

    if (!config) {
      showNotification('error', 'Configuration not loaded');
      return;
    }

    const isDuplicate = emailType === 'admin' 
      ? config.admins.includes(newEmail.trim())
      : config.sales.includes(newEmail.trim());
    
    if (isDuplicate) {
      showNotification('warning', `Email already exists in ${emailType} list`);
      return;
    }

    try {
      setActionLoading(`add-${emailType}`);
      const endpoint = `${BASE_URL}/configuration/${emailType === 'admin' ? 'admins' : 'sales'}`;
      const response = await axios.post(endpoint, { email: newEmail.trim() });
      const data = response.data;
      
      if (data.success && data.data) {
        setConfig(data.data);
        setNewEmail('');
        showNotification('success', `${emailType === 'admin' ? 'Admin' : 'Sales'} email added successfully`);
      } else {
        throw new Error(data.message || 'Failed to add email');
      }
    } catch (error) {
      console.error(`Error adding ${emailType} email:`, error);
      showNotification('error', `Failed to add ${emailType} email`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveEmail = async (email: string, type: 'admin' | 'sales') => {
    if (!config) {
      showNotification('error', 'Configuration not loaded');
      return;
    }

    try {
      setActionLoading(`remove-${type}-${email}`);
      const endpoint = `${BASE_URL}/configuration/${type === 'admin' ? 'admins' : 'sales'}`;
      const response = await axios.delete(endpoint, { data: { email } });
      const data = response.data;
      
      if (data.success && data.data) {
        setConfig(data.data);
        showNotification('success', `${type === 'admin' ? 'Admin' : 'Sales'} email removed successfully`);
      } else {
        throw new Error(data.message || 'Failed to remove email');
      }
    } catch (error) {
      console.error(`Error removing ${type} email:`, error);
      showNotification('error', `Failed to remove ${type} email`);
    } finally {
      setActionLoading(null);
    }
  };

  const updateQuoteNotifications = async (enabled: boolean) => {
    if (!config) return;

    try {
      setActionLoading('updateQuoteNotifications');
      const response = await axios.put(`${BASE_URL}/configuration/quote-notifications`, { enabled });
      
      if (response.data.success && response.data.data) {
        setConfig(response.data.data);
        showNotification('success', 'Quote notifications updated successfully');
      } else {
        throw new Error('Failed to update quote notifications');
      }
    } catch (error) {
      console.error('Error updating quote notifications:', error);
      showNotification('error', 'Failed to update quote notifications');
    } finally {
      setActionLoading(null);
    }
  };

  const updateMaintenanceMode = async (enabled: boolean) => {
    if (!config) return;

    try {
      setActionLoading('updateMaintenanceMode');
      const response = await axios.put(`${BASE_URL}/configuration/maintenance-mode`, { enabled });
      
      if (response.data.success && response.data.data) {
        setConfig(response.data.data);
        showNotification('success', 'Maintenance mode updated successfully');
      } else {
        throw new Error('Failed to update maintenance mode');
      }
    } catch (error) {
      console.error('Error updating maintenance mode:', error);
      showNotification('error', 'Failed to update maintenance mode');
    } finally {
      setActionLoading(null);
    }
  };

  const updateProductsPerPage = async (count: number) => {
    if (!config) return;

    try {
      setActionLoading('updateProductsPerPage');
      const response = await axios.put(`${BASE_URL}/configuration/products-per-page`, { count });
      
      if (response.data.success && response.data.data) {
        setConfig(response.data.data);
        showNotification('success', 'Products per page updated successfully');
      } else {
        throw new Error('Failed to update products per page');
      }
    } catch (error) {
      console.error('Error updating products per page:', error);
      showNotification('error', 'Failed to update products per page');
    } finally {
      setActionLoading(null);
    }
  };

  const updateContactInfo = async (contactInfo: {
    phoneNumber?: string;
    whatsappNumber?: string;
    telegramChannel?: string;
  }) => {
    if (!config) return;

    try {
      setActionLoading('updateContactInfo');
      const response = await axios.put(`${BASE_URL}/configuration/contact-info`, contactInfo);
      
      if (response.data.success && response.data.data) {
        setConfig(response.data.data);
        showNotification('success', 'Contact information updated successfully');
      } else {
        throw new Error('Failed to update contact information');
      }
    } catch (error) {
      console.error('Error updating contact information:', error);
      showNotification('error', 'Failed to update contact information');
    } finally {
      setActionLoading(null);
    }
  };

  const updateSocialMedia = async (socialMedia: {
    facebookPage?: string;
    instagramPage?: string;
    twitterPage?: string;
    youtubePage?: string;
    linkedinPage?: string;
    pinterestPage?: string;
    tiktokPage?: string;
  }) => {
    if (!config) return;

    try {
      setActionLoading('updateSocialMedia');
      const response = await axios.put(`${BASE_URL}/configuration/social-media`, socialMedia);
      
      if (response.data.success && response.data.data) {
        setConfig(response.data.data);
        showNotification('success', 'Social media links updated successfully');
      } else {
        throw new Error('Failed to update social media links');
      }
    } catch (error) {
      console.error('Error updating social media links:', error);
      showNotification('error', 'Failed to update social media links');
    } finally {
      setActionLoading(null);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialMedia(prev => ({ ...prev, [name]: value }));
  };

  const hasUnsavedChanges = () => {
    if (!config) return false;
    
    switch (activeTab) {
      case 'contact':
        return contactInfo.phoneNumber !== config.phoneNumber ||
               contactInfo.whatsappNumber !== config.whatsappNumber ||
               contactInfo.telegramChannel !== config.telegramChannel;
               
      case 'social':
        return socialMedia.facebookPage !== config.facebookPage ||
               socialMedia.instagramPage !== config.instagramPage ||
               socialMedia.twitterPage !== config.twitterPage ||
               socialMedia.youtubePage !== config.youtubePage ||
               socialMedia.linkedinPage !== config.linkedinPage ||
               socialMedia.pinterestPage !== config.pinterestPage ||
               socialMedia.tiktokPage !== config.tiktokPage;
               
      default:
        return false;
    }
  };

  const handleGlobalSave = async () => {
    if (!config) return;
    
    try {
      setActionLoading('globalSave');
      
      switch (activeTab) {
        case 'contact':
          await updateContactInfo(contactInfo);
          break;
          
        case 'social':
          await updateSocialMedia(socialMedia);
          break;
          
        default:
          break;
      }
      
      showNotification('success', 'Changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
      showNotification('error', 'Failed to save changes');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin absolute -top-1 -right-1" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Loading Configuration</h3>
            <p className="text-gray-500">Please wait while we fetch your settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configuration</h1>
              <p className="text-gray-600">Manage system configuration settings</p>
            </div>
          </div>
        </div>

        <NotificationBanner notification={notification} />

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {activeTab === 'emails' && config && (
              <EmailTab
                config={config}
                newEmail={newEmail}
                setNewEmail={setNewEmail}
                emailType={emailType}
                setEmailType={setEmailType}
                handleAddEmail={handleAddEmail}
                handleRemoveEmail={handleRemoveEmail}
                actionLoading={actionLoading}
                isEmailInputValid={isEmailInputValid}
              />
            )}

            {activeTab === 'general' && config && (
              <GeneralSettingsTab
                config={config}
                actionLoading={actionLoading}
                updateQuoteNotifications={updateQuoteNotifications}
                updateMaintenanceMode={updateMaintenanceMode}
                updateProductsPerPage={updateProductsPerPage}
              />
            )}

            {activeTab === 'contact' && config && (
              <ContactInfoTab
                contactInfo={contactInfo}
                handleChange={handleContactChange}
              />
            )}

            {activeTab === 'social' && config && (
              <SocialMediaTab
                socialMedia={socialMedia}
                handleChange={handleSocialChange}
              />
            )}
          </div>

          {/* Save Button - Only shown on Contact and Social tabs */}
          {(activeTab === 'contact' || activeTab === 'social') && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={handleGlobalSave}
                disabled={!hasUnsavedChanges() || actionLoading === 'globalSave'}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {actionLoading === 'globalSave' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>

        {config && (
          <div className="mt-6 text-right">
            <div className="text-xs text-gray-500 inline-flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span>Created:</span>
                <span className="font-medium">{new Date(config.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Updated:</span>
                <span className="font-medium">{new Date(config.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationManager;