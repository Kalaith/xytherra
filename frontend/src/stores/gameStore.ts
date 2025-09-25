import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  GameState, 
  Empire, 
  Galaxy, 
  StarSystem, 
  Planet, 
  UIState,
  GameSettings,
  VictoryCondition,
  Coordinates,
  Fleet,
  GameView,
  SidePanel,
  Notification,
  FactionType,
  ResourceType
} from '../types/game.d.ts';
import { TECHNOLOGIES, FACTION_BONUSES, PLANET_TRAITS } from '../data/gameData';

interface GameStore extends GameState {
  // Game Actions
  nextTurn: () => void;
  startGame: (settings: GameSettings) => void;
  endGame: (winner?: string, victoryType?: VictoryCondition) => void;
  resetGame: () => void;
  
  // Empire Actions
  setPlayerEmpire: (empireId: string) => void;
  updateEmpireResources: (empireId: string, resources: Partial<Record<ResourceType, number>>) => void;
  addTechnology: (empireId: string, techId: string) => void;
  startResearch: (empireId: string, techId: string) => void;
  
  // Planet Actions
  colonizePlanet: (planetId: string, empireId: string) => void;
  surveyPlanet: (planetId: string, empireId: string) => void;
  
  // Fleet Actions
  moveFleet: (fleetId: string, destination: Coordinates) => void;
  createFleet: (empireId: string, systemId: string) => string;
  
