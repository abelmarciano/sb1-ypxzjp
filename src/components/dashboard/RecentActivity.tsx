import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '../common/Card';
import { Prospect } from '../../types/prospect';
import { STATUS_LABELS } from '../../constants/status';
import { Phone, UserCheck, UserX, Clock } from 'lucide-react';

interface RecentActivityProps {
  prospects: Prospect[];
}

export function RecentActivity({ prospects }: RecentActivityProps) {
  const recentProspects = prospects
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5);

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'LEADS':
        return <UserCheck className="h-5 w-5 text-green-500" />;
      case 'PAS_INTERESSE':
        return <UserX className="h-5 w-5 text-red-500" />;
      case 'NRP_1':
      case 'NRP_2':
      case 'NRP_3':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Phone className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
      
      <div className="divide-y">
        {recentProspects.map((prospect) => (
          <div key={prospect.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-gray-50">
                {getActivityIcon(prospect.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {prospect.nom} {prospect.prenom}
                  </p>
                  <span className="text-sm text-gray-500">
                    {format(new Date(prospect.dateCreation), 'dd MMM HH:mm', { locale: fr })}
                  </span>
                </div>
                
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {prospect.ville} • {prospect.telephone}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {STATUS_LABELS[prospect.status]}
                  </span>
                </div>
                
                {prospect.montantElectricite > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    Facture électricité: {prospect.montantElectricite}€
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}