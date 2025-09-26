import type { Galaxy, StarSystem, Planet, GameSettings, PlanetType } from '../types/game.d.ts';
import { GAME_CONSTANTS, getGalaxyDimensions, getSystemCount, generateRandomSeed, generateRandomPlanetCount, generateRandomPlanetSize } from '../constants/gameConstants';
import { PLANET_TYPES, PLANET_TRAITS } from '../data/gameData';
import { addHyperlanesToGalaxy } from './hyperlaneService';

export class GalaxyGenerationService {
  /**
   * Generate a complete galaxy based on settings
   */
  static generateGalaxy(settings: GameSettings): Galaxy {
    const dimensions = getGalaxyDimensions(settings.galaxySize);
    const systemCount = getSystemCount(settings.galaxySize);
    const seed = generateRandomSeed();
    
    const galaxy: Galaxy = {
      size: settings.galaxySize,
      systems: {},
      hyperlanes: {},
      width: dimensions,
      height: dimensions,
      seed
    };

    // Generate star systems
    for (let i = 0; i < systemCount; i++) {
      const systemId = `system-${i}`;
      const system = this.generateStarSystem(systemId, dimensions);
      galaxy.systems[systemId] = system;
    }

    // Generate hyperlanes between systems
    const galaxyWithHyperlanes = addHyperlanesToGalaxy(galaxy);

    return galaxyWithHyperlanes;
  }
  
  /**
   * Generate a single star system
   */
  private static generateStarSystem(systemId: string, dimensions: number): StarSystem {
    const system: StarSystem = {
      id: systemId,
      name: this.generateSystemName(),
      coordinates: {
        x: Math.random() * dimensions,
        y: Math.random() * dimensions
      },
      planets: this.generatePlanetsForSystem(systemId),
      discoveredBy: [],
      hyperlanes: []
    };

    return system;
  }
  
  /**
   * Generate planets for a star system
   */
  private static generatePlanetsForSystem(systemId: string): Planet[] {
    const numPlanets = generateRandomPlanetCount();
    const planets: Planet[] = [];
    
    for (let i = 0; i < numPlanets; i++) {
      const planetId = `${systemId}-planet-${i}`;
      const planet = this.generatePlanet(planetId, systemId, i);
      planets.push(planet);
    }
    
    return planets;
  }
  
  /**
   * Generate a single planet
   */
  private static generatePlanet(planetId: string, systemId: string, orbitIndex: number): Planet {
    const planetTypes = ['water', 'volcanic', 'rocky', 'gas', 'ice', 'living', 'desolate', 'exotic'] as const;
    const weights = GAME_CONSTANTS.GALAXY_GENERATION.PLANET_TYPE_WEIGHTS;
    
    const planetType = this.weightedRandomChoice(planetTypes, weights);
    
    const planet: Planet = {
      id: planetId,
      name: this.generatePlanetName(),
      type: planetType,
      coordinates: { x: 0, y: 0 }, // Relative to system center
      size: generateRandomPlanetSize(),
      traits: this.generatePlanetTraits(),
      systemId,
      surveyedBy: []
    };
    
    return planet;
  }
  
  /**
   * Generate planet traits based on probability
   */
  private static generatePlanetTraits() {
    const availableTraits = Object.values(PLANET_TRAITS);
    const traitChance = Math.random();
    
    if (traitChance > GAME_CONSTANTS.PLANET.TRAIT_CHANCES.NO_TRAITS) {
      const numTraits = traitChance < GAME_CONSTANTS.PLANET.TRAIT_CHANCES.TWO_TRAITS ? 2 : 1;
      const selectedTraits: typeof availableTraits = [];
      
      for (let i = 0; i < numTraits && selectedTraits.length < availableTraits.length; i++) {
        const trait = availableTraits[Math.floor(Math.random() * availableTraits.length)];
        if (!selectedTraits.includes(trait)) {
          selectedTraits.push(trait);
        }
      }
      
      return selectedTraits;
    }
    
    return [];
  }
  
  /**
   * Weighted random selection utility
   */
  private static weightedRandomChoice<T>(items: readonly T[], weights: readonly number[]): T {
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
  
  /**
   * Generate system names
   */
  private static generateSystemName(): string {
    const prefixes = [
      'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Theta', 'Sigma',
      'Tau', 'Omega', 'Lambda', 'Kappa', 'Phi', 'Chi', 'Psi', 'Rho'
    ];
    const suffixes = [
      'Centauri', 'Prime', 'Major', 'Minor', 'Nova', 'Nebula', 'Reach', 'Gate',
      'Station', 'Expanse', 'Cluster', 'Junction', 'Haven', 'Drift', 'Core', 'Edge'
    ];
    
    return `${this.randomChoice(prefixes)} ${this.randomChoice(suffixes)}`;
  }
  
  /**
   * Generate planet names
   */
  private static generatePlanetName(): string {
    const prefixes = [
      'Neo', 'Prima', 'Alta', 'Nova', 'Terra', 'Magna', 'Ultima', 'Proxima',
      'Stella', 'Luna', 'Vera', 'Vita', 'Petra', 'Aqua', 'Ignis', 'Glacies'
    ];
    const suffixes = [
      'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
      'Prime', 'Major', 'Minor', 'Beta', 'Gamma', 'Delta'
    ];
    
    return `${this.randomChoice(prefixes)} ${this.randomChoice(suffixes)}`;
  }
  
  /**
   * Random choice utility
   */
  private static randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  /**
   * Check if coordinates are too close to existing systems (for better distribution)
   */
  static isValidSystemPlacement(
    newCoords: { x: number; y: number },
    existingSystems: StarSystem[],
    minDistance: number = 10
  ): boolean {
    return existingSystems.every(system => {
      const dx = newCoords.x - system.coordinates.x;
      const dy = newCoords.y - system.coordinates.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance >= minDistance;
    });
  }
  
  /**
   * Generate galaxy with better system distribution
   */
  static generateGalaxyWithDistribution(settings: GameSettings): Galaxy {
    const dimensions = getGalaxyDimensions(settings.galaxySize);
    const systemCount = getSystemCount(settings.galaxySize);
    const seed = generateRandomSeed();
    const minSystemDistance = dimensions * 0.08; // 8% of galaxy size
    
    const galaxy: Galaxy = {
      size: settings.galaxySize,
      systems: {},
      hyperlanes: {},
      width: dimensions,
      height: dimensions,
      seed
    };
    
    const systems: StarSystem[] = [];
    let attempts = 0;
    const maxAttempts = systemCount * 10;
    
    // Generate systems with minimum distance constraint
    while (systems.length < systemCount && attempts < maxAttempts) {
      const coords = {
        x: Math.random() * dimensions,
        y: Math.random() * dimensions
      };
      
      if (this.isValidSystemPlacement(coords, systems, minSystemDistance) || attempts > maxAttempts * 0.8) {
        const systemId = `system-${systems.length}`;
        const system: StarSystem = {
          id: systemId,
          name: this.generateSystemName(),
          coordinates: coords,
          planets: this.generatePlanetsForSystem(systemId),
          discoveredBy: [],
          hyperlanes: []
        };
        
        systems.push(system);
        galaxy.systems[systemId] = system;
      }
      
      attempts++;
    }
    
    return galaxy;
  }
}