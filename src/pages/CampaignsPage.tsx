import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Campaign } from '../types/campaign';
import { CampaignList } from '../components/campaigns/CampaignList';
import { SalesCampaignList } from '../components/campaigns/SalesCampaignList';
import { CreateCampaignModal } from '../components/campaigns/CreateCampaignModal';
import { Card } from '../components/common/Card';
import { useCampaigns } from '../hooks/useCampaigns';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export function CampaignsPage() {
  const { campaigns, isLoading, createCampaign, updateCampaign, deleteCampaign } = useCampaigns();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'purchase' | 'sales'>('purchase');

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    campaign.type === activeTab
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner 
          size="lg" 
          message="Chargement des campagnes..." 
          description="Connexion à la base de données et récupération des informations"
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Campagnes</h1>
          <div className="text-sm text-gray-500">
            {campaigns.length} campagne{campaigns.length > 1 ? 's' : ''} au total
          </div>
        </div>
        <p className="text-gray-500 text-lg">
          Gérez vos campagnes d'achat et de vente
        </p>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="p-4 border-b bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une campagne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
              />
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#2665EB] hover:bg-[#1b4bbd] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nouvelle campagne
            </button>
          </div>
        </div>

        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('purchase')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'purchase'
                  ? 'border-[#2665EB] text-[#2665EB]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Campagnes d'achat
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sales'
                  ? 'border-[#2665EB] text-[#2665EB]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Campagnes de vente
            </button>
          </div>
        </div>

        {activeTab === 'purchase' ? (
          <CampaignList
            campaigns={filteredCampaigns}
            onUpdate={updateCampaign}
            onDelete={deleteCampaign}
          />
        ) : (
          <SalesCampaignList
            campaigns={filteredCampaigns}
            onUpdate={updateCampaign}
            onDelete={deleteCampaign}
          />
        )}
      </Card>

      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createCampaign}
        type={activeTab}
      />
    </div>
  );
}