import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { 
  Waves, 
  Flame, 
  Mountain, 
  Wind, 
  Snowflake, 
  Leaf, 
  Skull,
  ArrowRight,
  Star,
  Zap,
  Lock,
  Unlock,
  Search,
  Shield,
  Wrench,
  Plane,
  Eye,
  Heart
} from 'lucide-react';

interface ColonizationPath {
  id: string;
  name: string;
  planets: string[];
  weights: number[];
  finalStats: {
    shields: number;
    weapons: number;
    industry: number;
    propulsion: number;
    sensors: number;
    biotech: number;
    survival: number;
  };
  hybridTechs: string[];
  description: string;
}

interface Technology {
  id: string;
  name: string;
  planetType: string;
  tier: number;
  tierName: string;
  icon: React.ElementType;
  color: string;
  description: string;
  effects: string[];
  requirements: string[];
  unlockCondition: string;
  category: 'Military' | 'Economic' | 'Industrial' | 'Scientific' | 'Defensive' | 'Hybrid';
}

const colonizationPaths: ColonizationPath[] = [
  {
    id: 'water-volcanic-rocky',
    name: 'Shield-First Empire',
    planets: ['Water', 'Volcanic', 'Rocky'],
    weights: [3.0, 2.0, 1.5],
    finalStats: { shields: 90, weapons: 60, industry: 45, propulsion: 20, sensors: 25, biotech: 15, survival: 30 },
    hybridTechs: ['Steam Burst Weapons', 'Thermal Shielding'],
    description: 'Defensive specialists with strong offensive capabilities'
  },
  {
    id: 'volcanic-water-rocky',
    name: 'Weapon-First Empire',
    planets: ['Volcanic', 'Water', 'Rocky'],
    weights: [3.0, 2.0, 1.5],
    finalStats: { shields: 60, weapons: 90, industry: 45, propulsion: 20, sensors: 25, biotech: 15, survival: 30 },
    hybridTechs: ['Steam Burst Weapons', 'Plasma Shields'],
    description: 'Aggressive empire with solid defensive backing'
  },
  {
    id: 'gas-ice-living',
    name: 'Explorer Empire',
    planets: ['Gas Giant', 'Ice', 'Living'],
    weights: [3.0, 2.0, 1.5],
    finalStats: { shields: 25, weapons: 20, industry: 30, propulsion: 90, sensors: 60, biotech: 45, survival: 35 },
    hybridTechs: ['Cryo-Ion Drives', 'Bio-Navigation'],
    description: 'Fast-moving scouts with adaptive technology'
  },
  {
    id: 'rocky-desolate-volcanic',
    name: 'Industrial Survivor',
    planets: ['Rocky', 'Desolate', 'Volcanic'],
    weights: [3.0, 2.0, 1.5],
    finalStats: { shields: 30, weapons: 45, industry: 90, propulsion: 25, sensors: 35, biotech: 20, survival: 60 },
    hybridTechs: ['Scrap Forges', 'Heat-Resistant Manufacturing'],
    description: 'Resource-efficient builders with strong survival instincts'
  }
];

const planetIcons: Record<string, React.ElementType> = {
  'Water': Waves,
  'Volcanic': Flame,
  'Rocky': Mountain,
  'Gas Giant': Wind,
  'Ice': Snowflake,
  'Living': Leaf,
  'Desolate': Skull
};

const planetColors: Record<string, string> = {
  'Water': 'text-blue-400',
  'Volcanic': 'text-red-400',
  'Rocky': 'text-gray-400',
  'Gas Giant': 'text-purple-400',
  'Ice': 'text-cyan-400',
  'Living': 'text-green-400',
  'Desolate': 'text-yellow-400'
};

