import { useState, useEffect } from 'react';
import { BarChart, Activity, Users, ShoppingBag, Download, FileText, MessageSquare, ChevronDown, ChevronUp, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsSummary {
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

interface DownloadAnalytics {
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

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  activePercentage: string;
  registrationTrend: Array<{ period: string; registrations: number }>;
}

interface ProductAnalytics {
  topViewedProducts: Array<{ _id: string; name: string; views: number }>;
  productsByCategory: Array<{ _id: string; name: string; productCount: number }>;
  recentProducts: Array<{ _id: string; name: string; createdAt: string }>;
}

interface ConversionAnalytics {
  totalEnquiries: number;
  totalQuotes: number;
  conversionRate: string;
  enquiriesTrend: Array<{ period: string; count: number }>;
  quotesTrend: Array<{ period: string; count: number }>;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [detailedAnalytics, setDetailedAnalytics] = useState<AnalyticsSummary | null>(null);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [conversionAnalytics, setConversionAnalytics] = useState<ConversionAnalytics | null>(null);
  const [downloadAnalytics, setDownloadAnalytics] = useState<DownloadAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });

  // UI state
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    products: false,
    users: false,
    conversions: false,
    downloads: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Fetch initial data
  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const fetchAllAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [summaryRes, detailedRes, productRes, userRes, conversionRes, downloadRes] = await Promise.all([
        fetch(`${BASE_URL}/analytic/summary`),
        fetch(`${BASE_URL}/analytic/detailed`),
        fetch(`${BASE_URL}/analytic/products`),
        fetch(`${BASE_URL}/analytic/users`),
        fetch(`${BASE_URL}/analytic/conversions`),
        fetch(`${BASE_URL}/analytic/downloads`)
      ]);

      // Check for errors
      if (!summaryRes.ok || !detailedRes.ok || !productRes.ok ||
        !userRes.ok || !conversionRes.ok || !downloadRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      // Parse responses
      const summaryData = await summaryRes.json();
      const detailedData = await detailedRes.json();
      const productData = await productRes.json();
      const userData = await userRes.json();
      const conversionData = await conversionRes.json();
      const downloadData = await downloadRes.json();

      // Update state
      setSummary(summaryData.data);
      setDetailedAnalytics(detailedData.data);
      setProductAnalytics(productData.data);
      setUserAnalytics(userData.data);
      setConversionAnalytics(conversionData.data);
      setDownloadAnalytics(downloadData.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle date range change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch data with date filter
  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (dateRange.startDate) queryParams.append('startDate', dateRange.startDate);
      if (dateRange.endDate) queryParams.append('endDate', dateRange.endDate);

      const response = await fetch(`${BASE_URL}/analytic/detailed?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch filtered data');

      const data = await response.json();
      setDetailedAnalytics(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <RefreshCw className="animate-spin w-12 h-12 text-blue-500" />
        <span className="ml-2 text-lg font-medium">Loading analytics data...</span>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full text-red-500">
        <AlertTriangle className="w-12 h-12 mb-2" />
        <h3 className="text-lg font-bold">Error loading analytics</h3>
        <p>{error}</p>
        <button
          onClick={fetchAllAnalytics}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 h-screen overflow-y-auto pb-16">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Analytics</h1>
        {/* <p className="text-gray-600">Comprehensive view of your system performance and metrics</p> */}
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-500" />
          Date Range Filter
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchFilteredData}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? (
                <span className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </span>
              ) : 'Apply Filter'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('summary')}
        >
          <h2 className="text-lg font-semibold flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-blue-500" />
            Summary Overview
          </h2>
          {expandedSections.summary ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {expandedSections.summary && summary && (
          <div className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <Users className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Users</span>
                </div>
                <p className="text-xl font-bold">{summary.totalUsers}</p>
                {detailedAnalytics?.activeUsers && (
                  <p className="text-xs text-gray-500">{detailedAnalytics.activeUsers} active</p>
                )}
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <ShoppingBag className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Products</span>
                </div>
                <p className="text-xl font-bold">{summary.totalProducts}</p>
                <p className="text-xs text-gray-500">{summary.totalCategories} categories</p>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <MessageSquare className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Enquiries</span>
                </div>
                <p className="text-xl font-bold">{summary.totalEnquiries}</p>
                <p className="text-xs text-gray-500">{summary.totalQuotes} quotes</p>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <Download className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Downloads</span>
                </div>
                <p className="text-xl font-bold">{summary.totalDownloads}</p>
                {detailedAnalytics?.downloadStats && (
                  <p className="text-xs text-gray-500">
                    {detailedAnalytics.downloadStats.downloadsThisMonth} this month
                  </p>
                )}
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <FileText className="w-4 h-4 text-indigo-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Content</span>
                </div>
                <p className="text-xl font-bold">{summary.totalImages + summary.totalGalleries}</p>
                <p className="text-xs text-gray-500">
                  {summary.totalImages} images, {summary.totalGalleries} galleries
                </p>
              </div>
            </div>

            {/* Popular Products */}
            {detailedAnalytics?.popularProducts && detailedAnalytics.popularProducts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-medium mb-3 text-gray-700">Popular Products</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        data={detailedAnalytics.popularProducts}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="#3b82f6" name="Views" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Analytics */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('products')}
        >
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-green-500" />
            Product Analytics
          </h2>
          {expandedSections.products ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {expandedSections.products && productAnalytics && (
          <div className="mt-4">
            {/* Top Viewed Products */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3 text-gray-700">Top Viewed Products</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                      <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productAnalytics.topViewedProducts.map(product => (
                      <tr key={product._id}>
                        <td className="py-2 px-3 text-sm text-gray-900">{product.name}</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right">{product.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Products by Category */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3 text-gray-700">Products by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={productAnalytics.productsByCategory}
                          dataKey="productCount"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {productAnalytics.productsByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="overflow-y-auto h-64">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {productAnalytics.productsByCategory.map(category => (
                        <tr key={category._id}>
                          <td className="py-2 px-3 text-sm text-gray-900">{category.name}</td>
                          <td className="py-2 px-3 text-sm text-gray-900 text-right">{category.productCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Analytics */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('users')}
        >
          <h2 className="text-lg font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            User Analytics
          </h2>
          {expandedSections.users ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {expandedSections.users && userAnalytics && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Total Users</h3>
                <p className="text-2xl font-bold text-blue-700">{userAnalytics.totalUsers}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Active Users</h3>
                <p className="text-2xl font-bold text-green-700">{userAnalytics.activeUsers}</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Active Rate</h3>
                <p className="text-2xl font-bold text-yellow-700">{userAnalytics.activePercentage}%</p>
              </div>
            </div>

            {/* User Registration Trend */}
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700">User Registration Trend</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart
                      data={userAnalytics.registrationTrend}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="registrations"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                        name="New Users"
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional sections for Conversions and Downloads similarly structured */}
      {/* Conversion Analytics */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('conversions')}
        >
          <h2 className="text-lg font-semibold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-yellow-500" />
            Enquiry & Quote Analytics
          </h2>
          {expandedSections.conversions ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {expandedSections.conversions && conversionAnalytics && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Total Enquiries</h3>
                <p className="text-2xl font-bold text-yellow-700">{conversionAnalytics.totalEnquiries}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Total Quotes</h3>
                <p className="text-2xl font-bold text-blue-700">{conversionAnalytics.totalQuotes}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</h3>
                <p className="text-2xl font-bold text-green-700">{conversionAnalytics.conversionRate}%</p>
              </div>
            </div>

            {/* Enquiries & Quotes Trend */}
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700">Enquiries & Quotes Trend</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="period"
                        allowDuplicatedCategory={false}
                      />
                      <YAxis />
                      <Tooltip />
                      <Line
                        data={conversionAnalytics.enquiriesTrend}
                        type="monotone"
                        dataKey="count"
                        stroke="#FFBB28"
                        name="Enquiries"
                        strokeWidth={2}
                      />
                      <Line
                        data={conversionAnalytics.quotesTrend}
                        type="monotone"
                        dataKey="count"
                        stroke="#0088FE"
                        name="Quotes"
                        strokeWidth={2}
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Download Analytics */}
{/* Download Analytics */}
<div className="bg-white p-4 rounded-lg shadow-sm mb-6">
  <div
    className="flex justify-between items-center cursor-pointer"
    onClick={() => toggleSection('downloads')}
  >
    <h2 className="text-lg font-semibold flex items-center">
      <Download className="w-5 h-5 mr-2 text-purple-500" />
      Download Analytics
    </h2>
    {expandedSections.downloads ? (
      <ChevronUp className="w-5 h-5 text-gray-500" />
    ) : (
      <ChevronDown className="w-5 h-5 text-gray-500" />
    )}
  </div>

  {expandedSections.downloads && downloadAnalytics && (
    <div className="mt-4">
      {/* Download Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Downloads</h3>
          <p className="text-2xl font-bold text-purple-700">{downloadAnalytics.summary.totalDownloads}</p>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Available Files</h3>
          <p className="text-2xl font-bold text-indigo-700">{downloadAnalytics.summary.totalFiles}</p>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Downloads/File</h3>
          <p className="text-2xl font-bold text-pink-700">{downloadAnalytics.summary.avgDownloadsPerFile}</p>
        </div>
      </div>

      {/* Download & Upload Trend */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-gray-700">Monthly Download Statistics</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart
                data={downloadAnalytics.monthlyStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalDownloads" fill="#8884d8" name="Downloads" />
                <Bar dataKey="filesUploaded" fill="#82ca9d" name="Files Added" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Downloads */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-gray-700">Popular Downloads</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {downloadAnalytics.popularDownloads.map(download => (
                <tr key={download.id}>
                  <td className="py-2 px-3 text-sm text-gray-900">{download.title}</td>
                  <td className="py-2 px-3 text-sm text-gray-500">
                    {(download.fileSize / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-900 text-right">{download.downloadCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Downloads by Type */}
      {downloadAnalytics.downloadsByType && downloadAnalytics.downloadsByType.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-3 text-gray-700">Downloads by File Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={downloadAnalytics.downloadsByType}
                      dataKey="totalDownloads"
                      nameKey="mimeType"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ mimeType, percent }) => 
                        `${mimeType.split('/').pop()} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {downloadAnalytics.downloadsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="overflow-y-auto h-64">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {downloadAnalytics.downloadsByType.map((type, index) => (
                    <tr key={index}>
                      <td className="py-2 px-3 text-sm text-gray-900">
                        {type.mimeType.split('/').pop()}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-900 text-right">{type.fileCount}</td>
                      <td className="py-2 px-3 text-sm text-gray-900 text-right">{type.totalDownloads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )}
</div>

      <div className="flex justify-end mt-4">
        <button
          onClick={fetchAllAnalytics}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh All Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;