  // UI State Management
  uiState: UIState;
  setSelectedPlanet: (planetId?: string) => void;
  setSelectedFleet: (fleetId?: string) => void;
  setCurrentView: (view: GameView) => void;
  setSidePanel: (panel: SidePanel) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

// Initial game state
const createInitialGameState = (): GameState => ({
  turn: 1,
  phase: 'setup',
  galaxy: {
    size: 'medium',
    systems: {},
    width: 100,
    height: 100,
    seed: Math.floor(Math.random() * 1000000)
  },
  empires: {},
  activeEvents: [],
  gameSettings: {
    galaxySize: 'medium',
    difficulty: 'normal',
    numEmpires: 5,
    victoryConditions: ['domination', 'federation', 'techAscendancy']
  },
  playerEmpireId: '',
  isGameOver: false
});

const createInitialUIState = (): UIState => ({
  currentView: 'galaxy',
  sidePanel: 'none',
  notifications: []
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...createInitialGameState(),
      uiState: createInitialUIState(),

      // Game Actions
      nextTurn: () => {
        set((state) => {
          const newState = { ...state };
          newState.turn += 1;
          
          // Process turn for all empires
          Object.keys(newState.empires).forEach(empireId => {
            const empire = newState.empires[empireId];
            if (empire) {
              // Update resources based on income
              Object.keys(empire.resourceIncome).forEach(resourceType => {
                const income = empire.resourceIncome[resourceType as keyof typeof empire.resourceIncome];
                empire.resources[resourceType as keyof typeof empire.resources] += income;
              });
              
              // Process research
              if (empire.currentResearch && empire.researchProgress[empire.currentResearch] !== undefined) {
                empire.researchProgress[empire.currentResearch] += empire.resourceIncome.research || 0;
                
                // Check if research is complete
                const tech = TECHNOLOGIES[empire.currentResearch];
                if (tech && empire.researchProgress[empire.currentResearch] >= tech.cost) {
                  empire.technologies.add(empire.currentResearch);
                  delete empire.researchProgress[empire.currentResearch];
                  empire.currentResearch = undefined;
                  
                  // Add notification for completed research
                  get().addNotification({
                    type: 'success',
                    title: 'Research Complete',
                    message: `${tech.name} research has been completed!`
                  });
                }
              }
            }
          });
          
          return newState;
        });
      },

      startGame: (settings) => {
        set((state) => ({
          ...state,
          phase: 'playing',
          gameSettings: settings,
          galaxy: generateGalaxy(settings),
          empires: generateEmpires(settings)
        }));
      },

      endGame: (winner, victoryType) => {
        set((state) => ({
          ...state,
          phase: 'ended',
          isGameOver: true,
          winner,
          victoryType
        }));
      },

      resetGame: () => {
        set(() => ({
          ...createInitialGameState(),
          uiState: createInitialUIState()
        }));
      },

      // Empire Actions
      setPlayerEmpire: (empireId) => {
        set((state) => ({
          ...state,
          playerEmpireId: empireId
        }));
      },

      updateEmpireResources: (empireId, resources) => {
        set((state) => {
          const empire = state.empires[empireId];
          if (empire) {
            Object.keys(resources).forEach(resourceType => {
              const amount = resources[resourceType as keyof typeof resources];
              if (amount !== undefined) {
                empire.resources[resourceType as keyof typeof empire.resources] += amount;
              }
            });
          }
          return state;
        });
      },

      addTechnology: (empireId, techId) => {
        set((state) => {
          const empire = state.empires[empireId];
          if (empire) {
            empire.technologies.add(techId);
          }
          return state;
        });
      },

      startResearch: (empireId, techId) => {
        set((state) => {
          const empire = state.empires[empireId];
          if (empire) {
            empire.currentResearch = techId;
            empire.researchProgress[techId] = 0;
          }
          return state;
        });
      },

      // Planet Actions
      colonizePlanet: (planetId, empireId) => {
        set((state) => {
          // Find the planet and add colony
          Object.values(state.galaxy.systems).forEach(system => {
            const planet = system.planets.find(p => p.id === planetId);
            if (planet && !planet.colonizedBy) {
              planet.colonizedBy = empireId;
              planet.colony = {
                id: `colony-${planetId}`,
                planetId,
                empireId,
                population: 1,
                buildings: [],
                resourceOutput: {
                  energy: 1,
                  minerals: 1,
                  food: 1,
                  research: 1,
                  alloys: 0,
                  exoticMatter: 0
                },
                established: state.turn,
                developmentLevel: 1
              };
              
              // Add to empire's colonies list
              const empire = state.empires[empireId];
              if (empire) {
                empire.colonies.push(planetId);
              }
            }
          });
          return state;
        });
      },

      surveyPlanet: (planetId, empireId) => {
        set((state) => {
          Object.values(state.galaxy.systems).forEach(system => {
            const planet = system.planets.find(p => p.id === planetId);
            if (planet && !planet.surveyedBy.includes(empireId)) {
              planet.surveyedBy.push(empireId);
            }
          });
          return state;
        });
      },

      // Fleet Actions
      moveFleet: (fleetId, destination) => {
        set((state) => {
          Object.values(state.empires).forEach(empire => {
            const fleet = empire.fleets.find(f => f.id === fleetId);
            if (fleet) {
              fleet.destination = destination;
              fleet.mission = 'explore';
            }
          });
          return state;
        });
      },

      createFleet: (empireId, systemId) => {
        const fleetId = `fleet-${Date.now()}`;
        set((state) => {
          const empire = state.empires[empireId];
          const system = state.galaxy.systems[systemId];
          if (empire && system) {
            const newFleet: Fleet = {
              id: fleetId,
              name: `Fleet ${empire.fleets.length + 1}`,
              empireId,
              ships: [],
              coordinates: system.coordinates,
              mission: 'idle',
              movementPoints: 3
            };
            empire.fleets.push(newFleet);
          }
          return state;
        });
        return fleetId;
      },

      // UI Actions
      setSelectedPlanet: (planetId) => {
        set((state) => ({
          ...state,
          uiState: {
            ...state.uiState,
            selectedPlanet: planetId
          }
        }));
      },

      setSelectedFleet: (fleetId) => {
        set((state) => ({
          ...state,
          uiState: {
            ...state.uiState,
            selectedFleet: fleetId
          }
        }));
      },

      setCurrentView: (view) => {
        set((state) => ({
          ...state,
          uiState: {
            ...state.uiState,
            currentView: view
          }
        }));
      },

      setSidePanel: (panel) => {
        set((state) => ({
          ...state,
          uiState: {
            ...state.uiState,
            sidePanel: panel
          }
        }));
      },

      addNotification: (notification) => {
        set((state) => ({
          ...state,
          uiState: {
            ...state.uiState,
            notifications: [
              ...state.uiState.notifications,
              {
                ...notification,
                id: `notification-${Date.now()}`,
                timestamp: Date.now(),
                read: false
              }
            ]
          }
        }));
      },

      markNotificationRead: (notificationId) => {
        set((state) => ({
          ...state,
          uiState: {
            ...state.uiState,
            notifications: state.uiState.notifications.map(n => 
              n.id === notificationId ? { ...n, read: true } : n
            )
          }
        }));
      },

      clearNotifications: () => {
        set((state) => ({
          ...state,
          uiState: {
            ...state.uiState,
            notifications: []
          }
        }));
      }
    }),
    {
      name: 'xytherra-game-state',
      partialize: (state) => ({
        turn: state.turn,
        phase: state.phase,
        galaxy: state.galaxy,
        empires: state.empires,
        gameSettings: state.gameSettings,
        playerEmpireId: state.playerEmpireId,
        isGameOver: state.isGameOver,
        winner: state.winner,
        victoryType: state.victoryType
      })
    }
  )
);

