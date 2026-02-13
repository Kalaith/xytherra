import type { 
  Empire, 
  Planet, 
  GameState, 
  ResourceType,
  PlanetType,
  VictoryCondition 
} from '../types/game.d.ts';

// Type guards for runtime type checking
export const isEmpire = (obj: unknown): obj is Empire => {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const empire = obj as Record<string, unknown>;
  
  return (
    typeof empire.id === 'string' &&
    typeof empire.name === 'string' &&
    typeof empire.color === 'string' &&
    typeof empire.isPlayer === 'boolean' &&
    typeof empire.homeworld === 'string' &&
    typeof empire.faction === 'string' &&
    typeof empire.resources === 'object' &&
    empire.resources !== null &&
    Array.isArray(empire.colonies) &&
    Array.isArray(empire.fleets) &&
    typeof empire.technologies === 'object'
  );
};

export const isPlanet = (obj: unknown): obj is Planet => {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const planet = obj as Record<string, unknown>;
  
  return (
    typeof planet.id === 'string' &&
    typeof planet.name === 'string' &&
    typeof planet.type === 'string' &&
    typeof planet.coordinates === 'object' &&
    typeof planet.size === 'number' &&
    Array.isArray(planet.traits) &&
    typeof planet.systemId === 'string' &&
    Array.isArray(planet.surveyedBy)
  );
};

export const isResourceType = (type: string): type is ResourceType => {
  const validTypes: ResourceType[] = [
    'energy', 'minerals', 'food', 'research', 'alloys', 'exoticMatter'
  ];
  return validTypes.includes(type as ResourceType);
};

export const isPlanetType = (type: string): type is PlanetType => {
  const validTypes: PlanetType[] = [
    'water', 'volcanic', 'rocky', 'gas', 'ice', 'living', 'desolate', 'exotic'
  ];
  return validTypes.includes(type as PlanetType);
};

export const isVictoryCondition = (condition: string): condition is VictoryCondition => {
  const validConditions: VictoryCondition[] = ['domination', 'federation', 'techAscendancy'];
  return validConditions.includes(condition as VictoryCondition);
};

// Data validation utilities
export const validateGameState = (state: unknown): GameState | null => {
  if (typeof state !== 'object' || state === null) return null;
  
  const gameState = state as Record<string, unknown>;
  
  // Basic structure validation
  if (
    typeof gameState.turn !== 'number' ||
    typeof gameState.phase !== 'string' ||
    typeof gameState.galaxy !== 'object' ||
    typeof gameState.empires !== 'object' ||
    !Array.isArray(gameState.activeEvents) ||
    typeof gameState.playerEmpireId !== 'string'
  ) {
    return null;
  }
  
  // Validate empires
  if (gameState.empires) {
    for (const [empireId, empire] of Object.entries(gameState.empires)) {
      if (!isEmpire(empire)) {
        console.warn(`Invalid empire data for ${empireId}:`, empire);
        return null;
      }
    }
  }
  
  return gameState as unknown as GameState;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 100); // Limit length
};

export const validateResourceAmount = (amount: number): boolean => {
  return (
    typeof amount === 'number' &&
    !isNaN(amount) &&
    isFinite(amount) &&
    amount >= 0 &&
    amount <= Number.MAX_SAFE_INTEGER
  );
};

export const validateCoordinates = (coords: unknown): coords is { x: number; y: number } => {
  if (typeof coords !== 'object' || coords === null) return false;
  
  const c = coords as Record<string, unknown>;
  return (
    typeof c.x === 'number' &&
    typeof c.y === 'number' &&
    !isNaN(c.x) &&
    !isNaN(c.y) &&
    isFinite(c.x) &&
    isFinite(c.y)
  );
};

// Test data factories for unit testing
export const createMockEmpire = (overrides: Partial<Empire> = {}): Empire => {
  return {
    id: 'test-empire',
    name: 'Test Empire',
    color: '#3B82F6',
    isPlayer: true,
    homeworld: 'test-planet',
    faction: 'forge-union',
    resources: {
      energy: 100,
      minerals: 100,
      food: 50,
      research: 25,
      alloys: 10,
      exoticMatter: 0
    },
    resourceIncome: {
      energy: 10,
      minerals: 10,
      food: 5,
      research: 5,
      alloys: 1,
      exoticMatter: 0
    },
    technologies: new Set(['basic-manufacturing']),
    researchProgress: {},
    colonies: ['test-planet'],
    // Planet-Tech System fields
    colonizationHistory: {
      order: [],
      weights: {
        shields: 0,
        weapons: 0,
        industry: 0,
        propulsion: 0,
        sensors: 0,
        biotech: 0,
        survival: 0,
        experimental: 0
      },
      currentSpecialization: []
    },
    techDomainWeights: {
      shields: 0,
      weapons: 0,
      industry: 0,
      propulsion: 0,
      sensors: 0,
      biotech: 0,
      survival: 0,
      experimental: 0
    },
    specializationLevel: {
      shields: 'weak',
      weapons: 'weak',
      industry: 'weak',
      propulsion: 'weak',
      sensors: 'weak',
      biotech: 'weak',
      survival: 'weak',
      experimental: 'weak'
    },
    planetMasteries: {},
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
    techsDiscovered: 1,
    ...overrides
  };
};

export const createMockPlanet = (overrides: Partial<Planet> = {}): Planet => {
  return {
    id: 'test-planet',
    name: 'Test Planet',
    type: 'rocky',
    coordinates: { x: 0, y: 0 },
    size: 3,
    traits: [],
    systemId: 'test-system',
    surveyedBy: [],
    ...overrides
  };
};

export const createMockGameState = (overrides: Partial<GameState> = {}): GameState => {
  const empire = createMockEmpire();
  const planet = createMockPlanet();
  
  return {
    turn: 1,
    phase: 'playing',
    galaxy: {
      size: 'medium',
      systems: {
        'test-system': {
          id: 'test-system',
          name: 'Test System',
          coordinates: { x: 50, y: 50 },
          planets: [planet],
          discoveredBy: [empire.id],
          hyperlanes: []
        }
      },
      hyperlanes: {},
      width: 100,
      height: 100,
      seed: 12345
    },
    empires: {
      [empire.id]: empire
    },
    activeEvents: [],
    gameSettings: {
      galaxySize: 'medium',
      difficulty: 'normal',
      numEmpires: 1,
      victoryConditions: ['domination', 'federation', 'techAscendancy']
    },
    playerEmpireId: empire.id,
    isGameOver: false,
    ...overrides
  };
};
