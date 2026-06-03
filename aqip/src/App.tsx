import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

import IncidentsPage from './pages/Piller2_Qualite/IncidentsPage';
import IncidentDetail from './pages/Piller2_Qualite/IncidentDetail';
import SatisfactionPage from './pages/Piller5_Citoyen/SatisfactionPage';
import CitizenJourneyPage from './pages/Piller5_Citoyen/CitizenJourneyPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import IAPage from './pages/Piller3_Intelligence/IAPage';

// Pages (à remplacer par de vrais composants par la suite)
const MissionControlPlaceholder = () => <div className="p-6"><h1 className="text-2xl font-bold">Mission Control Replay</h1></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="incidents/:id" element={<IncidentDetail />} />
          <Route path="citoyen" element={<SatisfactionPage />} />
          <Route path="citoyen/journey" element={<CitizenJourneyPage />} />
          <Route path="ia" element={<IAPage />} />
          <Route path="mission-control" element={<MissionControlPlaceholder />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
