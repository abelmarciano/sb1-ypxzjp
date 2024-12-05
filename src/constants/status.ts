import { ProspectStatus } from '../types/prospect';

export const STATUS_LABELS: Record<ProspectStatus, string> = {
  NOUVEAU: 'Nouveau',
  FAUX_NUMERO: 'Faux numéro',
  LEADS: 'Leads',
  MI_CHEMIN: 'Mi-chemin',
  PAS_INTERESSE: 'Pas intéressé',
  PAS_ELIGIBLE: 'Pas éligible',
  NRP_1: 'NRP 1',
  NRP_2: 'NRP 2',
  NRP_3: 'NRP 3',
  NRP_4: 'NRP 4',
  NRP_5: 'NRP 5',
  VENDU: 'Vendu'
};

export const STATUS_COLORS: Record<ProspectStatus, string> = {
  NOUVEAU: 'bg-blue-100 text-blue-800',
  FAUX_NUMERO: 'bg-red-100 text-red-800',
  LEADS: 'bg-green-100 text-green-800',
  MI_CHEMIN: 'bg-yellow-100 text-yellow-800',
  PAS_INTERESSE: 'bg-gray-100 text-gray-800',
  PAS_ELIGIBLE: 'bg-slate-100 text-slate-800',
  NRP_1: 'bg-orange-100 text-orange-800',
  NRP_2: 'bg-orange-200 text-orange-800',
  NRP_3: 'bg-orange-300 text-orange-800',
  NRP_4: 'bg-orange-400 text-orange-900',
  NRP_5: 'bg-orange-500 text-orange-900',
  VENDU: 'bg-purple-100 text-purple-800'
};