import React from 'react';
import { Bot, Bell, Settings, HelpCircle } from 'lucide-react';
import { theme } from '../../constants/theme';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg"
            >
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Leadeurs
              </h1>
              
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <Settings className="h-5 w-5" />
              </button>
            </div>
            <div className="pl-4 border-l">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Agent IA actif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}