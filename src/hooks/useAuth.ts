import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { openDB } from 'idb';
import toast from 'react-hot-toast';

const DB_NAME = 'crm-auth';
const STORE_NAME = 'users';

// Default admin user
const DEFAULT_ADMIN: User = {
  id: 'admin',
  firstName: 'Admin',
  lastName: 'System',
  email: 'admin@system.com',
  password: 'admin123',
  role: 'ADMIN',
  isActive: true,
  dateCreated: new Date().toISOString()
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
            // Add default admin user
            store.put(DEFAULT_ADMIN);
          }
        },
      });

      // Check for existing session
      const session = localStorage.getItem('auth_session');
      if (session) {
        try {
          const user = JSON.parse(session);
          // Verify user still exists and is active
          const dbUser = await db.get(STORE_NAME, user.id);
          if (dbUser && dbUser.isActive) {
            setCurrentUser(dbUser);
            setIsAuthenticated(true);
          } else {
            // Invalid session, clear it
            localStorage.removeItem('auth_session');
          }
        } catch (error) {
          console.error('Error parsing session:', error);
          localStorage.removeItem('auth_session');
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      toast.error('Erreur lors de l\'initialisation de l\'authentification');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const db = await openDB(DB_NAME, 1);
      
      // Get user by email
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('email');
      const user = await index.get(email);

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      if (!user.isActive) {
        throw new Error('Ce compte est désactivé');
      }

      if (user.password !== password) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };

      // Update in DB
      const updateTx = db.transaction(STORE_NAME, 'readwrite');
      await updateTx.store.put(updatedUser);
      await updateTx.done;

      // Save session
      localStorage.setItem('auth_session', JSON.stringify(updatedUser));
      
      // Update state
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);

      toast.success('Connexion réussie');
      return updatedUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    setCurrentUser(null);
    setIsAuthenticated(false);
    window.location.reload(); // Force reload to clear all state
  };

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    logout
  };
}