import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Feedback } from '../types';
import { useDataStore } from '../data/dataStore';

interface FeedbackState {
  feedbacks: Feedback[];
  getAll: () => Feedback[];
  getByAgent: (agentId: string) => Feedback[];
  getNonLus: () => Feedback[];
  getPositifs: () => Feedback[];
  getConstructifs: () => Feedback[];
  create: (data: Omit<Feedback, 'id' | 'date' | 'vu'>) => Feedback;
  markAsLu: (id: string) => void;
  getMoyenne: (agentId: string) => number;
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      feedbacks: [],
      getAll: () => {
        const f = get().feedbacks;
        if (f.length === 0) { const d = useDataStore.getState().getCollection('feedbacks'); set({ feedbacks: d }); return d; }
        return f;
      },
      getByAgent: (agentId) => get().getAll().filter(f => f.agentId === agentId),
      getNonLus: () => get().getAll().filter(f => !f.vu),
      getPositifs: () => get().getAll().filter(f => f.type === 'positif'),
      getConstructifs: () => get().getAll().filter(f => f.type === 'constructif'),
      create: (data) => {
        const f: Feedback = { id: `fb-${Date.now()}`, ...data, date: new Date().toISOString().split('T')[0], vu: false };
        set(state => ({ feedbacks: [...state.feedbacks, f] }));
        return f;
      },
      markAsLu: (id) => set(state => ({ feedbacks: state.feedbacks.map(f => f.id === id ? { ...f, vu: true } : f) })),
      getMoyenne: (agentId) => {
        const fb = get().getByAgent(agentId);
        return fb.length ? Math.round(fb.reduce((s, f) => s + f.note, 0) / fb.length * 10) / 10 : 0;
      },
    }),
    { name: 'aqip-feedbacks', partialize: (state) => ({ feedbacks: state.feedbacks }) }
  )
);