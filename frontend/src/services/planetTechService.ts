// Core service for the planet-driven technology system
import type {
  Empire,
  Planet,
  PlanetType,
  TechDomain,
  EmpireColonizationHistory,
  PlanetColonization,
  PlanetMastery,
  SpecializationLevel,
} from '../types/game.d.ts';
import { TECHNOLOGIES, planetTypes } from '../data/gameData';

// Colonization weight constants
export const colonizationWeights: Record<number, number> = {
  1: 3.0, // First colony - huge impact
  2: 2.0, // Second colony - major impact
  3: 1.5, // Third colony - significant impact
  4: 1.2, // Fourth colony - moderate impact
  5: 1.0, // Fifth+ colonies - standard impact
};

// Specialization thresholds
export const specializationThresholds = {
  weak: 0,
  moderate: 2,
  strong: 4,
  dominant: 8,
} as const;

export class PlanetTechService {
  /**
   * Initialize empire colonization history for new empires
   */
  static initializeColonizationHistory(): EmpireColonizationHistory {
    return {
      order: [],
      weights: {
        shields: 0,
        weapons: 0,
        industry: 0,
        propulsion: 0,
        sensors: 0,
        biotech: 0,
        survival: 0,
        experimental: 0,
      },
      currentSpecialization: [],
    };
  }

  /**
   * Initialize empire specialization levels
   */
  static initializeSpecializationLevels(): Record<TechDomain, SpecializationLevel> {
    return {
      shields: 'weak',
      weapons: 'weak',
      industry: 'weak',
      propulsion: 'weak',
      sensors: 'weak',
      biotech: 'weak',
      survival: 'weak',
      experimental: 'weak',
    };
  }

  /**
   * Initialize empire tech domain weights
   */
  static initializeTechDomainWeights(): Record<TechDomain, number> {
    return {
      shields: 0,
      weapons: 0,
      industry: 0,
      propulsion: 0,
      sensors: 0,
      biotech: 0,
      survival: 0,
      experimental: 0,
    };
  }

  /**
   * Unlock technologies when surveying a planet (Tier 1)
   */
  static unlockSurveyTechnologies(
    planet: Planet,
    _empireId: string
  ): {
    unlockedTechs: string[];
    notifications: string[];
  } {
    const unlockedTechs: string[] = [];
    const notifications: string[] = [];

    // Find all Tier 1 technologies for this planet type
    const tier1Techs = Object.values(TECHNOLOGIES).filter(
      tech => tech.requiredPlanetType === planet.type && tech.tier === 1
    );

    tier1Techs.forEach(tech => {
      unlockedTechs.push(tech.id);
      notifications.push(`Discovered ${tech.name} through planetary survey of ${planet.name}!`);
    });

    return { unlockedTechs, notifications };
  }

  /**
   * Unlock technologies when colonizing a planet (Tier 2)
   */
  static unlockColonyTechnologies(
    planet: Planet,
    _empireId: string
  ): {
    unlockedTechs: string[];
    notifications: string[];
  } {
    const unlockedTechs: string[] = [];
    const notifications: string[] = [];

    // Find all Tier 2 technologies for this planet type
    const tier2Techs = Object.values(TECHNOLOGIES).filter(
      tech => tech.requiredPlanetType === planet.type && tech.tier === 2
    );

    tier2Techs.forEach(tech => {
      unlockedTechs.push(tech.id);
      notifications.push(`Unlocked ${tech.name} through colonization of ${planet.name}!`);
    });

    return { unlockedTechs, notifications };
  }

  /**
   * Check for mastery technology unlocks (Tier 3)
   */
  static checkMasteryUnlocks(
    planet: Planet,
    empire: Empire
  ): {
    unlockedTechs: string[];
    notifications: string[];
  } {
    const unlockedTechs: string[] = [];
    const notifications: string[] = [];

    const mastery = empire.planetMasteries[planet.id];
    if (!mastery || !mastery.unlocked) {
      return { unlockedTechs, notifications };
    }

    // Find all Tier 3 technologies for this planet type that aren't already unlocked
    const tier3Techs = Object.values(TECHNOLOGIES).filter(
      tech =>
        tech.requiredPlanetType === planet.type &&
        tech.tier === 3 &&
        !empire.technologies.has(tech.id)
    );

    tier3Techs.forEach(tech => {
      unlockedTechs.push(tech.id);
      notifications.push(`Mastery achieved! Unlocked ${tech.name} from ${planet.name}!`);
    });

    return { unlockedTechs, notifications };
  }

  /**
   * Update colonization history when colonizing a planet
   */
  static updateColonizationHistory(
    empire: Empire,
    planet: Planet,
    turn: number
  ): EmpireColonizationHistory {
    const order = empire.colonizationHistory.order.length + 1;
    const weight = colonizationWeights[order] || 1.0;

    const newColonization: PlanetColonization = {
      planetId: planet.id,
      planetType: planet.type,
      turn,
      order,
      weight,
    };

    const updatedOrder = [...empire.colonizationHistory.order, newColonization];

    // Recalculate domain weights
    const updatedWeights = this.calculateDomainWeights(updatedOrder);

    // Determine current specialization (top 3 domains)
    const currentSpecialization = this.determineSpecialization(updatedWeights);

    return {
      order: updatedOrder,
      weights: updatedWeights,
      currentSpecialization,
    };
  }

