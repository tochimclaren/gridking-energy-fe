import { forwardRef } from 'react';
import { DateFilterRange } from 'types/table';

interface DateFilterDropdownProps {
  label: string;
  filterRange: DateFilterRange;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
}

const DateFilterDropdown = forwardRef<HTMLDivElement, DateFilterDropdownProps>(
  ({ label, filterRange, onChangeStart, onChangeEnd, onClear, onClose }, ref) => {
    return (
      <div 
        ref={ref}
        className="absolute z-10 mt-1 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-md shadow-lg p-4 border border-gray-200 right-0 min-w-64"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700 truncate pr-2">
            {label} Date Range
          </h3>
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-gray-500 hover:text-gray-700 flex-shrink-0"
          >
            Clear
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={filterRange.start || ''}
              onChange={(e) => onChangeStart(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-1 min-w-0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={filterRange.end || ''}
              onChange={(e) => onChangeEnd(e.target.value)}
              className="block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500 text-sm py-1 min-w-0"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  }
);

DateFilterDropdown.displayName = 'DateFilterDropdown';

export default DateFilterDropdown;