import { create } from 'zustand';
import type { Centre, Departement } from '../types';

interface CentreState {
  centres: Centre[];
  departements: Departement[];
  isLoading: boolean;
  error: string | null;
  fetchCentres: () => Promise<void>;
  getCentreById: (id: string) => Centre | undefined;
  getCentresByDepartement: (deptId: string) => Centre[];
}

export const useCentreStore = create<CentreState>((set, get) => ({
  centres: [],
  departements: [],
  isLoading: false,
  error: null,
  
  fetchCentres: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/db.json');
      const data = await response.json();
      set({ centres: data.centres, departements: data.departements, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch centres', isLoading: false });
    }
  },
  
  getCentreById: (id) => {
    return get().centres.find(c => c.id === id);
  },
  
  getCentresByDepartement: (deptId) => {
    return get().centres.filter(c => c.departementId === deptId);
  }
}));
