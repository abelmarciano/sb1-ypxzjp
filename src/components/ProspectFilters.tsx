import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProspectStatus } from '../types/prospect';
import { STATUS_LABELS } from '../constants/status';
import { DepartmentSearch } from './DepartmentSearch';
import Select from 'react-select';

interface FilterValues {
  search: string;
  status: ProspectStatus[];
  proprietaire: string;
  credit: string;
  modeChauffage: string[];
  campagne: string[];
  departements: string[];
  codePostal: string[];
  montantMin: string;
  montantMax: string;
  revenusMin: string;
  revenusMax: string;
}

interface ProspectFiltersProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  uniqueValues: {
    modeChauffage: string[];
    campagne: string[];
    departement: string[];
    codePostal: string[];
  };
}

export function ProspectFilters({
  filters,
  onFilterChange,
  showAdvanced,
  onToggleAdvanced,
  uniqueValues
}: ProspectFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);
  const [postalCodeSearch, setPostalCodeSearch] = useState('');

  // Update search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        ...filters,
        search: searchValue
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleChange = (field: keyof FilterValues, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const handlePostalCodeSearch = (value: string) => {
    setPostalCodeSearch(value);
    
    if (value.length >= 2) {
      const matchingCodes = uniqueValues.codePostal.filter(code => 
        code.startsWith(value)
      );
      handleChange('codePostal', matchingCodes);
    } else {
      handleChange('codePostal', []);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white border-b">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone, ville..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none w-full"
          />
        </div>

        <div className="w-64">
          <Select
            isMulti
            value={filters.status.map(status => ({
              value: status,
              label: STATUS_LABELS[status]
            }))}
            onChange={(selected) => handleChange('status', selected.map(option => option.value))}
            options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
              value,
              label
            }))}
            placeholder="Filtrer par statut"
            className="text-sm"
          />
        </div>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code postal
            </label>
            <div className="relative">
              <input
                type="text"
                value={postalCodeSearch}
                onChange={(e) => handlePostalCodeSearch(e.target.value)}
                placeholder="Entrez au moins 2 chiffres..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
                maxLength={5}
              />
              {filters.codePostal.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">
                    {filters.codePostal.length} code{filters.codePostal.length > 1 ? 's' : ''} postal{filters.codePostal.length > 1 ? 'aux' : ''} sélectionné{filters.codePostal.length > 1 ? 's' : ''}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {filters.codePostal.slice(0, 3).map(code => (
                      <span key={code} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {code}
                      </span>
                    ))}
                    {filters.codePostal.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
                        +{filters.codePostal.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Propriétaire
            </label>
            <select
              value={filters.proprietaire}
              onChange={(e) => handleChange('proprietaire', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
            >
              <option value="">Tous</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crédit en cours
            </label>
            <select
              value={filters.credit}
              onChange={(e) => handleChange('credit', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
            >
              <option value="">Tous</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode de chauffage
            </label>
            <Select
              isMulti
              value={filters.modeChauffage.map(value => ({ value, label: value }))}
              onChange={(selected) => handleChange('modeChauffage', selected.map(option => option.value))}
              options={uniqueValues.modeChauffage.map(value => ({ value, label: value }))}
              placeholder="Sélectionner..."
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campagne
            </label>
            <Select
              isMulti
              value={filters.campagne.map(value => ({ value, label: value }))}
              onChange={(selected) => handleChange('campagne', selected.map(option => option.value))}
              options={uniqueValues.campagne.map(value => ({ value, label: value }))}
              placeholder="Sélectionner..."
              className="text-sm"
            />
          </div>

          <DepartmentSearch
            value={filters.departements}
            onChange={(value) => handleChange('departements', value)}
            departments={uniqueValues.departement}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant électricité
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.montantMin}
                onChange={(e) => handleChange('montantMin', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.montantMax}
                onChange={(e) => handleChange('montantMax', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revenus
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.revenusMin}
                onChange={(e) => handleChange('revenusMin', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.revenusMax}
                onChange={(e) => handleChange('revenusMax', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}