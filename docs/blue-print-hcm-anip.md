# BLUEPRINT TECHNIQUE COMPLET — AQIP v2.0

## ANIP Quality Intelligence Platform

---

Ce document est le **plan d'implémentation exhaustif** de la plateforme. Il servira de référence unique pour le développement, la démonstration et la réponse à appel d'offres ANIP.

---

## NOUVELLE CATÉGORIE D'ERREURS : FAUTES DE FRANÇAIS (UC39)

Vous avez raison, c'est une dimension cruciale et très parlante pour le jury. Les erreurs de saisie (frappe, orthographe, grammaire) sont les plus fréquentes dans les centres d'enrôlement et ont un impact direct sur la **qualité des données d'état civil**.

### Nouvelle catégorie : Catégorie 6 — Saisie & Langue Française

| Code | Erreur | Gravité | Impact | Exemple réel |
|---|---|---|---|---|
| FR-01 | Faute d'orthographe sur le nom | Haute | Doublon / Rejet dossier | "ADJOVI" saisi "ADJOVY" |
| FR-02 | Faute d'orthographe sur le prénom | Haute | CNI invalide | "Koffi" saisi "Kofy" |
| FR-03 | Faute sur le nom de la commune | Moyenne | Donnée erronée | "Cotonou" saisi "Kotonou" |
| FR-04 | Faute sur le nom du père/mère | Moyenne | Incohérence famille | "Dossou" saisi "Dosu" |
| FR-05 | Inversion lettre (typo clavier) | Faible | Retard correction | "Atangana" saisi "Atnagana" |
| FR-06 | Faute de genre (le/la) | Faible | Erreur formulaire | "le agent" au lieu de "l'agent" |
| FR-07 | Faute d'accord (accord nom/adjectif) | Faible | Qualité rédaction | "les données saisi" au lieu de "saisies" |
| FR-08 | Accent manquant | Faible | Non-conformité | "Etat" au lieu de "État" |
| FR-09 | Cédille manquante | Faible | Orthographe | "francais" au lieu de "français" |
| FR-10 | Date en toutes lettres erronée | Haute | Rejet document | "premier janvier deux mille vingt" mal orthographié |
| FR-11 | Confusion homonymes | Haute | Donnée erronée | "père" saisi "paire" |
| FR-12 | Abréviation abusive | Moyenne | Document non conforme | "Rép. du Bénin" au lieu de "République du Bénin" |

### Nouveau cas d'usage UC39 — Contrôle Qualité Linguistique

| Rubrique | Description |
|---|---|
| **Problème métier** | Les erreurs de frappe et d'orthographe génèrent des doublons, des rejets de dossiers, des délais de correction et nuisent à la qualité des données d'état civil. |
| **Acteurs** | Agent (commet), Chef de Centre (supervise), Direction Qualité (analyse), DG (pilote) |
| **Workflow** | Saisie agent → Détection faute → Suggestion correction → Validation/Rejet → Statistiques → Plan d'amélioration |
| **Écrans** | Dashboard fautes, Détail par agent, Top fautes récurrentes, Évolution temporelle, Plan de correction, Module de dictée/entraînement |
| **Données** | 12 types de fautes, par agent, par centre, tendance, score qualité linguistique |

### Métrique : Indice de Qualité Linguistique (IQL)

```
IQL = 100 - (Nb fautes / Nb dossiers traités × 100)

Exemple :
Agent A : 45 fautes sur 300 dossiers → IQL = 85/100
Agent B : 120 fautes sur 280 dossiers → IQL = 57/100
```

---

## 1. ARCHITECTURE SYSTÈME COMPLÈTE

### Stack Technique Final

| Couche | Technologie | Version | Usage |
|---|---|---|---|
| **Framework** | React | 19.2 | UI Components |
| **Build** | Vite | 7.3 | Bundler |
| **Langage** | TypeScript | 5.x | Types sécurité |
| **Routing** | react-router-dom | 7.x | Navigation |
| **État global** | Zustand | 5.x | Store AQIP |
| **API Mock** | json-server | 1.x | REST API simulée |
| **CSS** | Tailwind CSS | 3.4 | Design system |
| **Animations** | Framer Motion | 12.x | Transitions |
| **Graphiques** | Recharts | 3.7 | Charts |
| **Cartes** | Leaflet + react-leaflet | 4.x | Carte Bénin |
| **IA Mock** | Custom engine | — | Moteur d'analyse simulation |
| **Formulaires** | react-hook-form | 7.x | Formulaires |
| **Son** | Web Audio API | — | Feedbacks audio |
| **Internationalisation** | i18next | 25.x | FR/EN |

### Architecture des données (json-server)

Fichier unique `db.json` servant de backend mocké complet :

