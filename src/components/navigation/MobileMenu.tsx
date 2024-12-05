import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, PhoneCall, BarChart3, Settings, X, Bot, Target } from 'lucide-react';
import { clsx } from 'clsx';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();
  
  const menuItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/' },
    { label: 'Prospects', icon: Users, path: '/prospects' },
    { label: 'Campagnes', icon: Target, path: '/campaigns' },
    { label: 'Appels', icon: PhoneCall, path: '/calls' },
    { label: 'Rapports', icon: BarChart3, path: '/reports' },
    { label: 'Paramètres', icon: Settings, path: '/settings' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#2665EB] to-[#1b4bbd] shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">CRM Énergies</h2>
              <p className="text-xs text-gray-500">Agent IA connecté</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive 
                      ? 'text-[#2665EB] bg-[#2665EB]/10' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Agent IA actif</span>
          </div>
        </div>
      </div>
    </div>
  );
}