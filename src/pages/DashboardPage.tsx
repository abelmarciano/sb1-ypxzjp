import React from 'react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { PerformanceMetrics } from '../components/dashboard/PerformanceMetrics';
import { useProspects } from '../hooks/useProspects';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export function DashboardPage() {
  const { prospects, isLoading } = useProspects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner size="lg" message="Chargement du tableau de bord..." />
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500">Vue d'ensemble de votre activité commerciale</p>
      </div>

      <div className="space-y-5">
        <DashboardStats prospects={prospects} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <DashboardCharts prospects={prospects} />
          <PerformanceMetrics prospects={prospects} />
        </div>
        <RecentActivity prospects={prospects} />
      </div>
    </div>
  );
}