import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { motion } from 'framer-motion';

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  onUpdate: (campaign: Campaign) => void;
}

export function EditCampaignModal({
  isOpen,
  onClose,
  campaign,
  onUpdate
}: EditCampaignModalProps) {
  const [name, setName] = useState('');
  const [pricePerProspect, setPricePerProspect] = useState('');
  const [pricePerLead, setPricePerLead] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setPricePerProspect(campaign.pricePerProspect?.toString() || '0');
      setPricePerLead(campaign.pricePerLead?.toString() || '0');
      setDescription(campaign.description || '');
      setIsActive(campaign.isActive);
    }
  }, [campaign]);

  if (!isOpen || !campaign) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...campaign,
      name,
      pricePerProspect: parseFloat(pricePerProspect) || 0,
      pricePerLead: campaign.type === 'sales' ? (parseFloat(pricePerLead) || 0) : undefined,
      description,
      isActive
    });
    onClose();
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
          <h2 className="text-lg font-semibold text-gray-900">
            Modifier la campagne {campaign.type === 'sales' ? 'de vente' : "d'achat"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la campagne
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
              placeholder="Ex: Campagne Été 2024"
            />
          </div>

          {campaign.type === 'purchase' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix par prospect (€)
              </label>
              <input
                type="number"
                value={pricePerProspect}
                onChange={(e) => setPricePerProspect(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
                placeholder="Ex: 50"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix par lead (€)
              </label>
              <input
                type="number"
                value={pricePerLead}
                onChange={(e) => setPricePerLead(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
                placeholder="Ex: 100"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optionnelle)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none resize-none"
              placeholder="Description de la campagne..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-gray-300 text-[#2665EB] focus:ring-[#2665EB]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Campagne active
            </label>
          </div>
        </form>

        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name || (campaign.type === 'purchase' ? !pricePerProspect : !pricePerLead)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2665EB] hover:bg-[#1b4bbd] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}