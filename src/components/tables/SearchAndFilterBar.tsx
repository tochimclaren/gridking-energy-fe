import React from 'react';
import { Search, Calendar, ChevronDown } from 'lucide-react';
import { ColumnHeader, DateFilters } from 'types/table';
import DateFilterDropdown from './DateFilterDropdown';

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFields: ColumnHeader[];
  dateFilters: DateFilters;
  openDateFilter: string | null;
  onToggleDateFilter: (key: string) => void;
  onDateFilterChange: (key: string, type: 'start' | 'end', value: string) => void;
  onClearDateFilter: (key: string) => void;
  dateFilterRef: React.RefObject<HTMLDivElement>;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  dateFields,
  dateFilters,
  openDateFilter,
  onToggleDateFilter,
  onDateFilterChange,
  onClearDateFilter,
  dateFilterRef
}) => {
  const isDateFilterActive = (key: string) => {
    return dateFilters[key]?.start || dateFilters[key]?.end;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search across all text fields..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 ml-auto">
          {dateFields.map(header => (
            <div key={`date-filter-btn-${header.key}`} className="relative">
              <button
                type="button"
                onClick={() => onToggleDateFilter(header.key)}
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
              
              {openDateFilter === header.key && (
                <DateFilterDropdown
                  ref={dateFilterRef}
                  label={header.label}
                  filterRange={dateFilters[header.key] || { start: '', end: '' }}
                  onChangeStart={(value) => onDateFilterChange(header.key, 'start', value)}
                  onChangeEnd={(value) => onDateFilterChange(header.key, 'end', value)}
                  onClear={() => onClearDateFilter(header.key)}
                  onClose={() => onToggleDateFilter(header.key)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;