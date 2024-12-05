import { useState } from 'react';
import { Prospect } from '../types/prospect';
import { SmartSelectionParams } from '../components/SmartSelectionModal';

export function useSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean, prospects: Prospect[] = []) => {
    if (checked) {
      setSelectedIds(new Set(prospects.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSmartSelect = (prospects: Prospect[], params: SmartSelectionParams) => {
    let filteredProspects = [...prospects];

    // Apply filters
    if (params.status) {
      filteredProspects = filteredProspects.filter(p => p.status === params.status);
    }
    if (params.proprietaire !== undefined) {
      filteredProspects = filteredProspects.filter(p => p.proprietaire === params.proprietaire);
    }
    if (params.credit !== undefined) {
      filteredProspects = filteredProspects.filter(p => p.credit === params.credit);
    }

    // Sort by most recent first
    filteredProspects.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());

    // Take only requested number of prospects
    const selectedProspects = filteredProspects.slice(0, params.count);
    setSelectedIds(new Set(selectedProspects.map(p => p.id)));

    return selectedProspects;
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  return {
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleSmartSelect,
    clearSelection
  };
}