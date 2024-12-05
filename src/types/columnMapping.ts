import { Prospect } from './prospect';

export interface ColumnMapping {
  csvHeader: string;
  crmField: keyof Prospect;
}

export interface MappingConfig {
  name: string;
  mappings: ColumnMapping[];
}

export const CRM_FIELD_OPTIONS = [
  { value: 'nom', label: 'Nom' },
  { value: 'prenom', label: 'Prénom' },
  { value: 'email', label: 'Email' },
  { value: 'telephone', label: 'Téléphone' },
  { value: 'ville', label: 'Ville' },
  { value: 'campagne', label: 'Campagne' },
  { value: 'dateCreation', label: 'Date import' },
  { value: 'status', label: 'Statut' },
  { value: 'dernierAppel', label: 'Dernier appel' },
  { value: 'proprietaire', label: 'Propriétaire' },
  { value: 'codePostal', label: 'Code postal' },
  { value: 'departement', label: 'Département' },
  { value: 'modeChauffage', label: 'Mode de chauffage' },
  { value: 'montantElectricite', label: 'Montant électricité' },
  { value: 'revenus', label: 'Revenus' },
  { value: 'credit', label: 'Crédit' },
  { value: 'solution', label: 'Solution' }
] as const;

export const CRM_FIELD_LABELS: Record<string, string> = Object.fromEntries(
  CRM_FIELD_OPTIONS.map(option => [option.value, option.label])
);