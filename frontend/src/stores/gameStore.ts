
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  Empire,
  UIState,
  GameSettings,
  VictoryCondition,
  Coordinates,
  GameView,
  SidePanel,
  Notification,
  FactionType,
  ResourceType,
  CombatResult,
  VictoryProgress,
  AIPersonality,
} from '../types/game.d.ts';
import {
  TECHNOLOGIES,
  factionBonuses,
  aiEmpireTemplates,
  combatModifiers,
  victoryConditions,
} from '../data/gameData';
import { gameConstants } from '../constants/gameConstants';

import { EmpireService } from '../services/empireService';
import { GalaxyGenerationService } from '../services/galaxyService';
import { AIService } from '../services/aiService';
import { FleetService } from '../services/fleetService';
import { PlanetTechService } from '../services/planetTechService';
import { ensureGalaxyHasHyperlanes } from '../services/hyperlaneService';

const maxCombatLogEntries = 25;

interface GameStore extends GameState {
  // Game Actions
  nextTurn: () => void;
  startGame: (settings: GameSettings) => void;
  endGame: (winner?: string, victoryType?: VictoryCondition) => void;
  resetGame: () => void;

  // Galaxy Actions
  generateHyperlanes: () => void; // New function to generate hyperlanes for existing saves

  // Empire Actions
  setPlayerEmpire: (empireId: string) => void;
  updateEmpireResources: (
    empireId: string,
    resources: Partial<Record<ResourceType, number>>
  ) => void;
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
  addCombatResult: (result: CombatResult) => void;
  clearCombatLog: () => void;
}

// Initial game state
const createInitialGameState = (): GameState => ({
  turn: 1,
  phase: 'setup',
  galaxy: {
    size: 'medium',
    systems: {},
    hyperlanes: {},
    width: gameConstants.GALAXY.DIMENSIONS.MEDIUM,
    height: gameConstants.GALAXY.DIMENSIONS.MEDIUM,
    seed: Math.floor(Math.random() * gameConstants.GALAXY.SEED_MAX),
  },
  empires: {},
  activeEvents: [],
  gameSettings: {
    galaxySize: 'medium',
    difficulty: 'normal',
    numEmpires: 5,
    victoryConditions: ['domination', 'federation', 'techAscendancy'],
  },
  playerEmpireId: '',
  isGameOver: false,
});

