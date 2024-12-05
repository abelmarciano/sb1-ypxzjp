import React, { useMemo, useState } from 'react';
import { Card } from '../common/Card';
import { Prospect } from '../../types/prospect';
import { Target, TrendingUp, DollarSign, Users, Phone, Clock, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';

interface DashboardStatsProps {
  prospects: Prospect[];
}

export function DashboardStats({ prospects }: DashboardStatsProps) {
  const [showFinancials, setShowFinancials] = useState(false);

  const stats = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Filter prospects by status
    const totalLeads = prospects.filter(p => p.status === 'LEADS');
    const soldLeads = prospects.filter(p => p.status === 'VENDU');
    const newProspects = prospects.filter(p => p.status === 'NOUVEAU');
    const notInterested = prospects.filter(p => p.status === 'PAS_INTERESSE');
    const notAnswered = prospects.filter(p => ['NRP_1', 'NRP_2', 'NRP_3', 'NRP_4', 'NRP_5'].includes(p.status));
    
    // Calculate revenue (only from sold leads with leadPrice)
    const totalRevenue = soldLeads.reduce((sum, p) => {
      const leadPrice = typeof p.leadPrice === 'number' ? p.leadPrice : 0;
      return sum + leadPrice;
    }, 0);
    
    // Calculate total cost from all prospects
    const totalCost = prospects.reduce((sum, p) => {
      const prospectPrice = typeof p.prospectPrice === 'number' ? p.prospectPrice : 0;
      return sum + prospectPrice;
    }, 0);
    
    // Calculate profit
    const profit = totalRevenue - totalCost;
    
    // Calculate ROI
    const roi = totalCost > 0 ? ((profit / totalCost) * 100) : 0;

    // Calculate this month's leads
    const thisMonthLeads = prospects.filter(p => 
      new Date(p.dateCreation) >= startOfMonth
    );

    // Calculate last month's leads for growth comparison
    const lastMonthLeads = prospects.filter(p => 
      new Date(p.dateCreation) >= lastMonth &&
      new Date(p.dateCreation) < startOfMonth
    );

    // Calculate lead growth percentage
    const leadsGrowth = lastMonthLeads.length > 0
      ? ((thisMonthLeads.length - lastMonthLeads.length) / lastMonthLeads.length) * 100
      : 0;

    // Calculate conversion rate
    const conversionRate = totalLeads.length > 0
      ? (soldLeads.length / totalLeads.length) * 100
      : 0;

    // Calculate averages
    const averageLeadPrice = soldLeads.length > 0 
      ? totalRevenue / soldLeads.length 
      : 0;

    const averageProspectPrice = prospects.length > 0 
      ? totalCost / prospects.length 
      : 0;

    return {
      totalLeads: totalLeads.length,
      leadsThisMonth: thisMonthLeads.length,
      lastMonthLeads: lastMonthLeads.length,
      conversionRate,
      averageLeadPrice,
      leadsGrowth,
      totalRevenue,
      totalCost,
      profit,
      roi,
      soldLeads: soldLeads.length,
      averageProspectPrice,
      totalProspects: prospects.length,
      newProspects: newProspects.length,
      notInterested: notInterested.length,
      notAnswered: notAnswered.length
    };
  }, [prospects]);

  const mainStats = [
    {
      label: 'Leads actifs',
      value: stats.totalLeads,
      subValue: `${stats.soldLeads} leads vendus`,
      icon: CheckCircle2,
      color: 'bg-[#2665EB]/10 text-[#2665EB]',
      trend: `${stats.conversionRate.toFixed(1)}% de conversion`
    },
    {
      label: 'Nouveaux prospects',
      value: stats.newProspects,
      subValue: `${stats.totalProspects} au total`,
      icon: Users,
      color: 'bg-[#2665EB]/10 text-[#2665EB]',
      trend: 'En attente de traitement'
    },
    {
      label: 'Non répondus',
      value: stats.notAnswered,
      subValue: `${stats.notInterested} non intéressés`,
      icon: Phone,
      color: 'bg-[#2665EB]/10 text-[#2665EB]',
      trend: 'À recontacter'
    },
    {
      label: 'Performance mensuelle',
      value: stats.leadsThisMonth,
      subValue: `vs ${stats.lastMonthLeads} le mois dernier`,
      icon: TrendingUp,
      color: 'bg-[#2665EB]/10 text-[#2665EB]',
      trend: `${stats.leadsGrowth > 0 ? '+' : ''}${stats.leadsGrowth.toFixed(1)}% de croissance`
    }
  ];

  const financialStats = [
    {
      label: 'Chiffre d\'affaires',
      value: `${stats.totalRevenue.toFixed(2)}€`,
      icon: DollarSign,
      color: 'bg-[#2665EB]/10 text-[#2665EB]',
      trend: `${stats.averageLeadPrice.toFixed(2)}€ par lead`
    },
    {
      label: 'Coût total',
      value: `${stats.totalCost.toFixed(2)}€`,
      icon: DollarSign,
      color: 'bg-[#2665EB]/10 text-[#2665EB]',
      trend: `${stats.averageProspectPrice.toFixed(2)}€ par prospect`
    },
    {
      label: 'Bénéfice',
      value: `${stats.profit.toFixed(2)}€`,
      icon: TrendingUp,
      color: 'bg-[#2665EB]/10 text-[#2665EB]',
      trend: stats.profit >= 0 ? 'Rentable' : 'Non rentable'
    },
    {
      label: 'ROI',
      value: `${stats.roi.toFixed(1)}%`,
      icon: Target,
      color: 'bg-[#2665EB]/10 text-[#2665EB]',
      trend: stats.roi >= 0 ? 'Positif' : 'Négatif'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map(({ label, value, subValue, icon: Icon, color, trend }) => (
          <Card key={label} className="relative p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-600">{label}</span>
              </div>
              
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{value}</span>
                  <span className="text-sm text-gray-500">{subValue}</span>
                </div>
                <div className="mt-2 text-sm font-medium text-[#2665EB]">
                  {trend}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Données financières</h3>
          <button
            onClick={() => setShowFinancials(!showFinancials)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showFinancials ? (
              <EyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financialStats.map(({ label, value, icon: Icon, color, trend }) => (
            <Card key={label} className="p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${color} flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  {showFinancials ? (
                    <>
                      <div className="text-2xl font-bold text-gray-900">{value}</div>
                      <div className="text-sm font-medium text-[#2665EB] mt-2">{trend}</div>
                    </>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">••••••</div>
                  )}
                  <div className="text-sm font-medium text-gray-600 mt-1">{label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}