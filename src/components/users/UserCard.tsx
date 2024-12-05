import React, { useState } from 'react';
import { Edit2, Trash2, Mail } from 'lucide-react';
import { User } from '../../types/user';
import { ROLE_LABELS } from '../../types/user';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EditUserModal } from './EditUserModal';

interface UserCardProps {
  user: User;
  onUpdate: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserCard({ user, onUpdate, onDelete }: UserCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-[#2665EB]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-medium text-[#2665EB]">
                {getInitials(user.firstName, user.lastName)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {user.isActive ? 'Actif' : 'Inactif'}
                </div>
              </div>

              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span className="truncate">{user.email}</span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span className="px-2 py-1 bg-[#2665EB]/10 text-[#2665EB] text-xs font-medium rounded">
                  {ROLE_LABELS[user.role]}
                </span>
                <span className="text-xs text-gray-500">
                  Créé le {format(new Date(user.dateCreated), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <Edit2 className="h-4 w-4" />
            Modifier
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>
        </div>
      </div>

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={onUpdate}
      />
    </>
  );
}