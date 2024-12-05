import React from 'react';
import { Phone, Download, Upload, Trash2, Brain } from 'lucide-react';
import { theme } from '../constants/theme';

interface ProspectListActionsProps {
  selectedCount: number;
  onCall: () => void;
  onExport: () => void;
  onDelete: () => void;
  onSmartSelect: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProspectListActions({
  selectedCount,
  onCall,
  onExport,
  onDelete,
  onSmartSelect,
  onFileChange
}: ProspectListActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onSmartSelect}
        className="px-3 py-1.5 text-sm text-white rounded flex items-center gap-1.5 shadow-sm"
        style={{ backgroundColor: theme.colors.secondary.main }}
      >
        <Brain className="h-4 w-4" />
        Sélection
      </button>
      {selectedCount > 0 && (
        <button
          onClick={onDelete}
          className="px-3 py-1.5 text-sm text-white rounded flex items-center gap-1.5 shadow-sm"
          style={{ backgroundColor: theme.colors.danger.main }}
        >
          <Trash2 className="h-4 w-4" />
          Suppr. ({selectedCount})
        </button>
      )}
      <button
        onClick={onCall}
        disabled={selectedCount === 0}
        className="px-3 py-1.5 text-sm text-white rounded flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: theme.colors.success.main }}
      >
        <Phone className="h-4 w-4" />
        Appeler ({selectedCount})
      </button>
      <button
        onClick={onExport}
        className="px-3 py-1.5 text-sm text-white rounded flex items-center gap-1.5 shadow-sm"
        style={{ backgroundColor: theme.colors.secondary.main }}
      >
        <Download className="h-4 w-4" />
        Export
      </button>
      <label
        className="px-3 py-1.5 text-sm text-white rounded flex items-center gap-1.5 shadow-sm cursor-pointer"
        style={{ backgroundColor: theme.colors.primary.main }}
      >
        <Upload className="h-4 w-4" />
        Import
        <input
          type="file"
          accept=".csv"
          onChange={onFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}