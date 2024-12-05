export type ProspectStatus = 
  | 'NOUVEAU'
  | 'FAUX_NUMERO'
  | 'LEADS'
  | 'MI_CHEMIN'
  | 'PAS_INTERESSE'
  | 'PAS_ELIGIBLE'
  | 'NRP_1'
  | 'NRP_2'
  | 'NRP_3'
  | 'NRP_4'
  | 'NRP_5'
  | 'VENDU';

export interface Prospect {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  ville: string;
  prospectPrice: number;
  campagne: string;
  dateCreation: string;
  status: ProspectStatus;
  dernierAppel?: string;
  proprietaire: boolean;
  codePostal: string;
  departement: string;
  modeChauffage: string;
  montantElectricite: number;
  revenus: number;
  credit: string;
  solution: string;
  dateSold?: string;
  leadPrice?: number;
}