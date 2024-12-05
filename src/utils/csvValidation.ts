import { Prospect } from '../types/prospect';

export interface ValidationError {
  row: number;
  field: string;
  value: string;
  message: string;
}

export interface ValidationResult {
  validProspects: Prospect[];
  errors: ValidationError[];
}

export class CSVValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSVValidationError';
  }
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^[0-9+\s-]{8,}$/.test(phone);
}

function validatePostalCode(code: string): boolean {
  return /^(\d{2}|\d{5})$/.test(code);
}

function validateProspect(data: Partial<Prospect>, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!data.nom?.toString().trim()) {
    errors.push({
      row: rowIndex,
      field: 'nom',
      value: data.nom || '',
      message: 'Le nom est requis'
    });
  }

  // Email validation (if provided)
  if (data.email && !validateEmail(data.email.toString().trim())) {
    errors.push({
      row: rowIndex,
      field: 'email',
      value: data.email,
      message: 'Format d\'email invalide'
    });
  }

  // Phone validation (if provided)
  if (data.telephone && !validatePhone(data.telephone.toString().trim())) {
    errors.push({
      row: rowIndex,
      field: 'telephone',
      value: data.telephone,
      message: 'Format de téléphone invalide'
    });
  }

  // Postal code validation (if provided)
  if (data.codePostal && !validatePostalCode(data.codePostal.toString().trim())) {
    errors.push({
      row: rowIndex,
      field: 'codePostal',
      value: data.codePostal,
      message: 'Le code postal doit contenir 2 ou 5 chiffres'
    });
  }

  // Numeric fields validation
  const numericFields: (keyof Prospect)[] = ['montantElectricite', 'revenus', 'prospectPrice', 'leadPrice'];
  numericFields.forEach(field => {
    const value = data[field];
    if (value !== undefined && value !== null) {
      const num = parseFloat(value.toString());
      if (isNaN(num) || num < 0) {
        errors.push({
          row: rowIndex,
          field,
          value: value.toString(),
          message: `Le champ ${field} doit être un nombre positif`
        });
      }
    }
  });

  return errors;
}

export function validateImportedData(data: Partial<Prospect>[]): ValidationResult {
  try {
    const validProspects: Prospect[] = [];
    const errors: ValidationError[] = [];

    if (!Array.isArray(data)) {
      throw new CSVValidationError('Les données importées ne sont pas au bon format');
    }

    data.forEach((row, index) => {
      if (!row || typeof row !== 'object') {
        throw new CSVValidationError(`Ligne ${index + 1}: format de données invalide`);
      }

      const rowErrors = validateProspect(row, index + 1);
      
      if (rowErrors.length === 0) {
        validProspects.push({
          id: row.id || crypto.randomUUID(),
          nom: row.nom || '',
          prenom: row.prenom || '',
          email: row.email || '',
          telephone: row.telephone || '',
          ville: row.ville || '',
          prospectPrice: row.prospectPrice || 0,
          campagne: row.campagne || '',
          dateCreation: row.dateCreation || new Date().toISOString(),
          status: row.status || 'NOUVEAU',
          proprietaire: row.proprietaire || false,
          codePostal: row.codePostal || '',
          departement: row.departement || '',
          modeChauffage: row.modeChauffage || '',
          montantElectricite: row.montantElectricite || 0,
          revenus: row.revenus || 0,
          credit: row.credit || '',
          solution: row.solution || '',
          dernierAppel: row.dernierAppel,
          dateSold: row.dateSold,
          leadPrice: row.leadPrice || 0
        });
      } else {
        errors.push(...rowErrors);
      }
    });

    return { validProspects, errors };
  } catch (error) {
    if (error instanceof CSVValidationError) {
      throw error;
    }
    throw new CSVValidationError('Erreur lors de la validation des données');
  }
}