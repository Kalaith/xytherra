// Static game data for planet types and their associated technologies

import type { PlanetType, TechDomain, Technology, PlanetTrait, AIPersonality, FactionType } from '../types/game.d.ts';

export interface PlanetTypeInfo {
  id: PlanetType;
  name: string;
  domain: TechDomain;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare';
  baseResourceMultipliers: Record<string, number>;
  adaptationRequired: boolean;
  strategicResources: string[];
}

export interface AIEmpireTemplate {
  name: string;
  color: string;
  faction: FactionType;
  personality: AIPersonality;
  description: string;
  preferredStrategies: string[];
  aggressionLevel: number; // 0-10
  expansionPriority: number; // 0-10
  diplomacyPriority: number; // 0-10
  economyPriority: number; // 0-10
  researchPriority: number; // 0-10
}

export const PLANET_TYPES: Record<PlanetType, PlanetTypeInfo> = {
  water: {
    id: 'water',
    name: 'Water World',
    domain: 'shields',
    description: 'Oceanic worlds that excel in defensive technologies and cooling systems',
    rarity: 'common',
    baseResourceMultipliers: { food: 1.5, energy: 0.8, research: 1.2 },
    adaptationRequired: false,
    strategicResources: ['Hydro-Compounds', 'Deep Water']
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic World',
    domain: 'weapons',
    description: 'Fire and lava worlds focused on offensive capabilities and energy generation',
    rarity: 'common',
    baseResourceMultipliers: { energy: 1.8, minerals: 1.3, food: 0.4 },
    adaptationRequired: true,
    strategicResources: ['Thermal Plasma', 'Molten Metals']
  },
  rocky: {
    id: 'rocky',
    name: 'Rocky World',
    domain: 'industry',
    description: 'Terrestrial worlds that boost production and manufacturing',
    rarity: 'common',
    baseResourceMultipliers: { minerals: 1.6, alloys: 1.4, food: 0.9 },
    adaptationRequired: false,
    strategicResources: ['Heavy Metals', 'Industrial Minerals']
  },
  gas: {
    id: 'gas',
    name: 'Gas Giant',
    domain: 'propulsion',
    description: 'Massive gas worlds providing advanced propulsion and fuel systems',
    rarity: 'common',
    baseResourceMultipliers: { energy: 1.4, research: 1.1, food: 0.1 },
    adaptationRequired: true,
    strategicResources: ['Exotic Gases', 'Hydrogen Isotopes']
  },
  ice: {
    id: 'ice',
    name: 'Ice World',
    domain: 'sensors',
    description: 'Frozen worlds enhancing information processing and sensor technology',
    rarity: 'common',
    baseResourceMultipliers: { research: 1.5, energy: 0.7, food: 0.6 },
    adaptationRequired: true,
    strategicResources: ['Cryo-Crystals', 'Frozen Compounds']
  },
  living: {
    id: 'living',
    name: 'Living World',
    domain: 'biotech',
    description: 'Garden worlds with advanced biological technologies and rapid growth',
    rarity: 'uncommon',
    baseResourceMultipliers: { food: 2.0, research: 1.3, alloys: 0.6 },
    adaptationRequired: false,
    strategicResources: ['Bio-Essence', 'Living Biomass']
  },
  desolate: {
    id: 'desolate',
    name: 'Desolate World',
    domain: 'survival',
    description: 'Harsh environments fostering survival technologies and rare materials',
    rarity: 'common',
    baseResourceMultipliers: { minerals: 1.4, exoticMatter: 1.6, food: 0.3 },
    adaptationRequired: true,
    strategicResources: ['Rare Metals', 'Radioactive Materials']
  },
  exotic: {
    id: 'exotic',
    name: 'Exotic World',
    domain: 'experimental',
    description: 'Anomalous worlds that defy physics with breakthrough technologies',
    rarity: 'ultra-rare',
    baseResourceMultipliers: { research: 2.5, exoticMatter: 3.0, energy: 0.5 },
    adaptationRequired: true,
    strategicResources: ['Quantum Crystals', 'Temporal Fragments', 'Dark Energy']
  }
};

