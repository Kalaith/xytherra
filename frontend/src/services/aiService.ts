import type { Empire, GameState, AIPersonality } from '../types/game.d.ts';
import { GAME_CONSTANTS } from '../constants/gameConstants';
import { TECHNOLOGIES } from '../data/gameData';

export interface AIDecision {
  type: 'research' | 'colonize' | 'explore' | 'build_fleet' | 'diplomacy';
  priority: number;
  target?: string;
  data?: Record<string, unknown>;
}

export class AIService {
  /**
   * Process AI decisions for a single empire
   */
  static processAITurn(empire: Empire, gameState: GameState): AIDecision[] {
    if (empire.isPlayer || !empire.aiPersonality) {
      return [];
    }
    
    const decisions: AIDecision[] = [];
    
    // Research decisions
    const researchDecision = this.makeResearchDecision(empire, gameState);
    if (researchDecision) {
      decisions.push(researchDecision);
    }
    
    // Expansion decisions
    const expansionDecision = this.makeExpansionDecision(empire, gameState);
    if (expansionDecision) {
      decisions.push(expansionDecision);
    }
    
    // Military decisions
    const militaryDecision = this.makeMilitaryDecision(empire, gameState);
    if (militaryDecision) {
      decisions.push(militaryDecision);
    }
    
    return decisions.sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Make research decisions based on AI personality
   */
  private static makeResearchDecision(empire: Empire, gameState: GameState): AIDecision | null {
    if (empire.currentResearch) {
      return null; // Already researching something
    }
    
    const personality = empire.aiPersonality!;
    const availableTechs = Object.keys(TECHNOLOGIES).filter(techId => 
      !empire.technologies.has(techId) && 
      TECHNOLOGIES[techId].prerequisites.every(prereq => empire.technologies.has(prereq))
    );
    
    if (availableTechs.length === 0) {
      return null;
    }
    
    const chosenTech = this.selectTechByPersonality(availableTechs, personality);
    const basePriority = GAME_CONSTANTS.AI.DECISION_WEIGHTS[personality.toUpperCase() as keyof typeof GAME_CONSTANTS.AI.DECISION_WEIGHTS].RESEARCH;
    
    return {
      type: 'research',
      priority: basePriority * 100,
      target: chosenTech,
      data: { techId: chosenTech }
    };
  }
  
  /**
   * Select technology based on AI personality
   */
  private static selectTechByPersonality(availableTechs: string[], personality: AIPersonality): string {
    const personalityTechPreferences = {
      aggressive: ['weapons'],
      defensive: ['shields'],
      scientific: ['research'], // Prioritize expensive/advanced techs
      expansionist: ['propulsion'],
      diplomatic: ['sensors'],
      economic: ['industry']
    };
    
    const preferredDomains = personalityTechPreferences[personality] || [];
    
    // First try to find tech in preferred domains
    for (const domain of preferredDomains) {
      const domainTechs = availableTechs.filter(techId => 
        TECHNOLOGIES[techId].domain === domain
      );
      if (domainTechs.length > 0) {
        return this.randomChoice(domainTechs);
      }
    }
    
    // Special case for scientific - prefer expensive techs
    if (personality === 'scientific') {
      const sortedByCost = availableTechs.sort((a, b) => 
        TECHNOLOGIES[b].cost - TECHNOLOGIES[a].cost
      );
      return sortedByCost[0];
    }
    
    // Fallback to random selection
    return this.randomChoice(availableTechs);
  }
  
  /**
   * Make expansion decisions
   */
  private static makeExpansionDecision(empire: Empire, gameState: GameState): AIDecision | null {
    const personality = empire.aiPersonality!;
    const expansionWeight = GAME_CONSTANTS.AI.DECISION_WEIGHTS[personality.toUpperCase() as keyof typeof GAME_CONSTANTS.AI.DECISION_WEIGHTS].EXPANSION;
    
    if (expansionWeight < 0.5) {
      return null; // Not interested in expansion
    }
    
    // Find uncolonized planets that are surveyed
    const uncolonizedPlanets = [];
    
    for (const system of Object.values(gameState.galaxy.systems)) {
      for (const planet of system.planets) {
        if (!planet.colonizedBy && planet.surveyedBy.includes(empire.id)) {
          uncolonizedPlanets.push(planet);
        }
      }
    }
    
    if (uncolonizedPlanets.length === 0) {
      return null;
    }
    
    // Prioritize planets based on type and traits
    const targetPlanet = this.selectBestColonizationTarget(uncolonizedPlanets, personality);
    
    return {
      type: 'colonize',
      priority: expansionWeight * 90,
      target: targetPlanet.id,
      data: { planetId: targetPlanet.id }
    };
  }
  
  /**
   * Select best colonization target based on personality
   */
  private static selectBestColonizationTarget(planets: any[], personality: AIPersonality) {
    // Simple scoring system - can be expanded
    const scores = planets.map(planet => {
      let score = planet.size * 10; // Base score from size
      
      // Personality-specific bonuses
      switch (personality) {
        case 'aggressive':
          if (planet.type === 'volcanic') score += 20;
          break;
        case 'defensive':
          if (planet.type === 'water') score += 20;
          break;
        case 'scientific':
          if (planet.type === 'ice' || planet.type === 'exotic') score += 20;
          break;
        case 'economic':
          if (planet.type === 'rocky') score += 20;
          break;
        case 'expansionist':
          score += 5; // Slight bonus to all planets
          break;
      }
      
      // Bonus for resource-rich traits
      planet.traits.forEach((trait: any) => {
        if (trait.id === 'resource-rich') score += 15;
        if (trait.id === 'pristine-biosphere') score += 10;
      });
      
      return { planet, score };
    });
    
    // Return highest scoring planet
    return scores.sort((a, b) => b.score - a.score)[0].planet;
  }
  
  /**
   * Make military decisions
   */
  private static makeMilitaryDecision(empire: Empire, gameState: GameState): AIDecision | null {
    const personality = empire.aiPersonality!;
    const militaryWeight = GAME_CONSTANTS.AI.DECISION_WEIGHTS[personality.toUpperCase() as keyof typeof GAME_CONSTANTS.AI.DECISION_WEIGHTS].MILITARY;
    
    if (militaryWeight < 0.4) {
      return null; // Not military focused
    }
    
    // Check if we need more military power
    const currentMilitaryPower = empire.fleets.reduce((total, fleet) => 
      total + fleet.ships.length, 0
    );
    
    const desiredMilitaryPower = Math.max(3, empire.colonies.length * 2);
    
    if (currentMilitaryPower < desiredMilitaryPower) {
      return {
        type: 'build_fleet',
        priority: militaryWeight * 80,
        data: { fleetSize: Math.min(3, desiredMilitaryPower - currentMilitaryPower) }
      };
    }
    
    return null;
  }
  
  /**
   * Execute AI decisions
   */
  static executeAIDecisions(
    empire: Empire, 
    decisions: AIDecision[], 
    gameState: GameState,
    actions: {
      startResearch: (empireId: string, techId: string) => void;
      colonizePlanet: (planetId: string, empireId: string) => void;
      createFleet: (empireId: string, systemId: string) => string;
      addNotification: (notification: any) => void;
    }
  ): void {
    decisions.forEach(decision => {
      switch (decision.type) {
        case 'research':
          if (decision.target) {
            actions.startResearch(empire.id, decision.target);
          }
          break;
          
        case 'colonize':
          if (decision.target) {
            actions.colonizePlanet(decision.target, empire.id);
            actions.addNotification({
              type: 'info',
              title: 'AI Expansion',
              message: `${empire.name} has established a new colony`
            });
          }
          break;
          
        case 'build_fleet':
          // Find a suitable system to build fleet
          const homeSystem = Object.values(gameState.galaxy.systems).find(system =>
            system.planets.some(p => p.id === empire.homeworld)
          );
          
          if (homeSystem) {
            actions.createFleet(empire.id, homeSystem.id);
            actions.addNotification({
              type: 'info',
              title: 'AI Military',
              message: `${empire.name} has constructed new military vessels`
            });
          }
          break;
      }
    });
  }
  
  /**
   * Random choice utility
   */
  private static randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  /**
   * Calculate empire threat level for diplomatic decisions
   */
  static calculateThreatLevel(empire: Empire, targetEmpire: Empire): number {
    const militaryPowerRatio = this.calculateMilitaryPower(empire) / Math.max(1, this.calculateMilitaryPower(targetEmpire));
    const territoryRatio = empire.colonies.length / Math.max(1, targetEmpire.colonies.length);
    const techRatio = empire.technologies.size / Math.max(1, targetEmpire.technologies.size);
    
    return (militaryPowerRatio + territoryRatio + techRatio) / 3;
  }
  
  /**
   * Calculate military power of an empire
   */
  private static calculateMilitaryPower(empire: Empire): number {
    return empire.fleets.reduce((total, fleet) => 
      total + fleet.ships.length * GAME_CONSTANTS.FLEET.BASE_COMBAT_POWER_PER_SHIP, 0
    );
  }
}