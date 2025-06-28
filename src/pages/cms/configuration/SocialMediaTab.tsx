import { Share2 } from 'lucide-react';
import React from 'react';

interface SocialMedia {
  facebookPage: string;
  instagramPage: string;
  twitterPage: string;
  youtubePage: string;
  linkedinPage: string;
  pinterestPage: string;
  tiktokPage: string;
}

interface SocialMediaTabProps {
  socialMedia: SocialMedia;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SocialMediaTab: React.FC<SocialMediaTabProps> = ({ 
  socialMedia, 
  handleChange 
}) => (
  <div className="overflow-hidden">
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold flex items-center space-x-2">
        <Share2 className="w-5 h-5" />
        <span>Social Media Links</span>
      </h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="facebookPage" className="block text-sm font-medium text-gray-700 mb-1">
            Facebook
          </label>
          <input
            type="url"
            name="facebookPage"
            value={socialMedia.facebookPage}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://facebook.com/yourpage"
          />
        </div>

        <div>
          <label htmlFor="instagramPage" className="block text-sm font-medium text-gray-700 mb-1">
            Instagram
          </label>
          <input
            type="url"
            name="instagramPage"
            value={socialMedia.instagramPage}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://instagram.com/yourpage"
          />
        </div>

        <div>
          <label htmlFor="twitterPage" className="block text-sm font-medium text-gray-700 mb-1">
            Twitter
          </label>
          <input
            type="url"
            name="twitterPage"
            value={socialMedia.twitterPage}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://twitter.com/yourpage"
          />
        </div>

        <div>
          <label htmlFor="youtubePage" className="block text-sm font-medium text-gray-700 mb-1">
            YouTube
          </label>
          <input
            type="url"
            name="youtubePage"
            value={socialMedia.youtubePage}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://youtube.com/yourchannel"
          />
        </div>

        <div>
          <label htmlFor="linkedinPage" className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <input
            type="url"
            name="linkedinPage"
            value={socialMedia.linkedinPage}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://linkedin.com/company/yourcompany"
          />
        </div>

        <div>
          <label htmlFor="pinterestPage" className="block text-sm font-medium text-gray-700 mb-1">
            Pinterest
          </label>
          <input
            type="url"
            name="pinterestPage"
            value={socialMedia.pinterestPage}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://pinterest.com/yourpage"
          />
        </div>

        <div>
          <label htmlFor="tiktokPage" className="block text-sm font-medium text-gray-700 mb-1">
            TikTok
          </label>
          <input
            type="url"
            name="tiktokPage"
            value={socialMedia.tiktokPage}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://tiktok.com/@yourchannel"
          />
        </div>
      </div>
    </div>
  </div>
);