```json
{
  "agents": [
    {
      "id": "agt-001",
      "nom": "Ahouangon",
      "prenom": "Jean",
      "matricule": "AGT-2024-0042",
      "email": "j.ahouangon@anip.bj",
      "telephone": "+229 61 23 45 67",
      "poste": "Agent d'enrôlement",
      "grade": "Catégorie B",
      "centreId": "ctr-001",
      "departementId": "dpt-001",
      "managerId": "mgr-001",
      "dateEmbauche": "2022-03-15",
      "statut": "actif",
      "competences": [
        { "competenceId": "comp-001", "niveauActuel": 4, "niveauAttendu": 5 },
        { "competenceId": "comp-002", "niveauActuel": 2, "niveauAttendu": 4 },
        { "competenceId": "comp-003", "niveauActuel": 5, "niveauAttendu": 5 }
      ],
      "scores": {
        "performance": 92,
        "qualite": 78,
        "linguistique": 85,
        "satisfaction": 4.3,
        "potentiel": 88,
        "composite": 86
      },
      "historiqueMutations": [
        { "date": "2023-06-01", "de": "Parakou", "vers": "Cotonou Centre", "motif": "Promotion" }
      ]
    }
  ],
  "centres": [
    {
      "id": "ctr-001",
      "nom": "Cotonou Centre",
      "departementId": "dpt-001",
      "chefCentreId": "mgr-001",
      "adresse": "01 BP 1234, Cotonou",
      "telephone": "+229 21 33 45 67",
      "latitude": 6.3667,
      "longitude": 2.4333,
      "dateOuverture": "2020-01-10",
      "statut": "actif",
      "equipements": ["BIO-347", "CAM-001", "LEC-089", "PC-012", "OND-003"],
      "capaciteMax": 5000,
      "agentsCount": 8
    }
  ],
  "departements": [
    {
      "id": "dpt-001",
      "nom": "Littoral",
      "chefLieu": "Cotonou",
      "directeurDepartementalId": "dir-001",
      "centresIds": ["ctr-001", "ctr-002"],
      "superficie": 79,
      "population": 1679356
    }
  ],
  "utilisateurs": [
    {
      "id": "usr-001",
      "nom": "Atangana",
      "prenom": "Jean-Pierre",
      "role": "dg",
      "email": "jp.atangana@anip.bj",
      "telephone": "+229 61 00 00 01",
      "centreId": null,
      "departementId": null,
      "photo": "/assets/photos/dg.jpg",
      "signature": "/assets/signatures/dg.png"
    }
  ],
  "incidents": [
    {
      "id": "inc-001",
      "agentId": "agt-001",
      "centreId": "ctr-001",
      "categorie": "biometrie",
      "codeErreur": "BIO-01",
      "description": "Photo floue — visage mal éclairé",
      "gravite": "moyenne",
      "statut": "analyse",
      "dateDetection": "2026-03-12T09:15:22Z",
      "dateResolution": null,
      "causeProbable": "Maîtrise insuffisante des réglages d'éclairage",
      "competenceImpactee": "comp-002",
      "gapCompetence": 2,
      "risque": "moyen",
      "impact": "Retards de production estimés à 12h/semaine",
      "formationPrescrite": "FMT-045",
      "scoreConfianceIA": 92,
      "historique": [
        { "date": "2026-03-12T09:15:22Z", "action": "DÉTECTION", "user": "Système IA" },
        { "date": "2026-03-12T09:20:00Z", "action": "NOTIFICATION", "user": "Système", "detail": "Chef de centre notifié" },
        { "date": "2026-03-12T10:00:00Z", "action": "ANALYSE", "user": "IA", "detail": "Cause probable identifiée avec 92% de confiance" }
      ]
    }
  ],
  "formations": [
    {
      "id": "fmt-045",
      "titre": "Capture biométrique avancée",
      "categorie": "technique",
      "duree": "3 jours",
      "heures": 21,
      "cout": 350000,
      "certifiante": true,
      "objectifs": ["Maîtriser éclairage studio", "Cadrage parfait", "Réglages caméra"],
      "programme": "Jour 1: Théorie de la capture...",
      "competencesCiblees": ["comp-002"],
      "niveauCible": 4
    }
  ],
  "formationsSuivies": [
    {
      "id": "fs-001",
      "agentId": "agt-001",
      "formationId": "fmt-045",
      "statut": "en_cours",
      "dateDebut": "2026-03-20",
      "progression": 45,
      "quizScore": 7,
      "dateCertification": null
    }
  ],
  "evaluations": [
    {
      "id": "eval-001",
      "agentId": "agt-001",
      "evaluateurId": "mgr-001",
      "campagne": "2026-T1",
      "date": "2026-03-01",
      "statut": "verrouillee",
      "scores": {
        "comportemental": [
          { "critereId": "b1", "label": "Leadership", "poids": 10, "note": 4 },
          { "critereId": "b2", "label": "Communication", "poids": 10, "note": 5 }
        ],
        "technique": [],
        "management": [],
        "objectifs": [],
        "autoEvaluation": []
      },
      "scoreFinal": 88,
      "verrouilleeLe": "2026-03-05T14:00:00Z"
    }
  ],
  "feedbacks": [
    {
      "id": "fb-001",
      "agentId": "agt-001",
      "emetteurId": "usr-045",
      "relation": "manager",
      "type": "positif",
      "message": "Très bonne progression sur la biométrie",
      "note": 4,
      "date": "2026-03-10",
      "anonyme": false,
      "vu": false
    }
  ],
  "satisfactions": [
    {
      "id": "sat-001",
      "centreId": "ctr-001",
      "agentId": "agt-001",
      "note": 4,
      "commentaire": "Accueil chaleureux, service rapide",
      "date": "2026-04-10",
      "canal": "sms",
      "typeService": "enrolement"
    }
  ],
  "auditLogs": [
    {
      "id": "aud-001",
      "agentId": "agt-001",
      "action": "MODIFICATION_DOSSIER",
      "cible": "DOS-2026-45821",
      "ancienneValeur": "dateNaissance: 12/03/1999",
      "nouvelleValeur": "dateNaissance: 13/03/1999",
      "motif": "Erreur de saisie — faute de frappe",
      "date": "2026-04-12T09:45:10Z",
      "ip": "10.12.8.45"
    }
  ],
  "competences": [
    {
      "id": "comp-001",
      "nom": "Capture photo biométrique",
      "categorie": "technique",
      "piller": "enrolement",
      "description": "Capacité à capturer et vérifier la qualité d'une photo d'identité biométrique",
      "niveaux": [
        { "niveau": 1, "label": "Débutant", "description": "A besoin de supervision" },
        { "niveau": 2, "label": "Intermédiaire", "description": "Capture simple, erreurs fréquentes" },
        { "niveau": 3, "label": "Avancé", "description": "Capture autonome, erreurs rares" },
        { "niveau": 4, "label": "Expert", "description": "Capture parfaite, peut former" },
        { "niveau": 5, "label": "Référent", "description": "Maîtrise totale, architecte processus" }
      ]
    }
  ],
  "pdI": [
    {
      "id": "pdi-001",
      "agentId": "agt-001",
      "annee": 2026,
      "statut": "actif",
      "objectifs": [
        { "competenceId": "comp-002", "niveauCible": 4, "echeance": "2026-06-30", "statut": "en_cours" },
        { "competenceId": "comp-003", "niveauCible": 5, "echeance": "2026-09-30", "statut": "planifie" }
      ],
      "formationsPrescrites": ["fmt-045"],
      "progressionGlobale": 35
    }
  ],
  "budget": {
    "annee": 2026,
    "totalAlloue": 50000000,
    "dejaEngage": 32000000,
    "restant": 18000000,
    "repartition": [
      { "categorie": "Biométrie", "montant": 15000000, "consomme": 12000000 },
      { "categorie": "État civil", "montant": 12000000, "consomme": 8000000 },
      { "categorie": "Accueil", "montant": 8000000, "consomme": 4000000 },
      { "categorie": "Management", "montant": 10000000, "consomme": 6000000 },
      { "categorie": "Transversal", "montant": 5000000, "consomme": 2000000 }
    ],
    "roiParFormation": [
      { "formationId": "fmt-045", "cout": 350000, "erreursEvitees": 120, "economieEstimee": 1200000, "roi": 342 }
    ]
  }
}
```

