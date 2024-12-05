import React, { useState } from 'react';
import { ProspectTable } from './ProspectTable';
import { TablePagination } from './TablePagination';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { Prospect } from '../../../types/prospect';

interface ProspectTableContainerProps {
  prospects: Prospect[];
  selectedIds: Set<string>;
  sortField: keyof Prospect;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Prospect) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onProspectClick: (prospect: Prospect) => void;
  isLoading?: boolean;
}

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function ProspectTableContainer({
  prospects,
  selectedIds,
  sortField,
  sortDirection,
  onSort,
  onSelectAll,
  onSelectOne,
  onProspectClick,
  isLoading
}: ProspectTableContainerProps) {
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return <LoadingState />;
  }

  if (prospects.length === 0) {
    return <EmptyState />;
  }

  const totalPages = Math.ceil(prospects.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, prospects.length);
  const currentProspects = prospects.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col">
      <ProspectTable
        prospects={currentProspects}
        selectedIds={selectedIds}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
        onSelectAll={onSelectAll}
        onSelectOne={onSelectOne}
        onProspectClick={onProspectClick}
      />

      <TablePagination
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={prospects.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}