export const TECHNOLOGIES: Record<string, Technology> = {
  // Water World Technologies
  'hydrodynamic-shielding': {
    id: 'hydrodynamic-shielding',
    name: 'Hydrodynamic Shielding',
    description: 'Advanced shield systems that flow like water around ship hulls',
    domain: 'shields',
    tier: 1,
    requiredPlanetType: 'water',
    prerequisites: [],
    cost: 200,
    effects: { shieldPower: 1.2, shipDefense: 1.1 },
    unlocks: ['shield-capacitor-1'],
    isHybrid: false
  },
  'coolant-recycling': {
    id: 'coolant-recycling',
    name: 'Coolant Recycling',
    description: 'Efficient cooling systems that allow ships to operate longer without overheating',
    domain: 'shields',
    tier: 2,
    requiredPlanetType: 'water',
    prerequisites: ['hydrodynamic-shielding'],
    cost: 400,
    effects: { shipEndurance: 1.3, weaponCooldown: 0.8 },
    unlocks: ['thermal-regulator'],
    isHybrid: false
  },
  'aquatic-habitats': {
    id: 'aquatic-habitats',
    name: 'Aquatic Habitats',
    description: 'Underwater cities that maximize food production and population growth',
    domain: 'shields',
    tier: 3,
    requiredPlanetType: 'water',
    prerequisites: ['coolant-recycling'],
    cost: 800,
    effects: { colonyGrowth: 1.5, foodProduction: 1.4 },
    unlocks: ['underwater-city'],
    isHybrid: false
  },

  // Volcanic World Technologies
  'heat-resistant-hulls': {
    id: 'heat-resistant-hulls',
    name: 'Heat-Resistant Hulls',
    description: 'Ship armor designed to withstand extreme temperatures',
    domain: 'weapons',
    tier: 1,
    requiredPlanetType: 'volcanic',
    prerequisites: [],
    cost: 200,
    effects: { shipHealth: 1.15, thermalResistance: 1.5 },
    unlocks: ['armor-plating-1'],
    isHybrid: false
  },
  'plasma-cannons': {
    id: 'plasma-cannons',
    name: 'Plasma Cannons',
    description: 'Devastating energy weapons that fire superheated plasma bolts',
    domain: 'weapons',
    tier: 2,
    requiredPlanetType: 'volcanic',
    prerequisites: ['heat-resistant-hulls'],
    cost: 400,
    effects: { weaponDamage: 1.4, energyWeaponPower: 1.3 },
    unlocks: ['plasma-cannon-mk1'],
    isHybrid: false
  },
  'planet-cracking-lances': {
    id: 'planet-cracking-lances',
    name: 'Planet-Cracking Thermal Lances',
    description: 'Massive thermal weapons capable of devastating planetary surfaces',
    domain: 'weapons',
    tier: 3,
    requiredPlanetType: 'volcanic',
    prerequisites: ['plasma-cannons'],
    cost: 800,
    effects: { siegeWeaponPower: 2.0, planetaryBombardment: 1.8 },
    unlocks: ['thermal-lance'],
    isHybrid: false
  },

  // Rocky World Technologies
  'basic-manufacturing': {
    id: 'basic-manufacturing',
    name: 'Basic Manufacturing',
    description: 'Fundamental industrial processes for ship and building construction',
    domain: 'industry',
    tier: 1,
    requiredPlanetType: 'rocky',
    prerequisites: [],
    cost: 200,
    effects: { constructionSpeed: 1.2, alloyProduction: 1.15 },
    unlocks: ['factory-1'],
    isHybrid: false
  },
  'nano-forging': {
    id: 'nano-forging',
    name: 'Nano-Forging',
    description: 'Molecular-level construction techniques for rapid building',
    domain: 'industry',
    tier: 2,
    requiredPlanetType: 'rocky',
    prerequisites: ['basic-manufacturing'],
    cost: 400,
    effects: { constructionSpeed: 1.5, buildingCostReduction: 0.8 },
    unlocks: ['nano-factory'],
    isHybrid: false
  },
  'industrial-foundries': {
    id: 'industrial-foundries',
    name: 'Industrial Foundries',
    description: 'Massive production facilities that dramatically increase alloy output',
    domain: 'industry',
    tier: 3,
    requiredPlanetType: 'rocky',
    prerequisites: ['nano-forging'],
    cost: 800,
    effects: { alloyProduction: 1.8, factoryEfficiency: 1.4 },
    unlocks: ['mega-foundry'],
    isHybrid: false
  },

  // Gas Giant Technologies
  'basic-ion-drives': {
    id: 'basic-ion-drives',
    name: 'Basic Ion Drives',
    description: 'Efficient propulsion systems using ionized gases',
    domain: 'propulsion',
    tier: 1,
    requiredPlanetType: 'gas',
    prerequisites: [],
    cost: 200,
    effects: { shipSpeed: 1.2, fuelEfficiency: 1.3 },
    unlocks: ['ion-thruster-1'],
    isHybrid: false
  },
  'ion-drive-enhancements': {
    id: 'ion-drive-enhancements',
    name: 'Ion Drive Enhancements',
    description: 'Advanced ion propulsion for superior fleet mobility',
    domain: 'propulsion',
    tier: 2,
    requiredPlanetType: 'gas',
    prerequisites: ['basic-ion-drives'],
    cost: 400,
    effects: { shipSpeed: 1.5, fleetRange: 1.4 },
    unlocks: ['enhanced-thruster'],
    isHybrid: false
  },
  'gravity-harnessing': {
    id: 'gravity-harnessing',
    name: 'Gravity Harnessing',
    description: 'Technology to manipulate gravitational fields for defense and propulsion',
    domain: 'propulsion',
    tier: 3,
    requiredPlanetType: 'gas',
    prerequisites: ['ion-drive-enhancements'],
    cost: 800,
    effects: { planetaryDefense: 1.6, jumpDriveEfficiency: 1.3 },
    unlocks: ['gravity-well-generator'],
    isHybrid: false
  },

  // Ice World Technologies
  'basic-sensors': {
    id: 'basic-sensors',
    name: 'Basic Sensors',
    description: 'Improved detection systems using crystalline matrices',
    domain: 'sensors',
    tier: 1,
    requiredPlanetType: 'ice',
    prerequisites: [],
    cost: 200,
    effects: { sensorRange: 1.3, explorationSpeed: 1.2 },
    unlocks: ['sensor-array-1'],
    isHybrid: false
  },
  'cryo-memory-storage': {
    id: 'cryo-memory-storage',
    name: 'Cryo-Memory Storage',
    description: 'Ultra-cold data storage systems that boost AI and research capabilities',
    domain: 'sensors',
    tier: 2,
    requiredPlanetType: 'ice',
    prerequisites: ['basic-sensors'],
    cost: 400,
    effects: { researchSpeed: 1.3, aiEfficiency: 1.4 },
    unlocks: ['quantum-computer'],
    isHybrid: false
  },
  'crystal-resonance-sensors': {
    id: 'crystal-resonance-sensors',
    name: 'Crystal Resonance Sensors',
    description: 'Advanced detection systems capable of finding cloaked enemies',
    domain: 'sensors',
    tier: 3,
    requiredPlanetType: 'ice',
    prerequisites: ['cryo-memory-storage'],
    cost: 800,
    effects: { cloakDetection: 2.0, sensorPrecision: 1.8 },
    unlocks: ['resonance-detector'],
    isHybrid: false
  },

  // Living World Technologies
  'basic-biotech': {
    id: 'basic-biotech',
    name: 'Basic Biotech',
    description: 'Fundamental biological engineering and organic systems',
    domain: 'biotech',
    tier: 1,
    requiredPlanetType: 'living',
    prerequisites: [],
    cost: 250,
    effects: { populationGrowth: 1.3, foodProduction: 1.2 },
    unlocks: ['bio-lab-1'],
    isHybrid: false
  },
  'organic-armor': {
    id: 'organic-armor',
    name: 'Organic Armor',
    description: 'Self-healing hull plating that regenerates damage over time',
    domain: 'biotech',
    tier: 2,
    requiredPlanetType: 'living',
    prerequisites: ['basic-biotech'],
    cost: 500,
    effects: { shipRegeneration: 1.2, biologicalResistance: 1.5 },
    unlocks: ['living-hull'],
    isHybrid: false
  },
  'bio-colonization': {
    id: 'bio-colonization',
    name: 'Bio-Colonization',
    description: 'Accelerated terraforming using biological agents',
    domain: 'biotech',
    tier: 3,
    requiredPlanetType: 'living',
    prerequisites: ['organic-armor'],
    cost: 1000,
    effects: { colonizationSpeed: 1.8, terraformingSpeed: 1.6 },
    unlocks: ['bio-terraformer'],
    isHybrid: false
  },

  // Desolate World Technologies
  'basic-survival-tech': {
    id: 'basic-survival-tech',
    name: 'Basic Survival Tech',
    description: 'Fundamental technologies for surviving in harsh environments',
    domain: 'survival',
    tier: 1,
    requiredPlanetType: 'desolate',
    prerequisites: [],
    cost: 200,
    effects: { environmentalResistance: 1.4, salvageEfficiency: 1.2 },
    unlocks: ['survival-suit'],
    isHybrid: false
  },
  'radiation-hardened-hulls': {
    id: 'radiation-hardened-hulls',
    name: 'Radiation-Hardened Hulls',
    description: 'Ship armor that resists radiation and environmental hazards',
    domain: 'survival',
    tier: 2,
    requiredPlanetType: 'desolate',
    prerequisites: ['basic-survival-tech'],
    cost: 400,
    effects: { radiationResistance: 1.8, hazardProtection: 1.5 },
    unlocks: ['hardened-hull'],
    isHybrid: false
  },
  'terraforming-accelerants': {
    id: 'terraforming-accelerants',
    name: 'Terraforming Accelerants',
    description: 'Chemical processes that dramatically reduce terraforming time and costs',
    domain: 'survival',
    tier: 3,
    requiredPlanetType: 'desolate',
    prerequisites: ['radiation-hardened-hulls'],
    cost: 800,
    effects: { terraformingCostReduction: 0.5, terraformingSpeed: 2.0 },
    unlocks: ['terraforming-station'],
    isHybrid: false
  },

  // Hybrid Technologies (require multiple planet types)
  'steam-burst-weapons': {
    id: 'steam-burst-weapons',
    name: 'Steam Burst Weapons',
    description: 'Area-of-effect plasma weapons stabilized by coolant systems',
    domain: 'weapons',
    tier: 2,
    requiredPlanetType: 'water', // Primary type
    requiredPlanetTypes: ['water', 'volcanic'],
    prerequisites: ['coolant-recycling', 'plasma-cannons'],
    cost: 600,
    effects: { aoeWeaponPower: 1.8, weaponCooldown: 0.7 },
    unlocks: ['steam-cannon'],
    isHybrid: true
  },
  'cryo-ion-drives': {
    id: 'cryo-ion-drives',
    name: 'Cryo-Ion Drives',
    description: 'Extremely efficient long-range travel technology',
    domain: 'propulsion',
    tier: 2,
    requiredPlanetType: 'gas', // Primary type
    requiredPlanetTypes: ['gas', 'ice'],
    prerequisites: ['ion-drive-enhancements', 'cryo-memory-storage'],
    cost: 600,
    effects: { fuelEfficiency: 1.8, longRangeTravel: 1.6 },
    unlocks: ['cryo-thruster'],
    isHybrid: true
  },
  'organic-nanoforges': {
    id: 'organic-nanoforges',
    name: 'Organic Nanoforges',
    description: 'Living factories that self-repair and adapt to production needs',
    domain: 'industry',
    tier: 3,
    requiredPlanetType: 'rocky', // Primary type
    requiredPlanetTypes: ['rocky', 'living'],
    prerequisites: ['industrial-foundries', 'bio-colonization'],
    cost: 1200,
    effects: { factorySelfRepair: 1.5, adaptiveProduction: 1.4 },
    unlocks: ['living-factory'],
    isHybrid: true
  }
};

