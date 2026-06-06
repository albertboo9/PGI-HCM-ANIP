import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import AQIPCard from '../../components/ui/AQIPCard';
import { useAgentStore } from '../../store/agentStore';
import { useIncidentStore } from '../../store/incidentStore';
import { getAgentSkillGaps } from '../../services/skillEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, MapPin, Users, AlertTriangle, Building2, Calculator } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const BENIN_CENTRES = [
  { id: 'ctr-001', nom: 'Cotonou', lat: 6.3703, lng: 2.3912, score: 75, departement: 'Littoral' },
  { id: 'ctr-002', nom: 'Parakou', lat: 9.3371, lng: 2.6303, score: 58, departement: 'Borgou' },
  { id: 'ctr-003', nom: 'Natitingou', lat: 10.3042, lng: 1.3799, score: 52, departement: 'Atacora' },
  { id: 'ctr-004', nom: 'Porto-Novo', lat: 6.4969, lng: 2.6289, score: 71, departement: 'Ouémé' },
  { id: 'ctr-005', nom: 'Abomey', lat: 7.1855, lng: 1.9976, score: 65, departement: 'Zou' },
  { id: 'ctr-006', nom: 'Lokossa', lat: 6.6387, lng: 1.7169, score: 69, departement: 'Mono' },
  { id: 'ctr-007', nom: 'Djougou', lat: 9.7086, lng: 1.6658, score: 61, departement: 'Donga' },
  { id: 'ctr-008', nom: 'Savalou', lat: 7.9280, lng: 1.9751, score: 63, departement: 'Collines' },
];

const COMPETENCES = ['Biométrie', 'État Civil', 'Accueil', 'Productivité', 'Qualité'];

