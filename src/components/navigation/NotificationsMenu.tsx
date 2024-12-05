import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread] = useState(true);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg relative"
      >
        <Bell className="h-5 w-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="px-4 py-3 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Nouveau prospect ajouté</p>
                  <p className="text-xs text-gray-500 mt-0.5">Il y a 5 minutes</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Lead converti avec succès</p>
                  <p className="text-xs text-gray-500 mt-0.5">Il y a 1 heure</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 border-t border-gray-100">
            <button className="text-sm text-cyan-600 hover:text-cyan-700">
              Voir toutes les notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}