import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Prospect } from '../types/prospect';

interface ProspectTableHeaderProps {
  sortField: keyof Prospect;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Prospect) => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
}

export function ProspectTableHeader({
  sortField,
  sortDirection,
  onSort,
  selectedCount,
  totalCount,
  onSelectAll
}: ProspectTableHeaderProps) {
  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'telephone', label: 'Tél.' },
    { key: 'email', label: 'Email' },
    { key: 'ville', label: 'Ville' },
    { key: 'campagne', label: 'Camp.' },
    { key: 'prospectPrice', label: 'Prix prospect' },
    { key: 'status', label: 'Statut' },
    { key: 'proprietaire', label: 'Prop.' },
    { key: 'codePostal', label: 'CP' },
    { key: 'departement', label: 'Dép.' },
    { key: 'modeChauffage', label: 'Chauff.' },
    { key: 'montantElectricite', label: 'Élec.' },
    { key: 'revenus', label: 'Rev.' },
    { key: 'credit', label: 'Crédit' },
    { key: 'solution', label: 'Sol.' },
    { key: 'leadPrice', label: 'Prix lead' },
    { key: 'dateCreation', label: 'Import' },
    { key: 'dernierAppel', label: 'Appel' }
  ];

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <thead className="bg-gray-50 text-sm uppercase tracking-wider text-gray-500">
      <tr>
        <th className="px-3 py-2 text-left">
          <div className="flex items-center gap-2" onClick={handleCheckboxClick}>
            <input
              type="checkbox"
              checked={selectedCount === totalCount && totalCount > 0}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-[#2665EB] focus:ring-[#2665EB] cursor-pointer"
            />
            {selectedCount > 0 && (
              <span className="text-xs font-medium text-gray-700">
                {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </th>
        {columns.map(({ key, label }) => (
          <th
            key={key}
            onClick={() => onSort(key as keyof Prospect)}
            className="px-3 py-2 text-left cursor-pointer whitespace-nowrap font-medium"
          >
            <div className="flex items-center gap-1">
              {label}
              {sortField === key && (
                sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}