export const PLANET_TRAITS: Record<string, PlanetTrait> = {
  'resource-rich': {
    id: 'resource-rich',
    name: 'Resource Rich',
    description: 'This planet contains abundant natural resources',
    effects: { minerals: 1.5, energy: 1.3 }
  },
  'ancient-ruins': {
    id: 'ancient-ruins',
    name: 'Ancient Ruins',
    description: 'Mysterious structures from a lost civilization provide research bonuses',
    effects: { research: 1.4 }
  },
  'hazardous-atmosphere': {
    id: 'hazardous-atmosphere',
    name: 'Hazardous Atmosphere',
    description: 'Toxic or corrosive atmosphere makes colonization difficult',
    effects: { colonizationCost: 1.5, populationGrowth: 0.8 }
  },
  'pristine-biosphere': {
    id: 'pristine-biosphere',
    name: 'Pristine Biosphere',
    description: 'Untouched ecosystem provides exceptional food production',
    effects: { food: 2.0, research: 1.2 }
  },
  'crystalline-formations': {
    id: 'crystalline-formations',
    name: 'Crystalline Formations',
    description: 'Natural crystal structures enhance sensor and research capabilities',
    effects: { research: 1.3, sensorRange: 1.2 }
  },
  'unstable-geology': {
    id: 'unstable-geology',
    name: 'Unstable Geology',
    description: 'Frequent seismic activity causes random events but provides rare materials',
    effects: { minerals: 1.4, exoticMatter: 1.6, stabilityPenalty: 0.8 }
  },
  'temporal-anomaly': {
    id: 'temporal-anomaly',
    name: 'Temporal Anomaly',
    description: 'Time flows differently here, affecting research and construction',
    effects: { research: 1.8, constructionSpeed: 0.6 }
  }
};

