import { openDB, IDBPDatabase } from 'idb';
import { Prospect } from '../types/prospect';

const DB_NAME = 'crm-prospects';
const DB_VERSION = 1;
const STORE_NAME = 'prospects';

let db: IDBPDatabase | null = null;

export async function initDB() {
  if (db) return db;

  try {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('status', 'status');
          store.createIndex('dateCreation', 'dateCreation');
          store.createIndex('departement', 'departement');
          store.createIndex('campagne', 'campagne');
          store.createIndex('dateSold', 'dateSold');
          store.createIndex('leadPrice', 'leadPrice');
          store.createIndex('prospectPrice', 'prospectPrice');
        }
      },
      blocked() {
        console.warn('Une version précédente de la base de données est bloquée');
      },
      blocking() {
        console.warn('Une nouvelle version de la base de données tente de prendre le contrôle');
        if (db) {
          db.close();
          db = null;
        }
      },
      terminated() {
        console.error('La base de données a été terminée de manière inattendue');
        db = null;
      }
    });

    return db;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw new Error('Impossible d\'initialiser la base de données');
  }
}

export async function ensureDB() {
  if (!db) {
    await initDB();
  }
  if (!db) throw new Error('La base de données n\'est pas initialisée');
  return db;
}

export async function getAllProspects(): Promise<Prospect[]> {
  try {
    const db = await ensureDB();
    const prospects = await db.getAll(STORE_NAME);
    return prospects.sort((a, b) => 
      new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des prospects:', error);
    throw new Error('Impossible de récupérer les prospects');
  }
}

export async function addProspects(prospects: Prospect[]): Promise<void> {
  try {
    const db = await ensureDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    
    await Promise.all([
      ...prospects.map(prospect => {
        const newProspect: Prospect = {
          id: prospect.id || crypto.randomUUID(),
          nom: prospect.nom || '',
          prenom: prospect.prenom || '',
          email: prospect.email || '',
          prospectPrice: prospect.prospectPrice || 0,
          telephone: prospect.telephone || '',
          ville: prospect.ville || '',
          campagne: prospect.campagne || '',
          dateCreation: prospect.dateCreation || new Date().toISOString(),
          status: prospect.status || 'NOUVEAU',
          proprietaire: prospect.proprietaire || false,
          codePostal: prospect.codePostal || '',
          departement: prospect.departement || '',
          modeChauffage: prospect.modeChauffage || '',
          montantElectricite: prospect.montantElectricite || 0,
          revenus: prospect.revenus || 0,
          credit: prospect.credit || '',
          solution: prospect.solution || '',
          dernierAppel: prospect.dernierAppel,
          dateSold: prospect.dateSold,
          leadPrice: prospect.leadPrice || 0
        };
        return tx.store.put(newProspect);
      }),
      tx.done
    ]);
  } catch (error) {
    console.error('Erreur lors de l\'ajout des prospects:', error);
    throw new Error('Impossible d\'ajouter les prospects');
  }
}

export async function updateProspect(prospect: Prospect): Promise<void> {
  try {
    const db = await ensureDB();
    const existingProspect = await db.get(STORE_NAME, prospect.id);
    
    if (!existingProspect) {
      throw new Error('Prospect non trouvé');
    }

    const updatedProspect = {
      ...existingProspect,
      ...prospect,
      dateModification: new Date().toISOString()
    };

    await db.put(STORE_NAME, updatedProspect);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du prospect:', error);
    throw new Error('Impossible de mettre à jour le prospect');
  }
}

export async function deleteProspects(ids: string[]): Promise<void> {
  try {
    const db = await ensureDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await Promise.all([
      ...ids.map(id => tx.store.delete(id)),
      tx.done
    ]);
  } catch (error) {
    console.error('Erreur lors de la suppression des prospects:', error);
    throw new Error('Impossible de supprimer les prospects');
  }
}

export async function getProspectsByStatus(status: string): Promise<Prospect[]> {
  try {
    const db = await ensureDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const index = tx.store.index('status');
    return index.getAll(status);
  } catch (error) {
    console.error('Erreur lors de la récupération des prospects par statut:', error);
    throw new Error('Impossible de récupérer les prospects par statut');
  }
}

export async function clearDatabase(): Promise<void> {
  try {
    const db = await ensureDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.clear();
    await tx.done;
  } catch (error) {
    console.error('Erreur lors de la suppression de la base de données:', error);
    throw new Error('Impossible de supprimer la base de données');
  }
}