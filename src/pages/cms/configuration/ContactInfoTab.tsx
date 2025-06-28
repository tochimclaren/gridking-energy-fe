import { Phone } from 'lucide-react';
import React, { useState } from 'react';

interface ContactInfo {
  phoneNumber: string;
  whatsappNumber: string;
  telegramChannel: string;
}

interface ContactInfoTabProps {
  contactInfo: ContactInfo;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Nigerian phone number formatter - more lenient version
const formatNigerianNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Don't format if empty or too short
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  
  // If starts with 234, format as international
  if (digits.startsWith('234')) {
    const remaining = digits.slice(3);
    if (remaining.length === 0) return '+234';
    if (remaining.length <= 3) return `+234 ${remaining}`;
    if (remaining.length <= 6) return `+234 ${remaining.slice(0, 3)} ${remaining.slice(3)}`;
    if (remaining.length <= 10) return `+234 ${remaining.slice(0, 3)} ${remaining.slice(3, 6)} ${remaining.slice(6)}`;
    return `+234 ${remaining.slice(0, 3)} ${remaining.slice(3, 6)} ${remaining.slice(6, 10)}`;
  }
  
  // If starts with 0 (local format), convert to international
  if (digits.startsWith('0')) {
    const withoutLeadingZero = digits.slice(1);
    if (withoutLeadingZero.length === 0) return '+234';
    if (withoutLeadingZero.length <= 3) return `+234 ${withoutLeadingZero}`;
    if (withoutLeadingZero.length <= 6) return `+234 ${withoutLeadingZero.slice(0, 3)} ${withoutLeadingZero.slice(3)}`;
    if (withoutLeadingZero.length <= 10) return `+234 ${withoutLeadingZero.slice(0, 3)} ${withoutLeadingZero.slice(3, 6)} ${withoutLeadingZero.slice(6)}`;
    return `+234 ${withoutLeadingZero.slice(0, 3)} ${withoutLeadingZero.slice(3, 6)} ${withoutLeadingZero.slice(6, 10)}`;
  }
  
  // If no country code, assume it's Nigerian and add +234
  if (digits.length <= 3) return `+234 ${digits}`;
  if (digits.length <= 6) return `+234 ${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 10) return `+234 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `+234 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
};

export const ContactInfoTab: React.FC<ContactInfoTabProps> = ({ 
  contactInfo, 
  handleChange 
}) => {
  const [isTyping, setIsTyping] = useState({ phoneNumber: false, whatsappNumber: false });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber' || name === 'whatsappNumber') {
      // Get current value from contactInfo
      const currentValue = contactInfo[name as keyof typeof contactInfo] || '';
      
      // If user is deleting (new value is shorter), allow it without formatting
      if (value.length < currentValue.length) {
        handleChange(e);
        return;
      }
      
      // Only format if we're adding characters
      const formattedValue = formatNigerianNumber(value);
      
      // Create a new event object with the formatted value
      const formattedEvent = {
        target: {
          name: name,
          value: formattedValue
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(formattedEvent);
    } else {
      handleChange(e);
    }
  };

  const handleFocus = (name: string) => {
    setIsTyping(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name: string) => {
    setIsTyping(prev => ({ ...prev, [name]: false }));
  };

  return (
    <div className="overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2 text-gray-800">
          <Phone className="w-5 h-5" />
          <span>Contact Information</span>
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={contactInfo.phoneNumber}
              onChange={handlePhoneChange}
              onFocus={() => handleFocus('phoneNumber')}
              onBlur={() => handleBlur('phoneNumber')}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="+234 803 123 4567"
              maxLength={18}
            />
            <p className="text-xs text-gray-500 mt-2">
              Format: +234 XXX XXX XXXX (Enter local number starting with 0 or international format)
            </p>
          </div>

          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              name="whatsappNumber"
              id="whatsappNumber"
              value={contactInfo.whatsappNumber}
              onChange={handlePhoneChange}
              onFocus={() => handleFocus('whatsappNumber')}
              onBlur={() => handleBlur('whatsappNumber')}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="+234 803 123 4567"
              maxLength={18}
            />
            <p className="text-xs text-gray-500 mt-2">
              Format: +234 XXX XXX XXXX (Enter local number starting with 0 or international format)
            </p>
          </div>

          <div>
            <label htmlFor="telegramChannel" className="block text-sm font-medium text-gray-700 mb-2">
              Telegram Channel
            </label>
            <input
              type="text"
              name="telegramChannel"
              id="telegramChannel"
              value={contactInfo.telegramChannel}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="@yourchannel"
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter your Telegram channel username (e.g., @yourchannel)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component to test the functionality
const App = () => {
  const [contactInfo, setContactInfo] = useState({
    phoneNumber: '',
    whatsappNumber: '',
    telegramChannel: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <ContactInfoTab 
        contactInfo={contactInfo} 
        handleChange={handleChange} 
      />
      
      {/* Debug info */}
      <div className="max-w-2xl mx-auto mt-6 p-4 bg-gray-800 text-white rounded-lg">
        <h3 className="font-semibold mb-2">Current Values:</h3>
        <pre className="text-sm">
          {JSON.stringify(contactInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default App;