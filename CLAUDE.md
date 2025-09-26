# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Xytherra** is a fully playable 4X grand strategy game built with React and TypeScript. The game features a unique planet-tech trajectory system where colonization order determines your empire's technological DNA. This is a complete game implementation, not just a design document.

## Core Game Systems

### Planet-Tech Trajectory System
- **7 Planet Types**: Water (Shields), Volcanic (Weapons), Rocky (Industry), Gas (Propulsion), Ice (Sensors), Living (Biotech), Desolate (Survival)
- **Colonization Order Matters**: Early colonies get higher weight multipliers (×3, ×2, ×1.5)
- **Empire Specialization**: Your tech trajectory creates permanent empire identity
- **Hybrid Technologies**: Unlock when controlling multiple planet types

### Game Features Implemented
- **Galaxy Generation**: Procedural star systems with diverse planet types
- **Empire Management**: Player and AI empires with unique factions
- **Tech System**: Planet-based research (no traditional tech tree)
- **Fleet System**: Space combat and exploration
- **Diplomacy**: Relations between empires
- **Victory Conditions**: Multiple win paths (Domination, Federation, Tech Ascendancy)
- **Save/Load**: Persistent game state with Zustand
- **AI**: Basic AI decision making for non-player empires

## Development Commands

### Frontend (React/TypeScript/Vite)
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server (localhost:5173)
npm run build       # Build for production
npm run lint        # Run ESLint
npm run type-check  # TypeScript compilation check
npm run test:run    # Run tests
npm run ci          # Full quality pipeline
```

### Build and Deployment
```bash
# From project root
.\publish.ps1               # Deploy to preview environment
.\publish.ps1 -Production   # Deploy to production
.\publish.ps1 -Frontend     # Frontend only
```

## Project Structure

```
xytherra/
├── CLAUDE.md                   # This file
├── README.md                   # Game design documentation
├── publish.ps1                 # PowerShell deployment script
├── map_implementation_plan.md  # Galaxy map enhancement roadmap
├── map_updates.md              # Map system design docs
└── frontend/                   # React/TypeScript game client
    ├── src/
    │   ├── App.tsx             # Main app with game phases
    │   ├── components/
    │   │   ├── game/           # Game-specific components
    │   │   │   ├── GameSetup.tsx           # Game initialization
    │   │   │   ├── GameUI.tsx              # Main game interface
    │   │   │   ├── GalaxyView.tsx          # Star map visualization
    │   │   │   ├── ColonyView.tsx          # Colony management
    │   │   │   ├── ResearchView.tsx        # Planet-tech research
    │   │   │   ├── DiplomacyView.tsx       # Empire relations
    │   │   │   ├── FleetView.tsx           # Fleet management
    │   │   │   ├── SpecializationDashboard.tsx  # Empire identity
    │   │   │   └── ColonizationTimeline.tsx     # Tech trajectory
    │   │   └── ui/             # Reusable UI components
    │   │       └── Button.tsx
    │   ├── stores/
    │   │   ├── gameStore.ts    # Main game state (Zustand)
    │   │   └── uiStore.ts      # UI state management
    │   ├── services/           # Game logic services
    │   │   ├── galaxyService.ts        # Galaxy generation
    │   │   ├── empireService.ts        # Empire management
    │   │   ├── fleetService.ts         # Fleet operations
    │   │   ├── aiService.ts            # AI decision making
    │   │   └── planetTechService.ts    # Planet-tech system
    │   ├── types/
    │   │   ├── game.d.ts       # Core game type definitions
    │   │   └── gameTypes.ts    # Additional game types
    │   ├── data/
    │   │   └── gameData.ts     # Static game data
    │   ├── constants/
    │   │   ├── gameConstants.ts    # Game balance constants
    │   │   └── uiConstants.ts      # UI configuration
    │   ├── hooks/
    │   │   ├── useGameState.ts     # Game state hook
    │   │   └── usePerformance.ts   # Performance monitoring
    │   ├── utils/              # Utility functions
    │   └── config/
    │       └── gameConfig.ts   # Game configuration
    ├── package.json            # Dependencies and scripts
    ├── vite.config.ts          # Vite configuration
    ├── tailwind.config.js      # Tailwind CSS config
    └── tsconfig.json           # TypeScript configuration