---

## 2. ARBORESCENCE FRONT-END COMPLÈTE

```
aqip/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── db.json                          ← json-server (API mock complète)
├── src/
│   ├── main.tsx                     ← Entry point
│   ├── App.tsx                      ← Routes (lazy)
│   ├── types/
│   │   ├── index.ts                 ← Types globaux
│   │   ├── agent.types.ts
│   │   ├── incident.types.ts
│   │   ├── centre.types.ts
│   │   ├── competence.types.ts
│   │   ├── formation.types.ts
│   │   ├── satisfaction.types.ts
│   │   ├── budget.types.ts
│   │   ├── rh.types.ts              ← UC34-UC38
│   │   └── iqsp.types.ts
│   ├── store/
│   │   ├── index.ts                 ← Zustand store global AQIP
│   │   ├── incidentStore.ts
│   │   ├── centreStore.ts
│   │   ├── agentStore.ts
│   │   ├── competenceStore.ts
│   │   ├── formationStore.ts
│   │   ├── satisfactionStore.ts
│   │   ├── budgetStore.ts
│   │   ├── rhStore.ts               ← UC34-UC38
│   │   ├── iaStore.ts               ← Moteur IA mocké
│   │   └── toastStore.ts
│   ├── services/
│   │   ├── api.ts                   ← Client HTTP (json-server)
│   │   ├── iaEngine.ts              ← Moteur IA mocké (analyse, recommandations)
│   │   ├── iqspCalculator.ts        ← Calcul Indice Qualité
│   │   ├── scoringEngine.ts         ← Calcul scores composites
│   │   ├── linguisticEngine.ts      ← Détection fautes français (mock)
│   │   └── rhAdvisor.ts            ← Suggestions RH (UC37)
│   ├── hooks/
│   │   ├── useAQIPData.ts           ← Hook générique data
│   │   ├── useInfiniteScroll.ts
│   │   ├── useDebounce.ts
│   │   ├── useSound.ts             ← Web Audio API
│   │   ├── useSimulation.ts         ← Simulation temps réel
│   │   └── useCommandCenter.ts     ← UC29
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx         ← Layout principal AQIP
│   │   │   ├── Sidebar.tsx          ← Navigation 8 piliers
│   │   │   ├── Header.tsx           ← Header + notifications
│   │   │   └── RoleSwitcher.tsx     ← Switcher personas
│   │   ├── ui/
│   │   │   ├── AQIPModal.tsx
│   │   │   ├── AQIPDrawer.tsx
│   │   │   ├── AQIPToast.tsx
│   │   │   ├── AQIPCard.tsx
│   │   │   ├── AQIPBadge.tsx
│   │   │   ├── AQIPStatCard.tsx     ← KPI card premium
│   │   │   ├── AQIPButton.tsx
│   │   │   ├── AQIPInput.tsx
│   │   │   ├── AQIPTable.tsx
│   │   │   ├── AQIPProgress.tsx
│   │   │   ├── AQIPScoreRing.tsx    ← Jauge circulaire (score)
│   │   │   ├── AQIPTimeline.tsx     ← Timeline premium
│   │   │   ├── AQIPAlert.tsx
│   │   │   ├── AQIPSearchBar.tsx
│   │   │   ├── AQIPFilters.tsx
│   │   │   ├── AQIPNotificationPanel.tsx
│   │   │   ├── AQIPAvatar.tsx
│   │   │   └── LoadingScreen.tsx
│   │   ├── charts/
│   │   │   ├── AreaChartAQIP.tsx
│   │   │   ├── BarChartAQIP.tsx
│   │   │   ├── PieChartAQIP.tsx
│   │   │   ├── RadarChartAQIP.tsx   ← Compétences
│   │   │   ├── HeatmapAQIP.tsx      ← Matrice
│   │   │   ├── GaugeChart.tsx       ← IQSP jauge
│   │   │   ├── NineBoxMatrix.tsx    ← UC36 9-box
│   │   │   └── TrendSparkline.tsx
│   │   ├── maps/
│   │   │   ├── BeninMap.tsx          ← Carte Leaflet complète
│   │   │   ├── CentreMarker.tsx      ← Marqueur centre
│   │   │   └── HeatmapLayer.tsx      ← Calque chaleur
│   │   ├── agent/
│   │   │   ├── AgentProfile.tsx
│   │   │   ├── AgentScoreCard.tsx
│   │   │   ├── AgentCompetencyRadar.tsx
│   │   │   ├── AgentIncidentList.tsx
│   │   │   ├── AgentTrainingTimeline.tsx
│   │   │   ├── AgentBadgeCollection.tsx
│   │   │   ├── AgentPDI.tsx
│   │   │   └── AgentLinguisticScore.tsx  ← UC39
│   │   ├── centre/
│   │   │   ├── CentreCard.tsx
│   │   │   ├── CentreDetail.tsx
│   │   │   ├── CentreScoreRing.tsx
│   │   │   ├── CentreComparison.tsx
│   │   │   ├── CentreEquipment.tsx
│   │   │   ├── CentreRanking.tsx         ← UC35
│   │   │   └── CentreMap.tsx
│   │   ├── incident/
│   │   │   ├── IncidentDashboard.tsx
│   │   │   ├── IncidentCard.tsx
│   │   │   ├── IncidentDetail.tsx
│   │   │   ├── IncidentForm.tsx
│   │   │   ├── IncidentWorkflow.tsx
│   │   │   ├── IncidentAnalysis.tsx      ← IA analyse
│   │   │   ├── IncidentCategoryBreakdown.tsx
│   │   │   └── LinguisticErrorPanel.tsx  ← UC39
│   │   ├── ia/
│   │   │   ├── IAAdvisor.tsx             ← Assistant IA
│   │   │   ├── IAAnalysisReport.tsx
│   │   │   ├── IAPrescriptionCard.tsx
│   │   │   ├── DigitalTwin.tsx           ← Jumeau Numérique
│   │   │   ├── DigitalTwinChat.tsx       ← Chat avec l'IA
│   │   │   └── IATrustScore.tsx
│   │   ├── iqsp/
│   │   │   ├── IQSPGauge.tsx
│   │   │   ├── IQSPMap.tsx
│   │   │   ├── IQSPComparison.tsx
│   │   │   ├── IQSPEvolution.tsx
│   │   │   └── IQSPBreakdown.tsx
│   │   ├── satisfaction/
│   │   │   ├── SatisfactionDashboard.tsx
│   │   │   ├── SatisfactionChart.tsx
│   │   │   ├── NPSGauge.tsx
│   │   │   ├── ReclamationList.tsx
│   │   │   └── CitizenFeedback.tsx
│   │   ├── rh/
│   │   │   ├── OrgChart.tsx             ← UC34 Organigramme
│   │   │   ├── OrgNode.tsx
│   │   │   ├── OrgDetail.tsx
│   │   │   ├── RankingTable.tsx         ← UC35 Benchmark
│   │   │   ├── RankingRadar.tsx
│   │   │   ├── TalentMatrix.tsx         ← UC36 9-box
│   │   │   ├── TalentCard.tsx
│   │   │   ├── TalentDetail.tsx
│   │   │   ├── RHAdvisorPanel.tsx       ← UC37 Suggestions
│   │   │   ├── SuccessionMatrix.tsx     ← UC38
│   │   │   ├── SuccessionTimeline.tsx
│   │   │   └── DecisionWorkflow.tsx
│   │   ├── budget/
│   │   │   ├── BudgetOverview.tsx
│   │   │   ├── BudgetBreakdown.tsx
│   │   │   ├── ROICalculator.tsx
│   │   │   └── BudgetAlert.tsx
│   │   ├── command-center/
│   │   │   ├── CommandCenter.tsx        ← UC29 Grand écran
│   │   │   ├── CrisisRoom.tsx           ← UC32 Crisis Room
│   │   │   ├── ZoneIQSP.tsx
│   │   │   ├── ZoneMap.tsx
│   │   │   ├── ZoneKPIs.tsx
│   │   │   ├── ZoneTopBottom.tsx
│   │   │   ├── ZoneAlerts.tsx
│   │   │   ├── ZoneActivity.tsx
│   │   │   └── NationalTimer.tsx
│   │   └── audit/
│   │       ├── AuditTrail.tsx
│   │       ├── AuditDetail.tsx
│   │       ├── ConformityDashboard.tsx
│   │       └── AuditExport.tsx
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   ├── AgentDashboard.tsx
│   │   │   ├── CentreChefDashboard.tsx
│   │   │   ├── DeptDirectorDashboard.tsx
│   │   │   ├── DRHDashboard.tsx
│   │   │   ├── QualiteDashboard.tsx
│   │   │   ├── DGExecDashboard.tsx
│   │   │   └── AuditorDashboard.tsx
│   │   ├── Piller1_Referentiel/
│   │   │   ├── MetiersPage.tsx
│   │   │   ├── PostesPage.tsx
│   │   │   ├── CompetencesPage.tsx
│   │   │   ├── ProfilsPage.tsx
│   │   │   └── MatricePage.tsx
│   │   ├── Piller2_Qualite/
│   │   │   ├── IncidentsPage.tsx
│   │   │   ├── ErreursPage.tsx
│   │   │   ├── CentresPage.tsx
│   │   │   ├── EquipementsPage.tsx
│   │   │   ├── RisquesPage.tsx
│   │   │   └── ObservatoireDonneesPage.tsx
│   │   ├── Piller3_Intelligence/
│   │   │   ├── ScoresPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── IAPage.tsx
│   │   │   ├── DigitalTwinPage.tsx
│   │   │   └── PerformanceFinancierePage.tsx
│   │   ├── Piller4_Excellence/
│   │   │   ├── CoachingPage.tsx
│   │   │   ├── PDIPage.tsx
│   │   │   ├── LMSPage.tsx
│   │   │   ├── CertificationsPage.tsx
│   │   │   ├── FeedbackPage.tsx
│   │   │   ├── TalentsPage.tsx
│   │   │   └── GamificationPage.tsx
│   │   ├── Piller5_Citoyen/
│   │   │   ├── SatisfactionPage.tsx
│   │   │   ├── NPSEvolutionPage.tsx
│   │   │   ├── ReclamationsPage.tsx
│   │   │   ├── DelaisPage.tsx
│   │   │   └── CycleVieCitoyenPage.tsx
│   │   ├── Piller6_Pilotage/
│   │   │   ├── IQSPPage.tsx
│   │   │   ├── CarteNationalePage.tsx
│   │   │   ├── CommandCenterPage.tsx
│   │   │   └── CrisisRoomPage.tsx
│   │   ├── Piller7_Gouvernance/
│   │   │   ├── AuditPage.tsx
│   │   │   ├── ConformitePage.tsx
│   │   │   ├── BudgetPage.tsx
│   │   │   ├── ROIFormationPage.tsx
│   │   │   └── RapportsPage.tsx
│   │   ├── Piller8_RH/
│   │   │   ├── OrganigrammePage.tsx      ← UC34
│   │   │   ├── BenchmarkCentresPage.tsx  ← UC35
│   │   │   ├── TalentMatrixPage.tsx      ← UC36
│   │   │   ├── DecisionsRHPage.tsx       ← UC37
│   │   │   └── SuccessionPage.tsx        ← UC38
│   │   ├── Login.tsx
│   │   ├── ErrorPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── data/
│   │   ├── errorsLibrary.ts              ← Bibliothèque 30+ erreurs
│   │   ├── scenarios.ts                  ← Scénarios démo
│   │   └── béninGeoData.ts              ← Centres GPS + départements
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── fr.ts
│   │   └── en.ts
│   └── styles/
│       ├── globals.css
│       └── aqip-theme.css               ← Design tokens AQIP
└── docs/
    ├── BLUEPRINT.md                      ← Ce document
    ├── SCENARIOS_DEMO.md                  ← Scripts démo
    ├── DIAGRAMMES.md                      ← Diagrammes UML
    └── ARCHITECTURE.md                    ← Architecture technique
```

