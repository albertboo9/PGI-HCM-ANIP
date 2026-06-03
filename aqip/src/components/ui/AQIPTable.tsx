import React from 'react';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  className?: string;
}

interface AQIPTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
}

export default function AQIPTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className,
  emptyMessage = "Aucune donnée disponible"
}: AQIPTableProps<T>) {
  
  return (
    <div className={clsx('w-full overflow-x-auto rounded-lg border border-aqip-border bg-aqip-bg-surface', className)}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-aqip-bg-elevated text-aqip-text-muted">
          <tr>
            {columns.map((col, i) => (
              <th key={i} scope="col" className={clsx('px-6 py-3 font-semibold tracking-wider', col.className)}>
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && <div className="flex flex-col"><ChevronUp className="h-2 w-2"/><ChevronDown className="h-2 w-2 -mt-1"/></div>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-aqip-border">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-aqip-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr 
                key={keyExtractor(row)} 
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  'bg-aqip-bg-surface transition-colors',
                  onRowClick ? 'cursor-pointer hover:bg-aqip-bg-elevated' : ''
                )}
              >
                {columns.map((col, j) => (
                  <td key={j} className={clsx('px-6 py-4 whitespace-nowrap text-aqip-text-primary', col.className)}>
                    {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
