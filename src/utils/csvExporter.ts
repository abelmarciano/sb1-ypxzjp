import Papa from 'papaparse';
import { Prospect, ProspectStatus } from '../types/prospect';
import { STATUS_LABELS } from '../constants/status';
import { CRM_FIELD_LABELS } from '../types/columnMapping';

export class CSVExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSVExportError';
  }
}

export function exportToCSV(prospects: Prospect[], selectedFields: string[]): void {
  try {
    if (!selectedFields || selectedFields.length === 0) {
      throw new CSVExportError('Veuillez sélectionner au moins un champ à exporter');
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
    if (error instanceof CSVExportError) {
      throw error;
    }
    throw new CSVExportError('Erreur lors de l\'export CSV');
  }
}