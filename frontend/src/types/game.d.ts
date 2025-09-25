// Core game types for Xytherra 4X strategy game

export type PlanetType = 
  | 'water' 
  | 'volcanic' 
  | 'rocky' 
  | 'gas' 
  | 'ice' 
  | 'living' 
  | 'desolate' 
  | 'exotic';

export type TechDomain = 
  | 'shields' 
  | 'weapons' 
  | 'industry' 
  | 'propulsion' 
  | 'sensors' 
  | 'biotech' 
  | 'survival' 
  | 'experimental';

export type ResourceType = 
  | 'energy' 
  | 'minerals' 
  | 'food' 
  | 'research' 
  | 'alloys' 
  | 'exoticMatter';

export type VictoryCondition = 
  | 'domination' 
  | 'federation' 
  | 'techAscendancy';

export interface Coordinates {
  x: number;
  y: number;
}

export interface Planet {
  id: string;
  name: string;
  type: PlanetType;
  coordinates: Coordinates;
  size: number; // 1-5, affects resource output
  traits: PlanetTrait[];
  colonizedBy?: string; // Empire ID
  colony?: Colony;
  systemId: string;
  surveyedBy: string[]; // Empire IDs that have surveyed this planet
}

export interface PlanetTrait {
  id: string;
  name: string;
  description: string;
  effects: Record<string, number>; // e.g., { 'energy': 1.5, 'research': 0.8 }
}

export interface StarSystem {
  id: string;
  name: string;
  coordinates: Coordinates;
  planets: Planet[];
  controlledBy?: string; // Empire ID
  discoveredBy: string[]; // Empire IDs that have discovered this system
}

export interface Colony {
  id: string;
  planetId: string;
  empireId: string;
  population: number;
  buildings: Building[];
  resourceOutput: Record<ResourceType, number>;
  established: number; // Turn number
  developmentLevel: number; // 0-10
}

export interface Building {
  id: string;
  type: string;
  name: string;
  description: string;
  cost: Record<ResourceType, number>;
  upkeep: Record<ResourceType, number>;
  effects: Record<string, number>;
  prerequisites: string[]; // Technology IDs
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  domain: TechDomain;
  tier: 1 | 2 | 3; // Survey, Colony, Mastery
  requiredPlanetType: PlanetType;
  prerequisites: string[]; // Other tech IDs
  cost: number; // Research points
  effects: Record<string, number>;
  unlocks: string[]; // Building/ship component IDs
  isHybrid: boolean;
  requiredPlanetTypes?: PlanetType[]; // For hybrid techs
}

export interface Empire {
  id: string;
  name: string;
  color: string;
  isPlayer: boolean;
  homeworld: string; // Planet ID
  faction: FactionType;
  resources: Record<ResourceType, number>;
  resourceIncome: Record<ResourceType, number>;
  technologies: Set<string>; // Technology IDs
  researchProgress: Record<string, number>; // Tech ID -> Progress
  currentResearch?: string; // Technology ID
  colonies: string[]; // Planet IDs
  fleets: Fleet[];
  diplomaticStatus: Record<string, DiplomaticRelation>; // Empire ID -> Relation
  victoryProgress: Record<VictoryCondition, number>;
}

export interface Fleet {
  id: string;
  name: string;
  empireId: string;
  ships: Ship[];
  coordinates: Coordinates;
  destination?: Coordinates;
  mission: FleetMission;
  movementPoints: number;
}

export interface Ship {
  id: string;
  design: ShipDesign;
  health: number;
  experience: number;
}

export interface ShipDesign {
  id: string;
  name: string;
  hull: string;
  components: ShipComponent[];
  cost: Record<ResourceType, number>;
  stats: ShipStats;
}

export interface ShipComponent {
  id: string;
  name: string;
  type: 'weapon' | 'defense' | 'utility' | 'propulsion';
  effects: Record<string, number>;
  requiredTech: string;
}

export interface ShipStats {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  range: number;
}

export type FleetMission = 
  | 'idle' 
  | 'explore' 
  | 'colonize' 
  | 'attack' 
  | 'defend' 
  | 'patrol';

export type DiplomaticRelation = 
  | 'war' 
  | 'hostile' 
  | 'neutral' 
  | 'friendly' 
  | 'allied' 
  | 'federated';

export type FactionType = 
  | 'forge-union' 
  | 'oceanic-concord' 
  | 'verdant-kin' 
  | 'nomad-fleet' 
  | 'ashborn-syndicate';

export interface GameState {
  turn: number;
  phase: GamePhase;
  galaxy: Galaxy;
  empires: Record<string, Empire>;
  activeEvents: GameEvent[];
  gameSettings: GameSettings;
  playerEmpireId: string;
  isGameOver: boolean;
  winner?: string;
  victoryType?: VictoryCondition;
}

export interface Galaxy {
  size: 'small' | 'medium' | 'large';
  systems: Record<string, StarSystem>;
  width: number;
  height: number;
  seed: number;
}

export type GamePhase = 
  | 'setup' 
  | 'playing' 
  | 'ended';

export interface GameEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  turn: number;
  empireId?: string;
  planetId?: string;
  choices?: EventChoice[];
}

export interface EventChoice {
  id: string;
  text: string;
  effects: Record<string, number>;
}

export interface GameSettings {
  galaxySize: 'small' | 'medium' | 'large';
  difficulty: 'easy' | 'normal' | 'hard';
  numEmpires: number;
  victoryConditions: VictoryCondition[];
  turnTimer?: number; // seconds per turn
}

// UI State Types
export interface UIState {
  selectedPlanet?: string;
  selectedFleet?: string;
  selectedEmpire?: string;
  currentView: GameView;
  sidePanel: SidePanel;
  notifications: Notification[];
  tutorialStep?: number;
}

export type GameView = 
  | 'galaxy' 
  | 'colony' 
  | 'research' 
  | 'diplomacy' 
  | 'fleets' 
  | 'victory';

export type SidePanel = 
  | 'none' 
  | 'planet-info' 
  | 'colony-management' 
  | 'fleet-details' 
  | 'research-tree' 
  | 'empire-overview';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  id: string;
  label: string;
  onClick: () => void;
}