const createInitialUIState = (): UIState => ({
  currentView: 'galaxy',
  sidePanel: 'none',
  notifications: [],
  combatLog: [],
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...createInitialGameState(),
      uiState: createInitialUIState(),

      // Game Actions
      nextTurn: () => {
        set(state => {
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
                    message: `${tech.name} research has been completed!`,
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

      startGame: settings => {
        set(state => {
          const galaxy = GalaxyGenerationService.generateGalaxyWithDistribution(settings);
          const empires = generateEmpires(settings);

          // Assign homeworlds and create starting fleets
          const systemIds = Object.keys(galaxy.systems);
          const availableSystems = [...systemIds];

          Object.values(empires).forEach((empire, _index) => {
            // Assign random homeworld system
            const randomIndex = Math.floor(Math.random() * availableSystems.length);
            const systemId = availableSystems.splice(randomIndex, 1)[0];
            const system = galaxy.systems[systemId];

            if (system && system.planets.length > 0) {
              // Find suitable homeworld planet based on faction
              const factionHomeType = factionBonuses[empire.faction].homeworld;
              let homeworld = system.planets.find(p => p.type === factionHomeType);

              // Fallback to any habitable planet
              if (!homeworld) {
                homeworld = system.planets.find(p =>
                  ['water', 'rocky', 'volcanic'].includes(p.type)
                );
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
                  population: gameConstants.EMPIRE.HOMEWORLD_POPULATION,
                  buildings: [],
                  resourceOutput: {
                    energy: gameConstants.EMPIRE.HOMEWORLD_OUTPUT.ENERGY,
                    minerals: gameConstants.EMPIRE.HOMEWORLD_OUTPUT.MINERALS,
                    food: gameConstants.EMPIRE.HOMEWORLD_OUTPUT.FOOD,
                    research: gameConstants.EMPIRE.HOMEWORLD_OUTPUT.RESEARCH,
                    alloys: gameConstants.EMPIRE.HOMEWORLD_OUTPUT.ALLOYS,
                    exoticMatter: gameConstants.EMPIRE.HOMEWORLD_OUTPUT.EXOTIC_MATTER,
                  },
                  established: 1,
                  developmentLevel: 1,
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
            empires,
          };
        });
      },

      endGame: (winner, victoryType) => {
        set(state => ({
          ...state,
          phase: 'ended',
          isGameOver: true,
          winner,
          victoryType,
        }));
      },

      resetGame: () => {
        set(() => ({
          ...createInitialGameState(),
          uiState: createInitialUIState(),
        }));
      },

      // Galaxy Actions
      generateHyperlanes: () => {
        set(state => {
          const updatedGalaxy = ensureGalaxyHasHyperlanes(state.galaxy);
          get().addNotification({
            type: 'info',
            title: 'Hyperlanes Generated',
            message: `Generated ${Object.keys(updatedGalaxy.hyperlanes).length} hyperlane connections between star systems.`,
          });
          return {
            ...state,
            galaxy: updatedGalaxy,
          };
        });
      },

      // Empire Actions
      setPlayerEmpire: empireId => {
        set(state => ({
          ...state,
          playerEmpireId: empireId,
        }));
      },

      updateEmpireResources: (empireId, resources) => {
        set(state => {
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
        set(state => {
          const empire = state.empires[empireId];
          if (empire) {
            empire.technologies.add(techId);
          }
          return state;
        });
      },

      startResearch: (empireId, techId) => {
        set(state => {
          const empire = state.empires[empireId];
          if (!empire) return state;

          // NEW: Validate technology research eligibility using planet-tech system
          const validationResult = validateTechResearch(empire, techId, state);

          if (!validationResult.canResearch) {
            get().addNotification({
              type: 'error',
              title: 'Research Not Available',
              message: validationResult.reason || 'Cannot research this technology',
            });
            return state;
          }

          // Start the research
          empire.currentResearch = techId;
          empire.researchProgress[techId] = 0;

          const tech = TECHNOLOGIES[techId];
          if (tech) {
            get().addNotification({
              type: 'info',
              title: 'Research Started',
              message: `Now researching ${tech.name}`,
            });
          }

          return state;
        });
      },

      // Planet Actions
      colonizePlanet: (planetId, empireId) => {
        set(state => {
          const empire = state.empires[empireId];
          if (!empire) {
            console.error('Empire not found:', empireId);
            return state;
          }

          console.log('Attempting to colonize planet:', planetId, 'by empire:', empireId);

          // Find the planet and add colony
          let planetFound = false;
          let targetPlanet = null;

          // First, find the planet
          for (const system of Object.values(state.galaxy.systems)) {
            const planet = system.planets.find(p => p.id === planetId);
            if (planet) {
              planetFound = true;
              targetPlanet = planet;
              break;
            }
          }

          if (!planetFound) {
            console.error('Planet not found:', planetId);
            get().addNotification({
              type: 'error',
              title: 'Colonization Failed',
              message: 'Planet not found.',
            });
            return state;
          }

          console.log(
            'Found planet:',
            targetPlanet!.name,
            'colonized by:',
            targetPlanet!.colonizedBy
          );

          // Check if planet is surveyed first
          if (!targetPlanet!.surveyedBy.includes(empireId)) {
            console.log('Planet not surveyed by empire:', empireId);
            get().addNotification({
              type: 'warning',
              title: 'Colonization Failed',
              message: `${targetPlanet!.name} must be surveyed before colonization.`,
            });
            return state;
          }

          if (targetPlanet!.colonizedBy) {
            console.log('Planet already colonized by:', targetPlanet!.colonizedBy);
            get().addNotification({
              type: 'warning',
              title: 'Colonization Failed',
              message: `${targetPlanet!.name} is already colonized.`,
            });
            return state;
          }

          try {
            // Check if empire can afford colonization
            const cost = EmpireService.calculateColonizationCost(targetPlanet!, empire);
            console.log('Colonization cost:', cost);

            const affordability = EmpireService.canAffordCost(empire, cost);
            console.log('Can afford:', affordability);

            if (!affordability.canAfford) {
              get().addNotification({
                type: 'error',
                title: 'Colonization Failed',
                message: `Insufficient resources: ${affordability.missingResources.join(', ')}`,
              });
              return state;
            }

            // Deduct resources
            const updatedEmpire = EmpireService.deductResources(empire, cost);
            state.empires[empireId] = updatedEmpire;

            // Set up basic colony
            targetPlanet!.colonizedBy = empireId;
            targetPlanet!.colony = {
              id: `colony-${planetId}`,
              planetId,
              empireId,
              population: gameConstants.EMPIRE.COLONY_POPULATION,
              buildings: [],
              resourceOutput: {
                energy: gameConstants.EMPIRE.COLONY_OUTPUT.ENERGY,
                minerals: gameConstants.EMPIRE.COLONY_OUTPUT.MINERALS,
                food: gameConstants.EMPIRE.COLONY_OUTPUT.FOOD,
                research: gameConstants.EMPIRE.COLONY_OUTPUT.RESEARCH,
                alloys: gameConstants.EMPIRE.COLONY_OUTPUT.ALLOYS,
                exoticMatter: gameConstants.EMPIRE.COLONY_OUTPUT.EXOTIC_MATTER,
              },
              established: state.turn,
              developmentLevel: 1,
            };

            // Add to empire's colonies list
            updatedEmpire.colonies.push(planetId);

            console.log('Basic colony setup complete, starting planet-tech integration...');

            // NEW: Planet-Tech System Integration (simplified for debugging)
            try {
              // 1. Initialize colonization history if needed
              if (!updatedEmpire.colonizationHistory) {
                updatedEmpire.colonizationHistory =
                  PlanetTechService.initializeColonizationHistory();
              }

              // 2. Update colonization history and calculate new weights
              const updatedHistory = PlanetTechService.updateColonizationHistory(
                updatedEmpire,
                targetPlanet!,
                state.turn
              );
              updatedEmpire.colonizationHistory = updatedHistory;
              console.log('Updated colonization history:', updatedHistory);

              // 3. Update empire tech domain weights
              updatedEmpire.techDomainWeights = updatedHistory.weights;
              console.log('Updated tech domain weights:', updatedEmpire.techDomainWeights);

              // 4. Calculate specialization levels
              updatedEmpire.specializationLevel = PlanetTechService.calculateSpecializationLevels(
                updatedHistory.weights
              );
              console.log('Updated specialization levels:', updatedEmpire.specializationLevel);

              // 5. Initialize planet mastery tracking if needed
              if (!updatedEmpire.planetMasteries) {
                updatedEmpire.planetMasteries = {};
              }
              updatedEmpire.planetMasteries[planetId] =
                PlanetTechService.initializePlanetMastery(planetId);

              // 6. Unlock Tier 2 technologies through colonization
              const colonyTechResult = PlanetTechService.unlockColonyTechnologies(
                targetPlanet!,
                empireId
              );
              console.log('Colony tech result:', colonyTechResult);

              colonyTechResult.unlockedTechs.forEach(techId => {
                updatedEmpire.technologies.add(techId);
                updatedEmpire.techsDiscovered += 1;
              });

              // Add notifications for unlocked technologies
              colonyTechResult.notifications.forEach(message => {
                get().addNotification({
                  type: 'success',
                  title: 'Technology Unlocked',
                  message,
                });
              });

              get().addNotification({
                type: 'success',
                title: 'Colony Established',
                message: `Successfully colonized ${targetPlanet!.name}! ${colonyTechResult.unlockedTechs.length} technologies unlocked.`,
              });

              // 7. Generate empire identity update notification
              try {
                const identityDescription =
                  PlanetTechService.getEmpireIdentityDescription(updatedEmpire);
                get().addNotification({
                  type: 'info',
                  title: 'Empire Specialization Updated',
                  message: `${updatedEmpire.name} specialization: ${identityDescription}`,
                });
              } catch (identityError) {
                console.error('Error generating empire identity:', identityError);
              }
            } catch (planetTechError) {
              console.error('Error in planet-tech integration:', planetTechError);
              get().addNotification({
                type: 'warning',
                title: 'Colony Established',
                message: `Successfully colonized ${targetPlanet!.name}! (Some specialization features may be unavailable)`,
              });
            }

            // Update planets conquered counter
            updatedEmpire.planetsConquered += 1;
            console.log('Colonization completed successfully');
          } catch (error) {
            console.error('Error during colonization:', error);
            get().addNotification({
              type: 'error',
              title: 'Colonization Error',
              message: 'An error occurred while establishing the colony. Please try again.',
            });
          }

          return state;
        });
      },

      surveyPlanet: (planetId, empireId) => {
        set(state => {
          const empire = state.empires[empireId];
          if (!empire) return state;

          Object.values(state.galaxy.systems).forEach(system => {
            const planet = system.planets.find(p => p.id === planetId);
            if (planet && !planet.surveyedBy.includes(empireId)) {
              // Add empire to surveyed list
              planet.surveyedBy.push(empireId);

              // NEW: Unlock Tier 1 technologies through survey
              const surveyResult = PlanetTechService.unlockSurveyTechnologies(planet, empireId);

              // Add unlocked technologies to empire
              surveyResult.unlockedTechs.forEach(techId => {
                empire.technologies.add(techId);
                empire.techsDiscovered += 1;
              });

              // Add notifications for discoveries
              surveyResult.notifications.forEach(message => {
                get().addNotification({
                  type: 'info',
                  title: 'Technology Discovered',
                  message,
                });
              });

              if (surveyResult.unlockedTechs.length > 0) {
                get().addNotification({
                  type: 'success',
                  title: 'Planetary Survey Complete',
                  message: `Survey of ${planet.name} revealed ${surveyResult.unlockedTechs.length} new technologies!`,
                });
              }
            }
          });
          return state;
        });
      },

      // Fleet Actions
      moveFleet: (fleetId, destination) => {
        set(state => {
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
        const fleetId = `${gameConstants.FLEET.FLEET_ID_PREFIX}${Date.now()}`;
        set(state => {
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
      setSelectedPlanet: planetId => {
        set(state => ({
          ...state,
          uiState: {
            ...state.uiState,
            selectedPlanet: planetId,
          },
        }));
      },

      setSelectedFleet: fleetId => {
        set(state => ({
          ...state,
          uiState: {
            ...state.uiState,
            selectedFleet: fleetId,
          },
        }));
      },

      setCurrentView: view => {
        set(state => ({
          ...state,
          uiState: {
            ...state.uiState,
            currentView: view,
          },
        }));
      },

      setSidePanel: panel => {
        set(state => ({
          ...state,
          uiState: {
            ...state.uiState,
            sidePanel: panel,
          },
        }));
      },

      addNotification: notification => {
        set(state => ({
          ...state,
          uiState: {
            ...state.uiState,
            notifications: [
              ...state.uiState.notifications,
              {
                ...notification,
                id: `notification-${Date.now()}`,
                timestamp: Date.now(),
                read: false,
              },
            ],
          },
        }));
      },

      markNotificationRead: notificationId => {
        set(state => ({
          ...state,
          uiState: {
            ...state.uiState,
            notifications: state.uiState.notifications.map(n =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
          },
        }));
      },

      clearNotifications: () => {
        set(state => ({
          ...state,
          uiState: {
            ...state.uiState,
            notifications: [],
          },
        }));
      },

      addCombatResult: result => {
        set(state => {
          const currentLog = state.uiState.combatLog ?? [];
          const nextLog = [result, ...currentLog].slice(0, maxCombatLogEntries);
          return {
            ...state,
            uiState: {
              ...state.uiState,
              combatLog: nextLog,
            },
          };
        });
      },

      clearCombatLog: () => {
        set(state => ({
          ...state,
          uiState: {
            ...state.uiState,
            combatLog: [],
          },
        }));
      },

      // Combat System
      resolveCombat: (attackerId: string, defenderId: string, _location: string) => {
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
            experienceGained: {},
          };
        }

        // Use EmpireService to calculate combat power
        const attackPower = EmpireService.calculateCombatPower(attacker);
        const defensePower = EmpireService.calculateCombatPower(defender);

        // Apply combat modifiers from constants
        const attackModifier = combatModifiers.factionBonuses[attacker.faction]?.attack || 1.0;
        const defenseModifier = combatModifiers.factionBonuses[defender.faction]?.defense || 1.0;

        const finalAttackPower = attackPower * attackModifier;
        const finalDefensePower =
          defensePower * defenseModifier * gameConstants.COMBAT.PLANETARY_DEFENSE_BONUS;

        const result: CombatResult = {
          attacker: {
            empire: attackerId,
            fleetsLost: 0,
            shipsLost: 0,
            damage: Math.max(0, finalDefensePower - finalAttackPower),
          },
          defender: {
            empire: defenderId,
            fleetsLost: 0,
            shipsLost: 0,
            damage: Math.max(0, finalAttackPower - finalDefensePower),
          },
          winner: finalAttackPower > finalDefensePower ? 'attacker' : 'defender',
          planetCaptured: false,
          experienceGained: {
            [attackerId]: gameConstants.COMBAT.BASE_EXPERIENCE_GAIN.WINNER,
            [defenderId]: gameConstants.COMBAT.BASE_EXPERIENCE_GAIN.LOSER,
          },
        };

        // Update combat experience using constants
        set(state => ({
          ...state,
          empires: {
            ...state.empires,
            [attackerId]: {
              ...state.empires[attackerId],
              combatExperience:
                state.empires[attackerId].combatExperience + result.experienceGained[attackerId],
              totalWars:
                state.empires[attackerId].totalWars + (result.winner === 'attacker' ? 1 : 0),
            },
            [defenderId]: {
              ...state.empires[defenderId],
              combatExperience:
                state.empires[defenderId].combatExperience + result.experienceGained[defenderId],
            },
          },
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
              addNotification: get().addNotification,
            });
          }
        });
      },

      // Victory Conditions
      checkVictoryConditions: () => {
        const state = get();
        const results: VictoryProgress[] = [];

        Object.values(state.empires).forEach(empire => {
          Object.entries(victoryConditions).forEach(([key, condition]) => {
            let progress: number;
            if (key === 'technology') {
              progress = (
                condition as (typeof victoryConditions)['technology']
              ).checkFunction(empire, { TECHNOLOGIES });
            } else if (key === 'diplomatic') {
              progress = (
                condition as (typeof victoryConditions)['diplomatic']
              ).checkFunction(empire, state.empires);
            } else {
              progress = (
                condition as
                  | (typeof victoryConditions)['domination']
                  | (typeof victoryConditions)['economic']
              ).checkFunction(empire, state.galaxy);
            }
            const isCompleted = progress >= condition.threshold;

            results.push({
              type: key as VictoryCondition,
              progress: Math.min(progress, 1.0),
              description: `${empire.name}: ${condition.description}`,
              requirements: [`Reach ${Math.round(condition.threshold * 100)}% completion`],
              completed: isCompleted,
            });

            // Check for victory
            if (isCompleted && !state.isGameOver) {
              get().endGame(empire.name, key as VictoryCondition);
              get().addNotification({
                type: 'success',
                title: 'Victory Achieved!',
                message: `${empire.name} has achieved ${condition.name}!`,
              });
            }
          });
        });

        return results;
      },
    }),
    {
      name: 'xytherra-game-state',
      partialize: state => ({
        turn: state.turn,
        phase: state.phase,
        galaxy: state.galaxy,
        empires: state.empires,
        gameSettings: state.gameSettings,
        playerEmpireId: state.playerEmpireId,
        isGameOver: state.isGameOver,
        winner: state.winner,
        victoryType: state.victoryType,
      }),
      onRehydrateStorage: () => state => {
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

          // Ensure galaxy has hyperlanes - fix for existing saves without hyperlanes
          state.galaxy = ensureGalaxyHasHyperlanes(state.galaxy);
        }
      },
    }
  )
);

// Helper function to validate technology research
function validateTechResearch(
  empire: Empire,
  techId: string,
  gameState: GameState
): {
  canResearch: boolean;
  reason?: string;
} {
  const tech = TECHNOLOGIES[techId];
  if (!tech) {
    return { canResearch: false, reason: 'Technology not found' };
  }

  // Check if already researched
  if (empire.technologies.has(techId)) {
    return { canResearch: false, reason: 'Technology already researched' };
  }

  // Check prerequisites
  const missingPrereqs = tech.prerequisites.filter(prereq => !empire.technologies.has(prereq));
  if (missingPrereqs.length > 0) {
    const prereqNames = missingPrereqs.map(id => TECHNOLOGIES[id]?.name || id).join(', ');
    return {
      canResearch: false,
      reason: `Missing prerequisites: ${prereqNames}`,
    };
  }

  // Check planet requirements for hybrid technologies
  if (tech.isHybrid && tech.requiredPlanetTypes) {
    const controlledPlanetTypes = new Set<string>();

    // Get planet types of all colonies
    empire.colonies.forEach(colonyId => {
      Object.values(gameState.galaxy.systems).forEach(system => {
        const planet = system.planets.find(p => p.id === colonyId);
        if (planet) {
          controlledPlanetTypes.add(planet.type);
        }
      });
    });

    const missingPlanetTypes = tech.requiredPlanetTypes.filter(planetType => {
      return !controlledPlanetTypes.has(planetType);
    });

    if (missingPlanetTypes.length > 0) {
      return {
        canResearch: false,
        reason: `Requires colonies on: ${missingPlanetTypes.join(', ')} worlds`,
      };
    }
  }

  // Check single planet requirement for regular technologies
  if (!tech.isHybrid) {
    const hasRequiredPlanetType = empire.colonies.some(colonyId => {
      let found = false;
      Object.values(gameState.galaxy.systems).forEach(system => {
        const planet = system.planets.find(p => p.id === colonyId);
        if (planet && planet.type === tech.requiredPlanetType) {
          found = true;
        }
      });
      return found;
    });

    if (!hasRequiredPlanetType) {
      return {
        canResearch: false,
        reason: `Requires a colony on a ${tech.requiredPlanetType} world`,
      };
    }
  }

  return { canResearch: true };
}

// Helper functions for game generation

// AI Helper Functions
function getRandomAIPersonality(): AIPersonality {
  const personalities: AIPersonality[] = [
    'aggressive',
    'expansionist',
    'defensive',
    'diplomatic',
    'economic',
    'scientific',
  ];
  return personalities[Math.floor(Math.random() * personalities.length)];
}

function getAIName(personality: AIPersonality, faction: FactionType): string {
  const template = aiEmpireTemplates.find(
    t => t.personality === personality && t.faction === faction
  );
  if (template) {
    return template.name;
  }

  // Fallback to random template
  const randomTemplate = aiEmpireTemplates[Math.floor(Math.random() * aiEmpireTemplates.length)];
  return randomTemplate.name;
}

function generateEmpires(settings: GameSettings): Record<string, Empire> {
  const empires: Record<string, Empire> = {};
  const factionTypes: FactionType[] = [
    'forge-union',
    'oceanic-concord',
    'verdant-kin',
    'nomad-fleet',
    'ashborn-syndicate',
  ];

  for (let i = 0; i < settings.numEmpires; i++) {
    const empireId = `empire-${i}`;
    const isPlayer = i === 0; // First empire is player
    const factionType = factionTypes[i % factionTypes.length];
    const aiPersonality = !isPlayer ? getRandomAIPersonality() : undefined;

    const empire: Empire = {
      id: empireId,
      name: isPlayer ? factionBonuses[factionType].name : getAIName(aiPersonality!, factionType),
      color: generateEmpireColor(i),
      isPlayer,
      aiPersonality,
      homeworld: '', // Will be set when placing homeworld
      faction: factionType,
      resources: {
        energy: gameConstants.EMPIRE.STARTING_RESOURCES.ENERGY,
        minerals: gameConstants.EMPIRE.STARTING_RESOURCES.MINERALS,
        food: gameConstants.EMPIRE.STARTING_RESOURCES.FOOD,
        research: gameConstants.EMPIRE.STARTING_RESOURCES.RESEARCH,
        alloys: gameConstants.EMPIRE.STARTING_RESOURCES.ALLOYS,
        exoticMatter: gameConstants.EMPIRE.STARTING_RESOURCES.EXOTIC_MATTER,
      },
      resourceIncome: {
        energy: gameConstants.EMPIRE.STARTING_INCOME.ENERGY,
        minerals: gameConstants.EMPIRE.STARTING_INCOME.MINERALS,
        food: gameConstants.EMPIRE.STARTING_INCOME.FOOD,
        research: gameConstants.EMPIRE.STARTING_INCOME.RESEARCH,
        alloys: gameConstants.EMPIRE.STARTING_INCOME.ALLOYS,
        exoticMatter: gameConstants.EMPIRE.STARTING_INCOME.EXOTIC_MATTER,
      },
      technologies: new Set(factionBonuses[factionType].startingTechs),
      researchProgress: {},
      colonies: [],
      fleets: [],
      diplomaticStatus: {},
      victoryProgress: {
        domination: 0,
        federation: 0,
        techAscendancy: 0,
      },
      combatExperience: 0,
      totalWars: 0,
      planetsConquered: 0,
      techsDiscovered: 0,
      // Planet-Tech System additions
      colonizationHistory: PlanetTechService.initializeColonizationHistory(),
      techDomainWeights: PlanetTechService.initializeTechDomainWeights(),
      specializationLevel: PlanetTechService.initializeSpecializationLevels(),
      planetMasteries: {},
    };

    empires[empireId] = empire;
  }

  return empires;
}

function generateEmpireColor(index: number): string {
  const colors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
  ];
  return colors[index % colors.length];
}
