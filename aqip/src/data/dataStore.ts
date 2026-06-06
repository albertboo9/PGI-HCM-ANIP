// DataStore central - Initialise et reset les données
// Utilise le générateur pour créer les données mockées
// Persiste dans localStorage via zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateAllData } from './generateData';
import type { DataStore } from './generateData';

export type DataStoreKey = keyof DataStore;

interface DataState {
  // Données
  data: DataStore | null;
  isInitialized: boolean;
  
  // Actions
  initialize: () => void;
  reset: () => void;
  getCollection: <K extends DataStoreKey>(key: K) => DataStore[K];
  updateCollection: <K extends DataStoreKey>(key: K, items: DataStore[K]) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      data: null,
      isInitialized: false,

      initialize: () => {
        if (get().isInitialized && get().data) return;
        const freshData = generateAllData();
        set({ data: freshData, isInitialized: true });
      },

      reset: () => {
        const freshData = generateAllData();
        set({ data: freshData, isInitialized: true });
      },

      getCollection: <K extends DataStoreKey>(key: K): DataStore[K] => {
        const state = get();
        if (!state.data) {
          state.initialize();
        }
        return (get().data as DataStore)[key];
      },

      updateCollection: <K extends DataStoreKey>(key: K, items: DataStore[K]) => {
        set(state => ({
          data: state.data ? { ...state.data, [key]: items } : state.data,
        }));
      },
    }),
    {
      name: 'aqip-datastore',
      partialize: (state) => ({
        data: state.data,
        isInitialized: state.isInitialized,
      }),
    }
  )
);