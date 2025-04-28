import { ReactNode } from 'react';

export interface ColumnHeader {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
  sortable?: boolean;
  width?: string;
  filterable?: boolean;
  boolean?: boolean;
  searchable?: boolean;
  isDate?: boolean;
}

export interface DateFilterRange {
  start?: string;
  end?: string;
}

export interface DateFilters {
  [key: string]: DateFilterRange;
}

export interface ColumnFilters {
  [key: string]: string;
}

export interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export interface ActionLabels {
  update?: string;
  delete?: string;
  view?: string;
  images?: string;
}