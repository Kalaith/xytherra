import type { Galaxy, StarSystem, Planet, GameSettings, PlanetType, PlanetTrait } from '../types/game.d.ts';
import {
  gameConstants,
  getGalaxyDimensions,
  getSystemCount,
  generateRandomSeed,
} from '../constants/gameConstants';
import { planetTraits } from '../data/gameData';
import { addHyperlanesToGalaxy } from './hyperlaneService';
import {
  createRandomNumberGenerator,
  generateRandomInteger,
  selectRandomElement,
} from '../utils/randomGeneration';
import type { RandomNumberGenerator } from '../utils/randomGeneration';

export class GalaxyGenerationService {
  /**
   * Generate a complete galaxy based on settings, using a deterministic seed when provided.
   */
  static generateGalaxy(settings: GameSettings, seed?: number): Galaxy {
    return this.generateGalaxyWithDistribution(settings, seed);
  }

  /**
   * Generate a galaxy with minimum-distance system placement for more even spreads.
   */
  static generateGalaxyWithDistribution(settings: GameSettings, seed?: number): Galaxy {
    const baseSeed = seed ?? generateRandomSeed();
    const randomNumberGenerator = createRandomNumberGenerator(baseSeed);

    const galaxyDimension = getGalaxyDimensions(settings.galaxySize);
    const starSystemCount = getSystemCount(settings.galaxySize);

    const galaxy: Galaxy = {
      size: settings.galaxySize,
      systems: {},
      hyperlanes: {},
      width: galaxyDimension,
      height: galaxyDimension,
      seed: baseSeed,
    };

    const generatedStarSystems: StarSystem[] = [];
    const minimumSystemDistance = galaxyDimension * 0.08;
    const maximumPlacementAttempts = starSystemCount * 20;
    let placementAttempts = 0;

    while (generatedStarSystems.length < starSystemCount && placementAttempts < maximumPlacementAttempts) {
      const candidateCoordinates = {
        x: randomNumberGenerator() * galaxyDimension,
        y: randomNumberGenerator() * galaxyDimension,
      };

      if (
        this.isValidSystemPlacement(candidateCoordinates, generatedStarSystems, minimumSystemDistance) ||
        placementAttempts > maximumPlacementAttempts * 0.8
      ) {
        const systemId = `system-${generatedStarSystems.length}`;
        const starSystem = this.generateStarSystem(systemId, candidateCoordinates, randomNumberGenerator);

        generatedStarSystems.push(starSystem);
        galaxy.systems[systemId] = starSystem;
      }

      placementAttempts += 1;
    }

    return addHyperlanesToGalaxy(galaxy);
  }

  private static generateStarSystem(
    systemId: string,
    coordinates: { x: number; y: number },
    randomNumberGenerator: RandomNumberGenerator,
  ): StarSystem {
    return {
      id: systemId,
      name: this.generateSystemName(randomNumberGenerator),
      coordinates: { ...coordinates },
      planets: this.generatePlanetsForSystem(systemId, randomNumberGenerator),
      discoveredBy: [],
      hyperlanes: [],
    };
  }

  private static generatePlanetsForSystem(
    systemId: string,
    randomNumberGenerator: RandomNumberGenerator,
  ): Planet[] {
    const maximumPlanetsExclusive = gameConstants.PLANET.MAX_PER_SYSTEM + 1;
    const planetCountInSystem = generateRandomInteger(
      randomNumberGenerator,
      maximumPlanetsExclusive,
      gameConstants.PLANET.MIN_PER_SYSTEM,
    );

    const generatedPlanets: Planet[] = [];
    for (let index = 0; index < planetCountInSystem; index += 1) {
      generatedPlanets.push(
        this.generatePlanet(`${systemId}-planet-${index}`, systemId, randomNumberGenerator),
      );
    }
    return generatedPlanets;
  }

