import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { UserList } from '../components/users/UserList';
import { CreateUserModal } from '../components/users/CreateUserModal';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export function UsersPage() {
  const { users, isLoading, createUser, updateUser, deleteUser } = useUsers();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner 
          size="lg" 
          message="Chargement des utilisateurs..." 
          description="Connexion à la base de données et récupération des informations"
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <div className="text-sm text-gray-500">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
          </div>
        </div>
        <p className="text-gray-500 text-lg">
          Gérez les utilisateurs et leurs accès au CRM
        </p>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="p-4 border-b bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
              />
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-[#2665EB] hover:bg-[#1b4bbd] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nouvel utilisateur
            </button>
          </div>
        </div>

        <UserList
          users={filteredUsers}
          onUpdate={updateUser}
          onDelete={deleteUser}
        />
      </Card>

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createUser}
      />
    </div>
  );
}