const getScoreColor = (score: number) => {
  if (score >= 75) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

type TimeView = 'past' | 'present' | 'future';

const TIME_LABELS: Record<TimeView, string> = { past: 'Il y a 6 mois', present: 'Aujourd\'hui', future: 'Projection 6 mois' };


export default function CompetencyMapPage() {
  
  const agents = useAgentStore(s => s.agents);
  const incidents = useIncidentStore(s => s.incidents);
  const [selectedCentre, setSelectedCentre] = useState<string | null>(null);
  const [timeView, setTimeView] = useState<TimeView>('present');
  const [simulatorOn, setSimulatorOn] = useState(false);
  const [simAgents, setSimAgents] = useState(50);

  const centreData = useMemo(() => {
    return BENIN_CENTRES.map(c => {
      const centreAgents = agents.filter(a => a.centreId === c.id);
      const gaps = centreAgents.flatMap(a => getAgentSkillGaps(a, incidents));
      const radarScores = COMPETENCES.map(comp => {
        const base = 40 + Math.random() * 50;
        return { competence: comp, score: Math.round(base + (timeView === 'past' ? -15 : timeView === 'future' ? 12 : 0) + Math.random() * 10) };
      });
      const scoreGlobal = Math.round(radarScores.reduce((s, r) => s + r.score, 0) / radarScores.length);
      return { ...c, radarScores, scoreGlobal, agentCount: centreAgents.length, gapCount: gaps.length };
    });
  }, [agents, incidents, timeView]);

  const selected = centreData.find(c => c.id === selectedCentre);

  const simImpact = useMemo(() => {
    if (!simulatorOn) return null;
    const reduction = Math.round(simAgents * 0.35);
    const qualityGain = Math.round(simAgents * 0.18);
    const satisfactionGain = Math.round(simAgents * 0.22);
    return { reduction, qualityGain, satisfactionGain };
  }, [simAgents, simulatorOn]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <AQIPCard className="bg-gradient-to-r from-[#2B5E8D] to-[#1E3A8A] text-white border-none shadow-[var(--aqip-shadow-glow)] overflow-hidden p-0">
          <div className="relative z-10 p-6 md:p-8 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><MapPin className="h-6 w-6" /> Carte Nationale des Compétences</h1>
              <p className="text-white/80 mt-1 text-sm">Visualisez les forces et faiblesses de chaque centre. Cliquez sur un centre pour analyser son profil.</p>
            </div>
            {/* Time slider */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20">
              {(['past', 'present', 'future'] as TimeView[]).map(v => (
                <button key={v} onClick={() => setTimeView(v)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${timeView === v ? 'bg-white text-[#2B5E8D] shadow-md' : 'text-white/70 hover:text-white'}`}>
                  {TIME_LABELS[v]}
                </button>
              ))}
            </div>
          </div>
        </AQIPCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte (2/3) */}
        <div className="lg:col-span-2">
          <AQIPCard className="p-0 overflow-hidden h-[600px] shadow-[var(--aqip-shadow-md)]">
            <MapContainer center={[8.5, 2.2]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              {centreData.map(c => {
                const color = getScoreColor(c.scoreGlobal);
                return (
                  <CircleMarker key={c.id} center={[c.lat, c.lng]} radius={10 + c.agentCount / 2} pathOptions={{ color, fillColor: color, fillOpacity: 0.6, weight: 2 }}
                    eventHandlers={{ click: () => setSelectedCentre(c.id) }}>
                    <Popup>
                      <div className="text-sm font-bold">{c.nom}</div>
                      <div className="text-xs text-gray-500">{c.departement}</div>
                      <div className="text-xs mt-1">Score: <span style={{ color }}>{c.scoreGlobal}%</span></div>
                      <div className="text-xs">{c.agentCount} agents — {c.gapCount} gaps</div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </AQIPCard>
        </div>

        {/* Panneau latéral — Détail Centre */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <AQIPCard className="bg-gradient-to-r from-[var(--aqip-primary)]/10 to-[var(--aqip-accent)]/5 border-[var(--aqip-primary)]/30">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-[var(--aqip-text-primary)]">{selected.nom}</h2>
                    <button onClick={() => setSelectedCentre(null)} className="text-xs text-[var(--aqip-text-muted)] hover:text-[var(--aqip-text-primary)]">✕ Fermer</button>
                  </div>
                  <div className="flex gap-4 text-xs text-[var(--aqip-text-muted)] mb-4">
                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {selected.departement}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {selected.agentCount} agents</span>
                    <span className="flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> {selected.gapCount} gaps</span>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-black" style={{ color: getScoreColor(selected.scoreGlobal) }}>{selected.scoreGlobal}%</div>
                    <div className="text-[10px] text-[var(--aqip-text-muted)]">Score global {TIME_LABELS[timeView].toLowerCase()}</div>
                  </div>
                </AQIPCard>

                {/* Radar */}
                <AQIPCard>
                  <h3 className="text-sm font-bold text-[var(--aqip-text-primary)] mb-2 flex items-center gap-2"><Target className="h-4 w-4 text-[var(--aqip-primary)]" /> Radar de compétences</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={selected.radarScores}>
                        <PolarGrid stroke="var(--aqip-border)" />
                        <PolarAngleAxis dataKey="competence" tick={{ fontSize: 9, fill: 'var(--aqip-text-muted)' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name={selected.nom} dataKey="score" stroke={getScoreColor(selected.scoreGlobal)} fill={getScoreColor(selected.scoreGlobal)} fillOpacity={0.2} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </AQIPCard>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <AQIPCard className="text-center py-8">
                  <MapPin className="h-12 w-12 text-[var(--aqip-text-muted)] opacity-30 mx-auto mb-4" />
                  <p className="text-sm text-[var(--aqip-text-muted)]">Cliquez sur un centre<br />sur la carte pour voir<br />son profil détaillé.</p>
                </AQIPCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simulateur stratégique */}
          <AQIPCard className="bg-[var(--aqip-bg-elevated)] border-[var(--aqip-border)]">
            <h3 className="text-sm font-bold text-[var(--aqip-text-primary)] mb-3 flex items-center gap-2"><Calculator className="h-4 w-4 text-[var(--aqip-accent)]" /> Simulateur Stratégique</h3>
            <p className="text-[10px] text-[var(--aqip-text-muted)] mb-3">Estimez l'impact d'une campagne de formation nationale</p>
            <div className="flex items-center gap-3 mb-3">
              <input type="range" min="10" max="200" value={simAgents} onChange={e => setSimAgents(Number(e.target.value))} className="flex-1 accent-[var(--aqip-accent)]" />
              <span className="text-xs font-bold text-[var(--aqip-text-primary)]">{simAgents} agents</span>
            </div>
            <button onClick={() => setSimulatorOn(!simulatorOn)}
              className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${simulatorOn ? 'bg-[var(--aqip-accent)] text-white' : 'bg-[var(--aqip-primary)] text-white'}`}>
              {simulatorOn ? 'Simulation active' : 'Lancer la simulation'}
            </button>
            {simImpact && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-2 pt-3 border-t border-[var(--aqip-border)]">
                <div className="flex justify-between text-[10px]"><span className="text-[var(--aqip-text-muted)]">Rejets biométriques</span><span className="font-bold text-[var(--aqip-accent)]">-{simImpact.reduction}%</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-[var(--aqip-text-muted)]">Qualité</span><span className="font-bold text-[var(--aqip-accent)]">+{simImpact.qualityGain}%</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-[var(--aqip-text-muted)]">Satisfaction</span><span className="font-bold text-[var(--aqip-accent)]">+{simImpact.satisfactionGain}%</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-[var(--aqip-text-muted)]">Budget estimé</span><span className="font-bold text-[var(--aqip-primary)]">{Math.round(simAgents * 50000).toLocaleString()} FCFA</span></div>
              </motion.div>
            )}
          </AQIPCard>

          {/* Top/Bottom centres */}
          <AQIPCard>
            <h3 className="text-sm font-bold text-[var(--aqip-text-primary)] mb-3">Classement National</h3>
            <div className="space-y-2">
              {[...centreData].sort((a, b) => b.scoreGlobal - a.scoreGlobal).map((c, i) => (
                <div key={c.id} onClick={() => setSelectedCentre(c.id)}
                  className="flex items-center justify-between p-2 bg-[var(--aqip-bg-elevated)] rounded-lg border border-[var(--aqip-border)] hover:border-[var(--aqip-primary)]/40 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--aqip-text-muted)]">#{i + 1}</span>
                    <span className="text-xs font-bold text-[var(--aqip-text-primary)]">{c.nom}</span>
                  </div>
                  <span className="text-xs font-black" style={{ color: getScoreColor(c.scoreGlobal) }}>{c.scoreGlobal}%</span>
                </div>
              ))}
            </div>
          </AQIPCard>
        </div>
      </div>
    </div>
  );
}