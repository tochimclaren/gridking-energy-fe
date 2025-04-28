import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Check, X, Edit, Trash2, Eye, Image as ImageIcon, Calendar, Download } from 'lucide-react';
import { utils, writeFile } from 'xlsx';

interface TableProps {
  title: string;
  headers: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    sortable?: boolean;
    width?: string;
    filterable?: boolean;
    boolean?: boolean;
    searchable?: boolean;
    isDate?: boolean;
  }[];
  data: Array<Record<string, any>>;
  keyField?: string;
  selectable?: boolean;
  onRowSelect?: (selectedRows: any[]) => void;
  createBtn?: React.ReactNode;
  className?: string;
  showActions?: boolean;
  onUpdate?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  onImages?: (row: any) => void;
  actionLabels?: {
    update?: string;
    delete?: string;
    view?: string;
    images?: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  };
}

const Table: React.FC<TableProps> = ({
  title,
  headers,
  data,
  keyField = 'id',
  selectable = false,
  onRowSelect,
  createBtn,
  className = '',
  showActions = false,
  onUpdate,
  onDelete,
  onView,
  onImages,
  actionLabels = { update: 'Edit', delete: 'Delete', view: 'View', images: 'Images' },
  pagination,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [dateFilters, setDateFilters] = useState<Record<string, { start?: string; end?: string }>>({});
  const [openDateFilter, setOpenDateFilter] = useState<string | null>(null);
  const dateFilterRef = useRef<HTMLDivElement>(null);

  // Function to export data to CSV
  const exportToCSV = () => {
    const csvHeaders = headers.map(header => header.label);
    const csvData = sortedData.map(row => 
      headers.map(header => {
        const value = row[header.key];
        if (header.isDate) return formatDate(value);
        if (header.boolean) return value ? 'Yes' : 'No';
        return value;
      })
    );

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export data to XLSX
  const exportToXLSX = () => {
    const wsData = [
      headers.map(header => header.label),
      ...sortedData.map(row => 
        headers.map(header => {
          const value = row[header.key];
          if (header.isDate) return formatDate(value);
          if (header.boolean) return value ? 'Yes' : 'No';
          return value;
        })
      )
    ];

    const ws = utils.aoa_to_sheet(wsData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, `${title.replace(/\s+/g, '_')}_export.xlsx`);
  };

  // Pre-process headers to automatically detect date fields
  const processedHeaders = useMemo(() => {
    return headers.map(header => {
      if (header.key === 'createdAt' || header.key === 'updatedAt') {
        return { ...header, isDate: true };
      }
      return header;
    });
  }, [headers]);

  // Get date fields for filtering
  const dateFields = useMemo(() => {
    return processedHeaders.filter(header => header.isDate);
  }, [processedHeaders]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle clicks outside the date filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
        setOpenDateFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter data based on search term, column filters, and date filters
  const filteredData = useMemo(() => {
    return data.filter(row => {
      // Universal search across all searchable text fields
      const matchesSearch = searchTerm === '' || 
        processedHeaders.some(header => {
          if (header.searchable === false || header.boolean) return false;
          const value = row[header.key];
          return value !== undefined && 
                 value !== null && 
                 String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });

      // Check column filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const rowValue = row[key];
        const header = processedHeaders.find(h => h.key === key);
        
        if (header?.boolean) {
          return value === 'all' || 
            (value === 'true' && rowValue) || 
            (value === 'false' && !rowValue);
        }
        return String(rowValue).toLowerCase().includes(value.toLowerCase());
      });

      // Check date filters
      const matchesDateFilters = Object.entries(dateFilters).every(([key, { start, end }]) => {
        if ((!start || start === '') && (!end || end === '')) return true;
        
        const rowDate = new Date(row[key]);
        if (isNaN(rowDate.getTime())) return false;
        
        const startDate = start ? new Date(start) : null;
        const endDate = end ? new Date(end) : null;
        
        if (startDate && endDate) {
          // Set end date to end of the day
          endDate.setHours(23, 59, 59, 999);
          return rowDate >= startDate && rowDate <= endDate;
        } else if (startDate) {
          return rowDate >= startDate;
        } else if (endDate) {
          // Set end date to end of the day
          endDate.setHours(23, 59, 59, 999);
          return rowDate <= endDate;
        }
        
        return true;
      });

      return matchesSearch && matchesFilters && matchesDateFilters;
    });
  }, [data, searchTerm, filters, dateFilters, processedHeaders]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const header = processedHeaders.find(h => h.key === sortConfig.key);
        
        if (header?.isDate) {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0;
          }
          return sortConfig.direction === 'ascending' 
            ? dateA.getTime() - dateB.getTime() 
            : dateB.getTime() - dateA.getTime();
        }
        
        if (header?.boolean) {
          const aValue = a[sortConfig.key] ? 1 : 0;
          const bValue = b[sortConfig.key] ? 1 : 0;
          return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig, processedHeaders]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRowSelect = (row: any) => {
    let newSelectedRows;
    if (selectedRows.some(selected => selected[keyField] === row[keyField])) {
      newSelectedRows = selectedRows.filter(selected => selected[keyField] !== row[keyField]);
    } else {
      newSelectedRows = [...selectedRows, row];
    }
    setSelectedRows(newSelectedRows);
    onRowSelect?.(newSelectedRows);
  };

  const selectAllRows = () => {
    if (selectedRows.length === sortedData.length) {
      setSelectedRows([]);
      onRowSelect?.([]);
    } else {
      setSelectedRows([...sortedData]);
      onRowSelect?.([...sortedData]);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateFilterChange = (key: string, type: 'start' | 'end', value: string) => {
    setDateFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value
      }
    }));
  };

  // Initialize date filters if not already set
  const initializeDateFilter = (key: string) => {
    if (!dateFilters[key]) {
      setDateFilters(prev => ({
        ...prev,
        [key]: { start: '', end: '' }
      }));
    }
  };

  // Toggle date filter dropdown
  const toggleDateFilter = (key: string) => {
    setOpenDateFilter(prevKey => prevKey === key ? null : key);
    initializeDateFilter(key);
  };

  // Check if date filter is active
  const isDateFilterActive = (key: string) => {
    return dateFilters[key]?.start || dateFilters[key]?.end;
  };

  // Clear date filter
  const clearDateFilter = (key: string) => {
    setDateFilters(prev => ({
      ...prev,
      [key]: { start: '', end: '' }
    }));
  };

  const renderBoolean = (value: boolean) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {value ? (
        <>
          <Check className="h-3 w-3 mr-1" />
          Yes
        </>
      ) : (
        <>
          <X className="h-3 w-3 mr-1" />
          No
        </>
      )}
    </span>
  );

  return (
    <div className={`p-4 w-full ${className}`}>
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-2 align-middle">
            {createBtn}
            <div className="relative inline-block">
              <button
                type="button"
                className="inline-flex items-center px-4 py-3 border border-gray-300  text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => document.getElementById('export-dropdown')?.classList.toggle('hidden')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <div
                id="export-dropdown"
                className="hidden absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={exportToCSV}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                    role="menuitem"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={exportToXLSX}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                    role="menuitem"
                  >
                    Export as Excel
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        
        {/* Combined search and date filter buttons in one full-width block */}
        <div className="w-full">
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-2"> */}
          <div className='flex justify-between'>
            {/* Search input spans full width on small screens, 1/3 on larger screens */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search across all text fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Date filter buttons */}
            <div className="flex flex-wrap gap-2 ml-auto">
              {dateFields.map(header => (
                <div key={`date-filter-btn-${header.key}`} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDateFilter(header.key)}
                    className={`flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isDateFilterActive(header.key)
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {header.label} Filter
                    {isDateFilterActive(header.key) && (
                      <span className="ml-1 bg-blue-500 text-white rounded-full w-2 h-2"></span>
                    )}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                  
                  {/* Collapsible date filter dropdown */}
                  {openDateFilter === header.key && (
                    <div 
                      ref={dateFilterRef}
                      className="absolute z-10 mt-1 w-72 bg-white rounded-md shadow-lg p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-700">
                          {header.label} Date Range
                        </h3>
                        <button
                          type="button"
                          onClick={() => clearDateFilter(header.key)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                          <input
                            type="date"
                            value={(dateFilters[header.key]?.start || '')}
                            onChange={(e) => handleDateFilterChange(header.key, 'start', e.target.value)}
                            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                          <input
                            type="date"
                            value={(dateFilters[header.key]?.end || '')}
                            onChange={(e) => handleDateFilterChange(header.key, 'end', e.target.value)}
                            className="block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-1"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setOpenDateFilter(null)}
                            className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                    onChange={selectAllRows}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {processedHeaders.map((header) => (
                <th
                  key={header.key}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    header.width ? `w-${header.width}` : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <div
                      className={`flex items-center ${header.sortable ? 'cursor-pointer hover:text-gray-700' : ''}`}
                      onClick={() => header.sortable && requestSort(header.key)}
                    >
                      {header.label}
                      {header.sortable && sortConfig?.key === header.key && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                    
                    {header.filterable && !header.isDate && (
                      <div className="mt-1">
                        {header.boolean ? (
                          <select
                            value={filters[header.key] || 'all'}
                            onChange={(e) => handleFilterChange(header.key, e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs py-1"
                          >
                            <option value="all">All</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder={`Filter ${header.label}`}
                            value={filters[header.key] || ''}
                            onChange={(e) => handleFilterChange(header.key, e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs py-1 px-2"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {showActions && (
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <tr
                  key={row[keyField]}
                  className={selectedRows.some(selected => selected[keyField] === row[keyField]) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                >
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.some(selected => selected[keyField] === row[keyField])}
                        onChange={() => handleRowSelect(row)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {processedHeaders.map((header) => (
                    <td
                      key={`${row[keyField]}-${header.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {header.render 
                        ? header.render(row[header.key], row)
                        : header.boolean
                          ? renderBoolean(row[header.key])
                          : header.isDate
                            ? formatDate(row[header.key])
                            : row[header.key]}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        {onUpdate && (
                          <button
                            onClick={() => onUpdate(row)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md flex items-center gap-1"
                            title={actionLabels.update}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">{actionLabels.update}</span>
                          </button>
                        )}
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md flex items-center gap-1"
                            title={actionLabels.view}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">{actionLabels.view}</span>
                          </button>
                        )}
                        {onImages && (
                          <button
                            onClick={() => onImages(row)}
                            className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-md flex items-center gap-1"
                            title={actionLabels.images}
                          >
                            <ImageIcon className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">{actionLabels.images}</span>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md flex items-center gap-1"
                            title={actionLabels.delete}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">{actionLabels.delete}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={processedHeaders.length + (selectable ? 1 : 0) + (showActions ? 1 : 0)} 
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => pagination.onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.page === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  disabled={pagination.page * pagination.limit >= pagination.total}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;