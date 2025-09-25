import type { Fleet, Ship, ShipDesign, StarSystem, Empire, Coordinates } from '../types/game.d.ts';
import { GAME_CONSTANTS } from '../constants/gameConstants';
import { DEFAULT_SHIP_DESIGNS } from '../data/gameData';

export class FleetService {
  /**
   * Create a new fleet for an empire
   */
  static createFleet(empireId: string, systemId: string, system: StarSystem): Fleet {
    const fleetId = this.generateFleetId(empireId);
    
    const fleet: Fleet = {
      id: fleetId,
      name: `Fleet ${fleetId.split('-').pop()}`,
      empireId,
      ships: [],
      coordinates: system.coordinates,
      mission: 'idle',
      movementPoints: GAME_CONSTANTS.FLEET.STARTING_MOVEMENT_POINTS
    };
    
    return fleet;
  }
  
  /**
   * Create a starting fleet for a new empire
   */
  static createStartingFleet(empireId: string, homeSystem: StarSystem): Fleet {
    const fleet = this.createFleet(empireId, homeSystem.id, homeSystem);
    
    // Add starting ships
    fleet.name = 'Home Fleet';
    fleet.ships = [
      this.createShip('scout'),
      this.createShip('corvette')
    ];
    fleet.mission = 'defend';
    
    return fleet;
  }
  
  /**
   * Create a ship from a design template
   */
  static createShip(designId: keyof typeof DEFAULT_SHIP_DESIGNS): Ship {
    const design = DEFAULT_SHIP_DESIGNS[designId];
    const shipId = this.generateShipId();
    
    return {
      id: shipId,
      design: {
        ...design,
        components: []
      } as ShipDesign,
      health: design.stats.health,
      experience: 0,
      stats: { ...design.stats }
    };
  }
  
  /**
   * Add ships to a fleet
   */
  static addShipsToFleet(fleet: Fleet, ships: Ship[]): Fleet {
    const updatedFleet = { ...fleet };
    updatedFleet.ships = [...fleet.ships, ...ships];
    return updatedFleet;
  }
  
  /**
   * Remove damaged ships from fleet
   */
  static removeDamagedShips(fleet: Fleet, damageThreshold: number = 0): Fleet {
    const updatedFleet = { ...fleet };
    updatedFleet.ships = fleet.ships.filter(ship => ship.health > damageThreshold);
    return updatedFleet;
  }
  
  /**
   * Move fleet to new coordinates
   */
  static moveFleet(fleet: Fleet, destination: Coordinates): Fleet {
    const updatedFleet = { ...fleet };
    updatedFleet.destination = destination;
    updatedFleet.mission = 'explore';
    return updatedFleet;
  }
  
  /**
   * Calculate total fleet combat power
   */
  static calculateFleetPower(fleet: Fleet): number {
    return fleet.ships.reduce((total, ship) => {
      const basePower = ship.stats.attack + ship.stats.defense;
      const experienceBonus = this.getExperienceBonus(ship.experience);
      return total + (basePower * experienceBonus);
    }, 0);
  }
  
  /**
   * Get experience bonus multiplier for ships
   */
  private static getExperienceBonus(experience: number): number {
    const levels = GAME_CONSTANTS.COMBAT.FLEET_EXPERIENCE_LEVELS;
    
    if (experience >= levels.LEGENDARY.MIN) return levels.LEGENDARY.BONUS;
    if (experience >= levels.ELITE.MIN) return levels.ELITE.BONUS;
    if (experience >= levels.VETERAN.MIN) return levels.VETERAN.BONUS;
    return levels.NOVICE.BONUS;
  }
  
  /**
   * Repair fleet ships (restore health)
   */
  static repairFleet(fleet: Fleet, repairAmount: number = 10): Fleet {
    const updatedFleet = { ...fleet };
    updatedFleet.ships = fleet.ships.map(ship => {
      if (ship.health < ship.design.stats.health) {
        return {
          ...ship,
          health: Math.min(ship.design.stats.health, ship.health + repairAmount)
        };
      }
      return ship;
    });
    return updatedFleet;
  }
  
