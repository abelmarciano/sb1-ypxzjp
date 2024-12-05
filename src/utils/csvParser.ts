import Papa from 'papaparse';

export interface CSVParseResult {
  data: any[];
  headers: string[];
}

export class CSVParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSVParseError';
  }
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