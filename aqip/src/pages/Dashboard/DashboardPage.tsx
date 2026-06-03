import { useAuthStore } from '../../store/authStore';
import DGExecDashboard from './DGExecDashboard';
import DRHDashboard from './DRHDashboard';
import CentreChefDashboard from './CentreChefDashboard';
import QualiteDashboard from './QualiteDashboard';
import AgentDashboard from './AgentDashboard';

export default function DashboardPage() {
  const { currentRole } = useAuthStore();

  switch (currentRole) {
    case 'dg':
      return <DGExecDashboard />;
    case 'drh':
      return <DRHDashboard />;
    case 'chef_centre':
    case 'directeur_dept':
      return <CentreChefDashboard />;
    case 'responsable_qualite':
    case 'auditeur':
      return <QualiteDashboard />;
    case 'agent':
      return <AgentDashboard />;
    default:
      return <DGExecDashboard />;
  }
}