const technologyDatabase: Technology[] = [
  // Water World Technologies
  {
    id: 'hydrodynamic-shielding',
    name: 'Hydrodynamic Shielding',
    planetType: 'Water',
    tier: 1,
    tierName: 'Survey',
    icon: Shield,
    color: 'text-blue-400',
    description: 'Advanced shield technology that uses fluid dynamics principles',
    effects: ['+20% shield effectiveness vs beam weapons', 'Reduces heat buildup from energy attacks'],
    requirements: ['Survey Water World'],
    unlockCondition: 'Discovered through initial planetary survey',
    category: 'Defensive'
  },
  {
    id: 'coolant-recycling',
    name: 'Coolant Recycling',
    planetType: 'Water',
    tier: 2,
    tierName: 'Colony',
    icon: Waves,
    color: 'text-blue-400',
    description: 'Closed-loop cooling systems that prevent overheating',
    effects: ['Ships can fire 50% longer before overheating', '+15% sustained damage output'],
    requirements: ['Colonize Water World', 'Hydrodynamic Shielding'],
    unlockCondition: 'Established colony infrastructure with cooling systems',
    category: 'Military'
  },
  {
    id: 'aquatic-habitats',
    name: 'Aquatic Habitats',
    planetType: 'Water',
    tier: 3,
    tierName: 'Mastery',
    icon: Heart,
    color: 'text-blue-400',
    description: 'Self-sustaining underwater cities with abundant food production',
    effects: ['+25% colony growth rate', '+30% food production', 'Reduces colony upkeep'],
    requirements: ['Water World Mastery', 'Long-term research investment'],
    unlockCondition: 'Achieve deep understanding of aquatic ecosystems',
    category: 'Economic'
  },

  // Volcanic World Technologies  
  {
    id: 'heat-resistant-hulls',
    name: 'Heat-Resistant Hulls',
    planetType: 'Volcanic',
    tier: 1,
    tierName: 'Survey',
    icon: Shield,
    color: 'text-red-400',
    description: 'Advanced hull materials that withstand extreme temperatures',
    effects: ['Ships take 30% less thermal/energy damage', 'Can operate near stars'],
    requirements: ['Survey Volcanic World'],
    unlockCondition: 'Study of volcanic planet atmospheric conditions',
    category: 'Defensive'
  },
  {
    id: 'plasma-cannons',
    name: 'Plasma Cannons',
    planetType: 'Volcanic',
    tier: 2,
    tierName: 'Colony',
    icon: Zap,
    color: 'text-red-400',
    description: 'High-energy plasma weapons with armor penetration',
    effects: ['+40% damage vs armored targets', 'Ignores 25% of enemy armor'],
    requirements: ['Colonize Volcanic World', 'Geothermal Reactors'],
    unlockCondition: 'Harness volcanic energy for weapon systems',
    category: 'Military'
  },
  {
    id: 'geothermal-reactors',
    name: 'Geothermal Reactors',
    planetType: 'Volcanic',
    tier: 2,
    tierName: 'Colony',
    icon: Zap,
    color: 'text-red-400',
    description: 'Power systems that tap directly into planetary thermal energy',
    effects: ['+50% energy production', 'Powers advanced volcanic technologies'],
    requirements: ['Colonize Volcanic World', 'Heat-Resistant Hulls'],
    unlockCondition: 'Successful volcanic colony establishment',
    category: 'Industrial'
  },
  {
    id: 'planet-cracking-lances',
    name: 'Planet-Cracking Thermal Lances',
    planetType: 'Volcanic',
    tier: 3,
    tierName: 'Mastery',
    icon: Star,
    color: 'text-red-400',
    description: 'Devastating weapons capable of planetary bombardment',
    effects: ['Massive damage vs planetary defenses', 'Can terraform planets through controlled destruction'],
    requirements: ['Volcanic World Mastery', 'Plasma Cannons', 'Advanced Energy Systems'],
    unlockCondition: 'Master volcanic energy manipulation',
    category: 'Military'
  },

  // Rocky World Technologies
  {
    id: 'nano-forging',
    name: 'Nano-Forging',
    planetType: 'Rocky',
    tier: 2,
    tierName: 'Colony',
    icon: Wrench,
    color: 'text-gray-400',
    description: 'Molecular-level manufacturing for rapid construction',
    effects: ['+25% ship construction speed', '+20% infrastructure build rate'],
    requirements: ['Colonize Rocky World', 'Basic Manufacturing'],
    unlockCondition: 'Establish industrial mining and manufacturing base',
    category: 'Industrial'
  },
  {
    id: 'tectonic-stabilizers',
    name: 'Tectonic Stabilizers',
    planetType: 'Rocky',
    tier: 2,
    tierName: 'Colony',
    icon: Mountain,
    color: 'text-gray-400',
    description: 'Technology to prevent seismic disasters',
    effects: ['Reduces planetary disaster risk by 80%', '+10% mining efficiency'],
    requirements: ['Colonize Rocky World', 'Geological Survey'],
    unlockCondition: 'Study planetary geology and seismic patterns',
    category: 'Scientific'
  },
  {
    id: 'industrial-foundries',
    name: 'Industrial Foundries',
    planetType: 'Rocky',
    tier: 3,
    tierName: 'Mastery',
    icon: Wrench,
    color: 'text-gray-400',
    description: 'Massive production facilities for alloy and metal processing',
    effects: ['+40% alloy output', 'Unlocks advanced ship hulls', '+30% fleet capacity'],
    requirements: ['Rocky World Mastery', 'Nano-Forging', 'Advanced Materials'],
    unlockCondition: 'Master large-scale industrial production',
    category: 'Industrial'
  },

  // Gas Giant Technologies
  {
    id: 'ion-drive-enhancements',
    name: 'Ion Drive Enhancements', 
    planetType: 'Gas Giant',
    tier: 2,
    tierName: 'Colony',
    icon: Plane,
    color: 'text-purple-400',
    description: 'Improved propulsion systems using exotic gas fuels',
    effects: ['+35% fleet movement speed', '+20% fuel efficiency'],
    requirements: ['Colonize Gas Giant', 'Exotic Gas Harvesting'],
    unlockCondition: 'Establish gas harvesting operations',
    category: 'Scientific'
  },
  {
    id: 'exotic-gas-reactors',
    name: 'Exotic Gas Reactors',
    planetType: 'Gas Giant',
    tier: 2,
    tierName: 'Colony',
    icon: Zap,
    color: 'text-purple-400',
    description: 'Advanced reactors powered by rare atmospheric gases',
    effects: ['Enables advanced technologies', '+25% research speed', 'Powers hybrid tech'],
    requirements: ['Colonize Gas Giant', 'Atmospheric Processing'],
    unlockCondition: 'Successfully harvest and process exotic gases',
    category: 'Scientific'
  },
  {
    id: 'gravity-harnessing',
    name: 'Gravity Harnessing',
    planetType: 'Gas Giant',
    tier: 3,
    tierName: 'Mastery',
    icon: Star,
    color: 'text-purple-400',
    description: 'Technology that manipulates gravitational fields',
    effects: ['×3 planetary defense multiplier', 'Creates gravity wells', 'Gravitational weapons'],
    requirements: ['Gas Giant Mastery', 'Exotic Gas Reactors', 'Advanced Physics'],
    unlockCondition: 'Master gravitational physics through gas giant study',
    category: 'Defensive'
  },

  // Ice World Technologies
  {
    id: 'cryo-memory-storage',
    name: 'Cryo-Memory Storage',
    planetType: 'Ice',
    tier: 2,
    tierName: 'Colony',
    icon: Eye,
    color: 'text-cyan-400',
    description: 'Ultra-cold data storage with massive capacity',
    effects: ['+30% AI research speed', '+25% data processing', 'Enhanced sensors'],
    requirements: ['Colonize Ice World', 'Cryogenic Systems'],
    unlockCondition: 'Harness extreme cold for data processing',
    category: 'Scientific'
  },
  {
    id: 'crystal-resonance-sensors',
    name: 'Crystal Resonance Sensors',
    planetType: 'Ice',
    tier: 3,
    tierName: 'Mastery',
    icon: Eye,
    color: 'text-cyan-400',
    description: 'Crystalline sensors that detect cloaked objects',
    effects: ['Detects all cloaked/stealth units', '+50% sensor range', 'Pierces electronic warfare'],
    requirements: ['Ice World Mastery', 'Crystal Formation Study', 'Advanced Sensors'],
    unlockCondition: 'Understand crystalline resonance patterns',
    category: 'Military'
  },
  {
    id: 'cryogenic-mining',
    name: 'Cryogenic Mining',
    planetType: 'Ice',
    tier: 2,
    tierName: 'Colony',
    icon: Mountain,
    color: 'text-cyan-400',
    description: 'Efficient extraction from frozen resources',
    effects: ['+40% mining yield from frozen worlds', 'Access to rare ice minerals'],
    requirements: ['Colonize Ice World', 'Specialized Equipment'],
    unlockCondition: 'Develop equipment for extreme cold mining',
    category: 'Industrial'
  },

  // Living World Technologies
  {
    id: 'organic-armor',
    name: 'Organic Armor',
    planetType: 'Living',
    tier: 2,
    tierName: 'Colony',
    icon: Heart,
    color: 'text-green-400',
    description: 'Self-healing hull plating grown from living organisms',
    effects: ['Hull regenerates 5% per turn', '+20% resistance to bioweapons', 'Adaptive armor'],
    requirements: ['Colonize Living World', 'Biological Integration'],
    unlockCondition: 'Form symbiotic relationship with planetary organisms',
    category: 'Defensive'
  },
  {
    id: 'sporefield-weapons',
    name: 'Sporefield Weapons',
    planetType: 'Living',
    tier: 2,
    tierName: 'Colony', 
    icon: Zap,
    color: 'text-green-400',
    description: 'Biological weapons that disable enemy crews',
    effects: ['Disables crew systems for 3 turns', '+30% capture chance', 'Bypasses shields'],
    requirements: ['Colonize Living World', 'Spore Cultivation'],
    unlockCondition: 'Weaponize planetary spore systems',
    category: 'Military'
  },
  {
    id: 'bio-colonization',
    name: 'Bio-Colonization',
    planetType: 'Living',
    tier: 3,
    tierName: 'Mastery',
    icon: Leaf,
    color: 'text-green-400',
    description: 'Rapid terraforming using biological agents',
    effects: ['+50% colony growth rate', 'Can terraform hostile worlds', 'Spreads life to dead worlds'],
    requirements: ['Living World Mastery', 'Advanced Biology', 'Terraforming Tech'],
    unlockCondition: 'Master biological terraforming processes',
    category: 'Scientific'
  },

  // Desolate World Technologies
  {
    id: 'radiation-hardened-hulls',
    name: 'Radiation-Hardened Hulls',
    planetType: 'Desolate',
    tier: 2,
    tierName: 'Colony',
    icon: Shield,
    color: 'text-yellow-400',
    description: 'Ship hulls that resist extreme environmental damage',
    effects: ['Immune to radiation/toxic damage', '+25% survival in hazardous zones'],
    requirements: ['Colonize Desolate World', 'Survival Systems'],
    unlockCondition: 'Survive extreme planetary conditions',
    category: 'Defensive'
  },
  {
    id: 'scrap-engineering',
    name: 'Scrap Engineering',
    planetType: 'Desolate',
    tier: 2,
    tierName: 'Colony',
    icon: Wrench,
    color: 'text-yellow-400',
    description: 'Advanced recycling and salvage technology',
    effects: ['+100% salvage from destroyed ships', 'Can build from scrap materials', 'Reduces construction costs'],
    requirements: ['Colonize Desolate World', 'Resource Scarcity Adaptation'],
    unlockCondition: 'Master resource efficiency in harsh conditions',
    category: 'Industrial'
  },
  {
    id: 'terraforming-accelerants',
    name: 'Terraforming Accelerants',
    planetType: 'Desolate',
    tier: 3,
    tierName: 'Mastery',
    icon: Leaf,
    color: 'text-yellow-400',
    description: 'Chemical processes that rapidly transform dead worlds',
    effects: ['Terraforming time reduced by 70%', 'Can terraform any planet type', 'Creates unique hybrid worlds'],
    requirements: ['Desolate World Mastery', 'Chemical Engineering', 'Environmental Sciences'],
    unlockCondition: 'Master planetary transformation chemistry',
    category: 'Scientific'
  },

  // Hybrid Technologies
  {
    id: 'steam-burst-weapons',
    name: 'Steam Burst Weapons',
    planetType: 'Hybrid',
    tier: 2,
    tierName: 'Hybrid',
    icon: Star,
    color: 'text-orange-400',
    description: 'Area-of-effect plasma weapons stabilized by coolant systems',
    effects: ['AoE damage to multiple targets', 'Combines thermal and kinetic damage', 'Never overheats'],
    requirements: ['Water World (Tier 2)', 'Volcanic World (Tier 2)', 'Coolant Recycling', 'Plasma Cannons'],
    unlockCondition: 'Merge thermal weapon tech with cooling systems',
    category: 'Hybrid'
  },
  {
    id: 'cryo-ion-drives',
    name: 'Cryo-Ion Drives',
    planetType: 'Hybrid',
    tier: 2,
    tierName: 'Hybrid',
    icon: Star,
    color: 'text-cyan-500',
    description: 'Ultra-efficient propulsion combining ice cooling with gas giant fuel',
    effects: ['+70% fleet speed', '90% fuel efficiency', 'Silent running capability'],
    requirements: ['Ice World (Tier 2)', 'Gas Giant (Tier 2)', 'Cryo-Memory Storage', 'Ion Drive Enhancements'],
    unlockCondition: 'Combine cryogenic cooling with exotic propulsion',
    category: 'Hybrid'
  },
  {
    id: 'organic-nanoforges',
    name: 'Organic Nanoforges',
    planetType: 'Hybrid',
    tier: 3,
    tierName: 'Hybrid',
    icon: Star,
    color: 'text-emerald-400',
    description: 'Living factories that self-repair and adapt to production needs',
    effects: ['Factories repair themselves', '+60% production efficiency', 'Adapts to build any design'],
    requirements: ['Rocky World (Tier 3)', 'Living World (Tier 2)', 'Industrial Foundries', 'Organic Armor'],
    unlockCondition: 'Merge industrial manufacturing with biological systems',
    category: 'Hybrid'
  },
  {
    id: 'radiation-dissipating-barriers',
    name: 'Radiation-Dissipating Barriers',
    planetType: 'Hybrid',
    tier: 3,
    tierName: 'Hybrid',
    icon: Star,
    color: 'text-teal-400',
    description: 'Advanced defensive fields that neutralize hazardous environments',
    effects: ['Nullifies all environmental damage', 'Protects entire fleets', 'Enables colonization of any world'],
    requirements: ['Desolate World (Tier 2)', 'Water World (Tier 3)', 'Radiation-Hardened Hulls', 'Aquatic Habitats'],
    unlockCondition: 'Combine survival tech with advanced shielding',
    category: 'Hybrid'
  }
];

