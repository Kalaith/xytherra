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
  AIPersonality,
  Ship,
  ShipDesign
} from '../types/game.d.ts';
import { 
  TECHNOLOGIES, 
  FACTION_BONUSES, 
  PLANET_TRAITS, 
  AI_EMPIRE_TEMPLATES, 
  COMBAT_MODIFIERS, 
  VICTORY_CONDITIONS,
  DEFAULT_SHIP_DESIGNS
} from '../data/gameData';
import { GAME_CONSTANTS } from '../constants/gameConstants';
import { EmpireService } from '../services/empireService';
import { GalaxyGenerationService } from '../services/galaxyService';
import { AIService } from '../services/aiService';
import { FleetService } from '../services/fleetService';

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
    width: GAME_CONSTANTS.GALAXY.DIMENSIONS.MEDIUM,
    height: GAME_CONSTANTS.GALAXY.DIMENSIONS.MEDIUM,
    seed: Math.floor(Math.random() * GAME_CONSTANTS.GALAXY.SEED_MAX)
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
          
          // Process turn for all empires using EmpireService
          Object.keys(newState.empires).forEach(empireId => {
            const empire = newState.empires[empireId];
            if (empire) {
              const result = EmpireService.processTurn(empire, (techId: string) => {
                const tech = TECHNOLOGIES[techId];
                if (tech) {
                  get().addNotification({
                    type: 'success',
                    title: 'Research Complete',
                    message: `${tech.name} research has been completed!`
                  });
                }
              });
              
              newState.empires[empireId] = result.empire;
              
              // Add any notifications from the turn processing
              result.notifications.forEach(notification => {
                get().addNotification(notification);
              });
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
        set((state) => {
          const galaxy = GalaxyGenerationService.generateGalaxyWithDistribution(settings);
          const empires = generateEmpires(settings);
          
          // Assign homeworlds and create starting fleets
          const systemIds = Object.keys(galaxy.systems);
          const availableSystems = [...systemIds];
          
          Object.values(empires).forEach((empire, index) => {
            // Assign random homeworld system
            const randomIndex = Math.floor(Math.random() * availableSystems.length);
            const systemId = availableSystems.splice(randomIndex, 1)[0];
            const system = galaxy.systems[systemId];
            
            if (system && system.planets.length > 0) {
              // Find suitable homeworld planet based on faction
              const factionHomeType = FACTION_BONUSES[empire.faction].homeworld;
              let homeworld = system.planets.find(p => p.type === factionHomeType);
              
              // Fallback to any habitable planet
              if (!homeworld) {
                homeworld = system.planets.find(p => ['water', 'rocky', 'volcanic'].includes(p.type));
              }
              
              // Final fallback to first planet
              if (!homeworld) {
                homeworld = system.planets[0];
              }
              
              if (homeworld) {
                empire.homeworld = homeworld.id;
                
                // Colonize the homeworld using constants
                homeworld.colonizedBy = empire.id;
                homeworld.colony = {
                  id: `colony-${homeworld.id}`,
                  planetId: homeworld.id,
                  empireId: empire.id,
                  population: GAME_CONSTANTS.EMPIRE.HOMEWORLD_POPULATION,
                  buildings: [],
                  resourceOutput: {
                    energy: GAME_CONSTANTS.EMPIRE.HOMEWORLD_OUTPUT.ENERGY,
                    minerals: GAME_CONSTANTS.EMPIRE.HOMEWORLD_OUTPUT.MINERALS,
                    food: GAME_CONSTANTS.EMPIRE.HOMEWORLD_OUTPUT.FOOD,
                    research: GAME_CONSTANTS.EMPIRE.HOMEWORLD_OUTPUT.RESEARCH,
                    alloys: GAME_CONSTANTS.EMPIRE.HOMEWORLD_OUTPUT.ALLOYS,
                    exoticMatter: GAME_CONSTANTS.EMPIRE.HOMEWORLD_OUTPUT.EXOTIC_MATTER
                  },
                  established: 1,
                  developmentLevel: 1
                };
                
                empire.colonies.push(homeworld.id);
                
                // Create starting fleet using FleetService
                const startingFleet = FleetService.createStartingFleet(empire.id, system);
                empire.fleets.push(startingFleet);
                
                // Discover the home system
                system.discoveredBy.push(empire.id);
                
                // Survey all planets in home system
                system.planets.forEach(planet => {
                  if (!planet.surveyedBy.includes(empire.id)) {
                    planet.surveyedBy.push(empire.id);
                  }
                });
              }
            }
          });
          
          return {
            ...state,
            phase: 'playing',
            gameSettings: settings,
            galaxy,
            empires
          };
        });
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
          const empire = state.empires[empireId];
          if (!empire) return state;
          
          // Find the planet and add colony
          Object.values(state.galaxy.systems).forEach(system => {
            const planet = system.planets.find(p => p.id === planetId);
            if (planet && !planet.colonizedBy) {
              // Check if empire can afford colonization
              const cost = EmpireService.calculateColonizationCost(planet, empire);
              const affordability = EmpireService.canAffordCost(empire, cost);
              
              if (!affordability.canAfford) {
                get().addNotification({
                  type: 'error',
                  title: 'Colonization Failed',
                  message: `Insufficient resources: ${affordability.missingResources.join(', ')}`
                });
                return;
              }
              
              // Deduct resources
              const updatedEmpire = EmpireService.deductResources(empire, cost);
              state.empires[empireId] = updatedEmpire;
              
              planet.colonizedBy = empireId;
              planet.colony = {
                id: `colony-${planetId}`,
                planetId,
                empireId,
                population: GAME_CONSTANTS.EMPIRE.COLONY_POPULATION,
                buildings: [],
                resourceOutput: {
                  energy: GAME_CONSTANTS.EMPIRE.COLONY_OUTPUT.ENERGY,
                  minerals: GAME_CONSTANTS.EMPIRE.COLONY_OUTPUT.MINERALS,
                  food: GAME_CONSTANTS.EMPIRE.COLONY_OUTPUT.FOOD,
                  research: GAME_CONSTANTS.EMPIRE.COLONY_OUTPUT.RESEARCH,
                  alloys: GAME_CONSTANTS.EMPIRE.COLONY_OUTPUT.ALLOYS,
                  exoticMatter: GAME_CONSTANTS.EMPIRE.COLONY_OUTPUT.EXOTIC_MATTER
                },
                established: state.turn,
                developmentLevel: 1
              };
              
              // Add to empire's colonies list
              updatedEmpire.colonies.push(planetId);
              
              get().addNotification({
                type: 'success',
                title: 'Colony Established',
                message: `Successfully colonized ${planet.name}!`
              });
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
        const fleetId = `${GAME_CONSTANTS.FLEET.FLEET_ID_PREFIX}${Date.now()}`;
        set((state) => {
          const empire = state.empires[empireId];
          const system = state.galaxy.systems[systemId];
          if (empire && system) {
            const newFleet = FleetService.createFleet(empireId, systemId, system);
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
        
        // Use EmpireService to calculate combat power
        const attackPower = EmpireService.calculateCombatPower(attacker);
        const defensePower = EmpireService.calculateCombatPower(defender);
        
        // Apply combat modifiers from constants
        const attackModifier = COMBAT_MODIFIERS.factionBonuses[attacker.faction]?.attack || 1.0;
        const defenseModifier = COMBAT_MODIFIERS.factionBonuses[defender.faction]?.defense || 1.0;
        
        const finalAttackPower = attackPower * attackModifier;
        const finalDefensePower = defensePower * defenseModifier * GAME_CONSTANTS.COMBAT.PLANETARY_DEFENSE_BONUS;
        
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
            [attackerId]: GAME_CONSTANTS.COMBAT.BASE_EXPERIENCE_GAIN.WINNER,
            [defenderId]: GAME_CONSTANTS.COMBAT.BASE_EXPERIENCE_GAIN.LOSER
          }
        };
        
        // Update combat experience using constants
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
          if (!empire.isPlayer && empire.aiPersonality) {
            // Get AI decisions using AIService
            const decisions = AIService.processAITurn(empire, state);
            
            // Execute AI decisions
            AIService.executeAIDecisions(empire, decisions, state, {
              startResearch: get().startResearch,
              colonizePlanet: get().colonizePlanet,
              createFleet: get().createFleet,
              addNotification: get().addNotification
            });
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
        energy: GAME_CONSTANTS.EMPIRE.STARTING_RESOURCES.ENERGY,
        minerals: GAME_CONSTANTS.EMPIRE.STARTING_RESOURCES.MINERALS,
        food: GAME_CONSTANTS.EMPIRE.STARTING_RESOURCES.FOOD,
        research: GAME_CONSTANTS.EMPIRE.STARTING_RESOURCES.RESEARCH,
        alloys: GAME_CONSTANTS.EMPIRE.STARTING_RESOURCES.ALLOYS,
        exoticMatter: GAME_CONSTANTS.EMPIRE.STARTING_RESOURCES.EXOTIC_MATTER
      },
      resourceIncome: {
        energy: GAME_CONSTANTS.EMPIRE.STARTING_INCOME.ENERGY,
        minerals: GAME_CONSTANTS.EMPIRE.STARTING_INCOME.MINERALS,
        food: GAME_CONSTANTS.EMPIRE.STARTING_INCOME.FOOD,
        research: GAME_CONSTANTS.EMPIRE.STARTING_INCOME.RESEARCH,
        alloys: GAME_CONSTANTS.EMPIRE.STARTING_INCOME.ALLOYS,
        exoticMatter: GAME_CONSTANTS.EMPIRE.STARTING_INCOME.EXOTIC_MATTER
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

function generateEmpireColor(index: number): string {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  return colors[index % colors.length];
}