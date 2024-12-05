import React from 'react';
import { Phone, Download, Upload, Trash2, Brain, Filter, Users, DollarSign } from 'lucide-react';

interface ProspectListToolbarProps {
  selectedCount: number;
  onCall: () => void;
  onExport: () => void;
  onDelete: () => void;
  onSmartSelect: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
  onBulkStatusUpdate: () => void;
  onBulkPriceUpdate: () => void;
}

export function ProspectListToolbar({
  selectedCount,
  onCall,
  onExport,
  onDelete,
  onSmartSelect,
  onFileChange,
  onToggleFilters,
  showFilters,
  onBulkStatusUpdate,
  onBulkPriceUpdate
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
          
          {selectedCount > 0 && (
            <>
              <button
                onClick={onCall}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Appeler ({selectedCount})
              </button>

              <button
                onClick={onBulkStatusUpdate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#2665EB] hover:bg-[#1b4bbd] transition-colors"
              >
                <Users className="h-4 w-4" />
                Modifier le statut ({selectedCount})
              </button>

              <button
                onClick={onBulkPriceUpdate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#2665EB] hover:bg-[#1b4bbd] transition-colors"
              >
                <DollarSign className="h-4 w-4" />
                Modifier les prix ({selectedCount})
              </button>

              <button
                onClick={onDelete}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer ({selectedCount})
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              showFilters
                ? 'text-white bg-[#2665EB] hover:bg-[#1b4bbd]'
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

          <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#2665EB] hover:bg-[#1b4bbd] transition-colors cursor-pointer">
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