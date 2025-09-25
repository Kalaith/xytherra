import type { GameState, Empire, Planet, Fleet } from '../types/game.d.ts';
import type { EmpireId, PlanetId, FleetId, ResourceMap } from '../types/gameTypes';

export class ValidationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class GameValidator {
  static validateEmpireExists(empireId: EmpireId, gameState: GameState): Empire {
    const empire = gameState.empires[empireId];
    if (!empire) {
      throw new ValidationError(`Empire with ID ${empireId} does not exist`, 'EMPIRE_NOT_FOUND');
    }
    return empire;
  }
  
  static validatePlanetExists(planetId: PlanetId, gameState: GameState): Planet {
    for (const system of Object.values(gameState.galaxy.systems)) {
      const planet = system.planets.find(p => p.id === planetId);
      if (planet) return planet;
    }
    throw new ValidationError(`Planet with ID ${planetId} does not exist`, 'PLANET_NOT_FOUND');
  }
  
  static validateFleetExists(fleetId: FleetId, gameState: GameState): Fleet {
    for (const empire of Object.values(gameState.empires)) {
      const fleet = empire.fleets.find(f => f.id === fleetId);
      if (fleet) return fleet;
    }
    throw new ValidationError(`Fleet with ID ${fleetId} does not exist`, 'FLEET_NOT_FOUND');
  }
  
  static validateColonizationRules(planet: Planet, empire: Empire): void {
    if (planet.colonizedBy) {
      throw new ValidationError(
        `Planet ${planet.id} is already colonized by ${planet.colonizedBy}`,
        'PLANET_ALREADY_COLONIZED'
      );
    }
    
    if (!planet.surveyedBy.includes(empire.id)) {
      throw new ValidationError(
        `Empire ${empire.id} must survey planet ${planet.id} before colonization`,
        'PLANET_NOT_SURVEYED'
      );
    }
    
    // Add resource cost validation
    const colonizationCost: ResourceMap = {
      energy: 100,
      minerals: 50,
      food: 25,
      research: 0,
      alloys: 25,
      exoticMatter: 0
    };
    
    for (const [resource, cost] of Object.entries(colonizationCost)) {
      if (empire.resources[resource as keyof ResourceMap] < cost) {
        throw new ValidationError(
          `Insufficient ${resource}: need ${cost}, have ${empire.resources[resource as keyof ResourceMap]}`,
          'INSUFFICIENT_RESOURCES'
        );
      }
    }
  }
  
  static validateResourceUpdate(empireId: EmpireId, resources: Partial<ResourceMap>): void {
    if (!empireId || typeof empireId !== 'string') {
      throw new ValidationError('Invalid empire ID', 'INVALID_EMPIRE_ID');
    }
    
    for (const [resource, amount] of Object.entries(resources)) {
      if (typeof amount !== 'number' || isNaN(amount)) {
        throw new ValidationError(
          `Invalid resource amount for ${resource}: ${amount}`,
          'INVALID_RESOURCE_AMOUNT'
        );
      }
      
      if (!['energy', 'minerals', 'food', 'research', 'alloys', 'exoticMatter'].includes(resource)) {
        throw new ValidationError(`Unknown resource type: ${resource}`, 'INVALID_RESOURCE_TYPE');
      }
    }
  }
  
  static validateGamePhase(gameState: GameState, expectedPhase: GameState['phase']): void {
    if (gameState.phase !== expectedPhase) {
      throw new ValidationError(
        `Invalid game phase: expected ${expectedPhase}, got ${gameState.phase}`,
        'INVALID_GAME_PHASE'
      );
    }
  }
}