// Helper functions for game generation
function generateGalaxy(settings: GameSettings): Galaxy {
  const size = settings.galaxySize;
  const dimensions = size === 'small' ? 60 : size === 'medium' ? 100 : 140;
  const numSystems = size === 'small' ? 20 : size === 'medium' ? 35 : 50;
  
  const galaxy: Galaxy = {
    size,
    systems: {},
    width: dimensions,
    height: dimensions,
    seed: Math.floor(Math.random() * 1000000)
  };
  
  // Generate star systems
  for (let i = 0; i < numSystems; i++) {
    const systemId = `system-${i}`;
    const system: StarSystem = {
      id: systemId,
      name: generateSystemName(),
      coordinates: {
        x: Math.random() * dimensions,
        y: Math.random() * dimensions
      },
      planets: generatePlanetsForSystem(systemId),
      discoveredBy: []
    };
    galaxy.systems[systemId] = system;
  }
  
  return galaxy;
}

function generateEmpires(settings: GameSettings): Record<string, Empire> {
  const empires: Record<string, Empire> = {};
  const factionTypes: FactionType[] = ['forge-union', 'oceanic-concord', 'verdant-kin', 'nomad-fleet', 'ashborn-syndicate'];
  
  for (let i = 0; i < settings.numEmpires; i++) {
    const empireId = `empire-${i}`;
    const isPlayer = i === 0; // First empire is player
    const factionType = factionTypes[i % factionTypes.length];
    
    const empire: Empire = {
      id: empireId,
      name: FACTION_BONUSES[factionType].name,
      color: generateEmpireColor(i),
      isPlayer,
      homeworld: '', // Will be set when placing homeworld
      faction: factionType,
      resources: {
        energy: 50,
        minerals: 50,
        food: 20,
        research: 10,
        alloys: 0,
        exoticMatter: 0
      },
      resourceIncome: {
        energy: 5,
        minerals: 5,
        food: 3,
        research: 2,
        alloys: 0,
        exoticMatter: 0
      },
      technologies: new Set(FACTION_BONUSES[factionType].startingTechs),
      researchProgress: {},
      colonies: [],
      fleets: [],
      diplomaticStatus: {},
      victoryProgress: {
        domination: 0,
        federation: 0,
        techAscendancy: 0
      }
    };
    
    empires[empireId] = empire;
  }
  
  return empires;
}

function generatePlanetsForSystem(systemId: string): Planet[] {
  const numPlanets = Math.floor(Math.random() * 4) + 1; // 1-4 planets per system
  const planets: Planet[] = [];
  
  for (let i = 0; i < numPlanets; i++) {
    const planetId = `${systemId}-planet-${i}`;
    const planetTypes = ['water', 'volcanic', 'rocky', 'gas', 'ice', 'living', 'desolate', 'exotic'] as const;
    const weights = [15, 15, 20, 15, 15, 5, 12, 3]; // Weighted probabilities
    
    const planetType = weightedRandomChoice(planetTypes, weights);
    
    const planet: Planet = {
      id: planetId,
      name: generatePlanetName(),
      type: planetType,
      coordinates: { x: 0, y: 0 }, // Relative to system
      size: Math.floor(Math.random() * 5) + 1,
      traits: generatePlanetTraits(),
      systemId,
      surveyedBy: []
    };
    
    planets.push(planet);
  }
  
  return planets;
}

function generatePlanetTraits() {
  const availableTraits = Object.values(PLANET_TRAITS);
  const numTraits = Math.random() < 0.7 ? (Math.random() < 0.3 ? 2 : 1) : 0;
  const selectedTraits: typeof availableTraits = [];
  
  for (let i = 0; i < numTraits; i++) {
    const trait = availableTraits[Math.floor(Math.random() * availableTraits.length)];
    if (!selectedTraits.includes(trait)) {
      selectedTraits.push(trait);
    }
  }
  
  return selectedTraits;
}

function generateSystemName(): string {
  const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Theta', 'Sigma'];
  const suffixes = ['Centauri', 'Prime', 'Major', 'Minor', 'Nova', 'Nebula', 'Reach', 'Gate'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

function generatePlanetName(): string {
  const prefixes = ['Neo', 'Prima', 'Alta', 'Nova', 'Terra', 'Magna', 'Ultima', 'Proxima'];
  const suffixes = ['I', 'II', 'III', 'IV', 'V', 'Prime', 'Major', 'Minor', 'Beta', 'Gamma'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

function generateEmpireColor(index: number): string {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  return colors[index % colors.length];
}

function weightedRandomChoice<T>(items: readonly T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let randomWeight = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    randomWeight -= weights[i];
    if (randomWeight <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1]; // Fallback
}