---

## 3. MOTEUR IA MOCKÉ COMPLET

### `iaEngine.ts` — Cœur de l'intelligence

```typescript
// Mécanisme de simulation IA
// Détecte → Analyse → Corrèle → Prédit → Recommande

export class IAEngine {
  
  // 1. Analyse d'un incident
  analyzeIncident(incident: Incident): IAAnalysis {
    // Trouve la cause probable basée sur la bibliothèque d'erreurs + historique
    const cause = this.findRootCause(incident);
    // Calcule le gap de compétence
    const gap = this.calculateCompetencyGap(incident.agentId, cause.competenceId);
    // Estime l'impact
    const impact = this.estimateImpact(incident, cause);
    // Score de confiance
    const confidence = this.calculateConfidence(incident, cause);
    
    return {
      causeProbable: cause,
      competenceImpactee: cause.competenceId,
      gap,
      risque: this.assessRisk(incident, cause),
      impact,
      formationPrescrite: this.recommendTraining(cause.competenceId, gap),
      scoreConfiance: confidence,
      incidentsSimilaires: this.findSimilarIncidents(incident)
    };
  }
  
  // 2. Jumeau Numérique — Réponse à une question
  answerQuestion(question: string, context: UserContext): IAAnswer {
    // NLP simulé : mots-clés → réponse pré-écrite
    // Exemple : "Pourquoi le Borgou baisse-t-il ?" → analyse département
    const intent = this.detectIntent(question);
    const entity = this.extractEntity(question);
    
    switch(intent) {
      case 'trend_down':
        return this.generateTrendAnalysis(entity as Departement);
      case 'top_centre':
        return this.generateTopCentreAnalysis();
      case 'comparison':
        return this.generateComparisonAnalysis(entity as [string, string]);
      case 'risk':
        return this.generateRiskAlert(entity as Centre);
      default:
        return this.generateGenericAnalysis();
    }
  }
  
  // 3. Détection précoce des risques
  detectEarlyWarning(agentId: string): EarlyWarning | null {
    const agent = this.getAgentData(agentId);
    // Analyse des tendances sur 30 jours
    if (agent.trendErrorRate > 15 && agent.trendProductivity < -10) {
      return {
        type: 'RISK_ELEVE',
        probability: 83,
        impact: 'Important',
        message: `Agent ${agent.nom} : hausse erreurs +${agent.trendErrorRate}%, baisse productivité ${agent.trendProductivity}%`,
        recommandation: 'Supervision renforcée + formation prioritaire'
      };
    }
    return null;
  }
  
  // 4. Suggestions RH (UC37)
  generateRHProposals(): RHProposal[] {
    // Analyse des gaps centres → suggestions mutations/promotions
    const proposals = [];
    
    // Centre en difficulté → proposition mutation
    const worstCentres = this.getWorstPerformingCentres(3);
    const bestManagers = this.getBestManagers(3);
    
    for (let i = 0; i < Math.min(worstCentres.length, bestManagers.length); i++) {
      proposals.push({
        type: 'MUTATION',
        centre: worstCentres[i],
        managerPropose: bestManagers[i],
        impactPrevu: `+${15 + Math.random() * 10} points IQSP`,
        confiance: 85 + Math.floor(Math.random() * 10)
      });
    }
    
    return proposals;
  }
}
```

