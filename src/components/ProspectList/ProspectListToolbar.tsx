import React from 'react';
import { Phone, Download, Upload, Trash2, Brain, Filter } from 'lucide-react';
import { theme } from '../../constants/theme';

interface ProspectListToolbarProps {
  selectedCount: number;
  onCall: () => void;
  onExport: () => void;
  onDelete: () => void;
  onSmartSelect: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export function ProspectListToolbar({
  selectedCount,
  onCall,
  onExport,
  onDelete,
  onSmartSelect,
  onFileChange,
  onToggleFilters,
  showFilters
}: ProspectListToolbarProps) {
  return (
    <div className="p-4 border-b bg-white">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <button
            onClick={onSmartSelect}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <Brain className="h-4 w-4" />
            Sélection intelligente
          </button>
          
          <button
            onClick={onCall}
            disabled={selectedCount === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
          >
            <Phone className="h-4 w-4" />
            Appeler {selectedCount > 0 && `(${selectedCount})`}
          </button>

          {selectedCount > 0 && (
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer ({selectedCount})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              showFilters
                ? 'text-white bg-cyan-500 hover:bg-cyan-600'
                : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filtres
          </button>

          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            Exporter
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 transition-colors cursor-pointer">
            <Upload className="h-4 w-4" />
            Importer
            <input
              type="file"
              accept=".csv"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}