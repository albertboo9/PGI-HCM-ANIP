# AQIP V3.5 — Plan d'Implémentation Officiel (Révisé)

> **Mission** : Transformer les erreurs terrain en montée en compétence mesurable. L'application devient une véritable **plateforme nationale de pilotage des compétences et de la qualité de service public**.

---

## État du Codebase (Audit)

| Asset | État | Réutilisable |
|-------|------|:---:|
| `skillEngine.ts` (analyzeIncident, getAgentSkillGaps, getRecommendedFormations) | Solide | ✅ |
| `skillMap.ts` (7 mappings Erreur→Compétence→Formation) | Solide | ✅ |
| `incidentStore.ts` & `agentStore.ts` (Zustand persist/localStorage) | Solide | ✅ |
| `authStore.ts` (7 rôles, switchRole, persist) | Solide | ✅ |
| `BeninMap.tsx` (Leaflet + markers custom) | Solide | ✅ |
| `AgentWorkspacePage.tsx` (workflow async 4s) | Solide | ✅ |
| `Header.tsx` & `Sidebar.tsx` & Design tokens (`aqip-theme.css`) | Récent | ✅ |

---

## Phase 1 — AQIP Coach Omniprésent (Cœur Émotionnel)

Le Coach n'est plus seulement une page, c'est un compagnon proactif qui vit partout dans l'application.

### [MODIFY] `src/components/layout/Header.tsx`
- Ajout du **Centre de notifications AQIP Coach** (icône cloche ou bulle).
- Notifications proactives :
  - "3 dossiers rejetés cette semaine."
  - "Nouvelle formation recommandée."
  - "Votre score qualité progresse."
  - "Vous pouvez désormais prétendre au poste de superviseur."

### [NEW] `src/services/coachEngine.ts`
Moteur de réponses contextuelles (AUCUN LLM). Toutes les réponses sont calculées à partir des stores.

### [NEW] `src/pages/Coach/CoachPage.tsx` — ⭐ Écran Star #2
Interface de chat premium type "Coach Professionnel" avec :
- **Profil résumé** : Score, Forces, Faiblesses, Compétences radar
- **Chat contextuel** : Réponses riches formatées. Explication de l'impact (Erreur → Compétence → Formation → Impact).
- Ton **bienveillant**, guide de carrière.

---

## Phase 2 — Quality Improvement Engine (Vocabulaire Métier)

Il est crucial de séparer "Erreur" de "Incompétence".

### [MODIFY] `src/types/incident.types.ts` & `server/db.json`
- `qualificationStatus`: 'constat' | 'cause_identifiee' | 'action_decidee' | 'accompagnement' | 'amelioration_observee'
- `causeRacine`: 'competence' | 'materiel' | 'procedure' | 'surcharge' | null

### [NEW] `src/pages/Quality/QualityWorkflowPage.tsx` — ⭐ Écran Star #3
Vue Kanban avec un vocabulaire métier compréhensible par un DG :

| Constat | Cause Identifiée | Action Décidée | Accompagnement | Amélioration Observée |
|---------|------------------|----------------|----------------|-----------------------|
| Cards   | Cards            | Cards          | Cards          | Cards                 |

- Chaque carte affiche la cause racine (ex: problème matériel vs besoin de formation).
- Fluidité visuelle (Sankey flow optionnel).

---

## Phase 3 — Learning Campus & Transformation Agent

### [MODIFY] `src/pages/Formations/CataloguePage.tsx`
Séparation en 3 niveaux clairs :
1. **Catalogue Libre** (accès libre : accueil, qualité, etc.)
2. **Formation Prescrite** (suite à un PDI / gap)
3. **Formation Externe** (nécessite validation Chef → DRH)

### [NEW] `src/pages/LMS/MonEvolutionPage.tsx` — ⭐ Écran Star #1
Ce n'est plus un simple "Parcours", c'est **"Mon Évolution Professionnelle"**.
Vue chronologique (Timeline) qui raconte une transformation :
- *Mars* : 15 erreurs FR-01
- *Avril* : Formation "Transcription des actes" suivie
- *Mai* : 8 erreurs FR-01
- *Juin* : Certification obtenue
- *Juillet* : 3 erreurs
- *Août* : Recommandation de promotion par le Coach IA

---

## Phase 4 — National Competency Intelligence (Vision Dirigeant)

### [NEW] `src/pages/Intelligence/CompetencyMapPage.tsx` — ⭐ Écran Star #4
Carte Nationale des Compétences enrichie :
1. **Radar de Compétences par Centre** (Biométrie, État civil, Accueil, Productivité, Qualité)
2. **Couche Temporelle** (Nouveau) : Slider "Il y a 6 mois" → "Aujourd'hui" → "Projection à 6 mois". Le DG voit l'impact des formations évoluer dans le temps sur la carte.
3. **Simulateur Stratégique** : "Si nous formons 50 agents biométrie → -35% rejets".

### [NEW] `src/pages/Intelligence/SuccessStoriesPage.tsx` — (Nouveau)
La vue qui raconte les "histoires humaines" pour le DG/DRH.
- Ex : **Jean Ahouangon** (18 erreurs → Formation → 5 erreurs → Score qualité 62 → 88).
- Ex : **Marie Dossou** (12 rejets biométriques → Coaching → 2 rejets → Certification Expert Biométrie).
- Des cartes narratives hautement visuelles.

### [NEW] `src/pages/Piller8_RH/TalentsMatricePage.tsx` — (Nouveau)
**Matrice des Talents DRH (9-box grid)** :
- Axe X : Compétences (basé sur le skillEngine)
- Axe Y : Performance (basé sur le taux d'erreur)
- Segments : "Futur Leader", "Expert Technique", "À Accompagner", "À Surveiller".

---

## Navigation Restructurée (Sidebar)

```
MON ESPACE
  ├── Dashboard
  └── Enrôlement (RAVIP)

DÉVELOPPEMENT
  ├── Mon Coach IA          ← ⭐ nouveau
  ├── Mon Évolution         ← ⭐ nouveau (Timeline transformation)
  └── Catalogue Formations

QUALITÉ
  ├── Workflow Qualité       ← ⭐ nouveau (Kanban métier)
  └── Journal des Constats

INTELLIGENCE / DRH
  ├── Carte Nationale        ← ⭐ nouveau (avec Time slider)
  ├── Matrice Talents        ← ⭐ nouveau (9-box)
  └── Success Stories        ← ⭐ nouveau (Histoires humaines)
```

---

## Ordre d'Exécution

1. **Phase 1** : Coach IA (Notification Center Header + Moteur + Interface)
2. **Phase 2** : Workflow Qualité (Kanban avec libellés métier)
3. **Phase 3** : Learning Campus & Mon Évolution (Timeline chronologique de l'agent)
4. **Phase 4** : Intelligence (Matrice DRH + Success Stories + Carte Temporelle)
5. **Phase 5** : Polish UX/UI (Références : ServiceNow, Palantir, Workday) et intégration du fil rouge.

---

## Fil Rouge Officiel de Démonstration (Rappel)
1. **Agent réalise une opération** (Poste de travail).
2. **Constat qualité détecté** (Erreur ≠ incompétence).
3. **Qualification & Cause identifiée** (Workflow Kanban).
4. **Coach intervient** (Notifications proactives).
5. **Formation recommandée et suivie** (Mon Évolution).
6. **Compétence améliorée** (Timeline agent).
7. **DG visualise l'impact national** (Carte temporelle, Matrice Talents, Success Stories).
