import React from 'react';
import { Card } from '../common/Card';
import { Prospect } from '../../types/prospect';
import { STATUS_LABELS } from '../../constants/status';

interface ProspectStatsProps {
  prospects: Prospect[];
}

export function ProspectStats({ prospects }: ProspectStatsProps) {
  const stats = {
    total: prospects.length,
    nouveaux: prospects.filter(p => p.status === 'NOUVEAU').length,
    leads: prospects.filter(p => p.status === 'LEADS').length,
    nonRepondus: prospects.filter(p => ['NRP_1', 'NRP_2', 'NRP_3', 'NRP_4', 'NRP_5'].includes(p.status)).length,
  };

  const statCards = [
    { label: 'Total prospects', value: stats.total, color: 'bg-blue-50 text-blue-700' },
    { label: 'Nouveaux', value: stats.nouveaux, color: 'bg-green-50 text-green-700' },
    { label: 'Leads', value: stats.leads, color: 'bg-purple-50 text-purple-700' },
    { label: 'Non répondus', value: stats.nonRepondus, color: 'bg-orange-50 text-orange-700' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map(({ label, value, color }) => (
        <Card key={label} className={`${color} border-0`}>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-2xl font-bold mt-1">{value}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}