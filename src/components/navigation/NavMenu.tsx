import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, PhoneCall, BarChart3, Settings, Target, UserCog } from 'lucide-react';
import { clsx } from 'clsx';

export function NavMenu() {
  const location = useLocation();
  
  const menuItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/' },
    { label: 'Prospects', icon: Users, path: '/prospects' },
    { label: 'Campagnes', icon: Target, path: '/campaigns' },
    { label: 'Utilisateurs', icon: UserCog, path: '/users' },
    { label: 'Appels', icon: PhoneCall, path: '/calls' },
    { label: 'Rapports', icon: BarChart3, path: '/reports' },
    { label: 'Paramètres', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="flex items-center space-x-1">
      {menuItems.map(({ label, icon: Icon, path }) => {
        const isActive = location.pathname === path;
        
        return (
          <Link
            key={path}
            to={path}
            className={clsx(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
              isActive 
                ? 'text-[#2665EB] bg-[#2665EB]/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}