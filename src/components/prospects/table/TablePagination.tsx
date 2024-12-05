import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RowsPerPageSelect } from './RowsPerPageSelect';
import { ROWS_PER_PAGE_OPTIONS } from './ProspectTableContainer';

interface TablePaginationProps {
  rowsPerPage: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
}

export function TablePagination({
  rowsPerPage,
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onRowsPerPageChange
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <RowsPerPageSelect
        value={rowsPerPage}
        onChange={onRowsPerPageChange}
        options={ROWS_PER_PAGE_OPTIONS}
      />

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {startIndex + 1}-{endIndex} sur {totalItems}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                const distance = Math.abs(page - currentPage);
                return distance === 0 || distance === 1 || page === 1 || page === totalPages;
              })
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-[#2665EB] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}