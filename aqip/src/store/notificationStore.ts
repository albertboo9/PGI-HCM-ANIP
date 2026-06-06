import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '../types/notification.types';
import { useDataStore } from '../data/dataStore';

interface NotificationState {
  notifications: Notification[];

  getAll: () => Notification[];
  getByAgent: (agentId: string) => Notification[];
  getNonLues: () => Notification[];
  getUrgentes: () => Notification[];

  create: (data: Omit<Notification, 'id' | 'date'>) => Notification;
  markAsLu: (id: string) => void;
  markAllAsLu: () => void;
  remove: (id: string) => void;

  getNonLuesCount: () => number;
  getRecent: (limit?: number) => Notification[];
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      getAll: () => {
        const n = get().notifications;
        if (n.length === 0) { const d = useDataStore.getState().getCollection('notifications'); set({ notifications: d }); return d; }
        return n;
      },

      getByAgent: (agentId) => get().getAll().filter(n => n.agentId === agentId),
      getNonLues: () => get().getAll().filter(n => !n.lu),
      getUrgentes: () => get().getAll().filter(n => n.priorite === 'urgente'),

      create: (data) => {
        const n: Notification = { id: `notif-${Date.now()}`, ...data, date: new Date().toISOString() };
        set(state => ({ notifications: [n, ...state.notifications] }));
        return n;
      },

      markAsLu: (id) => set(state => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, lu: true } : n) })),
      markAllAsLu: () => set(state => ({ notifications: state.notifications.map(n => ({ ...n, lu: true })) })),
      remove: (id) => set(state => ({ notifications: state.notifications.filter(n => n.id !== id) })),

      getNonLuesCount: () => get().getAll().filter(n => !n.lu).length,
      getRecent: (limit = 10) => [...get().getAll()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit),
    }),
    { name: 'aqip-notifications', partialize: (state) => ({ notifications: state.notifications }) }
  )
);