  /**
   * Grant experience to fleet ships
   */
  static grantFleetExperience(fleet: Fleet, experience: number): Fleet {
    const updatedFleet = { ...fleet };
    updatedFleet.ships = fleet.ships.map(ship => ({
      ...ship,
      experience: ship.experience + experience
    }));
    return updatedFleet;
  }
  
  /**
   * Check if fleet can reach destination with current movement points
   */
  static canReachDestination(
    fleet: Fleet, 
    destination: Coordinates
  ): { canReach: boolean; requiredPoints: number } {
    const distance = this.calculateDistance(fleet.coordinates, destination);
    const requiredPoints = Math.ceil(distance / 10); // Assuming 1 movement point = 10 distance units
    
    return {
      canReach: fleet.movementPoints >= requiredPoints,
      requiredPoints
    };
  }
  
  /**
   * Calculate distance between two points
   */
  private static calculateDistance(from: Coordinates, to: Coordinates): number {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * Reset fleet movement points (call at turn start)
   */
  static resetMovementPoints(fleet: Fleet): Fleet {
    const updatedFleet = { ...fleet };
    updatedFleet.movementPoints = GAME_CONSTANTS.FLEET.STARTING_MOVEMENT_POINTS;
    return updatedFleet;
  }
  
  /**
   * Get fleet status summary
   */
  static getFleetStatus(fleet: Fleet) {
    const totalShips = fleet.ships.length;
    const totalHealth = fleet.ships.reduce((sum, ship) => sum + ship.health, 0);
    const maxHealth = fleet.ships.reduce((sum, ship) => sum + ship.design.stats.health, 0);
    const averageExperience = totalShips > 0 
      ? fleet.ships.reduce((sum, ship) => sum + ship.experience, 0) / totalShips 
      : 0;
    
    const healthPercentage = maxHealth > 0 ? (totalHealth / maxHealth) * 100 : 0;
    const combatPower = this.calculateFleetPower(fleet);
    
    return {
      shipCount: totalShips,
      healthPercentage: Math.round(healthPercentage),
      averageExperience: Math.round(averageExperience),
      combatPower: Math.round(combatPower),
      movementPoints: fleet.movementPoints,
      mission: fleet.mission,
      canMove: fleet.movementPoints > 0
    };
  }
  
  /**
   * Merge two fleets
   */
  static mergeFleets(primaryFleet: Fleet, secondaryFleet: Fleet): Fleet {
    const mergedFleet = { ...primaryFleet };
    mergedFleet.ships = [...primaryFleet.ships, ...secondaryFleet.ships];
    mergedFleet.name = `${primaryFleet.name} Combined`;
    
    // Average movement points
    mergedFleet.movementPoints = Math.min(
      primaryFleet.movementPoints, 
      secondaryFleet.movementPoints
    );
    
    return mergedFleet;
  }
  
  /**
   * Split fleet into two
   */
  static splitFleet(fleet: Fleet, shipIndices: number[]): { primaryFleet: Fleet; newFleet: Fleet } {
    const primaryFleet = { ...fleet };
    const newFleet = this.createFleet(fleet.empireId, 'temp', { coordinates: fleet.coordinates } as StarSystem);
    
    // Move specified ships to new fleet
    newFleet.ships = shipIndices.map(index => fleet.ships[index]).filter(Boolean);
    primaryFleet.ships = fleet.ships.filter((_, index) => !shipIndices.includes(index));
    
    newFleet.name = `${fleet.name} Detachment`;
    newFleet.movementPoints = fleet.movementPoints;
    
    return { primaryFleet, newFleet };
  }
  
  /**
   * Generate unique fleet ID
   */
  private static generateFleetId(empireId: string): string {
    return `${GAME_CONSTANTS.FLEET.FLEET_ID_PREFIX}${empireId}-${Date.now()}`;
  }
  
  /**
   * Generate unique ship ID
   */
  private static generateShipId(): string {
    return `${GAME_CONSTANTS.FLEET.SHIP_ID_PREFIX}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}