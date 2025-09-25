import type { 
  Empire, 
  GameState, 
  ResourceType, 
  VictoryCondition,
  CombatResult,
  Planet,
  StarSystem,
  Fleet
} from './game.d.ts';

// Utility types for better type safety
export type EmpireId = string;
export type PlanetId = string;
export type SystemId = string;
export type FleetId = string;
export type TechnologyId = string;

// Strong typing for resource operations
export type ResourceMap = Record<ResourceType, number>;
export type PartialResourceMap = Partial<ResourceMap>;

// Combat system types
export interface CombatContext {
  attacker: Empire;
  defender: Empire;
  location: Planet | StarSystem;
  modifiers: CombatModifiers;
}

export interface CombatModifiers {
  attackBonus: number;
  defenseBonus: number;
  environmentalFactors: number;
}

// Galaxy generation types
export interface GalaxyGenerationConfig {
  size: 'small' | 'medium' | 'large';
  systemCount: number;
  dimensions: { width: number; height: number };
  seed: number;
}

// AI system types
export interface AIDecisionContext {
  empire: Empire;
  gameState: GameState;
  availableActions: AIAction[];
}

export interface AIAction {
  type: 'research' | 'colonize' | 'build_fleet' | 'diplomacy' | 'attack';
  priority: number;
  execute: (context: AIDecisionContext) => void;
}

// Event system types
export interface GameEventContext {
  triggerId: string;
  empireId?: EmpireId;
  planetId?: PlanetId;
  turn: number;
  metadata: Record<string, unknown>;
}

// Victory condition checking
export interface VictoryChecker {
  condition: VictoryCondition;
  threshold: number;
  checkProgress: (empire: Empire, gameState: GameState) => number;
}

// Type guards for runtime safety
export const isValidEmpireId = (id: string, gameState: GameState): id is EmpireId => {
  return id in gameState.empires;
};

export const isValidPlanetId = (id: string, gameState: GameState): id is PlanetId => {
  return Object.values(gameState.galaxy.systems).some(system => 
    system.planets.some(planet => planet.id === id)
  );
};

export const isValidResourceType = (type: string): type is ResourceType => {
  const validTypes: ResourceType[] = ['energy', 'minerals', 'food', 'research', 'alloys', 'exoticMatter'];
  return validTypes.includes(type as ResourceType);
};