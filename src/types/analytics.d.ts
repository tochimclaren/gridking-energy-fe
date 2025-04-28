export interface AnalyticsSummary {
    totalUsers: number;
    totalAppliances: number;
    totalCarousels: number;
    totalCategories: number;
    totalDownloads: number;
    totalEnquiries: number;
    totalQuotes: number;
    totalImages: number;
    totalProducts: number;
    totalGalleries: number;
    activeUsers?: number;
    popularProducts?: Array<{ id: string; name: string; views: number }>;
    popularCategories?: Array<{ id: string; name: string; productCount: number }>;
    recentEnquiries?: Array<any>;
    recentQuotes?: Array<any>;
    downloadStats?: {
      totalDownloads: number;
      downloadsThisMonth: number;
      topDownloads: Array<{ id: string; name: string; count: number }>;
    };
  }
  
  export interface DownloadAnalytics {
    summary: {
      totalDownloads: number;
      totalFiles: number;
      avgDownloadsPerFile: number;
    };
    monthlyStats: Array<{
      period: string;
      filesUploaded: number;
      totalDownloads: number;
    }>;
    popularDownloads: Array<{
      id: string;
      title: string;
      url: string;
      fileSize: number;
      downloadCount: number;
    }>;
    downloadsByType: Array<{
      mimeType: string;
      fileCount: number;
      totalDownloads: number;
    }>;
  }
  
  export interface UserAnalytics {
    totalUsers: number;
    activeUsers: number;
    activePercentage: string;
    registrationTrend: Array<{ period: string; registrations: number }>;
  }
  
  export interface ProductAnalytics {
    topViewedProducts: Array<{ _id: string; name: string; views: number }>;
    productsByCategory: Array<{ _id: string; name: string; productCount: number }>;
    recentProducts: Array<{ _id: string; name: string; createdAt: string }>;
  }
  
  export interface ConversionAnalytics {
    totalEnquiries: number;
    totalQuotes: number;
    conversionRate: string;
    enquiriesTrend: Array<{ period: string; count: number }>;
    quotesTrend: Array<{ period: string; count: number }>;
  }
  
  export interface DateRange {
    startDate: string;
    endDate: string;
  }
  
  export type ExpandedSections = {
    summary: boolean;
    products: boolean;
    users: boolean;
    conversions: boolean;
    downloads: boolean;
  };
  
  export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];