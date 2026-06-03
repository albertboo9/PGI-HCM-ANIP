import { create } from 'zustand';
import { Utilisateur } from '../types';

interface AuthState {
  currentUser: Utilisateur | null;
  currentRole: string;
  login: (user: Utilisateur) => void;
  logout: () => void;
  switchRole: (role: Utilisateur['role']) => void;
  hasPermission: (permission: string) => boolean;
}

// Simulons un utilisateur DG par défaut pour la démo
const defaultUser: Utilisateur = {
  id: 'usr-001',
  nom: 'Atangana',
  prenom: 'Jean-Pierre',
  role: 'dg',
  email: 'jp.atangana@anip.bj',
  telephone: '+229 61 00 00 01'
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: defaultUser,
  currentRole: defaultUser.role,
  
  login: (user) => set({ currentUser: user, currentRole: user.role }),
  
  logout: () => set({ currentUser: null, currentRole: '' }),
  
  switchRole: (role) => {
    // Dans un vrai système on vérifierait si l'utilisateur a le droit
    // Ici pour le démonstrateur, on permet le switch libre
    set({ currentRole: role });
  },
  
  hasPermission: (permission) => {
    const role = get().currentRole;
    if (role === 'dg') return true; // Le DG voit tout
    
    // Matrice de permissions simulée
    const rolePermissions: Record<string, string[]> = {
      drh: ['view_agents', 'manage_training', 'view_budget', 'manage_succession'],
      chef_centre: ['view_centre_agents', 'manage_centre_incidents'],
      directeur_dept: ['view_dept_centres', 'view_dept_iqsp'],
      responsable_qualite: ['view_all_incidents', 'view_iqsp', 'view_linguistic'],
      agent: ['view_own_profile', 'view_own_training'],
      auditeur: ['view_audit_logs', 'view_all_incidents']
    };
    
    return rolePermissions[role]?.includes(permission) || false;
  }
}));