  private static generatePlanet(
    planetId: string,
    systemId: string,
    randomNumberGenerator: RandomNumberGenerator,
  ): Planet {
    const planetTypes: PlanetType[] = [
      'water',
      'volcanic',
      'rocky',
      'gas',
      'ice',
      'living',
      'desolate',
      'exotic',
    ];

    const planetType = this.weightedRandomChoice(
      planetTypes,
      gameConstants.GALAXY_GENERATION.PLANET_TYPE_WEIGHTS,
      randomNumberGenerator,
    );

    return {
      id: planetId,
      name: this.generatePlanetName(randomNumberGenerator),
      type: planetType,
      coordinates: { x: 0, y: 0 },
      size: generateRandomInteger(
        randomNumberGenerator,
        gameConstants.PLANET.MAX_SIZE + 1,
        gameConstants.PLANET.MIN_SIZE,
      ),
      traits: this.generatePlanetTraits(randomNumberGenerator),
      systemId,
      surveyedBy: [],
    };
  }

  private static generatePlanetTraits(randomNumberGenerator: RandomNumberGenerator): PlanetTrait[] {
    const availableTraits = Object.values(planetTraits);
    if (availableTraits.length === 0) {
      return [];
    }

    const traitRoll = randomNumberGenerator();
    if (traitRoll <= gameConstants.PLANET.TRAIT_CHANCES.NO_TRAITS) {
      return [];
    }

    const shouldGenerateTwoTraits = traitRoll >= gameConstants.PLANET.TRAIT_CHANCES.TWO_TRAITS;
    const traitCount = shouldGenerateTwoTraits ? 2 : 1;

    const selectedTraits: PlanetTrait[] = [];
    while (selectedTraits.length < traitCount && selectedTraits.length < availableTraits.length) {
      const candidateTrait = selectRandomElement(randomNumberGenerator, availableTraits);
      if (!selectedTraits.includes(candidateTrait)) {
        selectedTraits.push(candidateTrait);
      }
    }

    return selectedTraits;
  }

  private static weightedRandomChoice<T>(
    items: readonly T[],
    weights: readonly number[],
    randomNumberGenerator: RandomNumberGenerator,
  ): T {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let selectionThreshold = randomNumberGenerator() * totalWeight;

    for (let index = 0; index < items.length; index += 1) {
      selectionThreshold -= weights[index];
      if (selectionThreshold <= 0) {
        return items[index];
      }
    }

    return items[items.length - 1];
  }

  private static generateSystemName(randomNumberGenerator: RandomNumberGenerator): string {
    const prefixes = [
      'Alpha',
      'Beta',
      'Gamma',
      'Delta',
      'Epsilon',
      'Zeta',
      'Theta',
      'Sigma',
      'Tau',
      'Omega',
      'Lambda',
      'Kappa',
      'Phi',
      'Chi',
      'Psi',
      'Rho',
    ] as const;
    const suffixes = [
      'Centauri',
      'Prime',
      'Major',
      'Minor',
      'Nova',
      'Nebula',
      'Reach',
      'Gate',
      'Station',
      'Expanse',
      'Cluster',
      'Junction',
      'Haven',
      'Drift',
      'Core',
      'Edge',
    ] as const;

    return `${selectRandomElement(randomNumberGenerator, prefixes)} ${selectRandomElement(randomNumberGenerator, suffixes)}`;
  }

  private static generatePlanetName(randomNumberGenerator: RandomNumberGenerator): string {
    const prefixes = [
      'Neo',
      'Prima',
      'Alta',
      'Nova',
      'Terra',
      'Magna',
      'Ultima',
      'Proxima',
      'Stella',
      'Luna',
      'Vera',
      'Vita',
      'Petra',
      'Aqua',
      'Ignis',
      'Glacies',
    ] as const;
    const suffixes = [
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X',
      'Prime',
      'Major',
      'Minor',
      'Beta',
      'Gamma',
      'Delta',
    ] as const;

    return `${selectRandomElement(randomNumberGenerator, prefixes)} ${selectRandomElement(randomNumberGenerator, suffixes)}`;
  }

  /**
   * Check if coordinates are too close to existing systems (for better distribution)
   */
  static isValidSystemPlacement(
    newCoordinates: { x: number; y: number },
    existingSystems: StarSystem[],
    minimumDistance = 10,
  ): boolean {
    return existingSystems.every((system) => {
      const deltaX = newCoordinates.x - system.coordinates.x;
      const deltaY = newCoordinates.y - system.coordinates.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      return distance >= minimumDistance;
    });
  }
}
