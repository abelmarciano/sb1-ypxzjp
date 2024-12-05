import React from 'react';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { RecentActivity } from './RecentActivity';
import { PerformanceMetrics } from './PerformanceMetrics';
import { useProspects } from '../../hooks/useProspects';

export function DashboardPage() {
  const { prospects, isLoading } = useProspects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500">Vue d'ensemble de votre activité commerciale</p>
      </div>

      <div className="space-y-6">
        <DashboardStats prospects={prospects} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCharts prospects={prospects} />
          <PerformanceMetrics prospects={prospects} />
        </div>
        <RecentActivity prospects={prospects} />
      </div>
    </div>
  );
}