// Starting bonuses for each faction
export const FACTION_BONUSES = {
  'forge-union': {
    name: 'Forge Union',
    homeworld: 'volcanic',
    bonuses: {
      weaponsResearch: 1.2,
      energyProduction: 1.15,
      thermalResistance: 1.5
    },
    startingTechs: ['heat-resistant-hulls']
  },
  'oceanic-concord': {
    name: 'Oceanic Concord',
    homeworld: 'water',
    bonuses: {
      shieldsResearch: 1.2,
      foodProduction: 1.25,
      shipDefense: 1.1
    },
    startingTechs: ['hydrodynamic-shielding']
  },
  'verdant-kin': {
    name: 'Verdant Kin',
    homeworld: 'living',
    bonuses: {
      biotechResearch: 1.3,
      populationGrowth: 1.2,
      biologicalResistance: 1.4
    },
    startingTechs: ['basic-biotech']
  },
  'nomad-fleet': {
    name: 'Nomad Fleet',
    homeworld: 'gas',
    bonuses: {
      propulsionResearch: 1.3,
      fuelEfficiency: 1.25,
      shipSpeed: 1.15
    },
    startingTechs: ['basic-ion-drives']
  },
  'ashborn-syndicate': {
    name: 'Ashborn Syndicate',
    homeworld: 'desolate',
    bonuses: {
      survivalResearch: 1.25,
      salvageEfficiency: 1.3,
      environmentalResistance: 1.5
    },
    startingTechs: ['basic-survival-tech']
  }
} as const;

