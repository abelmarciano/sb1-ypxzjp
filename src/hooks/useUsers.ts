import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { openDB } from 'idb';
import toast from 'react-hot-toast';

const DB_NAME = 'crm-users';
const STORE_NAME = 'users';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    try {
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('email', 'email', { unique: true });
          }
        },
      });

      const result = await db.getAll(STORE_NAME);
      setUsers(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing database:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'dateCreated'>) => {
    try {
      const db = await openDB(DB_NAME, 1);
      
      // Check if email already exists
      const existingUser = await db.getFromIndex(STORE_NAME, 'email', userData.email);
      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      const newUser: User = {
        ...userData,
        id: crypto.randomUUID(),
        dateCreated: new Date().toISOString(),
      };

      await db.add(STORE_NAME, newUser);
      setUsers(prev => [...prev, newUser]);
      toast.success('Utilisateur créé avec succès');
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création de l\'utilisateur');
      throw error;
    }
  };

  const updateUser = async (user: User) => {
    try {
      const db = await openDB(DB_NAME, 1);
      
      // Check if email is being changed and if it's already taken
      const existingUser = await db.getFromIndex(STORE_NAME, 'email', user.email);
      if (existingUser && existingUser.id !== user.id) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      await db.put(STORE_NAME, user);
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
      toast.success('Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'utilisateur');
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const db = await openDB(DB_NAME, 1);
      await db.delete(STORE_NAME, id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
      throw error;
    }
  };

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
  };
}