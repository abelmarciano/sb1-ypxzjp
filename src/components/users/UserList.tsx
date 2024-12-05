import React from 'react';
import { User } from '../../types/user';
import { UserCard } from './UserCard';
import { Users } from 'lucide-react';

interface UserListProps {
  users: User[];
  onUpdate: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserList({ users, onUpdate, onDelete }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun utilisateur</h3>
        <p className="text-gray-500">Commencez par créer un nouvel utilisateur</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}