// AI Empire Templates for procedural generation
export const AI_EMPIRE_TEMPLATES: AIEmpireTemplate[] = [
  {
    name: 'Crimson Hegemony',
    color: '#dc2626',
    faction: 'forge-union',
    personality: 'aggressive',
    description: 'A militaristic empire focused on conquest and expansion',
    preferredStrategies: ['military-expansion', 'technological-superiority', 'resource-control'],
    aggressionLevel: 9,
    expansionPriority: 8,
    diplomacyPriority: 3,
    economyPriority: 6,
    researchPriority: 7
  },
  {
    name: 'Azure Commonwealth',
    color: '#2563eb',
    faction: 'oceanic-concord',
    personality: 'diplomatic',
    description: 'A peaceful federation seeking cooperation and mutual prosperity',
    preferredStrategies: ['diplomatic-victory', 'economic-growth', 'defensive-alliances'],
    aggressionLevel: 2,
    expansionPriority: 5,
    diplomacyPriority: 9,
    economyPriority: 8,
    researchPriority: 6
  },
  {
    name: 'Emerald Collective',
    color: '#16a34a',
    faction: 'verdant-kin',
    personality: 'scientific',
    description: 'Bio-engineers seeking to understand and preserve all life',
    preferredStrategies: ['research-dominance', 'biological-mastery', 'peaceful-expansion'],
    aggressionLevel: 3,
    expansionPriority: 6,
    diplomacyPriority: 7,
    economyPriority: 7,
    researchPriority: 9
  },
  {
    name: 'Stellar Wanderers',
    color: '#7c3aed',
    faction: 'nomad-fleet',
    personality: 'expansionist',
    description: 'Nomadic fleet-builders exploring the far reaches of space',
    preferredStrategies: ['rapid-expansion', 'exploration-focus', 'mobility-advantage'],
    aggressionLevel: 5,
    expansionPriority: 9,
    diplomacyPriority: 5,
    economyPriority: 6,
    researchPriority: 7
  },
  {
    name: 'Iron Consortium',
    color: '#ea580c',
    faction: 'ashborn-syndicate',
    personality: 'economic',
    description: 'Resource-focused traders building an economic empire',
    preferredStrategies: ['economic-dominance', 'trade-networks', 'resource-monopoly'],
    aggressionLevel: 4,
    expansionPriority: 7,
    diplomacyPriority: 6,
    economyPriority: 9,
    researchPriority: 5
  },
  {
    name: 'Void Guardians',
    color: '#1f2937',
    faction: 'forge-union',
    personality: 'defensive',
    description: 'Fortress builders focused on impregnable defenses',
    preferredStrategies: ['defensive-mastery', 'fortification-focus', 'technological-barriers'],
    aggressionLevel: 3,
    expansionPriority: 4,
    diplomacyPriority: 6,
    economyPriority: 7,
    researchPriority: 8
  }
];

