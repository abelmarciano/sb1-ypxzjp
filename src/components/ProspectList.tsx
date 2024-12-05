import React, { useState } from 'react';
import { ProspectTable } from './ProspectTable';
import { ProspectListToolbar } from './ProspectListToolbar';
import { ProspectFilters } from './ProspectFilters';
import { ProspectDetails } from './ProspectDetails';
import { ImportPreviewModal } from './ImportPreviewModal';
import { ColumnMappingModal } from './ColumnMappingModal';
import { SmartSelectionModal } from './SmartSelectionModal';
import { CallSimulationModal } from './CallSimulationModal';
import { ExportFieldsModal } from './ExportFieldsModal';
import { BulkStatusUpdateModal } from './BulkStatusUpdateModal';
import { BulkPriceUpdateModal } from './BulkPriceUpdateModal';
import { useProspectFilters } from '../hooks/useProspectFilters';
import { useSelection } from '../hooks/useSelection';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Prospect } from '../types/prospect';
import { parseCSV, applyColumnMapping, exportToCSV, CSVError } from '../utils/csvHelpers';
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
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [importData, setImportData] = useState<any>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mappedData, setMappedData] = useState<any>(null);

  const { filters, setFilters, sortField, sortDirection, handleSort, filteredProspects } = useProspectFilters(prospects);
  const { selectedIds, handleSelectAll, handleSelectOne, handleSmartSelect, clearSelection } = useSelection();
  const [savedMappings] = useLocalStorage('columnMappings', []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data, headers } = await parseCSV(file);
      setCsvHeaders(headers);
      setImportData(data);
      setShowMappingModal(true);
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier CSV:', error);
      if (error instanceof CSVError) {
        toast.error(error.message);
      } else {
        toast.error('Erreur lors de la lecture du fichier CSV');
      }
    }
  };

  const handleMappingConfirm = (mapping: any) => {
    try {
      const mapped = applyColumnMapping(importData, mapping);
      setMappedData(mapped);
      setShowMappingModal(false);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Erreur lors du mapping:', error);
      if (error instanceof CSVError) {
        toast.error(error.message);
      } else {
        toast.error('Erreur lors du mapping des données');
      }
    }
  };

  const handleImportConfirm = (campaignId: string) => {
    if (!mappedData) return;
    onImportCSV(mappedData, campaignId);
    setShowPreviewModal(false);
    setMappedData(null);
    toast.success('Import réussi avec la campagne sélectionnée');
  };

  const handleBulkStatusUpdate = (updatedProspects: Prospect[]) => {
    updatedProspects.forEach(prospect => {
      onUpdateProspect(prospect);
    });
    clearSelection();
    setShowBulkStatusModal(false);
    toast.success(`Statut mis à jour pour ${updatedProspects.length} prospect${updatedProspects.length > 1 ? 's' : ''}`);
  };

  const handleBulkPriceUpdate = (updatedProspects: Prospect[]) => {
    updatedProspects.forEach(prospect => {
      onUpdateProspect(prospect);
    });
    clearSelection();
    setShowBulkPriceModal(false);
    toast.success(`Prix mis à jour pour ${updatedProspects.length} prospect${updatedProspects.length > 1 ? 's' : ''}`);
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
        onBulkStatusUpdate={() => setShowBulkStatusModal(true)}
        onBulkPriceUpdate={() => setShowBulkPriceModal(true)}
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
            departement: [...new Set(prospects.map(p => p.departement).filter(Boolean))],
            codePostal: [...new Set(prospects.map(p => p.codePostal).filter(Boolean))]
          }}
        />
      )}

      <ProspectTable
        prospects={filteredProspects}
        selectedIds={selectedIds}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onSelectAll={(checked) => handleSelectAll(checked, filteredProspects)}
        onSelectOne={handleSelectOne}
        onProspectClick={setSelectedProspect}
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

      <ImportPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        previewData={mappedData}
        onConfirm={handleImportConfirm}
      />

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
          handleSmartSelect(prospects, params);
          setShowSmartSelectionModal(false);
        }}
        totalProspects={filteredProspects.length}
      />

      {selectedIds.size > 0 && (
        <>
          <BulkStatusUpdateModal
            isOpen={showBulkStatusModal}
            onClose={() => setShowBulkStatusModal(false)}
            selectedProspects={selectedProspects}
            onUpdate={handleBulkStatusUpdate}
          />

          <BulkPriceUpdateModal
            isOpen={showBulkPriceModal}
            onClose={() => setShowBulkPriceModal(false)}
            selectedProspects={selectedProspects}
            onUpdate={handleBulkPriceUpdate}
          />
        </>
      )}
    </div>
  );
}