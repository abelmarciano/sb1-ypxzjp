import React from 'react';
import { Campaign } from '../../types/campaign';
import { CampaignCard } from './CampaignCard';
import { Users } from 'lucide-react';

interface CampaignListProps {
  campaigns: Campaign[];
  onUpdate: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
}

export function CampaignList({ campaigns, onUpdate, onDelete }: CampaignListProps) {
  // Filter only purchase campaigns
  const purchaseCampaigns = campaigns.filter(campaign => campaign.type === 'purchase');

  if (purchaseCampaigns.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune campagne d'achat</h3>
        <p className="text-gray-500">Commencez par créer une nouvelle campagne d'achat</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {purchaseCampaigns.map(campaign => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}