const TechnologyDatabase: React.FC = () => {
  const [selectedPlanetType, setSelectedPlanetType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);

  const planetTypeFilters = ['All', 'Water', 'Volcanic', 'Rocky', 'Gas Giant', 'Ice', 'Living', 'Desolate', 'Hybrid'];
  const categoryFilters = ['All', 'Military', 'Economic', 'Industrial', 'Scientific', 'Defensive', 'Hybrid'];

  const filteredTechnologies = technologyDatabase.filter(tech => {
    const matchesPlanet = selectedPlanetType === 'All' || tech.planetType === selectedPlanetType;
    const matchesCategory = selectedCategory === 'All' || tech.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPlanet && matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Military': return 'text-red-400 bg-red-900/30';
      case 'Economic': return 'text-green-400 bg-green-900/30';
      case 'Industrial': return 'text-yellow-400 bg-yellow-900/30';
      case 'Scientific': return 'text-blue-400 bg-blue-900/30';
      case 'Defensive': return 'text-cyan-400 bg-cyan-900/30';
      case 'Hybrid': return 'text-purple-400 bg-purple-900/30';
      default: return 'text-slate-400 bg-slate-700/30';
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'text-slate-400 bg-slate-600';
      case 2: return 'text-blue-400 bg-blue-600';
      case 3: return 'text-purple-400 bg-purple-600';
      default: return 'text-orange-400 bg-orange-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Planet Type Filter */}
          <div>
            <select
              value={selectedPlanetType}
              onChange={(e) => setSelectedPlanetType(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {planetTypeFilters.map(type => (
                <option key={type} value={type}>{type} Worlds</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categoryFilters.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Technology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnologies.map((tech, index) => (
          <motion.div
            key={tech.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedTech(tech)}
            className="cursor-pointer bg-slate-800/50 rounded-xl p-4 border border-slate-600 hover:border-slate-400 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-3">
              <tech.icon className={`w-6 h-6 ${tech.color}`} />
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(tech.category)}`}>
                  {tech.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getTierColor(tech.tier)}`}>
                  T{tech.tier}
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">{tech.name}</h3>
            <p className="text-sm text-slate-400 mb-3">{tech.planetType} • {tech.tierName}</p>
            <p className="text-sm text-slate-300">{tech.description}</p>
            
            <div className="mt-3">
              <div className="text-xs text-slate-500 mb-1">Effects:</div>
              <div className="text-xs text-slate-400">
                {tech.effects.slice(0, 2).join(' • ')}
                {tech.effects.length > 2 && '...'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Technology Detail Modal */}
      {selectedTech && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTech(null)}
        >
          <div 
            className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <selectedTech.icon className={`w-10 h-10 ${selectedTech.color}`} />
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{selectedTech.name}</h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${getCategoryColor(selectedTech.category)}`}>
                      {selectedTech.category}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold text-white ${getTierColor(selectedTech.tier)}`}>
                      Tier {selectedTech.tier} - {selectedTech.tierName}
                    </span>
                    <span className="text-slate-400">{selectedTech.planetType}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTech(null)}
                className="text-slate-400 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>

            <p className="text-slate-300 text-lg mb-6">{selectedTech.description}</p>

            <div className="space-y-6">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <Zap className="w-5 h-5 text-green-400 mr-2" />
                  Technology Effects
                </h4>
                <ul className="space-y-2">
                  {selectedTech.effects.map((effect, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start">
                      <Star className="w-3 h-3 text-green-400 mt-1 mr-2 flex-shrink-0" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <Lock className="w-5 h-5 text-blue-400 mr-2" />
                  Requirements
                </h4>
                <ul className="space-y-2 mb-4">
                  {selectedTech.requirements.map((req, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start">
                      <ArrowRight className="w-3 h-3 text-blue-400 mt-1 mr-2 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
                
                <div className="bg-slate-600/50 rounded-lg p-3">
                  <h5 className="text-sm font-semibold mb-2 flex items-center">
                    <Unlock className="w-4 h-4 text-yellow-400 mr-2" />
                    Unlock Condition
                  </h5>
                  <p className="text-sm text-slate-300">{selectedTech.unlockCondition}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {filteredTechnologies.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No technologies match your current filters</p>
          <p className="text-slate-500 text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

const TechTreePage: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<ColonizationPath>(colonizationPaths[0]);
  const [animationStep, setAnimationStep] = useState(0);

  const radarData = [
    { stat: 'Shields', value: selectedPath.finalStats.shields, fullMark: 100 },
    { stat: 'Weapons', value: selectedPath.finalStats.weapons, fullMark: 100 },
    { stat: 'Industry', value: selectedPath.finalStats.industry, fullMark: 100 },
    { stat: 'Propulsion', value: selectedPath.finalStats.propulsion, fullMark: 100 },
    { stat: 'Sensors', value: selectedPath.finalStats.sensors, fullMark: 100 },
    { stat: 'Biotech', value: selectedPath.finalStats.biotech, fullMark: 100 },
    { stat: 'Survival', value: selectedPath.finalStats.survival, fullMark: 100 }
  ];

  const weightData = selectedPath.planets.map((planet, index) => ({
    planet,
    weight: selectedPath.weights[index],
    order: index + 1
  }));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Planet-Tech Trajectory System
          </h1>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Your colonization order determines your empire's technological DNA. Early colonies carry more weight, 
            creating permanent strategic advantages in specific domains.
          </p>
        </motion.div>

        {/* Path Selector */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Colonization Path Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {colonizationPaths.map((path) => (
              <motion.div
                key={path.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPath(path)}
                className={`cursor-pointer rounded-xl p-4 border transition-all duration-300 ${
                  selectedPath.id === path.id 
                    ? 'border-blue-500 bg-blue-900/30' 
                    : 'border-slate-600 bg-slate-800/50 hover:border-slate-400'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{path.name}</h3>
                <div className="flex items-center space-x-1 mb-3">
                  {path.planets.map((planet, idx) => {
                    const Icon = planetIcons[planet];
                    return (
                      <React.Fragment key={planet}>
                        <Icon className={`w-5 h-5 ${planetColors[planet]}`} />
                        {idx < path.planets.length - 1 && <ArrowRight className="w-3 h-3 text-slate-500" />}
                      </React.Fragment>
                    );
                  })}
                </div>
                <p className="text-sm text-slate-400">{path.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Animated Colonization Timeline */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Colonization Weight Visualization</h2>
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <p className="text-center text-slate-300 mb-8">
              Watch how colonization order affects final technology weighting for: <strong>{selectedPath.name}</strong>
            </p>
            
            <div className="flex justify-center items-center space-x-8 mb-8">
              {selectedPath.planets.map((planet, index) => {
                const Icon = planetIcons[planet];
                const isActive = animationStep >= index;
                const weight = selectedPath.weights[index];
                
                return (
                  <motion.div
                    key={planet}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: isActive ? 1 : 0.5, 
                      opacity: isActive ? 1 : 0.3 
                    }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${
                      isActive ? 'border-blue-400 bg-blue-900/30' : 'border-slate-600 bg-slate-800/50'
                    }`}>
                      <Icon className={`w-8 h-8 ${isActive ? planetColors[planet] : 'text-slate-500'}`} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold">{planet}</p>
                      <p className="text-xs text-slate-400">×{weight}</p>
                      <p className="text-xs text-blue-400">Order {index + 1}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weight Chart */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Colonization Weight Multipliers</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="planet" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="weight" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tech Domain Radar */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Final Tech Domain Strengths</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="stat" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <PolarRadiusAxis 
                      angle={0} 
                      domain={[0, 100]} 
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    />
                    <Radar
                      name="Tech Strength"
                      dataKey="value"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Hybrid Technologies */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Unlocked Hybrid Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedPath.hybridTechs.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-slate-600"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold">{tech}</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  Advanced hybrid technology only available through this specific colonization path.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Technology Database */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Technology Database</h2>
          <TechnologyDatabase />
        </motion.section>

        {/* Key Insights */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">System Design Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Order Matters</h3>
              <p className="text-slate-300 text-sm">
                Early colonies have exponentially more impact on your empire's tech DNA. 
                First colony gets ×3 weight, second gets ×2, etc.
              </p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Unique Identities</h3>
              <p className="text-slate-300 text-sm">
                Same final planets in different orders create completely different empire archetypes 
                with distinct strengths and hybrid technologies.
              </p>
            </div>
            <div className="text-center">
              <ArrowRight className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Strategic Depth</h3>
              <p className="text-slate-300 text-sm">
                Players must balance expansion speed vs. specialization, creating meaningful 
                trade-offs in every colonization decision.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default TechTreePage;