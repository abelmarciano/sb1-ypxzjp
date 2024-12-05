import { useState, useEffect } from 'react';
import { Prospect } from '../types/prospect';
import { initDB, getAllProspects, addProspects, deleteProspects, updateProspect } from '../services/db';
import toast from 'react-hot-toast';

export function useProspects() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProspects();
  }, []);

  const loadProspects = async () => {
    try {
      await initDB();
      const loadedProspects = await getAllProspects();
      setProspects(loadedProspects);
    } catch (error) {
      console.error('Erreur lors du chargement des prospects:', error);
      toast.error('Erreur lors du chargement des prospects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportCSV = async (data: Partial<Prospect>[], campaignId: string) => {
    try {
      const newProspects = data.map(prospect => ({
        id: crypto.randomUUID(),
        nom: prospect.nom || '',
        prenom: prospect.prenom || '',
        email: prospect.email || '',
        telephone: prospect.telephone || '',
        ville: prospect.ville || '',
        campagne: campaignId,
        dateCreation: new Date().toISOString(),
        status: 'NOUVEAU',
        proprietaire: prospect.proprietaire || false,
        codePostal: prospect.codePostal || '',
        departement: prospect.departement || '',
        modeChauffage: prospect.modeChauffage || '',
        montantElectricite: prospect.montantElectricite || 0,
        revenus: prospect.revenus || 0,
        credit: prospect.credit || false,
        solution: prospect.solution || ''
      } as Prospect));

      await addProspects(newProspects);
      const updatedProspects = await getAllProspects();
      setProspects(updatedProspects);
      toast.success(`${newProspects.length} prospects importés avec succès`, {
        icon: '📥',
        duration: 3000
      });
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast.error('Erreur lors de l\'import CSV');
    }
  };

  const handleDeleteProspects = async (selectedIds: Set<string>) => {
    try {
      await deleteProspects(Array.from(selectedIds));
      setProspects(prev => prev.filter(p => !selectedIds.has(p.id)));
      toast.success(`${selectedIds.size} prospect(s) supprimé(s)`, {
        icon: '🗑️',
        duration: 2000
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression des prospects');
    }
  };

  const handleUpdateProspect = async (updatedProspect: Prospect) => {
    try {
      await updateProspect(updatedProspect);
      setProspects(prev => prev.map(p => 
        p.id === updatedProspect.id ? updatedProspect : p
      ));
      toast.success('Prospect mis à jour avec succès', {
        icon: '✅',
        duration: 2000
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du prospect');
    }
  };

  return {
    prospects,
    isLoading,
    importProspects: handleImportCSV,
    deleteProspects: handleDeleteProspects,
    updateProspect: handleUpdateProspect
  };
}