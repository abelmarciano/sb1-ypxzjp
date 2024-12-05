import { useState, useEffect } from 'react';
import { Campaign } from '../types/campaign';
import { openDB } from 'idb';
import toast from 'react-hot-toast';

const DB_NAME = 'crm-campaigns';
const STORE_NAME = 'campaigns';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    try {
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('type', 'type');
            store.createIndex('dateCreated', 'dateCreated');
          }
        },
      });

      const result = await db.getAll(STORE_NAME);
      setCampaigns(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing database:', error);
      toast.error('Erreur lors du chargement des campagnes');
      setIsLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'dateCreated'>) => {
    try {
      const db = await openDB(DB_NAME, 1);
      const newCampaign: Campaign = {
        ...campaignData,
        id: crypto.randomUUID(),
        dateCreated: new Date().toISOString(),
        totalLeads: 0,
        totalProspects: 0,
        pricePerProspect: campaignData.type === 'purchase' ? campaignData.pricePerProspect : 0,
        pricePerLead: campaignData.type === 'sales' ? campaignData.pricePerLead : undefined
      };

      await db.add(STORE_NAME, newCampaign);
      setCampaigns(prev => [...prev, newCampaign]);
      toast.success('Campagne créée avec succès');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Erreur lors de la création de la campagne');
    }
  };

  const updateCampaign = async (campaign: Campaign) => {
    try {
      const db = await openDB(DB_NAME, 1);
      await db.put(STORE_NAME, campaign);
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c));
      toast.success('Campagne mise à jour avec succès');
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast.error('Erreur lors de la mise à jour de la campagne');
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const db = await openDB(DB_NAME, 1);
      await db.delete(STORE_NAME, id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
      toast.success('Campagne supprimée avec succès');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Erreur lors de la suppression de la campagne');
    }
  };

  return {
    campaigns,
    isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}