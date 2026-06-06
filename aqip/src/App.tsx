import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

// Dashboard (Router multi-personas)
import DashboardPage from './pages/Dashboard/DashboardPage';

// Pilier 1 : Référentiel
import MetiersPage from './pages/Piller1_Referentiel/MetiersPage';
import CompetencesPage from './pages/Piller1_Referentiel/CompetencesPage';
import ProfilsPage from './pages/Piller1_Referentiel/ProfilsPage';
import MatricePage from './pages/Piller1_Referentiel/MatricePage';

// Pilier 2 : Qualité
import IncidentsPage from './pages/Piller2_Qualite/IncidentsPage';
import IncidentDetail from './pages/Piller2_Qualite/IncidentDetail';
import ErreursPage from './pages/Piller2_Qualite/ErreursPage';
import CentresPage from './pages/Piller2_Qualite/CentresPage';
import ObservatoireDonneesPage from './pages/Piller2_Qualite/ObservatoireDonneesPage';
import QualityWorkflowPage from './pages/Quality/QualityWorkflowPage';
import CentrePage from './pages/Quality/CentrePage';
import SuccessStoriesPage from './pages/Intelligence/SuccessStoriesPage';
import CompetencyMapPage from './pages/Intelligence/CompetencyMapPage';

// Pilier 3 : Intelligence
import ScoresPage from './pages/Piller3_Intelligence/ScoresPage';
import CoachPage from './pages/Coach/CoachPage';

// Pilier 4 : Excellence
import LMSPage from './pages/Piller4_Excellence/LMSPage';
import CatalogueFormationsPage from './pages/Piller4_Excellence/CatalogueFormationsPage';
import Feedback360Page from './pages/Piller4_Excellence/Feedback360Page';
import CertificationsPage from './pages/Piller4_Excellence/CertificationsPage';
import MaturitePage from './pages/Piller2_Qualite/MaturitePage';

// Pilier 5 : Citoyen
import CitizenJourneyPage from './pages/Piller5_Citoyen/CitizenJourneyPage';
import SatisfactionPage from './pages/Piller5_Citoyen/SatisfactionPage';

// Pilier 6 : Mission Control
import MissionControlPage from './pages/Piller6_MissionControl/MissionControlPage';
import CommandCenterPage from './pages/Piller6_MissionControl/CommandCenterPage';

// Pilier 7 : Gouvernance
import AuditPage from './pages/Piller7_Gouvernance/AuditPage';

// Pilier 8 : RH & Finance
import OrganigrammePage from './pages/Piller8_RH/OrganigrammePage';
import TalentsPage from './pages/Piller8_RH/TalentsPage';

// Workspace Agent
import AgentWorkspacePage from './pages/Workspace/AgentWorkspacePage';

// Dossier Amélioration
import DossierAmeliorationPage from './pages/Agent/DossierAmeliorationPage';

// Catalogue Formations (Nouveau)
import CataloguePage from './pages/Formations/CataloguePage';
import MonEvolutionPage from './pages/LMS/MonEvolutionPage';
import FormationDetailPage from './pages/Formations/FormationDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="workspace" element={<AgentWorkspacePage />} />
          <Route path="agent/:agentId/dossier" element={<DossierAmeliorationPage />} />
          
          {/* Pilier 1 */}
          <Route path="referentiel/metiers" element={<MetiersPage />} />
          <Route path="referentiel/competences" element={<CompetencesPage />} />
          <Route path="referentiel/profils" element={<ProfilsPage />} />
          <Route path="referentiel/matrice" element={<MatricePage />} />

          {/* Pilier 2 */}
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="incidents/:id" element={<IncidentDetail />} />
          <Route path="qualite/erreurs" element={<ErreursPage />} />
          <Route path="qualite/centres" element={<CentresPage />} />
          <Route path="qualite/observatoire" element={<ObservatoireDonneesPage />} />
          <Route path="qualite/workflow" element={<QualityWorkflowPage />} />
          <Route path="qualite/centre" element={<CentrePage />} />
          <Route path="success-stories" element={<SuccessStoriesPage />} />
          <Route path="competency-map" element={<CompetencyMapPage />} />

          {/* Pilier 3 */}
          <Route path="coach" element={<CoachPage />} />
          <Route path="mon-evolution" element={<MonEvolutionPage />} />
          <Route path="intelligence/scores" element={<ScoresPage />} />
          
          {/* Pilier 4 */}
          <Route path="excellence/lms" element={<LMSPage />} />
          <Route path="excellence/catalogue" element={<CatalogueFormationsPage />} />
          <Route path="excellence/feedback" element={<Feedback360Page />} />
          <Route path="excellence/certifications" element={<CertificationsPage />} />
          <Route path="maturite" element={<MaturitePage />} />
          
          {/* Pilier 5 */}
          <Route path="citoyen" element={<CitizenJourneyPage />} />
          <Route path="satisfaction" element={<SatisfactionPage />} />
          
          {/* Pilier 6 */}
          <Route path="mission-control" element={<MissionControlPage />} />
          <Route path="pilotage/command-center" element={<CommandCenterPage />} />
          
          {/* Pilier 7 */}
          <Route path="gouvernance/audit" element={<AuditPage />} />
          
          {/* Pilier 8 */}
          <Route path="rh/organigramme" element={<OrganigrammePage />} />
          <Route path="rh/talents" element={<TalentsPage />} />

          {/* Catalogue Formations (Accessible par tous) */}
          <Route path="formations/catalogue" element={<CataloguePage />} />
          <Route path="formations/:formationId" element={<FormationDetailPage />} />
          <Route path="certificats" element={<CataloguePage />} />
          <Route path="documents" element={<CataloguePage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
