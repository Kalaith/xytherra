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
  ResourceType,
  CombatResult,
  VictoryProgress,
  AIPersonality
} from '../types/game.d.ts';
import { 
  TECHNOLOGIES, 
  FACTION_BONUSES, 
  PLANET_TRAITS, 
  AI_EMPIRE_TEMPLATES, 
  COMBAT_MODIFIERS, 
  VICTORY_CONDITIONS 
} from '../data/gameData';

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
  
  // Combat System
  resolveCombat: (attackerId: string, defenderId: string, location: string) => CombatResult;
  
  // AI System
  processAITurns: () => void;
  
  // Victory Conditions
  checkVictoryConditions: () => VictoryProgress[];
  
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
                  empire.techsDiscovered += 1;
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
        
        // Process AI turns after state update
        get().processAITurns();
        
        // Check victory conditions
        get().checkVictoryConditions();
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
      },

      // Combat System
      resolveCombat: (attackerId: string, defenderId: string, location: string) => {
        const state = get();
        const attacker = state.empires[attackerId];
        const defender = state.empires[defenderId];
        
        if (!attacker || !defender) {
          // Return a default combat result if empires not found
          return {
            attacker: { empire: attackerId, fleetsLost: 0, shipsLost: 0, damage: 0 },
            defender: { empire: defenderId, fleetsLost: 0, shipsLost: 0, damage: 0 },
            winner: 'draw' as const,
            planetCaptured: false,
            experienceGained: {}
          };
        }
        
        // Simple combat resolution - can be expanded later
        const attackPower = attacker.fleets.reduce((total, fleet) => total + fleet.ships.length * 10, 0);
        const defensePower = defender.fleets.reduce((total, fleet) => total + fleet.ships.length * 10, 0);
        
        // Apply combat modifiers
        const attackModifier = COMBAT_MODIFIERS.factionBonuses[attacker.faction]?.attack || 1.0;
        const defenseModifier = COMBAT_MODIFIERS.factionBonuses[defender.faction]?.defense || 1.0;
        
        const finalAttackPower = attackPower * attackModifier;
        const finalDefensePower = defensePower * defenseModifier * COMBAT_MODIFIERS.planetaryDefense;
        
        const result: CombatResult = {
          attacker: {
            empire: attackerId,
            fleetsLost: 0,
            shipsLost: 0,
            damage: Math.max(0, finalDefensePower - finalAttackPower)
          },
          defender: {
            empire: defenderId,
            fleetsLost: 0,
            shipsLost: 0,
            damage: Math.max(0, finalAttackPower - finalDefensePower)
          },
          winner: finalAttackPower > finalDefensePower ? 'attacker' : 'defender',
          planetCaptured: false,
          experienceGained: {
            [attackerId]: 10,
            [defenderId]: 5
          }
        };
        
        // Update combat experience
        set((state) => ({
          ...state,
          empires: {
            ...state.empires,
            [attackerId]: {
              ...state.empires[attackerId],
              combatExperience: state.empires[attackerId].combatExperience + result.experienceGained[attackerId],
              totalWars: state.empires[attackerId].totalWars + (result.winner === 'attacker' ? 1 : 0)
            },
            [defenderId]: {
              ...state.empires[defenderId],
              combatExperience: state.empires[defenderId].combatExperience + result.experienceGained[defenderId]
            }
          }
        }));
        
        return result;
      },

      // AI System
      processAITurns: () => {
        const state = get();
        
        Object.values(state.empires).forEach(empire => {
          if (!empire.isPlayer) {
            // AI decision making based on personality
            const aiPersonality = empire.aiPersonality;
            
            // Research decisions
            if (!empire.currentResearch && aiPersonality) {
              const availableTechs = Object.keys(TECHNOLOGIES).filter(techId => 
                !empire.technologies.has(techId) && 
                TECHNOLOGIES[techId].prerequisites.every(prereq => empire.technologies.has(prereq))
              );
              
              if (availableTechs.length > 0) {
                let chosenTech: string;
                
                switch (aiPersonality) {
                  case 'aggressive':
                    chosenTech = availableTechs.find(id => TECHNOLOGIES[id].domain === 'weapons') || availableTechs[0];
                    break;
                  case 'defensive':
                    chosenTech = availableTechs.find(id => TECHNOLOGIES[id].domain === 'shields') || availableTechs[0];
                    break;
                  case 'scientific':
                    chosenTech = availableTechs.sort((a, b) => TECHNOLOGIES[b].cost - TECHNOLOGIES[a].cost)[0];
                    break;
                  case 'expansionist':
                    chosenTech = availableTechs.find(id => TECHNOLOGIES[id].domain === 'propulsion') || availableTechs[0];
                    break;
                  default:
                    chosenTech = availableTechs[Math.floor(Math.random() * availableTechs.length)];
                }
                
                get().startResearch(empire.id, chosenTech);
              }
            }
            
            // Expansion decisions
            if (aiPersonality === 'expansionist' || aiPersonality === 'aggressive') {
              // Look for unclaimed planets to colonize
              const systems = Object.values(state.galaxy.systems);
              const uncolonizedPlanets = [];
              
              for (const system of systems) {
                for (const planet of system.planets) {
                  if (!planet.colony && planet.surveyedBy && planet.surveyedBy.length > 0) {
                    uncolonizedPlanets.push(planet);
                  }
                }
              }
              
              if (uncolonizedPlanets.length > 0) {
                const targetPlanet = uncolonizedPlanets[Math.floor(Math.random() * uncolonizedPlanets.length)];
                // AI would attempt to colonize this planet (simplified)
                get().addNotification({
                  type: 'info',
                  title: 'AI Expansion',
                  message: `${empire.name} is expanding to new worlds`
                });
              }
            }
          }
        });
      },

      // Victory Conditions
      checkVictoryConditions: () => {
        const state = get();
        const results: VictoryProgress[] = [];
        
        Object.values(state.empires).forEach(empire => {
          Object.entries(VICTORY_CONDITIONS).forEach(([key, condition]) => {
            const progress = condition.checkFunction(empire, state.galaxy);
            const isCompleted = progress >= condition.threshold;
            
            results.push({
              type: key as VictoryCondition,
              progress: Math.min(progress, 1.0),
              description: `${empire.name}: ${condition.description}`,
              requirements: [`Reach ${Math.round(condition.threshold * 100)}% completion`],
              completed: isCompleted
            });
            
            // Check for victory
            if (isCompleted && !state.isGameOver) {
              get().endGame(empire.name, key as VictoryCondition);
              get().addNotification({
                type: 'success',
                title: 'Victory Achieved!',
                message: `${empire.name} has achieved ${condition.name}!`
              });
            }
          });
        });
        
        return results;
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
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert technologies arrays back to Sets after rehydration
          Object.keys(state.empires).forEach(empireId => {
            const empire = state.empires[empireId];
            if (empire.technologies && Array.isArray(empire.technologies)) {
              empire.technologies = new Set(empire.technologies);
            } else if (!empire.technologies) {
              empire.technologies = new Set();
            }
          });
        }
      }
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

