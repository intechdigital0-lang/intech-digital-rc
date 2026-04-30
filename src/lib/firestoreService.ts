import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  getDoc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { PortfolioItem } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const isOffline = error instanceof Error && error.message.includes('offline');
  
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };

  if (!isOffline) {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    console.warn(`Firestore is currently offline for ${operationType} on ${path}. Retrying automatically...`);
  }
}

export const portfolioService = {
  async getItems(): Promise<PortfolioItem[]> {
    const path = 'portfolio';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PortfolioItem[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  subscribeToItems(callback: (items: PortfolioItem[]) => void) {
    const path = 'portfolio';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PortfolioItem[];
      callback(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async addItem(item: Omit<PortfolioItem, 'id'>) {
    const path = 'portfolio';
    try {
      return await addDoc(collection(db, path), {
        ...item,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async deleteItem(id: string) {
    const path = `portfolio/${id}`;
    try {
      await deleteDoc(doc(db, 'portfolio', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async updateItem(id: string, item: Partial<PortfolioItem>) {
    const path = `portfolio/${id}`;
    try {
      await updateDoc(doc(db, 'portfolio', id), {
        ...item,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
};

export const settingsService = {
  async getSettings() {
    const path = 'settings/global';
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'global'));
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async updateHeroImage(imageUrl: string) {
    const path = 'settings/global';
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        heroImageUrl: imageUrl,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateWhyUsImage(imageUrl: string) {
    const path = 'settings/global';
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        whyUsImageUrl: imageUrl,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};

export const testimonialService = {
  subscribeToItems(callback: (items: any[]) => void) {
    const path = 'testimonials';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async addItem(item: any) {
    const path = 'testimonials';
    try {
      return await addDoc(collection(db, path), {
        ...item,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async deleteItem(id: string) {
    const path = `testimonials/${id}`;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
