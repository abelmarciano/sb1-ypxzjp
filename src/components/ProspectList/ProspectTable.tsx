import React from 'react';
import { ProspectTableHeader } from './ProspectTableHeader';
import { ProspectTableRow } from './ProspectTableRow';
import { Prospect } from '../../types/prospect';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { FileSpreadsheet } from 'lucide-react';

interface ProspectTableProps {
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

export function ProspectTable({
  prospects,
  selectedIds,
  sortField,
  sortDirection,
  onSort,
  onSelectAll,
  onSelectOne,
  onProspectClick,
  isLoading
}: ProspectTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner message="Chargement des prospects..." />
      </div>
    );
  }

  if (prospects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileSpreadsheet className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-xl font-medium text-gray-900 mb-2">Aucun prospect trouvé</p>
        <p className="text-sm text-gray-500 max-w-md text-center">
          Commencez par importer des prospects ou modifiez vos filtres pour voir les résultats
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
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