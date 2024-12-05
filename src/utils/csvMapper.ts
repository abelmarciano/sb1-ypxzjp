import { Prospect, ProspectStatus } from '../types/prospect';
import { ColumnMapping } from '../types/columnMapping';

export class CSVMapError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSVMapError';
  }
}

function convertValue(value: string, type: string, field: string): any {
  try {
    switch (type) {
      case 'boolean':
        return ['true', 'oui', '1', 'yes', 'vrai'].includes(value.toLowerCase());
      case 'number':
        const numStr = value.replace(/[^0-9.,]/g, '').replace(',', '.');
        const num = parseFloat(numStr);
        return isNaN(num) ? 0 : num;
      case 'phone':
        return value.replace(/[^0-9+]/g, '');
      case 'email':
        return value.toLowerCase();
      case 'postal':
        return value.replace(/[^0-9]/g, '');
      default:
        return value;
    }
  } catch (error) {
    throw new CSVMapError(`Erreur de conversion pour le champ ${field}`);
  }
}

export function applyColumnMapping(data: any[], mapping: ColumnMapping[]): Partial<Prospect>[] {
  try {
    if (!Array.isArray(data)) {
      throw new CSVMapError('Les données à mapper ne sont pas au bon format');
    }

    if (!Array.isArray(mapping) || mapping.length === 0) {
      throw new CSVMapError('Le mapping des colonnes est invalide');
    }

    return data.map((row, index) => {
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
        if (!csvHeader || !crmField) {
          throw new CSVMapError(`Mapping invalide à la ligne ${index + 1}`);
        }

        let value = row[csvHeader];
        if (value === undefined || value === null || value === '') return;

        value = value.toString().trim();

        switch (crmField) {
          case 'proprietaire':
          case 'credit':
            mappedRow[crmField] = convertValue(value, 'boolean', crmField);
            break;

          case 'montantElectricite':
          case 'revenus':
          case 'leadPrice':
          case 'prospectPrice':
            mappedRow[crmField] = convertValue(value, 'number', crmField);
            break;

          case 'telephone':
            mappedRow[crmField] = convertValue(value, 'phone', crmField);
            break;

          case 'email':
            mappedRow[crmField] = convertValue(value, 'email', crmField);
            break;

          case 'codePostal':
            mappedRow.codePostal = convertValue(value, 'postal', crmField);
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