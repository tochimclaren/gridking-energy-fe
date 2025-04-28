import React, { useState, useMemo, useRef, useEffect } from 'react';
import { utils, writeFile } from 'xlsx';
import TableHeader from './TableHeader';
import SearchAndFilterBar from './SearchAndFilterBar';
import TableColumns from './TableColumns';
import TableRows from './TableRows';
import Pagination from './Pagination';
import { ColumnHeader, SortConfig, DateFilters, PaginationConfig, ActionLabels } from 'types/table';

interface TableProps {
  title: string;
  headers: ColumnHeader[];
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
  actionLabels?: ActionLabels;
  pagination?: PaginationConfig;
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
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [dateFilters, setDateFilters] = useState<DateFilters>({});
  const [openDateFilter, setOpenDateFilter] = useState<string | null>(null);
  const dateFilterRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  // Process headers to automatically detect date fields
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

  // Request a sorting change
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle row selection
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

  // Handle select all rows
  const selectAllRows = () => {
    if (selectedRows.length === sortedData.length) {
      setSelectedRows([]);
      onRowSelect?.([]);
    } else {
      setSelectedRows([...sortedData]);
      onRowSelect?.([...sortedData]);
    }
  };

  // Handle column filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle date filter change
  const handleDateFilterChange = (key: string, type: 'start' | 'end', value: string) => {
    setDateFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value
      }
    }));
  };

  // Initialize date filter if not already set
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

  // Clear date filter
  const clearDateFilter = (key: string) => {
    setDateFilters(prev => ({
      ...prev,
      [key]: { start: '', end: '' }
    }));
  };

  // Export data to CSV
  const exportToCSV = () => {
    const csvHeaders = processedHeaders.map(header => header.label);
    const csvData = sortedData.map(row => 
      processedHeaders.map(header => {
        const value = row[header.key];
        if (header.isDate) {
          const date = new Date(value);
          return isNaN(date.getTime()) ? value : date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
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

  // Export data to XLSX
  const exportToXLSX = () => {
    const wsData = [
      processedHeaders.map(header => header.label),
      ...sortedData.map(row => 
        processedHeaders.map(header => {
          const value = row[header.key];
          if (header.isDate) {
            const date = new Date(value);
            return isNaN(date.getTime()) ? value : date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
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

  return (
    <div className={`p-4 w-full ${className}`}>
      <div className="mb-4 flex flex-col gap-4">
        {/* Table Header Component */}
        <TableHeader 
          title={title}
          createBtn={createBtn}
          onExportCSV={exportToCSV}
          onExportXLSX={exportToXLSX}
        />
        
        {/* Search and Filter Bar Component */}
        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateFields={dateFields}
          dateFilters={dateFilters}
          openDateFilter={openDateFilter}
          onToggleDateFilter={toggleDateFilter}
          onDateFilterChange={handleDateFilterChange}
          onClearDateFilter={clearDateFilter}
          dateFilterRef={dateFilterRef}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Columns Component */}
          <TableColumns
            headers={processedHeaders}
            sortConfig={sortConfig}
            filters={filters}
            onRequestSort={requestSort}
            onFilterChange={handleFilterChange}
            selectable={selectable}
            showActions={showActions}
            allSelected={selectedRows.length === sortedData.length && sortedData.length > 0}
            onSelectAll={selectAllRows}
          />
          
          {/* Table Rows Component */}
          <TableRows
            data={sortedData}
            headers={processedHeaders}
            keyField={keyField}
            selectable={selectable}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            showActions={showActions}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onView={onView}
            onImages={onImages}
            actionLabels={actionLabels}
          />
        </table>
      </div>

      {/* Pagination Component */}
      {pagination && (
        <Pagination pagination={pagination} />
      )}
    </div>
  );
};

export default Table;