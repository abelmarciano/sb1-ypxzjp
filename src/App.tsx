import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProspectsPage } from './pages/ProspectsPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { UsersPage } from './pages/UsersPage';
import { CallsPage } from './pages/CallsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TopNav } from './components/navigation/TopNav';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { LoadingSpinner } from './components/common/LoadingSpinner';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Chargement..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: '#F1F1F1' }}>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'text-sm font-medium',
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
            },
          }}
        />
        
        <TopNav />
        
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/prospects" element={<ProspectsPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/calls" element={<CallsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;