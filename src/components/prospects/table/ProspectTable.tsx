import React from 'react';
import { ProspectTableHeader } from './ProspectTableHeader';
import { ProspectTableRow } from './ProspectTableRow';
import { Prospect } from '../../../types/prospect';

interface ProspectTableProps {
  prospects: Prospect[];
  selectedIds: Set<string>;
  sortField: keyof Prospect;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Prospect) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onProspectClick: (prospect: Prospect) => void;
}

export function ProspectTable({
  prospects,
  selectedIds,
  sortField,
  sortDirection,
  onSort,
  onSelectAll,
  onSelectOne,
  onProspectClick
}: ProspectTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <ProspectTableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          selectedCount={selectedIds.size}
          totalCount={prospects.length}
          onSelectAll={onSelectAll}
        />
        <tbody className="divide-y divide-gray-100">
          {prospects.map(prospect => (
            <ProspectTableRow
              key={prospect.id}
              prospect={prospect}
              isSelected={selectedIds.has(prospect.id)}
              onSelect={onSelectOne}
              onClick={() => onProspectClick(prospect)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}