---

## 4. SCÉNARIOS DE DÉMONSTRATION

### Scénario A — Parcours Agent : "De l'erreur à l'amélioration" (5 min)

```
ÉTAPE 1 : DÉTECTION
Écran : Dashboard Agent — Jean Ahouangon
Action : L'IA détecte 8 photos floues sur 30 dossiers (26.7%)
Visuel : Badge rouge "ALERTE" + notification

ÉTAPE 2 : ANALYSE
Écran : Détail Incident BIO-01
Action : Clique sur l'incident
Visuel : Analyse IA déroulée :
  • Cause : Maîtrise insuffisante éclairage (92% confiance)
  • Compétence impactée : Capture photo (niveau 2/5, attendu 4/5)
  • Risque : Moyen
  • Impact : 12h/semaine de retard

ÉTAPE 3 : RECOMMANDATION
Écran : Assistant IA RH
Action : "Recommandation pour Jean Ahouangon"
Visuel : IA propose formation "Capture biométrique avancée"
  • Score de confiance : 92%
  • Justification : "Cas similaire résolu à Porto-Novo (+45%)"

ÉTAPE 4 : PRESCRIPTION AUTOMATIQUE
Écran : PDI de Jean Ahouangon
Action : Formation assignée directement dans le plan
Visuel : "Formation Capture biométrique avancée — À démarrer avant 14/04"

ÉTAPE 5 : SUIVI FORMATION
Écran : LMS Intelligent — Formation en cours
Action : Progression 45%, Quiz 7/10
Visuel : Barre progression, modules restants

ÉTAPE 6 : RÉÉVALUATION
Écran : Dashboard Agent — 15 jours après
Action : Nouveau taux d'erreur = 5.2% (contre 26.7%)
Visuel : Graphique avant/après, +21.5 points d'amélioration

ÉTAPE 7 : CERTIFICATION
Écran : Portefeuille de certifications
Action : Badge "Expert Biométrie" décerné
Visuel : Badge animé, +50 XP, classement Top 10
```

