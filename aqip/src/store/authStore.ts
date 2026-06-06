import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Utilisateur } from '../types';
import { useDataStore } from '../data/dataStore';

export type Role = 'agent' | 'chef_centre' | 'directeur_dept' | 'drh' | 'dg' | 'auditeur' | 'responsable_qualite';

export interface RoleConfig {
  label: string;
  icon: string;
  description: string;
  dashboardLabel: string;
  menu: string[];
  permissions: string[];
}

export const ROLES_CONFIG: Record<Role, RoleConfig> = {
  agent: {
    label: "Agent d'enrôlement",
    icon: '👤',
    description: 'Agent de terrain - Accès personnel',
    dashboardLabel: 'Mon Tableau de Bord',
    menu: ['dashboard', 'workspace', 'formations', 'coach-ia', 'profil'],
    permissions: ['read:own', 'create:formation_request'],
  },
  chef_centre: {
    label: 'Chef de Centre',
    icon: '🏢',
    description: 'Gère son centre et ses agents',
    dashboardLabel: 'Tableau de Bord Centre',
    menu: ['dashboard', 'equipe', 'qualite-centre', 'formations-equipe', 'incidents'],
    permissions: ['read:centre', 'create:incident', 'validate:formation_request'],
  },
  directeur_dept: {
    label: 'Directeur Départemental',
    icon: '🗺️',
    description: 'Pilote les centres du département',
    dashboardLabel: 'Pilotage Départemental',
    menu: ['dashboard', 'centres', 'performances', 'cartographie', 'rapports'],
    permissions: ['read:departement', 'validate:budget', 'validate:mutation'],
  },
  drh: {
    label: 'Directeur RH',
    icon: '👥',
    description: 'Gère les ressources humaines',
    dashboardLabel: 'Pilotage RH',
    menu: ['dashboard', 'agents', 'competences', 'formations', 'budget', 'talents'],
    permissions: ['read:all', 'create:agent', 'update:agent', 'validate:budget'],
  },
  dg: {
    label: 'Directeur Général',
    icon: '📊',
    description: 'Vision stratégique nationale',
    dashboardLabel: 'Command Center',
    menu: ['command-center', 'performance-nationale', 'cartographie', 'talents', 'roi', 'decisions-rh'],
    permissions: ['read:all', 'validate:strategic'],
  },
  auditeur: {
    label: 'Auditeur',
    icon: '🔍',
    description: 'Contrôle et conformité',
    dashboardLabel: 'Audit & Conformité',
    menu: ['dashboard', 'audits', 'conformite', 'incidents', 'rapports'],
    permissions: ['read:all', 'create:audit_report'],
  },
  responsable_qualite: {
    label: 'Responsable Qualité',
    icon: '🛡️',
    description: 'Pilote la qualité opérationnelle',
    dashboardLabel: 'Qualité Opérationnelle',
    menu: ['dashboard', 'incidents', 'erreurs', 'centres', 'observatoire'],
    permissions: ['read:all', 'update:incident', 'create:quality_report'],
  },
};

interface AuthState {
  currentUser: Utilisateur | null;
  currentRole: Role;
  isAuthenticated: boolean;
  
  // Actions
  login: (userId: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  getRoleConfig: () => RoleConfig;
  getUsers: () => Utilisateur[];
  hasPermission: (permission: string) => boolean;
  getPersonas: () => { user: Utilisateur; role: Role }[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      currentRole: 'dg',
      isAuthenticated: true, // Toujours connecté pour la démo

      login: (userId) => {
        const users = useDataStore.getState().getCollection('utilisateurs');
        const user = users.find(u => u.id === userId);
        if (user) {
          set({ currentUser: user, currentRole: user.role as Role, isAuthenticated: true });
        }
      },

      logout: () => {
        set({ currentUser: null, currentRole: 'agent', isAuthenticated: false });
      },

      switchRole: (role) => {
        // Trouver un utilisateur avec ce rôle
        const users = useDataStore.getState().getCollection('utilisateurs');
        const user = users.find(u => u.role === role) || users[0];
        set({ currentUser: user, currentRole: role, isAuthenticated: true });
      },

      getRoleConfig: () => {
        return ROLES_CONFIG[get().currentRole];
      },

      getUsers: () => {
        return useDataStore.getState().getCollection('utilisateurs');
      },

      hasPermission: (permission) => {
        const config = ROLES_CONFIG[get().currentRole];
        return config.permissions.includes(permission);
      },

      getPersonas: () => {
        const users = useDataStore.getState().getCollection('utilisateurs');
        return users.map(u => ({
          user: u,
          role: u.role as Role,
        }));
      },
    }),
    {
      name: 'aqip-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentRole: state.currentRole,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);