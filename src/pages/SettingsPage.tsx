import React from 'react';
import { Card } from '../components/common/Card';
import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500">Configurez votre espace de travail</p>
      </div>

      <Card className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
            <Settings className="h-6 w-6 text-cyan-600" />
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Page des paramètres en développement
          </h2>
          <p className="text-gray-500 max-w-md">
            Cette fonctionnalité sera bientôt disponible. Vous pourrez personnaliser
            votre espace de travail et gérer vos préférences.
          </p>
        </div>
      </Card>
    </div>
  );
}