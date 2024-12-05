import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Prospect } from '../types/prospect';
import { Campaign } from '../types/campaign';
import { useCampaigns } from '../hooks/useCampaigns';
import Select from 'react-select';
import { motion } from 'framer-motion';

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: Partial<Prospect>[] | null;
  onConfirm: (campaignId: string, prospectPrice: number) => void;
}

export function ImportPreviewModal({
  isOpen,
  onClose,
  previewData,
  onConfirm
}: ImportPreviewModalProps) {
  const { campaigns } = useCampaigns();
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [prospectPrice, setProspectPrice] = useState<string>('0');

  useEffect(() => {
    if (selectedCampaign) {
      const campaign = campaigns.find(c => c.id === selectedCampaign);
      if (campaign) {
        setProspectPrice(campaign.pricePerProspect.toString());
      }
    }
  }, [selectedCampaign, campaigns]);

  if (!isOpen || !previewData) return null;

  const campaignOptions = campaigns
    .filter(campaign => campaign.isActive && campaign.type === 'purchase')
    .map(campaign => ({
      value: campaign.id,
      label: `${campaign.name} (${campaign.pricePerProspect}€/prospect)`
    }));

  const handleSubmit = () => {
    const price = parseFloat(prospectPrice) || 0;
    onConfirm(selectedCampaign, price);
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
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Aperçu de l'import</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sélectionner une campagne d'achat
              </label>
              <Select
                options={campaignOptions}
                value={campaignOptions.find(option => option.value === selectedCampaign)}
                onChange={(option) => setSelectedCampaign(option?.value || '')}
                placeholder="Choisir une campagne..."
                className="text-sm"
                isSearchable
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix par prospect
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
                Ce prix sera appliqué à tous les prospects importés
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Prospects à importer ({previewData.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Nom', 'Prénom', 'Email', 'Téléphone', 'Ville'].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.slice(0, 5).map((prospect, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{prospect.nom}</td>
                      <td className="px-4 py-2">{prospect.prenom}</td>
                      <td className="px-4 py-2">{prospect.email}</td>
                      <td className="px-4 py-2">{prospect.telephone}</td>
                      <td className="px-4 py-2">{prospect.ville}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 5 && (
                <p className="text-sm text-gray-500 mt-2 px-4">
                  Et {previewData.length - 5} autres prospects...
                </p>
              )}
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
            onClick={handleSubmit}
            disabled={!selectedCampaign}
            className="px-4 py-2 text-white bg-[#2665EB] hover:bg-[#1b4bbd] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Importer {previewData.length} prospect{previewData.length > 1 ? 's' : ''}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}