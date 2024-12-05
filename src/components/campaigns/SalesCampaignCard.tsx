import React from 'react';
import { Edit2, Trash2, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SalesCampaignCardProps {
  campaign: Campaign;
  onUpdate: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
}

export function SalesCampaignCard({ campaign, onUpdate, onDelete }: SalesCampaignCardProps) {
  const totalRevenue = campaign.totalLeads * campaign.pricePerLead;
  const conversionRate = campaign.totalProspects ? 
    ((campaign.totalLeads / campaign.totalProspects) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {campaign.name}
            </h3>
            <p className="text-sm text-gray-500">
              Créée le {format(new Date(campaign.dateCreated), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            campaign.isActive
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {campaign.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <DollarSign className="h-4 w-4" />
                Prix par lead
              </div>
              <div className="text-xl font-bold text-gray-900">{campaign.pricePerLead}€</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <TrendingUp className="h-4 w-4" />
                Chiffre d'affaires
              </div>
              <div className="text-xl font-bold text-emerald-600">{totalRevenue}€</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Users className="h-4 w-4" />
                Leads vendus
              </div>
              <div className="text-lg font-semibold text-gray-900">{campaign.totalLeads}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <TrendingUp className="h-4 w-4" />
                Taux de conversion
              </div>
              <div className="text-lg font-semibold text-gray-900">{conversionRate}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
        <button
          onClick={() => onUpdate(campaign)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Edit2 className="h-4 w-4" />
          Modifier
        </button>
        <button
          onClick={() => onDelete(campaign.id)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer
        </button>
      </div>
    </div>
  );
}