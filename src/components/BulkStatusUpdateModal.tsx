import React, { useState } from 'react';
import { X, Users, DollarSign } from 'lucide-react';
import { Prospect, ProspectStatus } from '../types/prospect';
import { STATUS_LABELS } from '../constants/status';
import { motion } from 'framer-motion';
import { useCampaigns } from '../hooks/useCampaigns';
import Select from 'react-select';

interface BulkStatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProspects: Prospect[];
  onUpdate: (prospects: Prospect[]) => void;
}

export function BulkStatusUpdateModal({
  isOpen,
  onClose,
  selectedProspects,
  onUpdate
}: BulkStatusUpdateModalProps) {
  const [newStatus, setNewStatus] = useState<ProspectStatus>('NOUVEAU');
  const [saleCampaignId, setSaleCampaignId] = useState<string>('');
  const [purchaseCampaignId, setPurchaseCampaignId] = useState<string>('');
  const { campaigns } = useCampaigns();
  const [totalPrice, setTotalPrice] = useState(0);

  const purchaseCampaigns = campaigns.filter(c => c.type === 'purchase');
  const salesCampaigns = campaigns.filter(c => c.type === 'sales');

  const handleSubmit = () => {
    const updatedProspects = selectedProspects.map(prospect => {
      const updates: Partial<Prospect> = {
        status: newStatus,
      };

      // If status is VENDU and a sale campaign is selected
      if (newStatus === 'VENDU' && saleCampaignId) {
        const saleCampaign = campaigns.find(c => c.id === saleCampaignId);
        updates.leadPrice = saleCampaign?.pricePerLead || 0;
        updates.dateSold = new Date().toISOString();
      }

      // Update purchase campaign if selected
      if (purchaseCampaignId) {
        updates.campagne = purchaseCampaignId;
        const purchaseCampaign = campaigns.find(c => c.id === purchaseCampaignId);
        updates.prospectPrice = purchaseCampaign?.pricePerProspect || 0;
      }

      return {
        ...prospect,
        ...updates
      };
    });

    onUpdate(updatedProspects);
    onClose();
  };

  const campaignOptions = {
    purchase: purchaseCampaigns.map(campaign => ({
      value: campaign.id,
      label: `${campaign.name} (${campaign.pricePerProspect}€/prospect)`
    })),
    sales: salesCampaigns.map(campaign => ({
      value: campaign.id,
      label: `${campaign.name} (${campaign.pricePerLead}€/lead)`
    }))
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-lg mx-4 shadow-xl"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2665EB]/10">
              <Users className="h-5 w-5 text-[#2665EB]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Modifier le statut</h2>
              <p className="text-sm text-gray-500">{selectedProspects.length} prospect{selectedProspects.length > 1 ? 's' : ''} sélectionné{selectedProspects.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau statut
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ProspectStatus)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campagne d'achat
            </label>
            <Select
              value={campaignOptions.purchase.find(option => option.value === purchaseCampaignId)}
              onChange={(option) => setPurchaseCampaignId(option?.value || '')}
              options={campaignOptions.purchase}
              isClearable
              placeholder="Sélectionner une campagne..."
              className="text-sm"
            />
          </div>

          {newStatus === 'VENDU' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campagne de vente
                </label>
                <Select
                  value={campaignOptions.sales.find(option => option.value === saleCampaignId)}
                  onChange={(option) => setSaleCampaignId(option?.value || '')}
                  options={campaignOptions.sales}
                  placeholder="Sélectionner une campagne..."
                  className="text-sm"
                />
              </div>

              {saleCampaignId && (
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-medium">Prix total des leads</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {totalPrice.toFixed(2)}€
                  </p>
                  <p className="text-sm text-emerald-600 mt-1">
                    Basé sur les prix de la campagne sélectionnée
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2665EB] hover:bg-[#1b4bbd] rounded-lg transition-colors"
          >
            Mettre à jour
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}