### Scénario B — Parcours DG : "Pilotage national" (4 min)

```
ÉTAPE 1 : COMMAND CENTER
Écran : ANIP Command Center (grand écran 6 zones)
Action : Vue nationale temps réel
Visuel : 
  • IQSP National : 76/100 (jauge + trend)
  • Carte Bénin : 12 centres colorés (vert/orange/rouge)
  • KPIs : Performance 78 · Qualité 76 · Formation 82 · Satisfaction 74 · Production 85 · IA 92%
  • Top/Bottom 3 centres
  • Alertes actives
  • Fil d'activité national

ÉTAPE 2 : ALERTE STRATÉGIQUE
Action : Alerte rouge — Natitingou (score 45/100, -8% trend)
Visuel : Notification flash + vibration CTA

ÉTAPE 3 : DÉCISION RH
Écran : Suggestions RH (UC37)
Action : IA propose 4 décisions
Visuel : Mutation recommandée, Promotion, Affectation, Réaffectation

ÉTAPE 4 : JUMEAU NUMÉRIQUE
Écran : Jumeau Numérique ANIP
Action : Tape "Pourquoi le Borgou baisse-t-il ?"
Visuel : IA répond avec analyse détaillée
  • Causes : +31% erreurs biométriques, panne scanner, rotation personnel
  • Impact : -13 points IQSP
  • Recommandations : Remplacer scanner, former 12 agents, renforcer supervision
  • Score de confiance : 94%
```

