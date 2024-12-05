import React from 'react';
import { ProspectList } from '../components/ProspectList';
import { useProspects } from '../hooks/useProspects';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card } from '../components/common/Card';
import { exportToCSV } from '../utils/csvHelpers';
import toast from 'react-hot-toast';

export function ProspectsPage() {
  const { prospects, isLoading, importProspects, deleteProspects, updateProspect } = useProspects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner 
          size="lg" 
          message="Chargement des prospects..." 
          description="Connexion à la base de données et récupération des informations"
        />
      </div>
    );
  }

  const handleExportCSV = (selectedFields: string[]) => {
    try {
      exportToCSV(prospects, selectedFields);
      toast.success('Export CSV réussi');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'export CSV');
    }
  };

  const handleImportCSV = async (data: any[], campaignId: string) => {
    try {
      await importProspects(data, campaignId);
      toast.success('Import réussi');
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast.error('Erreur lors de l\'import CSV');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F1F1' }}>
      <div className="max-w-[1920px] mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Prospects</h1>
            <div className="text-sm text-gray-500">
              {prospects.length} prospect{prospects.length > 1 ? 's' : ''} au total
            </div>
          </div>
          <p className="text-gray-500 text-lg">
            Gérez vos prospects et suivez leur progression dans le tunnel de conversion
          </p>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg">
          <ProspectList
            prospects={prospects}
            onCallSelected={() => {}}
            onExportCSV={handleExportCSV}
            onImportCSV={handleImportCSV}
            onDeleteProspects={deleteProspects}
            onUpdateProspect={updateProspect}
          />
        </Card>
      </div>
    </div>
  );
}