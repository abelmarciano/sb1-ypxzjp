import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Prospect } from '../types/prospect';
import { motion } from 'framer-motion';
import { useCampaigns } from '../hooks/useCampaigns';
import Select from 'react-select';

interface BulkPriceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProspects: Prospect[];
  onUpdate: (prospects: Prospect[]) => void;
}

export function BulkPriceUpdateModal({
  isOpen,
  onClose,
  selectedProspects,
  onUpdate
}: BulkPriceUpdateModalProps) {
  const [prospectPrice, setProspectPrice] = useState<string>('');
  const [leadPrice, setLeadPrice] = useState<string>('');
  const [purchaseCampaignId, setPurchaseCampaignId] = useState<string>('');
  const [saleCampaignId, setSaleCampaignId] = useState<string>('');
  const { campaigns } = useCampaigns();

  const purchaseCampaigns = campaigns.filter(c => c.type === 'purchase');
  const salesCampaigns = campaigns.filter(c => c.type === 'sales');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const updatedProspects = selectedProspects.map(prospect => {
      const updates: Partial<Prospect> = {};

      // Update prospect price if provided
      if (prospectPrice) {
        updates.prospectPrice = parseFloat(prospectPrice);
      }

      // Update lead price if provided
      if (leadPrice) {
        updates.leadPrice = parseFloat(leadPrice);
      }

      // Update purchase campaign if selected
      if (purchaseCampaignId) {
        updates.campagne = purchaseCampaignId;
        const campaign = campaigns.find(c => c.id === purchaseCampaignId);
        if (campaign) {
          updates.prospectPrice = campaign.pricePerProspect;
        }
      }

      // Update sale campaign and lead price if selected
      if (saleCampaignId) {
        const campaign = campaigns.find(c => c.id === saleCampaignId);
        if (campaign) {
          updates.leadPrice = campaign.pricePerLead;
        }
      }

      return {
        ...prospect,
        ...updates
      };
    });

    onUpdate(updatedProspects);
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
              <DollarSign className="h-5 w-5 text-[#2665EB]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Modifier les prix</h2>
              <p className="text-sm text-gray-500">
                {selectedProspects.length} prospect{selectedProspects.length > 1 ? 's' : ''} sélectionné{selectedProspects.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix du prospect
            </label>
            <div className="relative">
              <input
                type="number"
                value={prospectPrice}
                onChange={(e) => setProspectPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
              />
              <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Laissez vide pour utiliser le prix de la campagne
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campagne de vente
            </label>
            <Select
              value={campaignOptions.sales.find(option => option.value === saleCampaignId)}
              onChange={(option) => setSaleCampaignId(option?.value || '')}
              options={campaignOptions.sales}
              isClearable
              placeholder="Sélectionner une campagne..."
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix du lead
            </label>
            <div className="relative">
              <input
                type="number"
                value={leadPrice}
                onChange={(e) => setLeadPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
              />
              <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Laissez vide pour utiliser le prix de la campagne
            </p>
          </div>
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
            disabled={!purchaseCampaignId && !prospectPrice && !saleCampaignId && !leadPrice}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2665EB] hover:bg-[#1b4bbd] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mettre à jour les prix
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}