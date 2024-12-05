import React, { useState } from 'react';
import { ProspectTable } from './ProspectTable';
import { ProspectListToolbar } from './ProspectListToolbar';
import { ProspectFilters } from '../ProspectFilters';
import { ProspectDetails } from '../ProspectDetails';
import { ImportPreviewModal } from '../ImportPreviewModal';
import { ColumnMappingModal } from '../ColumnMappingModal';
import { SmartSelectionModal } from '../SmartSelectionModal';
import { CallSimulationModal } from '../CallSimulationModal';
import { ExportFieldsModal } from '../ExportFieldsModal';
import { useProspectFilters } from '../../hooks/useProspectFilters';
import { useSelection } from '../../hooks/useSelection';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Prospect } from '../../types/prospect';
import { parseCSV, applyColumnMapping, validateImportedData } from '../../utils/csvHelpers';
import toast from 'react-hot-toast';

interface ProspectListProps {
  prospects: Prospect[];
  onCallSelected: (prospects: Prospect[]) => void;
  onExportCSV: (selectedFields: string[]) => void;
  onImportCSV: (data: Partial<Prospect>[], campaignId: string) => void;
  onDeleteProspects: (ids: Set<string>) => void;
  onUpdateProspect: (prospect: Prospect) => void;
}

export function ProspectList({
  prospects,
  onCallSelected,
  onExportCSV,
  onImportCSV,
  onDeleteProspects,
  onUpdateProspect
}: ProspectListProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showCallSimulation, setShowCallSimulation] = useState(false);
  const [showExportFields, setShowExportFields] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSmartSelectionModal, setShowSmartSelectionModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [importData, setImportData] = useState<any>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mappedData, setMappedData] = useState<any>(null);

  const { filters, setFilters, sortField, sortDirection, handleSort, filteredProspects } = useProspectFilters(prospects);
  const { selectedIds, handleSelectAll, handleSelectOne, clearSelection } = useSelection();
  const [savedMappings] = useLocalStorage('columnMappings', []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data, headers } = await parseCSV(file);
      setCsvHeaders(headers);
      setImportData(data);
      setShowMappingModal(true);
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier CSV:', error);
      toast.error('Erreur lors de la lecture du fichier CSV');
    }
  };

  const handleMappingConfirm = (mapping: any) => {
    try {
      const mapped = applyColumnMapping(importData, mapping);
      const validated = validateImportedData(mapped);
      setMappedData(validated);
      setShowMappingModal(false);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Erreur lors du mapping:', error);
      toast.error('Erreur lors du mapping des données');
    }
  };

  const handleImportConfirm = (campaignId: string) => {
    if (!mappedData?.validProspects) return;
    
    onImportCSV(mappedData.validProspects, campaignId);
    setShowPreviewModal(false);
    setMappedData(null);
    toast.success('Import réussi avec la campagne sélectionnée');
  };

  const handleProspectClick = (prospect: Prospect) => {
    setSelectedProspect(prospect);
  };

  const selectedProspects = Array.from(selectedIds)
    .map(id => prospects.find(p => p.id === id))
    .filter((p): p is Prospect => p !== undefined);

  return (
    <div className="flex flex-col h-full">
      <ProspectListToolbar
        selectedCount={selectedIds.size}
        onCall={() => setShowCallSimulation(true)}
        onExport={() => setShowExportFields(true)}
        onDelete={() => {
          onDeleteProspects(selectedIds);
          clearSelection();
        }}
        onSmartSelect={() => setShowSmartSelectionModal(true)}
        onFileChange={handleFileChange}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />

      {showFilters && (
        <ProspectFilters
          filters={filters}
          onFilterChange={setFilters}
          showAdvanced={showFilters}
          onToggleAdvanced={() => setShowFilters(!showFilters)}
          uniqueValues={{
            modeChauffage: [...new Set(prospects.map(p => p.modeChauffage).filter(Boolean))],
            campagne: [...new Set(prospects.map(p => p.campagne).filter(Boolean))],
            departement: [...new Set(prospects.map(p => p.departement).filter(Boolean))]
          }}
        />
      )}

      <ProspectTable
        prospects={filteredProspects}
        selectedIds={selectedIds}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onProspectClick={handleProspectClick}
      />

      {selectedProspect && (
        <ProspectDetails
          prospect={selectedProspect}
          onClose={() => setSelectedProspect(null)}
          onUpdate={(updatedProspect) => {
            onUpdateProspect(updatedProspect);
            setSelectedProspect(updatedProspect);
          }}
        />
      )}

      <ColumnMappingModal
        isOpen={showMappingModal}
        onClose={() => setShowMappingModal(false)}
        csvHeaders={csvHeaders}
        onConfirm={handleMappingConfirm}
        savedMappings={savedMappings}
        onSaveMapping={(config) => {
          const newMappings = [...savedMappings, config];
          localStorage.setItem('columnMappings', JSON.stringify(newMappings));
        }}
      />

      {mappedData && (
        <ImportPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          previewData={mappedData}
          onConfirm={handleImportConfirm}
        />
      )}

      <CallSimulationModal
        isOpen={showCallSimulation}
        onClose={() => setShowCallSimulation(false)}
        prospects={selectedProspects}
        onComplete={(results) => {
          setShowCallSimulation(false);
          clearSelection();
          toast.success(`Campagne d'appels terminée : ${results.leads} leads générés`);
        }}
      />

      <ExportFieldsModal
        isOpen={showExportFields}
        onClose={() => setShowExportFields(false)}
        onConfirm={onExportCSV}
      />

      <SmartSelectionModal
        isOpen={showSmartSelectionModal}
        onClose={() => setShowSmartSelectionModal(false)}
        onConfirm={(params) => {
          // Handle smart selection
          setShowSmartSelectionModal(false);
        }}
        totalProspects={filteredProspects.length}
      />
    </div>
  );
}