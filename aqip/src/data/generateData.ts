// Générateur de données mockées AQIP
// 100% statique, prêt pour Vercel
// Aligné sur les types existants

import type { Agent, AgentCompetence, Centre, Departement, Competence, Formation, FormationSuivie, Incident, Satisfaction, Feedback, Utilisateur, Budget, BudgetRepartition, ROIData, Notification, DemandeFormation } from '../types';

export interface DataStore {
  agents: Agent[];
  centres: Centre[];
  departements: Departement[];
  competences: Competence[];
  formations: Formation[];
  formationsSuivies: FormationSuivie[];
  incidents: Incident[];
  evaluations: any[];
  feedbacks: Feedback[];
  satisfactions: Satisfaction[];
  notifications: Notification[];
  utilisateurs: Utilisateur[];
  budget: Budget;
  demandesFormation: DemandeFormation[];
}

export function generateAllData(): DataStore {
    // === FONCTIONS UTILITAIRES ===
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const pickN = <T>(arr: T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randF = (min: number, max: number, d: number = 1) => parseFloat((min + Math.random() * (max - min)).toFixed(d));
  const id = (prefix: string, n: number) => `${prefix}-${String(n).padStart(3, '0')}`;
  const date = (y: number, m?: number, d?: number) => `${y}-${String(m ?? rand(1,12)).padStart(2,'0')}-${String(d ?? rand(1,28)).padStart(2,'0')}`;
  const phone = () => `+229 ${rand(61,99)} ${rand(10,99)} ${rand(10,99)} ${rand(10,99)}`;

  const NOMS = ['Ahouangon','Kossou','Mensah','Adjovi','Dossou','Zinsu','Bello','Adjo','Atangana','Houngbedji','Tohouegnon','Gbaguidi','Sossa','Akakpo','Agossa','Hounkpatin','Adeossi','Assogba','Ahyi','Bognon','Chabi','Dah','Gnonlonfoun','Houndeton','Hounsou','Kpeto','Lokossou','Medegan','Noudossou','Orou','Padonou','Quenum','Sagbo','Tchibozo','Vignon','Yehouenou','Zannou','Adoukonou'];
  const PRENOMS = ['Jean','Léa','Kofi','Grâce','Claire','Paul','Rachid','Pascal','Marie','David','Esther','Franck','Bénédicte','Roland','Jules','Florence','Théophile','Noélie','Gilles','Angélique','Cédric','Mireille','Joël','Sylvie','Hervé','Odile','Raoul','Irène','Bertrand','Céline','Armel','Joséphine','Cyprien','Martine'];
  const POSTES = ["Agent d'enrôlement","Opérateur saisie","Superviseur","Chef de centre","Contrôleur qualité","Agent biométrie","Agent accueil","Agent état civil","Responsable départemental","Analyste données","Formateur","Assistant RH"];
  const GRADES = ['Catégorie A','Catégorie B','Catégorie C'];
  const STATUTS_AGENT: Array<'actif'|'conge'|'suspendu'|'mutation'> = ['actif','actif','actif','conge','actif'];
  const CATS_INCIDENT = ['Biométrie','Saisie & Langue Française','Accueil & Citoyen','État Civil','Technique','Procédure'];

  const VILLES = [
    { nom: 'Cotonou', lat: 6.3667, lng: 2.4333, dept: 'Littoral', pop: 1679356 },
    { nom: 'Porto-Novo', lat: 6.4973, lng: 2.6051, dept: 'Ouémé', pop: 264320 },
    { nom: 'Parakou', lat: 9.3372, lng: 2.6303, dept: 'Borgou', pop: 255478 },
    { nom: 'Natitingou', lat: 10.3, lng: 1.3833, dept: 'Atacora', pop: 104010 },
    { nom: 'Abomey', lat: 7.1819, lng: 1.9931, dept: 'Zou', pop: 90195 },
    { nom: 'Bohicon', lat: 7.1667, lng: 2.0667, dept: 'Zou', pop: 149271 },
    { nom: 'Lokossa', lat: 6.6333, lng: 1.7167, dept: 'Mono', pop: 100870 },
    { nom: 'Dogbo', lat: 6.8167, lng: 1.7833, dept: 'Couffo', pop: 62209 },
    { nom: 'Kandi', lat: 11.1333, lng: 2.9333, dept: 'Alibori', pop: 181206 },
    { nom: 'Ouidah', lat: 6.3667, lng: 2.0833, dept: 'Atlantique', pop: 162034 },
    { nom: 'Savalou', lat: 7.9167, lng: 1.9167, dept: 'Collines', pop: 104400 },
    { nom: 'Djougou', lat: 9.7, lng: 1.6667, dept: 'Donga', pop: 237040 },
  ];

  // 1. Départements
  const deptSet = new Set(VILLES.map(v => v.dept));
  const departements: Departement[] = Array.from(deptSet).map((nom, i) => ({
    id: id('dpt', i + 1),
    nom,
    chefLieu: VILLES.find(v => v.dept === nom)?.nom,
    superficie: rand(1500, 5500),
    population: VILLES.filter(v => v.dept === nom).reduce((s, v) => s + v.pop, 0),
    iqsp: rand(55, 92),
  }));

  // 2. Compétences
  const competences: Competence[] = [
    { id: 'comp-photo', nom: 'Capture photo biométrique', categorie: 'technique', piller: 'enrolement', description: 'Capacité à capturer et vérifier la qualité photo', niveaux: [
      { niveau: 1, label: 'Débutant', description: 'A besoin de supervision' }, { niveau: 2, label: 'Intermédiaire', description: 'Capture simple' }, { niveau: 3, label: 'Avancé', description: 'Autonome' }, { niveau: 4, label: 'Expert', description: 'Peut former' }, { niveau: 5, label: 'Référent', description: 'Maîtrise totale' }
    ]},
    { id: 'comp-etat-civil', nom: 'Saisie état civil', categorie: 'technique', piller: 'enrolement', description: 'Transcription correcte des actes', niveaux: [
      { niveau: 1, label: 'Débutant', description: 'Erreurs fréquentes' }, { niveau: 2, label: 'Intermédiaire', description: 'Relecture nécessaire' }, { niveau: 3, label: 'Avancé', description: 'Fiable' }, { niveau: 4, label: 'Expert', description: 'Maîtrise parfaite' }, { niveau: 5, label: 'Référent', description: 'Forme les pairs' }
    ]},
    { id: 'comp-empreintes', nom: 'Capture empreintes digitales', categorie: 'technique', piller: 'enrolement', description: 'Qualité des empreintes', niveaux: [
      { niveau: 1, label: 'Débutant', description: 'Difficultés' }, { niveau: 2, label: 'Intermédiaire', description: 'Correct mais lent' }, { niveau: 3, label: 'Avancé', description: 'Peu de rejets' }, { niveau: 4, label: 'Expert', description: 'Taux > 98%' }, { niveau: 5, label: 'Référent', description: 'Empreintes dégradées' }
    ]},
    { id: 'comp-accueil', nom: 'Accueil et relation citoyen', categorie: 'comportementale', piller: 'accueil', description: 'Qualité de l\'accueil', niveaux: [
      { niveau: 1, label: 'Débutant', description: 'Neutre' }, { niveau: 2, label: 'Intermédiaire', description: 'Correct' }, { niveau: 3, label: 'Avancé', description: 'Excellent' }, { niveau: 4, label: 'Expert', description: 'Gère les conflits' }
    ]},
    { id: 'comp-toponymie', nom: 'Connaissance toponymique', categorie: 'technique', piller: 'enrolement', description: 'Connaissance des localités', niveaux: [
      { niveau: 1, label: 'Débutant', description: 'Grandes villes' }, { niveau: 2, label: 'Intermédiaire', description: '12 départements' }, { niveau: 3, label: 'Avancé', description: '77 communes' }, { niveau: 4, label: 'Expert', description: 'Arrondissements' }
    ]},
    { id: 'comp-informatique', nom: 'Bureautique et systèmes', categorie: 'manageriale', piller: 'administration', description: 'Outils informatiques', niveaux: [
      { niveau: 1, label: 'Débutant', description: 'Basique' }, { niveau: 2, label: 'Intermédiaire', description: 'Logiciels métier' }, { niveau: 3, label: 'Avancé', description: 'Dépannage basique' }
    ]},
    { id: 'comp-linguistique', nom: 'Qualité linguistique', categorie: 'comportementale', piller: 'qualite', description: 'Orthographe et rédaction', niveaux: [
      { niveau: 1, label: 'Débutant', description: 'Fautes fréquentes' }, { niveau: 2, label: 'Intermédiaire', description: 'Correct avec relecture' }, { niveau: 3, label: 'Avancé', description: 'Bonne maîtrise' }, { niveau: 4, label: 'Expert', description: 'Excellent rédacteur' }
    ]},
  ];

  // 3. Centres
  const centres: Centre[] = VILLES.map((v, i) => ({
    id: id('ctr', i + 1),
    nom: `${v.nom} Centre`,
    departementId: departements.find(d => d.nom === v.dept)?.id ?? 'dpt-001',
    adresse: `01 BP ${rand(100, 9999)}, ${v.nom}`,
    telephone: phone(),
    latitude: v.lat + randF(-0.03, 0.03, 4),
    longitude: v.lng + randF(-0.03, 0.03, 4),
    dateOuverture: `2020-${String(rand(1,12)).padStart(2,'0')}-${String(rand(1,28)).padStart(2,'0')}`,
    statut: pick(['actif','actif','actif','alerte']),
    maturite: pick(['Réactif','Contrôlé','Standardisé','Piloté','Excellence']),
    equipements: pickN(['BIO-347','CAM-001','LEC-089','PC-012','OND-003','SCAN-X1','IMP-Laser','SER-002'], rand(3, 6)),
    capaciteMax: rand(2000, 8000),
    agentsCount: rand(8, 45),
    chefCentreId: `usr-${String(rand(1,12)).padStart(3,'0')}`,
  }));

  // 4. Agents (150)
  const agents: Agent[] = [];
  for (let i = 0; i < 150; i++) {
    const centre = pick(centres);
    const nom = pick(NOMS);
    const prenom = pick(PRENOMS);
    const perf = rand(35, 98);
    const qual = rand(30, 97);
    const ling = rand(25, 95);
    const agentsComp: AgentCompetence[] = pickN(competences, rand(2, 5)).map(c => ({
      competenceId: c.id,
      niveauActuel: rand(1, 5),
      niveauAttendu: rand(3, 5),
    }));
    agents.push({
      id: id('agt', i + 1),
      nom, prenom,
      matricule: `AGT-${rand(2020, 2025)}-${rand(1000, 9999)}`,
      email: `${prenom.toLowerCase()[0]}.${nom.toLowerCase()}@anip.bj`,
      telephone: phone(),
      poste: pick(POSTES),
      grade: pick(GRADES),
      centreId: centre.id,
      departementId: centre.departementId,
      managerId: i > 10 ? id('mgr', rand(1, 5)) : undefined,
      dateEmbauche: `${2020 + rand(0, 5)}-${String(rand(1,12)).padStart(2,'0')}-${String(rand(1,28)).padStart(2,'0')}`,
      statut: pick(STATUTS_AGENT),
      competences: agentsComp,
      scores: {
        performance: perf,
        qualite: qual,
        linguistique: ling,
        satisfaction: randF(2.0, 5.0, 1),
        potentiel: rand(30, 95),
        composite: Math.round(perf * 0.35 + qual * 0.25 + ling * 0.20 + rand(40, 98) * 0.20),
      },
      historiqueMutations: i % 5 === 0 ? [{ date: date(2023), de: pick(VILLES).nom, vers: centre.nom, motif: pick(['Mutation','Promotion','Réaffectation']) }] : [],
    });
  }

  // 5. Formations (30)
  const fmtData = [
    { t: 'Maîtrise de la transcription des noms', d: '2h', h: 2, c: 0, cert: false },
    { t: 'Capture biométrique avancée', d: '3 jours', h: 21, c: 350000, cert: true },
    { t: 'Protocole empreintes ANIP', d: '1 jour', h: 7, c: 200000, cert: true },
    { t: 'Référentiel géographique du Bénin', d: '1h30', h: 1.5, c: 0, cert: false },
    { t: 'Accueil et gestion des files d\'attente', d: '4h', h: 4, c: 120000, cert: false },
    { t: 'Orthographe et rédaction administrative', d: '3h', h: 3, c: 0, cert: false },
    { t: 'Gestion du stress en situation de pointe', d: '2h', h: 2, c: 0, cert: false },
    { t: 'Cyber-sécurité pour agents', d: '1h', h: 1, c: 0, cert: false },
    { t: 'Procédure de traitement des réclamations', d: '2h30', h: 2.5, c: 0, cert: false },
    { t: 'Normes OACI pour photo d\'identité', d: '2h', h: 2, c: 0, cert: false },
    { t: 'Techniques de communication non-violente', d: '1 jour', h: 7, c: 150000, cert: true },
    { t: 'Excel avancé pour le reporting', d: '2 jours', h: 14, c: 200000, cert: true },
    { t: 'Leadership et management d\'équipe', d: '3 jours', h: 21, c: 400000, cert: true },
    { t: 'Détection des fraudes documentaires', d: '1 jour', h: 7, c: 0, cert: false },
    { t: 'Module dictée assistée', d: '30 min', h: 0.5, c: 0, cert: false },
    { t: 'Gestion du temps et des priorités', d: '1h', h: 1, c: 0, cert: false },
    { t: 'Procédure d\'enrôlement complet', d: '4h', h: 4, c: 0, cert: false },
    { t: 'Base de données et SQL', d: '2 jours', h: 14, c: 250000, cert: true },
    { t: 'Anglais administratif niveau 1', d: '20h', h: 20, c: 0, cert: false },
    { t: 'Anglais administratif niveau 2', d: '20h', h: 20, c: 0, cert: false },
    { t: 'Préparation certification qualité', d: '3 jours', h: 21, c: 300000, cert: true },
    { t: 'Gestion des conflits interpersonnels', d: '1 jour', h: 7, c: 150000, cert: true },
    { t: 'Méthodologie de résolution de problèmes', d: '2h', h: 2, c: 0, cert: false },
    { t: 'RGPD et protection des données', d: '1h30', h: 1.5, c: 0, cert: false },
    { t: 'Accueil des personnes handicapées', d: '2h', h: 2, c: 0, cert: false },
    { t: 'Formation des formateurs internes', d: '5 jours', h: 35, c: 500000, cert: true },
    { t: 'Gestion budgétaire pour managers', d: '1 jour', h: 7, c: 200000, cert: true },
    { t: 'Connaissance du système ANIP', d: '3h', h: 3, c: 0, cert: false },
    { t: 'Techniques d\'encadrement terrain', d: '2 jours', h: 14, c: 250000, cert: true },
    { t: 'Cours accéléré de toponymie béninoise', d: '1h', h: 1, c: 0, cert: false },
  ];
  const formations: Formation[] = fmtData.map((f, i) => ({
    id: id('fmt', i + 1),
    titre: f.t,
    categorie: pick(['technique','management','qualite','integration']),
    duree: f.d,
    heures: f.h,
    cout: f.c,
    certifiante: f.cert,
    objectifs: ['Acquérir les compétences clés', 'Mettre en pratique', 'Évaluer la progression'],
    programme: `Programme complet de "${f.t}"`,
    competencesCiblees: pickN(competences, rand(1, 3)).map(c => c.id),
    niveauCible: rand(3, 5),
  }));

  // 6. Formations suivies (200)
  const formationsSuivies: FormationSuivie[] = [];
  for (let i = 0; i < 200; i++) {
    const agent = pick(agents);
    const formation = pick(formations);
    const statut = pick(['planifiee','en_cours','terminee']);
    formationsSuivies.push({
      id: id('fs', i + 1),
      agentId: agent.id,
      formationId: formation.id,
      statut: statut as 'planifiee' | 'en_cours' | 'terminee',
      dateDebut: statut === 'terminee' ? date(2025) : statut === 'en_cours' ? date(2026) : undefined,
      progression: statut === 'terminee' ? 100 : statut === 'en_cours' ? rand(15, 85) : 0,
      quizScore: statut === 'terminee' ? rand(5, 10) : undefined,
      dateCertification: statut === 'terminee' && rand(0,1) === 1 ? date(2026, rand(1,4)) : null,
    });
  }

  // 7. Incidents (60)
  const incidents: Incident[] = [];
  const codesErreur: Record<string, string[]> = {
    'Biométrie': ['BIO-01','BIO-02','BIO-03','BIO-04','BIO-05','BIO-06','BIO-07','BIO-08'],
    'Saisie & Langue Française': ['FR-01','FR-02','FR-03','FR-04','FR-05','FR-06','FR-07','FR-08','FR-09','FR-10','FR-11','FR-12'],
    'Accueil & Citoyen': ['ACC-01','ACC-02','ACC-03','ACC-04'],
    'État Civil': ['EC-01','EC-02','EC-03','EC-04'],
  };
  const libellesErreur = [
    'Photo floue', 'Photo sous-exposée', 'Photo surexposée', 'Empreintes illisibles',
    'Nom mal orthographié', 'Prénom erroné', 'Commune erronée', 'Accent manquant',
    'Temps d\'attente excessif', 'Agent non disponible', 'Comportement inapproprié',
    'Acte mal transcrit', 'Lien filiation erroné', 'Numéro d\'acte invalide',
  ];
  const statutsInc: Array<'nouveau'|'analyse'|'en_cours'|'resolu'> = ['nouveau','analyse','en_cours','resolu'];
  for (let i = 0; i < 60; i++) {
    const agent = pick(agents);
    const cat = pick(CATS_INCIDENT);
    const codes = codesErreur[cat] || ['ERR-01'];
    const dateDet = new Date(2026, rand(0,5), rand(1,28), rand(8,17), rand(0,59));
    const statut = pick(statutsInc);
    incidents.push({
      id: id('inc', i + 1),
      agentId: agent.id,
      centreId: agent.centreId,
      categorie: cat,
      codeErreur: pick(codes),
      erreurLibelle: pick(libellesErreur),
      description: 'Erreur détectée lors du contrôle qualité',
      gravite: pick(['Faible','Moyenne','Haute','Critique']),
      statut: statut as any,
      dateDetection: dateDet.toISOString(),
      dateResolution: statut === 'resolu' ? new Date(dateDet.getTime() + rand(1,14)*86400000).toISOString() : null,
      causeProbable: statut !== 'nouveau' ? 'Maîtrise insuffisante de la procédure' : undefined,
      competenceImpactee: pick(competences).id,
      gapCompetence: rand(1, 3),
      risque: pick(['moyen','élevé','critique']),
      impact: `Retards estimés à ${rand(2,20)}h/semaine`,
      coutEstime: rand(2500, 15000),
      formationPrescrite: rand(0,1) === 1 ? pick(formations).id : undefined,
      scoreConfianceIA: rand(72, 97),
      historique: [
        { date: dateDet.toISOString(), action: 'DÉTECTION', user: pick(['Système IA','Contrôleur qualité']) },
        ...(statut !== 'nouveau' ? [{ date: new Date(dateDet.getTime()+3600000).toISOString(), action: 'ANALYSE', user: 'IA', detail: `Cause probable avec ${rand(75,95)}% confiance` }] : []),
        ...(statut === 'resolu' ? [{ date: new Date(dateDet.getTime()+rand(2,10)*86400000).toISOString(), action: 'RÉSOLUTION', user: 'Chef de centre', detail: 'Plan correctif appliqué' }] : []),
      ],
    });
  }

  // 8. Feedbacks (50)
  const feedbacks: Feedback[] = [];
  const msgs = ['Très bonne progression','Doit améliorer la qualité','Excellent travail d\'équipe','Point à suivre : ponctualité','A très bien géré une situation difficile','Proactif','Doit renforcer sa maîtrise','Remarquable : a formé deux collègues'];
  for (let i = 0; i < 50; i++) {
    feedbacks.push({
      id: id('fb', i + 1),
      agentId: pick(agents).id,
      emetteurId: id('usr', rand(1,50)),
      relation: pick(['manager','pair','subordonne','citoyen']),
      type: pick(['positif','constructif','constructif','positif','alerte']),
      message: pick(msgs),
      note: rand(1, 5),
      date: date(2026, rand(1,4)),
      anonyme: Math.random() > 0.7,
      vu: Math.random() > 0.3,
    });
  }

  // 9. Satisfactions (100)
  const satisfactions: Satisfaction[] = [];
  const comments = ['Service rapide','Agent très aimable','Attente un peu longue','Excellent accueil','Procédure bien expliquée','À améliorer','Très satisfait','Personnel compétent'];
  for (let i = 0; i < 100; i++) {
    satisfactions.push({
      id: id('sat', i + 1),
      citoyen: `${pick(PRENOMS)} ${pick(NOMS)}`,
      centreId: pick(centres).id,
      agentId: pick(agents).id,
      note: randF(1, 5, 0),
      commentaire: pick(comments),
      date: date(2026, rand(1,4)),
      canal: pick(['sms','email','borne','web']),
      typeService: pick(['enrolement','renouvellement','information','reclamation']),
    });
  }

  // 10. Notifications (40)
  const notifications: Notification[] = [];
  const notifTypes: Array<Notification['type']> = ['incident','formation','evaluation','feedback','alerte','systeme'];
  const notifTitres = ['Nouvel incident détecté','Formation recommandée','Évaluation à compléter','Nouveau feedback','Alerte performance','Certification obtenue'];
  const notifMsgs = ['Un incident a été détecté','L\'IA recommande une formation','Votre évaluation est disponible','Vous avez reçu un feedback','Votre score a baissé','Félicitations pour votre certification'];
  for (let i = 0; i < 40; i++) {
    notifications.push({
      id: id('notif', i + 1),
      titre: pick(notifTitres),
      message: pick(notifMsgs),
      type: pick(notifTypes),
      lu: Math.random() > 0.5,
      date: `${date(2026, rand(1,6))}T${String(rand(8,17)).padStart(2,'0')}:${String(rand(0,59)).padStart(2,'0')}:00Z`,
      agentId: pick(agents).id,
      lien: '/dashboard',
      priorite: pick(['basse','normale','haute','urgente']),
    });
  }

  // 11. Utilisateurs
  const utilisateurs: Utilisateur[] = [
    { id: 'usr-001', nom: 'Atangana', prenom: 'Jean-Pierre', role: 'dg', email: 'jp.atangana@anip.bj', telephone: phone() },
    { id: 'usr-002', nom: 'Hounkpatin', prenom: 'Martine', role: 'drh', email: 'm.hounkpatin@anip.bj', telephone: phone() },
    { id: 'usr-003', nom: 'Agossa', prenom: 'Bertrand', role: 'directeur_dept', email: 'b.agossa@anip.bj', telephone: phone() },
    { id: 'usr-004', nom: 'Akakpo', prenom: 'Florence', role: 'responsable_qualite', email: 'f.akakpo@anip.bj', telephone: phone() },
    { id: 'usr-005', nom: 'Ahouangon', prenom: 'Jean', role: 'agent', email: 'j.ahouangon@anip.bj', telephone: phone() },
    { id: 'usr-006', nom: 'Adjo', prenom: 'Pascal', role: 'chef_centre', email: 'p.adjo@anip.bj', telephone: phone() },
    { id: 'usr-007', nom: 'Zinsu', prenom: 'Paul', role: 'agent', email: 'p.zinsu@anip.bj', telephone: phone() },
    { id: 'usr-008', nom: 'Kossou', prenom: 'Léa', role: 'agent', email: 'l.kossou@anip.bj', telephone: phone() },
    { id: 'usr-009', nom: 'Bello', prenom: 'Rachid', role: 'agent', email: 'r.bello@anip.bj', telephone: phone() },
    { id: 'usr-010', nom: 'Adjovi', prenom: 'Grâce', role: 'agent', email: 'g.adjovi@anip.bj', telephone: phone() },
    { id: 'usr-011', nom: 'Dossou', prenom: 'Claire', role: 'agent', email: 'c.dossou@anip.bj', telephone: phone() },
    { id: 'usr-012', nom: 'Mensah', prenom: 'Kofi', role: 'agent', email: 'k.mensah@anip.bj', telephone: phone() },
  ];

  // 12. Budget
  const budgetRepartition: BudgetRepartition[] = [
    { categorie: 'Biométrie', montant: 15000000, consomme: 12000000 },
    { categorie: 'État civil', montant: 12000000, consomme: 8000000 },
    { categorie: 'Accueil', montant: 8000000, consomme: 4000000 },
    { categorie: 'Management', montant: 10000000, consomme: 6000000 },
    { categorie: 'Transversal', montant: 5000000, consomme: 2000000 },
  ];
  const coutFormations = formations.filter(f => f.cout > 0);
  const roiParFormation: ROIData[] = coutFormations.slice(0, 5).map(f => ({
    formationId: f.id,
    cout: f.cout,
    erreursEvitees: rand(20, 150),
    economieEstimee: rand(500000, 2500000),
    roi: rand(150, 500),
  }));
  const budget: Budget = {
    annee: 2026,
    totalAlloue: 50000000,
    dejaEngage: 32000000,
    restant: 18000000,
    repartition: budgetRepartition,
    roiParFormation,
  };

  // 13. Demandes de formation (30)
  const demandesFormation: DemandeFormation[] = [];
  const fmtPayantes = formations.filter(f => f.cout > 0);
  for (let i = 0; i < 30; i++) {
    demandesFormation.push({
      id: id('dem', i + 1),
      agentId: pick(agents).id,
      formationId: pick(fmtPayantes).id,
      dateDemande: date(2026, rand(1,6)),
      statut: pick(['en_attente','validée','refusée']),
      motif: 'Formation nécessaire pour améliorer la qualité de service',
      decisionCommentaire: Math.random() > 0.6 ? 'Formation prioritaire' : undefined,
    });
  }

  // 14. Évaluations (simplifié, type any pour compatibilité)
  const evaluations: any[] = [];
  for (let i = 0; i < 80; i++) {
    const agent = pick(agents);
    evaluations.push({
      id: id('eval', i + 1),
      agentId: agent.id,
      evaluateurId: id('mgr', rand(1,5)),
      campagne: pick(['2025-T4','2026-T1','2026-T2']),
      date: date(2026, rand(1,4)),
      statut: pick(['brouillon','soumis','verrouillee']),
      scores: {
        comportemental: [
          { critereId: 'b1', label: 'Leadership', poids: 10, note: rand(1,5) },
          { critereId: 'b2', label: 'Communication', poids: 10, note: rand(1,5) },
          { critereId: 'b3', label: 'Travail équipe', poids: 10, note: rand(1,5) },
        ],
        technique: [
          { critereId: 't1', label: 'Maîtrise métier', poids: 20, note: rand(1,5) },
          { critereId: 't2', label: 'Productivité', poids: 20, note: rand(1,5) },
        ],
        management: [],
        objectifs: [
          { critereId: 'o1', label: 'Atteinte objectifs', poids: 20, note: rand(1,5) },
        ],
        autoEvaluation: [],
      },
      scoreFinal: rand(55, 98),
      verrouilleeLe: `2026-${String(rand(1,4)).padStart(2,'0')}-${String(rand(1,28)).padStart(2,'0')}T14:00:00Z`,
    });
  }

  return {
    agents, centres, departements, competences,
    formations, formationsSuivies, incidents,
    evaluations, feedbacks, satisfactions,
    notifications, utilisateurs, budget, demandesFormation,
  };
}