import { useState, useEffect } from 'react';
import { BarChart, Users, ShoppingBag, MessageSquare, ChevronDown, ChevronUp, RefreshCw, AlertTriangle, FileText, Download } from 'lucide-react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsSummary {
  totalUsers: number;
  totalCategories: number;
  totalDownloads: number;
  totalEnquiries: number;
  totalQuotes: number;
  totalImages: number;
  totalProducts: number;
  totalGalleries: number;
  activeUsers?: number;
  downloadStats?: {
    totalDownloads: number;
    downloadsThisMonth: number;
  };
}

interface ProductAnalytics {
  topViewedProducts: Array<{ _id: string; name: string; views: number }>;
  productsByCategory: Array<{ _id: string; name: string; productCount: number }>;
}

interface ConversionAnalytics {
  totalEnquiries: number;
  totalQuotes: number;
  conversionRate: string;
  enquiriesTrend: Array<{ period: string; count: number }>;
  quotesTrend: Array<{ period: string; count: number }>;
}

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [detailedAnalytics, setDetailedAnalytics] = useState<AnalyticsSummary | null>(null);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics | null>(null);
  const [conversionAnalytics, setConversionAnalytics] = useState<ConversionAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    products: true,
    conversions: true
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
      const [summaryRes, detailedRes, productRes, conversionRes] = await Promise.all([
        fetch(`${BASE_URL}/analytic/summary`),
        fetch(`${BASE_URL}/analytic/detailed`),
        fetch(`${BASE_URL}/analytic/products`),
        fetch(`${BASE_URL}/analytic/conversions`)
      ]);

      // Check for errors
      if (!summaryRes.ok || !detailedRes.ok || !productRes.ok || !conversionRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      // Parse responses
      const summaryData = await summaryRes.json();
      const detailedData = await detailedRes.json();
      const productData = await productRes.json();
      const conversionData = await conversionRes.json();

      // Update state
      setSummary(summaryData.data);
      setDetailedAnalytics(detailedData.data);
      setProductAnalytics(productData.data);
      setConversionAnalytics(conversionData.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching analytics:', err);
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

      <div className="flex justify-end mt-4">
        <button
          onClick={fetchAllAnalytics}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh All Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;