// Combat System Data
export const COMBAT_MODIFIERS = {
  planetaryDefense: 1.5, // Defending on a planet
  fleetExperience: {
    novice: 1.0,     // 0-10 battles
    veteran: 1.1,    // 11-25 battles
    elite: 1.2,      // 26-50 battles
    legendary: 1.3   // 50+ battles
  },
  factionBonuses: {
    'forge-union': { attack: 1.1, defense: 1.0 },
    'oceanic-concord': { attack: 0.95, defense: 1.15 },
    'verdant-kin': { attack: 0.9, defense: 1.1 },
    'nomad-fleet': { attack: 1.05, defense: 0.9 },
    'ashborn-syndicate': { attack: 1.0, defense: 1.05 }
  }
};

// Basic Ship Design Templates
export const DEFAULT_SHIP_DESIGNS = {
  'scout': {
    id: 'scout',
    name: 'Scout',
    hull: 'light',
    components: [],
    cost: { energy: 50, minerals: 75, food: 0, research: 0, alloys: 25, exoticMatter: 0 },
    stats: {
      health: 80,
      attack: 15,
      defense: 10,
      speed: 9,
      range: 3
    }
  },
  'corvette': {
    id: 'corvette',
    name: 'Corvette',
    hull: 'light',
    components: [],
    cost: { energy: 100, minerals: 150, food: 0, research: 0, alloys: 50, exoticMatter: 0 },
    stats: {
      health: 120,
      attack: 25,
      defense: 15,
      speed: 7,
      range: 2
    }
  },
  'frigate': {
    id: 'frigate',
    name: 'Frigate',
    hull: 'medium',
    components: [],
    cost: { energy: 200, minerals: 300, food: 0, research: 0, alloys: 100, exoticMatter: 0 },
    stats: {
      health: 200,
      attack: 35,
      defense: 25,
      speed: 6,
      range: 3
    }
  }
} as const;

// Victory Condition Thresholds
export const VICTORY_CONDITIONS = {
  domination: {
    name: 'Galactic Domination',
    description: 'Control 60% of all inhabited planets',
    threshold: 0.6,
    checkFunction: (empire: any, galaxy: any) => {
      const systems = Object.values(galaxy.systems) as any[];
      const totalPlanets = systems.reduce((count, system) => {
        return count + system.planets.filter((p: any) => p.colony).length;
      }, 0);
      const controlledPlanets = empire.colonies.length;
      return totalPlanets > 0 ? controlledPlanets / totalPlanets : 0;
    }
  },
  technology: {
    name: 'Technological Supremacy',
    description: 'Research 80% of all available technologies',
    threshold: 0.8,
    checkFunction: (empire: any, gameData: any) => {
      const totalTechs = Object.keys(gameData.TECHNOLOGIES).length;
      return empire.technologies.size / totalTechs;
    }
  },
  diplomatic: {
    name: 'Diplomatic Victory',
    description: 'Form alliances with 75% of surviving empires',
    threshold: 0.75,
    checkFunction: (empire: any, empires: any) => {
      const otherEmpires = Object.values(empires).filter((e: any) => e.id !== empire.id && !e.isDefeated);
      const allies = otherEmpires.filter((e: any) => 
        empire.diplomaticStatus[e.id] === 'allied' || empire.diplomaticStatus[e.id] === 'federated'
      );
      return otherEmpires.length > 0 ? allies.length / otherEmpires.length : 0;
    }
  },
  economic: {
    name: 'Economic Supremacy',
    description: 'Accumulate 10,000 resources across all types',
    threshold: 10000,
    checkFunction: (empire: any) => {
      const resources = Object.values(empire.resources) as number[];
      return resources.reduce((sum: number, val: number) => sum + val, 0);
    }
  }
};