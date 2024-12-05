import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { ColumnMapping, MappingConfig, CRM_FIELD_OPTIONS } from '../types/columnMapping';
import { theme } from '../constants/theme';

interface ColumnMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  csvHeaders: string[];
  onConfirm: (mapping: ColumnMapping[]) => void;
  savedMappings: MappingConfig[];
  onSaveMapping: (config: MappingConfig) => void;
}

export function ColumnMappingModal({
  isOpen,
  onClose,
  csvHeaders,
  onConfirm,
  savedMappings,
  onSaveMapping
}: ColumnMappingModalProps) {
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [newMappingName, setNewMappingName] = useState('');
  const [selectedMapping, setSelectedMapping] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setMappings(
        csvHeaders.map(header => ({
          csvHeader: header,
          crmField: guessField(header)
        }))
      );
    }
  }, [isOpen, csvHeaders]);

  const guessField = (header: string): string => {
    const normalized = header.toLowerCase().trim().replace(/[^a-z]/g, '');
    
    const fieldMap: Record<string, string> = {
      nom: 'nom',
      name: 'nom',
      lastname: 'nom',
      prenom: 'prenom',
      firstname: 'prenom',
      email: 'email',
      mail: 'email',
      telephone: 'telephone',
      phone: 'telephone',
      tel: 'telephone',
      ville: 'ville',
      city: 'ville',
      campagne: 'campagne',
      campaign: 'campagne',
      proprietaire: 'proprietaire',
      owner: 'proprietaire',
      codepostal: 'codePostal',
      zipcode: 'codePostal',
      departement: 'departement',
      chauffage: 'modeChauffage',
      electricite: 'montantElectricite',
      revenus: 'revenus',
      income: 'revenus',
      credit: 'credit',
      solution: 'solution'
    };

    return fieldMap[normalized] || '';
  };

  const handleMappingChange = (csvHeader: string, crmField: string) => {
    setMappings(prev =>
      prev.map(m =>
        m.csvHeader === csvHeader ? { ...m, crmField } : m
      )
    );
  };

  const handleSaveMapping = () => {
    if (newMappingName.trim()) {
      onSaveMapping({
        name: newMappingName.trim(),
        mappings
      });
      setNewMappingName('');
    }
  };

  const handleLoadMapping = (configName: string) => {
    const config = savedMappings.find(m => m.name === configName);
    if (config) {
      setMappings(config.mappings);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Configuration du mapping des colonnes</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {savedMappings.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Charger une configuration sauvegardée
              </label>
              <select
                value={selectedMapping}
                onChange={(e) => {
                  setSelectedMapping(e.target.value);
                  handleLoadMapping(e.target.value);
                }}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Sélectionner une configuration</option>
                {savedMappings.map(config => (
                  <option key={config.name} value={config.name}>
                    {config.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-4">
            {mappings.map(({ csvHeader, crmField }) => (
              <div key={csvHeader} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Colonne CSV: {csvHeader}
                  </label>
                  <select
                    value={crmField}
                    onChange={(e) => handleMappingChange(csvHeader, e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Sélectionner un champ</option>
                    {CRM_FIELD_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sauvegarder cette configuration
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMappingName}
                onChange={(e) => setNewMappingName(e.target.value)}
                placeholder="Nom de la configuration"
                className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleSaveMapping}
                disabled={!newMappingName.trim()}
                className="px-4 py-2 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: theme.colors.secondary.main }}
              >
                <Save className="h-4 w-4" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(mappings)}
            className="px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: theme.colors.primary.main }}
          >
            Confirmer le mapping
          </button>
        </div>
      </div>
    </div>
  );
}