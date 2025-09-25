import type { Empire, ResourceType, GameState, Fleet, Planet } from '../types/game.d.ts';
import { GAME_CONSTANTS } from '../constants/gameConstants';
import { TECHNOLOGIES } from '../data/gameData';

export interface TurnProcessingResult {
  empire: Empire;
  researchCompleted?: string[];
  notifications: Array<{
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
  }>;
}

export class EmpireService {
  /**
   * Process resource income for an empire
   */
  static processResourceIncome(empire: Empire): Empire {
    const updatedEmpire = { ...empire };
    
    Object.keys(empire.resourceIncome).forEach(resourceType => {
      const income = empire.resourceIncome[resourceType as ResourceType];
      updatedEmpire.resources[resourceType as ResourceType] += income;
    });
    
    return updatedEmpire;
  }
  
  /**
   * Process research progress and completion
   */
  static processResearch(
    empire: Empire, 
    onResearchComplete: (techId: string) => void
  ): { empire: Empire; completedTechs: string[] } {
    if (!empire.currentResearch || empire.researchProgress[empire.currentResearch] === undefined) {
      return { empire, completedTechs: [] };
    }
    
    const updatedEmpire = { ...empire };
    const completedTechs: string[] = [];
    const researchProgress = updatedEmpire.researchProgress[empire.currentResearch];
    const researchIncome = empire.resourceIncome.research || 0;
    
    updatedEmpire.researchProgress[empire.currentResearch] = researchProgress + researchIncome;
    
    const tech = TECHNOLOGIES[empire.currentResearch];
    if (tech && updatedEmpire.researchProgress[empire.currentResearch] >= tech.cost) {
      updatedEmpire.technologies.add(empire.currentResearch);
      updatedEmpire.techsDiscovered += 1;
      delete updatedEmpire.researchProgress[empire.currentResearch];
      
      const completedTech = empire.currentResearch;
      updatedEmpire.currentResearch = undefined;
      
      completedTechs.push(completedTech);
      onResearchComplete(completedTech);
    }
    
    return { empire: updatedEmpire, completedTechs };
  }
  
  /**
   * Calculate total combat power for an empire
   */
  static calculateCombatPower(empire: Empire): number {
    return empire.fleets.reduce((total, fleet) => {
      return total + fleet.ships.length * GAME_CONSTANTS.FLEET.BASE_COMBAT_POWER_PER_SHIP;
    }, 0);
  }
  
  /**
   * Process a complete turn for an empire
   */
  static processTurn(
    empire: Empire,
    onResearchComplete: (techId: string) => void
  ): TurnProcessingResult {
    const notifications: TurnProcessingResult['notifications'] = [];
    
    // Step 1: Process resource income
    let processedEmpire = this.processResourceIncome(empire);
    
    // Step 2: Process research
    const { empire: empireAfterResearch, completedTechs } = this.processResearch(
      processedEmpire,
      onResearchComplete
    );
    processedEmpire = empireAfterResearch;
    
    // Step 3: Add notifications for completed research
    completedTechs.forEach(techId => {
      const tech = TECHNOLOGIES[techId];
      notifications.push({
        type: 'success',
        title: 'Research Complete',
        message: `${tech.name} research has been completed!`
      });
    });
    
    // Step 4: Check for resource alerts
    this.checkResourceAlerts(processedEmpire).forEach(alert => {
      notifications.push(alert);
    });
    
    return {
      empire: processedEmpire,
      researchCompleted: completedTechs,
      notifications
    };
  }
  
  /**
   * Check for resource-related alerts
   */
  private static checkResourceAlerts(empire: Empire): TurnProcessingResult['notifications'] {
    const alerts: TurnProcessingResult['notifications'] = [];
    const resourceWarningThreshold = 10;
    
    Object.entries(empire.resources).forEach(([resource, amount]) => {
      if (amount < resourceWarningThreshold && empire.resourceIncome[resource as ResourceType] <= 0) {
        alerts.push({
          type: 'warning',
          title: 'Resource Warning',
          message: `Low ${resource}: ${Math.floor(amount)} remaining with no income!`
        });
      }
    });
    
    return alerts;
  }
  
  /**
   * Calculate colonization cost including any modifiers
   */
  static calculateColonizationCost(planet: Planet, empire: Empire): Record<ResourceType, number> {
    // Convert uppercase constants to lowercase resource keys
    const baseCost: Record<ResourceType, number> = {
      energy: GAME_CONSTANTS.COLONIZATION.BASE_COST.ENERGY,
      minerals: GAME_CONSTANTS.COLONIZATION.BASE_COST.MINERALS,
      food: GAME_CONSTANTS.COLONIZATION.BASE_COST.FOOD,
      research: GAME_CONSTANTS.COLONIZATION.BASE_COST.RESEARCH,
      alloys: GAME_CONSTANTS.COLONIZATION.BASE_COST.ALLOYS,
      exoticMatter: GAME_CONSTANTS.COLONIZATION.BASE_COST.EXOTIC_MATTER
    };
    
    // Apply faction bonuses or penalties
    // This could be expanded based on planet traits, empire technologies, etc.
    
    return baseCost;
  }
  
  /**
   * Check if empire can afford a cost
   */
  static canAffordCost(
    empire: Empire, 
    cost: Partial<Record<ResourceType, number>>
  ): { canAfford: boolean; missingResources: string[] } {
    const missingResources: string[] = [];
    
    Object.entries(cost).forEach(([resource, amount]) => {
      if (amount && empire.resources[resource as ResourceType] < amount) {
        missingResources.push(`${resource}: need ${amount}, have ${Math.floor(empire.resources[resource as ResourceType])}`);
      }
    });
    
    return {
      canAfford: missingResources.length === 0,
      missingResources
    };
  }
  
  /**
   * Deduct resources from empire
   */
  static deductResources(
    empire: Empire,
    cost: Partial<Record<ResourceType, number>>
  ): Empire {
    const updatedEmpire = { ...empire };
    
    Object.entries(cost).forEach(([resource, amount]) => {
      if (amount) {
        updatedEmpire.resources[resource as ResourceType] -= amount;
      }
    });
    
    return updatedEmpire;
  }
  
  /**
   * Add resources to empire
   */
  static addResources(
    empire: Empire,
    resources: Partial<Record<ResourceType, number>>
  ): Empire {
    const updatedEmpire = { ...empire };
    
    Object.entries(resources).forEach(([resource, amount]) => {
      if (amount) {
        updatedEmpire.resources[resource as ResourceType] += amount;
      }
    });
    
    return updatedEmpire;
  }
  
  /**
   * Get empire statistics for UI display
   */
  static getEmpireStats(empire: Empire) {
    const totalShips = empire.fleets.reduce((count, fleet) => count + fleet.ships.length, 0);
    const totalFleetPower = this.calculateCombatPower(empire);
    const resourceTotal = Object.values(empire.resources).reduce((sum, amount) => sum + amount, 0);
    const incomeTotal = Object.values(empire.resourceIncome).reduce((sum, amount) => sum + amount, 0);
    
    return {
      totalShips,
      totalFleetPower,
      resourceTotal: Math.floor(resourceTotal),
      incomeTotal: Math.floor(incomeTotal),
      techProgress: empire.technologies.size,
      colonyCount: empire.colonies.length,
      combatExperience: empire.combatExperience,
      totalWars: empire.totalWars
    };
  }
}