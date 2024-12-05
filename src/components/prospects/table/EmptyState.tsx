import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export function EmptyState() {
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