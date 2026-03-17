import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  doc,
  getDoc
} from 'firebase/firestore';

export interface LegalCase {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: number;
  legalDomain: string;
  judge: string;
  summary: string;
  fullText: string;
  authorityWeight: number;
  citatorStatus: 'followed' | 'distinguished' | 'overruled';
  citedBy?: string[];
  cites?: string[];
}

export interface Statute {
  id: string;
  actName: string;
  chapter?: string;
  section: string;
  subsection?: string;
  title: string;
  content: string;
  legalDomain: string;
}

export const LegalService = {
  async searchCases(searchTerm: string, domain?: string) {
    const path = 'cases';
    try {
      let q = query(collection(db, path), orderBy('authorityWeight', 'desc'), limit(10));
      
      if (domain) {
        q = query(collection(db, path), where('legalDomain', '==', domain), orderBy('authorityWeight', 'desc'), limit(10));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LegalCase));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async getCaseById(id: string) {
    const path = `cases/${id}`;
    try {
      const docRef = doc(db, 'cases', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as LegalCase) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async searchStatutes(actName: string, section?: string) {
    const path = 'statutes';
    try {
      let q = query(collection(db, path), where('actName', '==', actName));
      if (section) {
        q = query(q, where('section', '==', section));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Statute));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async getCitatorData(caseId: string) {
    try {
      const mainCase = await this.getCaseById(caseId);
      if (!mainCase) return null;

      const citedBy = mainCase.citedBy ? await Promise.all(mainCase.citedBy.map(id => this.getCaseById(id))) : [];
      const cites = mainCase.cites ? await Promise.all(mainCase.cites.map(id => this.getCaseById(id))) : [];

      return {
        case: mainCase,
        citedBy: citedBy.filter(Boolean),
        cites: cites.filter(Boolean)
      };
    } catch (error) {
      console.error("Citator data fetch failed", error);
      return null;
    }
  }
};