```

## Technology Stack

- **React 19** with TypeScript and strict mode
- **Vite 6.x** for build tooling and development
- **Tailwind CSS 4.x** with custom game theming
- **Zustand 5.x** for state management with persistence
- **Framer Motion** for UI animations
- **Chart.js** for data visualizations
- **React Use** for utility hooks
- **Lucide React** for icons

## Architecture Overview

### State Management
- **gameStore.ts**: Main Zustand store with game state, empires, galaxy, and all game actions
- **Persistence**: Automatic save/load using Zustand persist middleware
- **Type Safety**: Comprehensive TypeScript interfaces for all game entities

### Service Layer Architecture
- **galaxyService.ts**: Procedural galaxy generation with balanced planet distribution
- **empireService.ts**: Empire management, resource calculations, turn processing
- **planetTechService.ts**: Core planet-tech system, colonization history, specialization levels
- **fleetService.ts**: Fleet creation, movement, and combat mechanics
- **aiService.ts**: AI decision making for non-player empires

### Component Architecture
- **Game Phases**: Setup → Playing → Ended
- **View System**: Galaxy, Research, Diplomacy, Colony, Specialization, Fleets, Victory
- **Side Panels**: Context-sensitive information panels
- **Notifications**: Real-time game events and feedback

## Key Game Mechanics

### Planet-Tech Integration
Located primarily in `planetTechService.ts:39`:
- **initializeColonizationHistory()**: Sets up empire's tech trajectory tracking
- **updateColonizationHistory()**: Records new colonizations with proper weighting
- **calculateSpecializationLevels()**: Determines empire's tech domain strengths
- **unlockColonyTechnologies()**: Grants Tier 2 techs when colonizing planets
- **unlockSurveyTechnologies()**: Grants Tier 1 techs when surveying planets

### Empire Specialization System
The colonization order creates weighted tech domains:
```typescript
// Early colonies have higher impact
const weights = { first: 3.0, second: 2.0, third: 1.5, later: 1.0 }
// Results in unique empire "DNA" based on colonization choices
```

### Galaxy Generation
Balanced procedural generation ensures:
- Each planet type appears in reasonable quantities
- Systems are distributed across galaxy regions
- Special sites and resource-rich systems are placed strategically

## Common Development Tasks

### Adding New Planet Types
1. Update `PlanetType` enum in `game.d.ts:3`
2. Add tech domain mapping in `planetTechService.ts`
3. Update planet generation in `galaxyService.ts`
4. Add visual styling for new planet type

### Modifying Game Balance
Key balance constants in `gameConstants.ts:34`:
- **EMPIRE**: Starting resources, homeworld output, colony costs
- **GALAXY**: System counts, planet distribution
- **COMBAT**: Damage modifiers, experience gains
- **TECH**: Research costs, tier requirements

### Adding New Technologies
1. Define tech in `gameData.ts` TECHNOLOGIES object
2. Set planet type requirements and tier level
3. Add unlock conditions in `planetTechService.ts`
4. Update UI displays in research components

### AI Behavior Modification
AI decision making in `aiService.ts:38`:
- **processAITurn()**: Main AI logic loop
- **Personality System**: Different AI approaches (aggressive, expansionist, etc.)
- **Decision Weights**: Configurable priorities for different actions

## Testing and Quality

### Available Scripts
- `npm run ci`: Full quality pipeline (lint + type-check + test + build)
- `npm run type-check:strict`: Strict TypeScript compilation
- `npm run validate`: Quick validation without build
- `npm run test:coverage`: Test coverage reports

### Code Quality Standards
- **TypeScript Strict Mode**: Enabled with comprehensive error checking
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Automatic code formatting
- **No `any` types**: All data structures fully typed

## Performance Considerations

### State Optimization
- **Selective Updates**: Use Zustand selectors to prevent unnecessary re-renders
- **Large Collections**: Game state handles hundreds of planets and systems efficiently
- **Persistence**: Only essential game state is persisted, UI state is ephemeral

### Memory Management
- **Service Functions**: Pure functions without internal state
- **Component Cleanup**: Proper cleanup of intervals and event listeners
- **Asset Loading**: Lazy loading of non-critical game data