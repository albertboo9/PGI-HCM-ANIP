import React, { useState } from 'react';
import { UserCircle, ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../store/authStore';

const ROLES = [
  { id: 'dg', label: 'Directeur Général', desc: 'Vision nationale et stratégique' },
  { id: 'drh', label: 'Directeur des RH', desc: 'Gestion talents et budget' },
  { id: 'directeur_dept', label: 'Directeur Départemental', desc: 'Supervision département' },
  { id: 'chef_centre', label: 'Chef de Centre', desc: 'Pilotage opérationnel local' },
  { id: 'responsable_qualite', label: 'Responsable Qualité', desc: 'Incidents et audits' },
  { id: 'auditeur', label: 'Auditeur', desc: 'Conformité et traçabilité' },
  { id: 'agent', label: 'Agent d\'Enrôlement', desc: 'Opérations terrain' },
];

export default function RoleSwitcher() {
  const { currentRole, switchRole } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const activeRole = ROLES.find(r => r.id === currentRole) || ROLES[0];

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-x-3 cursor-pointer hover:bg-aqip-bg-elevated p-2 rounded-md transition-colors border border-transparent hover:border-aqip-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        <UserCircle className="h-8 w-8 text-aqip-text-muted" aria-hidden="true" />
        <span className="hidden lg:flex lg:items-center">
          <span className="flex flex-col text-sm font-semibold leading-none text-aqip-text-primary text-left">
            <span>{activeRole.label}</span>
            <span className="text-[10px] font-normal text-aqip-primary uppercase tracking-wider mt-1">Mode Démo</span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4 text-aqip-text-muted" aria-hidden="true" />
        </span>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-72 rounded-xl bg-aqip-bg-surface shadow-2xl border border-aqip-border py-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-2 border-b border-aqip-border mb-2">
              <p className="text-xs font-semibold text-aqip-text-muted uppercase tracking-wider">Changer de Persona</p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    switchRole(role.id as any);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    'w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-aqip-bg-elevated transition-colors',
                    currentRole === role.id ? 'bg-aqip-primary/10' : ''
                  )}
                >
                  <div>
                    <p className={clsx('text-sm font-medium', currentRole === role.id ? 'text-aqip-primary' : 'text-aqip-text-primary')}>
                      {role.label}
                    </p>
                    <p className="text-xs text-aqip-text-muted mt-0.5">{role.desc}</p>
                  </div>
                  {currentRole === role.id && <Check className="h-4 w-4 text-aqip-primary" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
