// Game balance and configuration constants
export const gameConstants = {
  GALAXY: {
    SEED_MAX: 1_000_000,
    DIMENSIONS: {
      SMALL: 60,
      MEDIUM: 100,
      LARGE: 140
    },
    SYSTEM_COUNTS: {
      SMALL: 20,
      MEDIUM: 35,
      LARGE: 50
    }
  },
  
  PLANET: {
    MIN_PER_SYSTEM: 1,
    MAX_PER_SYSTEM: 4,
    MIN_SIZE: 1,
    MAX_SIZE: 5,
    ORBIT_BASE_RADIUS: 15,
    ORBIT_RADIUS_INCREMENT: 8,
    TRAIT_CHANCES: {
      NO_TRAITS: 0.3,
      ONE_TRAIT: 0.7,
      TWO_TRAITS: 0.3
    }
  },
  
  EMPIRE: {
    STARTING_RESOURCES: {
      ENERGY: 50,
      MINERALS: 50,
      FOOD: 20,
      RESEARCH: 10,
      ALLOYS: 0,
      EXOTIC_MATTER: 0
    },
    STARTING_INCOME: {
      ENERGY: 5,
      MINERALS: 5,
      FOOD: 3,
      RESEARCH: 2,
      ALLOYS: 0,
      EXOTIC_MATTER: 0
    },
    HOMEWORLD_POPULATION: 2,
    COLONY_POPULATION: 1,
    HOMEWORLD_OUTPUT: {
      ENERGY: 3,
      MINERALS: 3,
      FOOD: 2,
      RESEARCH: 1,
      ALLOYS: 0,
      EXOTIC_MATTER: 0
    },
    COLONY_OUTPUT: {
      ENERGY: 1,
      MINERALS: 1,
      FOOD: 1,
      RESEARCH: 1,
      ALLOYS: 0,
      EXOTIC_MATTER: 0
    }
  },
  
  FLEET: {
    STARTING_MOVEMENT_POINTS: 3,
    BASE_COMBAT_POWER_PER_SHIP: 10,
    SHIP_ID_PREFIX: 'ship-',
    FLEET_ID_PREFIX: 'fleet-'
  },
  
  COMBAT: {
    PLANETARY_DEFENSE_BONUS: 1.5,
    BASE_EXPERIENCE_GAIN: {
      WINNER: 10,
      LOSER: 5
    },
    FLEET_EXPERIENCE_LEVELS: {
      NOVICE: { MIN: 0, MAX: 10, BONUS: 1.0 },
      VETERAN: { MIN: 11, MAX: 25, BONUS: 1.1 },
      ELITE: { MIN: 26, MAX: 50, BONUS: 1.2 },
      LEGENDARY: { MIN: 51, MAX: Infinity, BONUS: 1.3 }
    }
  },
  
  GALAXY_GENERATION: {
    PLANET_TYPE_WEIGHTS: [15, 15, 20, 15, 15, 5, 12, 3], // Corresponds to planet types array
    STAR_BACKGROUND_COUNT: 200,
    STAR_OPACITY_MIN: 0.3,
    STAR_OPACITY_MAX: 0.8,
    STAR_ANIMATION_DURATION_MIN: 2,
    STAR_ANIMATION_DURATION_MAX: 5
  },
  
  AI: {
    DECISION_WEIGHTS: {
      AGGRESSIVE: { RESEARCH: 0.7, EXPANSION: 0.8, MILITARY: 0.9, DIPLOMACY: 0.3 },
      DEFENSIVE: { RESEARCH: 0.8, EXPANSION: 0.4, MILITARY: 0.6, DIPLOMACY: 0.6 },
      EXPANSIONIST: { RESEARCH: 0.6, EXPANSION: 0.9, MILITARY: 0.5, DIPLOMACY: 0.5 },
      SCIENTIFIC: { RESEARCH: 0.9, EXPANSION: 0.6, MILITARY: 0.4, DIPLOMACY: 0.7 },
      DIPLOMATIC: { RESEARCH: 0.6, EXPANSION: 0.5, MILITARY: 0.3, DIPLOMACY: 0.9 },
      ECONOMIC: { RESEARCH: 0.5, EXPANSION: 0.7, MILITARY: 0.4, DIPLOMACY: 0.6 }
    }
  },
  
  COLONIZATION: {
    BASE_COST: {
      ENERGY: 100,
      MINERALS: 50,
      FOOD: 25,
      RESEARCH: 0,
      ALLOYS: 25,
      EXOTIC_MATTER: 0
    }
  },
  
  COLONY: {
    STARTING_POPULATION: 1,
    FOOD_CONSUMPTION_PER_POP: 0.1,
    BASE_HAPPINESS: 50,
    HAPPINESS_EFFECTS: {
      OVERCROWDING_THRESHOLD: 2, // population per planet size
      OVERCROWDING_PENALTY: 20,
      UNDERPOPULATED_BONUS: 10,
      DEVELOPMENT_BONUS_PER_LEVEL: 5
    },
    RESOURCE_BASE_OUTPUT: {
      ENERGY: 1,
      MINERALS: 1,
      FOOD: 2,
      RESEARCH: 0.5
    }
  },
  
  UI: {
    MAX_NOTIFICATIONS: 3,
    NOTIFICATION_AUTO_DISMISS_TIME: 5000,
    ANIMATION_DURATION: 200,
    PERFORMANCE_WARNING_THRESHOLD_MS: 16.67 // One frame at 60fps
  }
} as const;

// Helper functions to get constants with type safety
export const getGalaxyDimensions = (size: 'small' | 'medium' | 'large'): number => {
  return gameConstants.GALAXY.DIMENSIONS[size.toUpperCase() as keyof typeof gameConstants.GALAXY.DIMENSIONS];
};

export const getSystemCount = (size: 'small' | 'medium' | 'large'): number => {
  return gameConstants.GALAXY.SYSTEM_COUNTS[size.toUpperCase() as keyof typeof gameConstants.GALAXY.SYSTEM_COUNTS];
};

export const generateRandomSeed = (): number => {
  return Math.floor(Math.random() * gameConstants.GALAXY.SEED_MAX);
};

export const generateRandomPlanetCount = (): number => {
  return Math.floor(Math.random() * gameConstants.PLANET.MAX_PER_SYSTEM) + gameConstants.PLANET.MIN_PER_SYSTEM;
};

export const generateRandomPlanetSize = (): number => {
  return Math.floor(Math.random() * gameConstants.PLANET.MAX_SIZE) + gameConstants.PLANET.MIN_SIZE;
};