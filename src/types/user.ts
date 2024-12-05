export type UserRole = 'ADMIN' | 'MANAGER' | 'AGENT';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Added password field
  role: UserRole;
  isActive: boolean;
  dateCreated: string;
  lastLogin?: string;
  avatar?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  MANAGER: 'Manager',
  AGENT: 'Agent'
};