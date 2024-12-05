import { useState, useMemo } from 'react';
import { Prospect, ProspectStatus } from '../types/prospect';

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

export function useProspectFilters(prospects: Prospect[]) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    status: [],
    proprietaire: '',
    credit: '',
    modeChauffage: [],
    campagne: [],
    departements: [],
    codePostal: [],
    montantMin: '',
    montantMax: '',
    revenusMin: '',
    revenusMax: ''
  });

  const [sortField, setSortField] = useState<keyof Prospect>('dateCreation');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredProspects = useMemo(() => {
    return prospects
      .filter(prospect => {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = !filters.search || 
          prospect.nom.toLowerCase().includes(searchLower) ||
          prospect.prenom.toLowerCase().includes(searchLower) ||
          prospect.email.toLowerCase().includes(searchLower) ||
          prospect.telephone.toLowerCase().includes(searchLower) ||
          prospect.ville.toLowerCase().includes(searchLower);

        const matchesStatus = filters.status.length === 0 || filters.status.includes(prospect.status);
        const matchesProprietaire = !filters.proprietaire || prospect.proprietaire === (filters.proprietaire === 'true');
        const matchesCredit = !filters.credit || prospect.credit === (filters.credit === 'true');
        const matchesModeChauffage = filters.modeChauffage.length === 0 || 
          filters.modeChauffage.includes(prospect.modeChauffage);
        const matchesCampagne = filters.campagne.length === 0 || 
          filters.campagne.includes(prospect.campagne);
        const matchesDepartements = filters.departements.length === 0 || 
          filters.departements.includes(prospect.departement);
        const matchesCodePostal = filters.codePostal.length === 0 ||
          filters.codePostal.includes(prospect.codePostal);

        const matchesMontant = (!filters.montantMin || prospect.montantElectricite >= parseFloat(filters.montantMin)) &&
          (!filters.montantMax || prospect.montantElectricite <= parseFloat(filters.montantMax));

        const matchesRevenus = (!filters.revenusMin || prospect.revenus >= parseFloat(filters.revenusMin)) &&
          (!filters.revenusMax || prospect.revenus <= parseFloat(filters.revenusMax));

        return matchesSearch && matchesStatus && matchesProprietaire && matchesCredit &&
          matchesModeChauffage && matchesCampagne && matchesDepartements && matchesCodePostal &&
          matchesMontant && matchesRevenus;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue === bValue) return 0;
        const comparison = aValue > bValue ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [prospects, filters, sortField, sortDirection]);

  const handleSort = (field: keyof Prospect) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    filters,
    setFilters,
    sortField,
    sortDirection,
    handleSort,
    filteredProspects
  };
}