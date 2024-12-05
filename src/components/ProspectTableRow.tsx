import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Prospect } from '../types/prospect';
import { STATUS_COLORS, STATUS_LABELS } from '../constants/status';
import { clsx } from 'clsx';
import { useCampaigns } from '../hooks/useCampaigns';

interface ProspectTableRowProps {
  prospect: Prospect;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onClick: (prospect: Prospect) => void;
  onCampaignClick?: (campaignId: string) => void;
}

export function ProspectTableRow({
  prospect,
  isSelected,
  onSelect,
  onClick,
  onCampaignClick
}: ProspectTableRowProps) {
  const { campaigns } = useCampaigns();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yy', { locale: fr });
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yy HH:mm', { locale: fr });
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCampaignClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (prospect.campagne && onCampaignClick) {
      onCampaignClick(prospect.campagne);
    }
  };

  const campaign = campaigns.find(c => c.id === prospect.campagne);

  return (
    <tr 
      onClick={() => onClick(prospect)}
      className={clsx(
        'hover:bg-gray-50 transition-colors cursor-pointer text-sm',
        isSelected && 'bg-[#2665EB]/5'
      )}
    >
      <td className="px-3 py-2">
        <div onClick={handleCheckboxClick}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(prospect.id, e.target.checked)}
            className="rounded border-gray-300 text-[#2665EB] focus:ring-[#2665EB] cursor-pointer"
          />
        </div>
      </td>
      <td className="px-3 py-2 font-medium">{prospect.nom || '-'}</td>
      <td className="px-3 py-2">{prospect.prenom || '-'}</td>
      <td className="px-3 py-2">{prospect.telephone || '-'}</td>
      <td className="px-3 py-2">{prospect.email || '-'}</td>
      <td className="px-3 py-2">{prospect.ville || '-'}</td>
      <td className="px-3 py-2">
        {campaign ? (
          <button
            onClick={handleCampaignClick}
            className="text-[#2665EB] hover:text-[#1b4bbd] hover:underline focus:outline-none"
          >
            {campaign.name}
          </button>
        ) : '-'}
      </td>
      <td className="px-3 py-2">
        {typeof prospect.prospectPrice === 'number' ? (
          <span className="text-gray-900 font-medium">{prospect.prospectPrice}€</span>
        ) : '-'}
      </td>
      <td className="px-3 py-2">
        <span className={clsx(
          'px-2 py-1 text-xs font-medium rounded-full inline-flex items-center',
          STATUS_COLORS[prospect.status]
        )}>
          {STATUS_LABELS[prospect.status]}
        </span>
      </td>
      <td className="px-3 py-2">{prospect.proprietaire ? 'Oui' : 'Non'}</td>
      <td className="px-3 py-2">{prospect.codePostal || '-'}</td>
      <td className="px-3 py-2">{prospect.departement || '-'}</td>
      <td className="px-3 py-2">{prospect.modeChauffage || '-'}</td>
      <td className="px-3 py-2">
        {prospect.montantElectricite ? `${prospect.montantElectricite}€` : '-'}
      </td>
      <td className="px-3 py-2">
        {prospect.revenus ? `${prospect.revenus}€` : '-'}
      </td>
      <td className="px-3 py-2">{prospect.credit || '-'}</td>
      <td className="px-3 py-2">{prospect.solution || '-'}</td>
      <td className="px-3 py-2">
        {typeof prospect.leadPrice === 'number' ? (
          <span className="text-emerald-600 font-medium">{prospect.leadPrice}€</span>
        ) : '-'}
      </td>
      <td className="px-3 py-2 text-gray-500">
        {formatDate(prospect.dateCreation)}
      </td>
      <td className="px-3 py-2 text-gray-500">
        {formatDateTime(prospect.dernierAppel)}
      </td>
    </tr>
  );
}