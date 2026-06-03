import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

import IncidentsPage from './pages/Piller2_Qualite/IncidentsPage';
import IncidentDetail from './pages/Piller2_Qualite/IncidentDetail';
import SatisfactionPage from './pages/Piller5_Citoyen/SatisfactionPage';
import CitizenJourneyPage from './pages/Piller5_Citoyen/CitizenJourneyPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import IAPage from './pages/Piller3_Intelligence/IAPage';
import MaturitePage from './pages/Piller2_Qualite/MaturitePage';
import MissionControlPage from './pages/Piller6_MissionControl/MissionControlPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="incidents/:id" element={<IncidentDetail />} />
          <Route path="maturite" element={<MaturitePage />} />
          <Route path="citoyen" element={<SatisfactionPage />} />
          <Route path="citoyen/journey" element={<CitizenJourneyPage />} />
          <Route path="ia" element={<IAPage />} />
          <Route path="mission-control" element={<MissionControlPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
