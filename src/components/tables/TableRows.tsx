import React from 'react';
import { Check, X, Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { ColumnHeader, ActionLabels } from 'types/table';

interface TableRowsProps {
  data: Array<Record<string, any>>;
  headers: ColumnHeader[];
  keyField: string;
  selectable: boolean;
  selectedRows: any[];
  onRowSelect: (row: any) => void;
  showActions: boolean;
  onUpdate?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  onImages?: (row: any) => void;
  actionLabels: ActionLabels;
}

const TableRows: React.FC<TableRowsProps> = ({
  data,
  headers,
  keyField,
  selectable,
  selectedRows,
  onRowSelect,
  showActions,
  onUpdate,
  onDelete,
  onView,
  onImages,
  actionLabels
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  if (data.length === 0) {
    return (
      <tbody className="bg-white divide-y divide-gray-200">
        <tr>
          <td 
            colSpan={headers.length + (selectable ? 1 : 0) + (showActions ? 1 : 0)} 
            className="px-6 py-4 text-center text-sm text-gray-500"
          >
            No data available
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((row) => (
        <tr
          key={row[keyField]}
          className={selectedRows.some(selected => selected[keyField] === row[keyField]) ? 'bg-blue-50' : 'hover:bg-gray-50'}
        >
          {selectable && (
            <td className="px-6 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                checked={selectedRows.some(selected => selected[keyField] === row[keyField])}
                onChange={() => onRowSelect(row)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </td>
          )}
          {headers.map((header) => (
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
      ))}
    </tbody>
  );
};

export default TableRows;