  /**
   * Calculate domain weights from colonization history
   */
  static calculateDomainWeights(colonizations: PlanetColonization[]): Record<TechDomain, number> {
    const weights: Record<TechDomain, number> = {
      shields: 0,
      weapons: 0,
      industry: 0,
      propulsion: 0,
      sensors: 0,
      biotech: 0,
      survival: 0,
      experimental: 0,
    };

    colonizations.forEach(colonization => {
      const planetInfo = planetTypes[colonization.planetType];
      if (planetInfo) {
        weights[planetInfo.domain] += colonization.weight;
      }
    });

    return weights;
  }

  /**
   * Calculate empire specialization based on colonization history
   */
  static calculateEmpireSpecialization(empire: Empire): Record<TechDomain, number> {
    return this.calculateDomainWeights(empire.colonizationHistory.order);
  }

  /**
   * Determine specialization levels for each domain
   */
  static calculateSpecializationLevels(
    weights: Record<TechDomain, number>
  ): Record<TechDomain, SpecializationLevel> {
    const levels: Record<TechDomain, SpecializationLevel> = {} as Record<
      TechDomain,
      SpecializationLevel
    >;

    Object.entries(weights).forEach(([domain, weight]) => {
      if (weight >= specializationThresholds.dominant) {
        levels[domain as TechDomain] = 'dominant';
      } else if (weight >= specializationThresholds.strong) {
        levels[domain as TechDomain] = 'strong';
      } else if (weight >= specializationThresholds.moderate) {
        levels[domain as TechDomain] = 'moderate';
      } else {
        levels[domain as TechDomain] = 'weak';
      }
    });

    return levels;
  }

  /**
   * Determine top specialization domains (top 3)
   */
  static determineSpecialization(weights: Record<TechDomain, number>): TechDomain[] {
    return Object.entries(weights)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .filter(([, weight]) => weight > 0)
      .map(([domain]) => domain as TechDomain);
  }

  /**
   * Check if empire can research a specific technology
   */
  static canResearchTechnology(
    empire: Empire,
    techId: string
  ): {
    canResearch: boolean;
    reason?: string;
    requiredPlanets?: PlanetType[];
  } {
    const tech = TECHNOLOGIES[techId];
    if (!tech) {
      return { canResearch: false, reason: 'Technology not found' };
    }

    // Check if already researched
    if (empire.technologies.has(techId)) {
      return { canResearch: false, reason: 'Technology already researched' };
    }

    // Check prerequisites
    const missingPrereqs = tech.prerequisites.filter(prereq => !empire.technologies.has(prereq));
    if (missingPrereqs.length > 0) {
      return {
        canResearch: false,
        reason: `Missing prerequisites: ${missingPrereqs.join(', ')}`,
      };
    }

    // Check planet requirements for hybrid technologies
    if (tech.isHybrid && tech.requiredPlanetTypes) {
      const missingPlanetTypes = tech.requiredPlanetTypes.filter(_planetType => {
        return !empire.colonies.some(_colonyId => {
          // This would need to be resolved by checking the actual planet type of the colony
          // For now, we'll implement this check in the game store where we have access to the galaxy
          return false; // Placeholder
        });
      });

      if (missingPlanetTypes.length > 0) {
        return {
          canResearch: false,
          reason: 'Missing required planet types for hybrid technology',
          requiredPlanets: missingPlanetTypes,
        };
      }
    }

    // Check single planet requirement for regular technologies
    if (!tech.isHybrid) {
      // This check would also need galaxy access to verify planet types of colonies
      // Implementation needed in game store
    }

    return { canResearch: true };
  }

  /**
   * Initialize planet mastery tracking for a new colony
   */
  static initializePlanetMastery(planetId: string): PlanetMastery {
    return {
      planetId,
      currentLevel: 0,
      masteryPoints: 0,
      requiredInvestment: 1000, // Base requirement
      masteryBonuses: {},
      unlocked: false,
    };
  }

  /**
   * Update planet mastery progress
   */
  static updatePlanetMastery(mastery: PlanetMastery, investmentPoints: number): PlanetMastery {
    const updatedMastery = { ...mastery };
    updatedMastery.masteryPoints += investmentPoints;
    updatedMastery.currentLevel = Math.min(
      100,
      (updatedMastery.masteryPoints / updatedMastery.requiredInvestment) * 100
    );

    if (updatedMastery.currentLevel >= 100 && !updatedMastery.unlocked) {
      updatedMastery.unlocked = true;
    }

    return updatedMastery;
  }

  /**
   * Get empire's technology identity description based on specialization
   */
  static getEmpireIdentityDescription(empire: Empire): string {
    const specialization = empire.colonizationHistory.currentSpecialization;

    if (specialization.length === 0) {
      return 'Unspecialized Empire - No clear technological focus yet.';
    }

    const primary = specialization[0];
    const secondary = specialization[1];
    const tertiary = specialization[2];

    const descriptions = {
      shields: 'Defensive Specialists',
      weapons: 'Military Powerhouse',
      industry: 'Industrial Giants',
      propulsion: 'Space Nomads',
      sensors: 'Information Masters',
      biotech: 'Bio-Engineers',
      survival: 'Survivalists',
      experimental: 'Reality Benders',
    };

    let description = descriptions[primary] || 'Unknown Specialization';

    if (secondary) {
      description += ` with ${descriptions[secondary]} tendencies`;
    }

    if (tertiary) {
      description += ` and ${descriptions[tertiary]} capabilities`;
    }

    return description;
  }

  /**
   * Get research speed modifier based on empire specialization
   */
  static getResearchSpeedModifier(empire: Empire, techDomain: TechDomain): number {
    const specializationLevel = empire.specializationLevel[techDomain];

    const modifiers = {
      weak: 1.0,
      moderate: 1.2,
      strong: 1.5,
      dominant: 2.0,
    };

    return modifiers[specializationLevel] || 1.0;
  }
}
