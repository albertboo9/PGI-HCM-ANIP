import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToasterProvider } from './components/ui/AQIPToaster'
import { useDataStore } from './data/dataStore'

// 🔥 Initialiser les données mockées au démarrage de l'application
useDataStore.getState().initialize();

// 🔥 Initialiser les stores avec les données
import { useAgentStore } from './store/agentStore'
import { useIncidentStore } from './store/incidentStore'
import { useFormationStore } from './store/formationStore'
import { useCentreStore } from './store/centreStore'

const data = useDataStore.getState().data;
if (data) {
  if (data.agents.length > 0) {
    useAgentStore.setState({ agents: data.agents });
    useIncidentStore.setState({ incidents: data.incidents });
    useFormationStore.setState({ 
      formations: data.formations, 
      formationsSuivies: data.formationsSuivies 
    });
    useCentreStore.setState({ 
      centres: data.centres, 
      departements: data.departements 
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToasterProvider>
      <App />
    </ToasterProvider>
  </StrictMode>,
)
