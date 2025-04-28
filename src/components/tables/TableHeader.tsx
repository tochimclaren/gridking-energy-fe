import React from 'react';
import { Download } from 'lucide-react';

interface TableHeaderProps {
  title: string;
  createBtn?: React.ReactNode;
  onExportCSV: () => void;
  onExportXLSX: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  createBtn,
  onExportCSV,
  onExportXLSX
}) => {
  const toggleExportDropdown = () => {
    document.getElementById('export-dropdown')?.classList.toggle('hidden');
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex items-center gap-2">
        <div className="flex gap-2 align-middle">
          {createBtn}
          <div className="relative inline-block">
            <button
              type="button"
              className="inline-flex items-center px-4 py-3 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={toggleExportDropdown}
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
                  onClick={onExportCSV}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  Export as CSV
                </button>
                <button
                  onClick={onExportXLSX}
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
  );
};

export default TableHeader;