### Scénario C — Parcours Citoyen : "Qualité de service" (3 min)

```
ÉTAPE 1 : SATISFACTION
Écran : Dashboard Satisfaction Citoyenne
Action : Vue nationale des notes
Visuel : 
  • Satisfaction moyenne : 4.2/5
  • NPS : +42 (Excellent)
  • Top centre : Cotonou Centre (4.7/5)
  • Bottom : Natitingou (2.1/5)

ÉTAPE 2 : RÉCLAMATION
Écran : Réclamations récentes
Action : Détail réclamation "Temps d'attente excessif"
Visuel : Analyse cause + plan d'action

ÉTAPE 3 : CYCLE DE VIE CITOYEN (UC30)
Écran : Cycle de Vie Citoyen
Action : Parcours complet d'un citoyen
Visuel : Naissance → NPI → Biométrie → Production → Livraison
  • Délai moyen : 12 jours
  • Taux rejet : 3.2%
  • Satisfaction : 4.1/5
```

### Scénario D — Parcours Erreurs de Français : "Qualité Linguistique" (2 min)

```
ÉTAPE 1 : DASHBOARD LINGUISTIQUE
Écran   : Contrôle Qualité Linguistique (UC39)
Action  : Vue nationale des fautes de français
Visuel  : 
  • IQL National : 78/100
  • Top erreurs : FR-01 (Orthographe nom) 34%, FR-08 (Accents) 22%
  • Par centre : Cotonou 85%, Natitingou 45%

ÉTAPE 2 : DÉTAIL AGENT
Écran : Détail Agent — Jean Ahouangon
Action : 15 fautes détectées ce mois
Visuel : 
  • Fautes listées avec corrections suggérées
  • "Etat" → "État", "Kotonou" → "Cotonou"
  • Score IQL : 72/100
  • Recommandation IA : Module de dictée assistée

ÉTAPE 3 : PLAN CORRECTIF
Écran : Plan d'amélioration linguistique
Action : Formation "Français administratif" prescrite
Visuel : 
  • 3 agents du même centre inscrits
  • Progression : 45%
  • Impact attendu : +15 points IQL
```

---

## 5. NAVIGATION COMPLÈTE (Sidebar)