// AI Helper Functions
function getRandomAIPersonality(): AIPersonality {
  const personalities: AIPersonality[] = ['aggressive', 'expansionist', 'defensive', 'diplomatic', 'economic', 'scientific'];
  return personalities[Math.floor(Math.random() * personalities.length)];
}

function getAIName(personality: AIPersonality, faction: FactionType): string {
  const template = AI_EMPIRE_TEMPLATES.find(t => t.personality === personality && t.faction === faction);
  if (template) {
    return template.name;
  }
  
  // Fallback to random template
  const randomTemplate = AI_EMPIRE_TEMPLATES[Math.floor(Math.random() * AI_EMPIRE_TEMPLATES.length)];
  return randomTemplate.name;
}

function generateEmpires(settings: GameSettings): Record<string, Empire> {
  const empires: Record<string, Empire> = {};
  const factionTypes: FactionType[] = ['forge-union', 'oceanic-concord', 'verdant-kin', 'nomad-fleet', 'ashborn-syndicate'];
  
  for (let i = 0; i < settings.numEmpires; i++) {
    const empireId = `empire-${i}`;
    const isPlayer = i === 0; // First empire is player
    const factionType = factionTypes[i % factionTypes.length];
    const aiPersonality = !isPlayer ? getRandomAIPersonality() : undefined;
    
    const empire: Empire = {
      id: empireId,
      name: isPlayer ? FACTION_BONUSES[factionType].name : getAIName(aiPersonality!, factionType),
      color: generateEmpireColor(i),
      isPlayer,
      aiPersonality,
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
      },
      combatExperience: 0,
      totalWars: 0,
      planetsConquered: 0,
      techsDiscovered: 0
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