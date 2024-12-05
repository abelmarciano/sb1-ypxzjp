import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import { Prospect } from '../../types/prospect';
import { STATUS_LABELS } from '../../constants/status';

interface DashboardChartsProps {
  prospects: Prospect[];
}

export function DashboardCharts({ prospects }: DashboardChartsProps) {
  const statusDistribution = useMemo(() => {
    const distribution = prospects.reduce((acc, prospect) => {
      acc[prospect.status] = (acc[prospect.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution)
      .map(([status, count]) => ({
        status,
        label: STATUS_LABELS[status as keyof typeof STATUS_LABELS],
        count,
        percentage: (count / prospects.length) * 100
      }))
      .sort((a, b) => b.count - a.count);
  }, [prospects]);

  const revenueByDepartment = useMemo(() => {
    const soldLeads = prospects.filter(p => p.status === 'VENDU' && p.leadPrice);
    
    const distribution = soldLeads.reduce((acc, prospect) => {
      if (prospect.departement && prospect.leadPrice) {
        acc[prospect.departement] = (acc[prospect.departement] || 0) + prospect.leadPrice;
      }
      return acc;
    }, {} as Record<string, number>);

    const totalRevenue = Object.values(distribution).reduce((sum, value) => sum + value, 0);

    return Object.entries(distribution)
      .map(([dept, revenue]) => ({
        department: dept,
        revenue,
        percentage: (revenue / totalRevenue) * 100
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [prospects]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-base font-semibold mb-3">Distribution par statut</h3>
        <div className="space-y-2">
          {statusDistribution.map(({ status, label, count, percentage }) => (
            <div key={status}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{label}</span>
                <span className="text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-[#2665EB] to-[#1b4bbd]"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-base font-semibold mb-3">Top 5 départements par CA</h3>
        <div className="space-y-2">
          {revenueByDepartment.map(({ department, revenue, percentage }) => (
            <div key={department}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{department}</span>
                <span className="text-gray-500">{revenue.toFixed(0)}€</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-[#2665EB] to-[#1b4bbd]"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}