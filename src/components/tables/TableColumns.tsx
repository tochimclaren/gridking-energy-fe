import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ColumnHeader, SortConfig, ColumnFilters } from 'types/table';

interface TableColumnsProps {
  headers: ColumnHeader[];
  sortConfig: SortConfig | null;
  filters: ColumnFilters;
  onRequestSort: (key: string) => void;
  onFilterChange: (key: string, value: string) => void;
  selectable: boolean;
  showActions: boolean;
  allSelected: boolean;
  onSelectAll: () => void;
}

const TableColumns: React.FC<TableColumnsProps> = ({
  headers,
  sortConfig,
  filters,
  onRequestSort,
  onFilterChange,
  selectable,
  showActions,
  allSelected,
  onSelectAll
}) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        {selectable && (
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </th>
        )}
        {headers.map((header) => (
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
                onClick={() => header.sortable && onRequestSort(header.key)}
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
                      onChange={(e) => onFilterChange(header.key, e.target.value)}
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
                      onChange={(e) => onFilterChange(header.key, e.target.value)}
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
  );
};

export default TableColumns;