```
┌──────────────────────────────────────────────────────────────┐
│  🏛️  AQIP · ANIP                          [🔔] [👤] [⚙️]     │
│  ─────────────────────────────────────────────────────────── │
│                                                              │
│  📋  RÉFÉRENTIEL ORGANISATIONNEL                             │
│       ├── Métiers & Postes                                   │
│       ├── Compétences                                        │
│       ├── Profils Agents                                     │
│       └── Matrice Compétences                                │
│                                                              │
│  🛡️  QUALITÉ OPÉRATIONNELLE                                  │
│       ├── Incidents Qualité                                  │
│       ├── Bibliothèque Erreurs                               │
│       ├── Qualité Centres                                    │
│       ├── Équipements                                        │
│       ├── Audit & Conformité                                 │
│       ├── Gestion des Risques                                │
│       └── Observatoire Données                               │
│                                                              │
│  🧠  INTELLIGENCE QUALITÉ                                    │
│       ├── Scores & Analytics                                 │
│       ├── IA d'Analyse                                       │
│       ├── Jumeau Numérique ANIP                              │
│       └── Performance Financière                             │
│                                                              │
│  ⚡  EXCELLENCE OPÉRATIONNELLE                                │
│       ├── Coaching & PDI                                     │
│       ├── LMS Intelligent                                    │
│       ├── Certifications                                     │
│       ├── Feedback 360°                                      │
│       ├── Talents & Succession                               │
│       └── Gamification                                       │
│                                                              │
│  👥  EXPÉRIENCE CITOYENNE                                    │
│       ├── Satisfaction                                       │
│       ├── Réclamations                                       │
│       ├── Cycle de Vie Citoyen                               │
│       └── Délais de Traitement                               │
│                                                              │
│  🌍  PILOTAGE NATIONAL                                       │
│       ├── IQSP National                                      │
│       ├── Carte Nationale                                    │
│       ├── Command Center 🖥️                                  │
│       └── Crisis Room 🚨                                     │
│                                                              │
│  🏗️  GOUVERNANCE                                             │
│       ├── Audit Trail                                        │
│       ├── Budget Formation                                   │
│       ├── ROI Formation                                      │
│       └── Rapports Exportables                               │
│                                                              │
│  👥  RH STRATÉGIQUES                                         │
│       ├── Organigramme National                              │
│       ├── Benchmark Centres                                  │
│       ├── Cartographie Talents                               │
│       ├── Décisions RH Assistées                             │
│       └── Plan de Succession                                 │
│                                                              │
│  ⚙️  ADMINISTRATION                                          │
│       └── Paramètres Système                                 │
│                                                              │
│  ─────────────────────────────────────────────────────────── │
│  👤  Mode Démo — Persona actif : DG                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. RÉSUMÉ QUANTITATIF — CHIFFRES CLÉS DU PROJET

| Métrique             | Valeur|
|--------------------------|---|
| **Piliers fonctionnels** | 8 |
| **Cas d'usage**          |39 |
| **Écrans** | ~85 |
| **Composants réutilisés TMS** | 22 |
| **Nouveaux composants** | ~65 |
| **Types d'erreurs** | 30+ (6 catégories) |
| **Centres mockés** | 12 |
| **Agents mockés** | 150 |
| **Départements** | 12 |
| **Formations mockées** | 30 |
| **Fichiers db.json** | 1 (15+ collections) |
| **Services IA mockés** | 5 (analyse, jumeau, détection, rh, linguistique) |
| **Scénarios démo** | 4 (total ~14 min) |
| **Temps développement Phase 1** | 6 semaines |
| **Taux de réutilisation TMS** | ~25% (architecture et composants UI) |
| **Nouveau code estimé** | ~85% |

---

## 7. PLAN DE TRAVAIL DÉTAILLÉ — 12 SEMAINES

| Semaine | Sprint | Livrables |
|---|---|---|
| **S1** | **Fondations** | Sauvegarde TMS + Vidéo. Initialisation projet Vite + TypeScript + Tailwind + json-server. Création store AQIP + types. Rebranding visuel (palette, logo, fonts). |
| **S2** | **Module Incidents** | Bibliothèque erreurs (30+ types). Dashboard incidents + Détail + Workflow résolution. Analyse IA mockée (causes, gaps). |
| **S3** | **Module Centres + Carte** | 12 centres + 12 départements. Dashboard Qualité Centres. Carte Leaflet Bénin (marqueurs colorés). Comparaison inter-centres. |
| **S4** | **IQSP + Satisfaction** | Calcul IQSP composite. Dashboard IQSP national + département. Dashboard Satisfaction Citoyenne (notes, NPS, réclamations). Cycle de Vie Citoyen (UC30). |
| **S5** | **IA + Jumeau Numérique** | Moteur IA complet. Assistant IA RH. Jumeau Numérique ANIP (chat). Détection précoce des risques. |
| **S6** | **Command Center** | Grand écran 6 zones. Crisis Room (UC32). Intégration de tous les KPIs. Script démo complet. **Répétition jury.** |
| **S7** | **Module Linguistique** | UC39 — Contrôle Qualité Linguistique. Dashboard fautes français. Module dictée/entraînement. |
| **S8** | **RH Stratégiques (partie 1)** | UC34 Organigramme. UC35 Benchmark Centres. UC36 Cartographie Talents (9-box). |
| **S9** | **RH Stratégiques (partie 2)** | UC37 Décisions RH Assistées. UC38 Mobilité & Succession. Intégration workflow décision. |
| **S10** | **Budget + ROI + Gamification** | Budget Formation, ROI, Badges, Classement, Défis. |
| **S11** | **Audit + Conformité + Finalisation** | Journal d'audit, Conformité, Exports. Finalisation tous les dashboards. |
| **S12** | **Documentation + Présentation** | Slides, Script démo filmé, Documentation technique, Storybook. **Démonstration finale.** |

---

## 8. ARGUMENTAIRE DE VENTE — POUR LE JURY ANIP

| Question | Réponse AQIP |
|---|---|
| "En quoi êtes-vous différents d'un LMS ?" | AQIP n'est PAS un LMS. Le LMS est un sous-module invisible. AQIP est un **système national de pilotage de la qualité** qui utilise les erreurs opérationnelles comme données d'amélioration continue. |
| "Comment prouvez-vous l'impact sur la qualité ?" | Chaque erreur est tracée, analysée, et corrélée à une action corrective. L'IQSP (Indice Qualité Service Public) mesure en temps réel l'état de santé de l'institution. |
| "Quel est le ROI pour l'ANIP ?" | Le module UC21 calcule le ROI de chaque formation : coût vs erreurs évitées. Exemple : 350k FCFA de formation → 1.2M FCFA d'économies. |
| "Comment gérez-vous la dimension humaine ?" | Les 5 UC RH (UC34-UC38) couvrent : organigramme, benchmark, talents, décisions RH assistées et succession. Le DG pilote ses hommes avec la donnée, pas avec l'intuition. |
| "Et les fautes de français ?" | UC39 détecte, catégorise et corrige les erreurs de saisie. IQL (Indice Qualité Linguistique) mesure la qualité des données d'état civil. |
| "C'est un prototype ou un produit fini ?" | C'est un prototype fonctionnel avec 39 cas d'usage, une mock data réaliste, et une architecture prête pour l'industrialisation. La vision est celle d'un produit fini. |

---

Ce blueprint décrit un système complet de **39 cas d'usage répartis sur 8 piliers**, avec **~85 écrans**, une **architecture data complète (json-server)**, un **moteur IA mocké**, une **carte Leaflet**, et **4 scénarios de démonstration** qui couvrent l'intégralité du parcours : de l'erreur terrain au pilotage DG.

Le système répond à la question fondamentale du jury :

> "Cette plateforme peut-elle transformer l'ANIP ?"

**Réponse : Oui. Structurellement. Et la démonstration le prouvera.**

---

**Demande : Je suis prêt à passer en ACT MODE pour implémenter la Phase 1 (Semaines 1-6) et produire la démonstration qui remportera le marché ANIP.**