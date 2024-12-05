import Papa from 'papaparse';
import { Prospect, ProspectStatus } from '../types/prospect';
import { ColumnMapping } from '../types/columnMapping';
import { STATUS_LABELS } from '../constants/status';
import { CRM_FIELD_LABELS } from '../types/columnMapping';

export class CSVError extends Error {
  constructor(message: string, name = 'CSVError') {
    super(message);
    this.name = name;
  }
}

export class CSVParseError extends CSVError {
  constructor(message: string) {
    super(message, 'CSVParseError');
  }
}

export class CSVMapError extends CSVError {
  constructor(message: string) {
    super(message, 'CSVMapError');
  }
}

export class CSVValidationError extends CSVError {
  constructor(message: string) {
    super(message, 'CSVValidationError');
  }
}

export interface CSVParseResult {
  data: any[];
  headers: string[];
}

export async function parseCSV(file: File): Promise<CSVParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.data && Array.isArray(results.data)) {
          resolve({
            data: results.data,
            headers: results.meta.fields || []
          });
        } else {
          reject(new CSVParseError('Format de fichier CSV invalide'));
        }
      },
      error: (error) => {
        reject(new CSVParseError(`Erreur lors de la lecture du fichier CSV: ${error}`));
      }
    });
  });
}

export function applyColumnMapping(data: any[], mapping: ColumnMapping[]): Partial<Prospect>[] {
  try {
    if (!Array.isArray(data)) {
      throw new CSVMapError('Les données à mapper ne sont pas au bon format');
    }

    if (!Array.isArray(mapping) || mapping.length === 0) {
      throw new CSVMapError('Le mapping des colonnes est invalide');
    }

    return data.map(row => {
      const mappedRow: Partial<Prospect> = {
        id: crypto.randomUUID(),
        status: 'NOUVEAU' as ProspectStatus,
        dateCreation: new Date().toISOString(),
        proprietaire: false,
        credit: false,
        montantElectricite: 0,
        revenus: 0,
        prospectPrice: 0,
        leadPrice: 0
      };

      mapping.forEach(({ csvHeader, crmField }) => {
        if (!csvHeader || !crmField) return;

        let value = row[csvHeader];
        if (value === undefined || value === null || value === '') return;

        value = value.toString().trim();

        switch (crmField) {
          case 'proprietaire':
          case 'credit':
            mappedRow[crmField] = ['true', 'oui', '1', 'yes', 'vrai'].includes(value.toLowerCase());
            break;

          case 'montantElectricite':
          case 'revenus':
          case 'leadPrice':
          case 'prospectPrice':
            const numStr = value.replace(/[^0-9.,]/g, '').replace(',', '.');
            const num = parseFloat(numStr);
            mappedRow[crmField] = isNaN(num) ? 0 : num;
            break;

          case 'telephone':
            mappedRow[crmField] = value.replace(/[^0-9+]/g, '');
            break;

          case 'email':
            mappedRow[crmField] = value.toLowerCase();
            break;

          case 'codePostal':
            mappedRow.codePostal = value.replace(/[^0-9]/g, '');
            if (mappedRow.codePostal.length >= 2) {
              mappedRow.departement = mappedRow.codePostal.substring(0, 2);
            }
            break;

          default:
            mappedRow[crmField] = value;
        }
      });

      return mappedRow;
    });
  } catch (error) {
    if (error instanceof CSVMapError) {
      throw error;
    }
    throw new CSVMapError('Erreur lors du mapping des données');
  }
}

export function exportToCSV(prospects: Prospect[], selectedFields: string[]): void {
  try {
    if (!selectedFields || selectedFields.length === 0) {
      throw new CSVError('Veuillez sélectionner au moins un champ à exporter');
    }

    const exportData = prospects.map(prospect => {
      const row: Record<string, any> = {};
      selectedFields.forEach(field => {
        const label = CRM_FIELD_LABELS[field];
        if (!label) return;

        let value = prospect[field as keyof Prospect];

        // Format values based on field type
        switch (field) {
          case 'status':
            value = STATUS_LABELS[value as ProspectStatus] || value;
            break;
          case 'proprietaire':
          case 'credit':
            value = value ? 'Oui' : 'Non';
            break;
          case 'dateCreation':
          case 'dernierAppel':
            value = value ? new Date(value).toLocaleString('fr-FR') : '';
            break;
          case 'montantElectricite':
          case 'revenus':
          case 'leadPrice':
          case 'prospectPrice':
            value = value ? `${value}€` : '0€';
            break;
          default:
            value = value || '';
        }

        row[label] = value;
      });
      return row;
    });

    const csv = Papa.unparse(exportData, {
      delimiter: ';',
      header: true
    });

    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `prospects_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    if (error instanceof CSVError) {
      throw error;
    }
    throw new CSVError('Erreur lors de l\'export CSV');
  }
}