import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Waves, 
  Flame, 
  Mountain, 
  Wind, 
  Snowflake, 
  Leaf, 
  Skull,
  Sparkles,
  Shield,
  Zap,
  Wrench,
  Eye,
  Heart,
  Atom,
  Layers,
  AlertTriangle,
  Gem,
  Star
} from 'lucide-react';

interface PlanetType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  domain: string;
  description: string;
  examples: string[];
  tier1: string;
  tier2: string;
  tier3: string;
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Ultra-Rare';
  appearance?: string;
  strategicResources?: string[];
  adaptationRequired?: string;
  planetTraits?: string[];
}

const planetTypes: PlanetType[] = [
  {
    id: 'water',
    name: 'Water Worlds',
    icon: Waves,
    color: 'text-blue-400',
    bgColor: 'from-blue-900 to-blue-700',
    domain: 'Shields & Cooling',
    description: 'Oceans and ice-covered worlds that excel in defensive technologies',
    examples: ['Hydrodynamic Shielding', 'Coolant Recycling', 'Aquatic Habitats'],
    tier1: 'Heat-resistant hulls',
    tier2: 'Coolant Recycling — ships run longer before overheating',
    tier3: 'Aquatic Habitats — cheap, food-rich colony growth',
    rarity: 'Common',
    strategicResources: ['Hydro-Compounds', 'Deep Water'],
    adaptationRequired: 'Underwater habitats or floating platforms',
    planetTraits: ['Abundant Food', 'Shield Research Bonus', 'Storm Systems']
  },
  {
    id: 'volcanic',
    name: 'Volcanic Worlds',
    icon: Flame,
    color: 'text-red-400',
    bgColor: 'from-red-900 to-orange-700',
    domain: 'Weapons & Energy',
    description: 'Fire and lava worlds focused on offensive capabilities',
    examples: ['Plasma Lances', 'Geothermal Reactors', 'Thermal Overdrive'],
    tier1: 'Heat-resistant hulls',
    tier2: 'Plasma cannons, geothermal reactors',
    tier3: 'Planet-cracking thermal lances',
    rarity: 'Common',
    strategicResources: ['Thermal Plasma', 'Molten Metals'],
    adaptationRequired: 'Environmental stabilization or protective infrastructure',
    planetTraits: ['High Volcanic Activity', 'Energy Rich', 'Hazardous Atmosphere']
  },
  {
    id: 'rocky',
    name: 'Rocky Worlds',
    icon: Mountain,
    color: 'text-gray-400',
    bgColor: 'from-gray-900 to-stone-700',
    domain: 'Industry & Manufacturing',
    description: 'Terrestrial worlds that boost production and construction',
    examples: ['Nano-Forging', 'Tectonic Stabilizers', 'Industrial Foundries'],
    tier1: 'Basic manufacturing',
    tier2: 'Nano-Forging — faster construction',
    tier3: 'Industrial Foundries — increased alloy output',
    rarity: 'Common',
    strategicResources: ['Heavy Metals', 'Industrial Minerals'],
    adaptationRequired: 'Basic atmospheric processors (minimal)',
    planetTraits: ['Stable Geology', 'Mineral Rich', 'Easily Colonizable']
  },
  {
    id: 'gas',
    name: 'Gas Giants',
    icon: Wind,
    color: 'text-purple-400',
    bgColor: 'from-purple-900 to-indigo-700',
    domain: 'Propulsion & Fuel',
    description: 'Massive gas worlds providing advanced propulsion systems',
    examples: ['Ion Drive Enhancements', 'Exotic Gas Reactors', 'Gravity Harnessing'],
    tier1: 'Basic ion drives',
    tier2: 'Ion Drive Enhancements — faster travel',
    tier3: 'Gravity Harnessing — planetary defense multipliers',
    rarity: 'Common',
    strategicResources: ['Exotic Gases', 'Hydrogen Isotopes'],
    adaptationRequired: 'Orbital platforms and atmospheric mining equipment',
    planetTraits: ['Massive Gravity Well', 'Rich Atmosphere', 'Storm Systems']
  },
  {
    id: 'ice',
    name: 'Ice Worlds',
    icon: Snowflake,
    color: 'text-cyan-400',
    bgColor: 'from-cyan-900 to-blue-800',
    domain: 'Sensors & Data',
    description: 'Crystal and frozen worlds enhancing information processing',
    examples: ['Cryo-Memory Storage', 'Crystal Resonance Sensors', 'Cryogenic Mining'],
    tier1: 'Basic sensors',
    tier2: 'Cryo-Memory Storage — boosts AI and research',
    tier3: 'Crystal Resonance Sensors — detect cloaked fleets',
    rarity: 'Common',
    strategicResources: ['Cryo-Crystals', 'Frozen Compounds'],
    adaptationRequired: 'Thermal regulation systems and insulated habitats',
    planetTraits: ['Sub-zero Temperatures', 'Crystal Formations', 'Data Processing Bonus']
  },
  {
    id: 'living',
    name: 'Living Worlds',
    icon: Leaf,
    color: 'text-green-400',
    bgColor: 'from-green-900 to-emerald-700',
    domain: 'Biotech & Regeneration',
    description: 'Eden worlds with advanced biological technologies',
    examples: ['Organic Armor', 'Sporefield Weapons', 'Bio-Colonization'],
    tier1: 'Basic biotech',
    tier2: 'Organic Armor — self-healing hull plating',
    tier3: 'Bio-Colonization — faster colony growth',
    rarity: 'Uncommon',
    strategicResources: ['Bio-Essence', 'Living Biomass'],
    adaptationRequired: 'Biological compatibility screening and ecosystem integration',
    planetTraits: ['Rich Biosphere', 'Self-Healing Environment', 'Rapid Growth']
  },
  {
    id: 'desolate',
    name: 'Desolate Worlds',
    icon: Skull,
    color: 'text-yellow-400',
    bgColor: 'from-yellow-900 to-amber-700',
    domain: 'Survival & Adaptability',
    description: 'Harsh environments fostering survival technologies',
    examples: ['Radiation-Hardened Hulls', 'Scrap Engineering', 'Terraforming Accelerants'],
    tier1: 'Basic survival tech',
    tier2: 'Radiation-Hardened Hulls — resist extreme environments',
    tier3: 'Terraforming Accelerants — reduce terraforming costs',
    rarity: 'Common',
    strategicResources: ['Rare Metals', 'Radioactive Materials'],
    adaptationRequired: 'Radiation shielding and environmental suits',
    planetTraits: ['High Radiation', 'Resource Rich', 'Dangerous Wildlife']
  },
  {
    id: 'exotic',
    name: 'Exotic Worlds',
    icon: Atom,
    color: 'text-purple-300',
    bgColor: 'from-purple-900 via-indigo-900 to-violet-800',
    domain: 'Experimental & Breakthrough Tech',
    description: 'Ultra-rare anomalous worlds that defy conventional physics',
    examples: ['Quantum Rift Drives', 'Reality Shunts', 'Entropic Weapons'],
    tier1: 'Anomaly Analysis — basic understanding of exotic physics',
    tier2: 'Quantum Manipulation — harness anomalous properties',
    tier3: 'Reality Engineering — reshape spacetime itself',
    rarity: 'Ultra-Rare',
    appearance: 'Mid to Late Game',
    strategicResources: ['Quantum Crystals', 'Temporal Fragments', 'Dark Energy'],
    adaptationRequired: 'Advanced physics research and specialized equipment',
    planetTraits: ['Temporal Anomalies', 'Gravitational Distortions', 'Reality Fluctuations']
  }
];

const PlanetTypesPage: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetType | null>(null);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Planet Types & Technology Domains
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
            Each planet type represents a unique technology domain. The planets you colonize determine your empire's technological trajectory.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {planetTypes.map((planet, index) => (
            <motion.div
              key={planet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPlanet(planet)}
              className="cursor-pointer group"
            >
              <div className={`bg-gradient-to-br ${planet.bgColor} rounded-xl p-6 border border-slate-600 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}>
                <div className="flex items-center justify-between mb-4">
                  <planet.icon className={`w-8 h-8 ${planet.color}`} />
                  <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${planet.bgColor}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{planet.name}</h3>
                <p className="text-sm text-slate-300 mb-3">{planet.domain}</p>
                <p className="text-xs text-slate-400">{planet.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPlanet(null)}
          >
            <div 
              className={`bg-gradient-to-br ${selectedPlanet.bgColor} rounded-2xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <selectedPlanet.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${selectedPlanet.color}`} />
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{selectedPlanet.name}</h2>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-200">{selectedPlanet.domain}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-slate-200 mb-6">{selectedPlanet.description}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    Research Tiers
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <span className="font-semibold">Survey</span>
                      </div>
                      <p className="text-sm text-slate-300">{selectedPlanet.tier1}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <span className="font-semibold">Colony</span>
                      </div>
                      <p className="text-sm text-slate-300">{selectedPlanet.tier2}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <span className="font-semibold">Mastery</span>
                      </div>
                      <p className="text-sm text-slate-300">{selectedPlanet.tier3}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Technology Examples</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedPlanet.examples.map((example, idx) => (
                      <div key={idx} className="bg-slate-800/30 rounded-lg p-3">
                        <span className="text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Additional Planet Information */}
                {(selectedPlanet.strategicResources || selectedPlanet.adaptationRequired || selectedPlanet.planetTraits || selectedPlanet.rarity) && (
                  <div className="space-y-4">
                    {selectedPlanet.rarity && (
                      <div className="bg-slate-800/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-2 flex items-center">
                          <Gem className="w-5 h-5 text-purple-400 mr-2" />
                          Planet Rarity
                        </h4>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          selectedPlanet.rarity === 'Ultra-Rare' ? 'bg-purple-900/50 text-purple-300' :
                          selectedPlanet.rarity === 'Rare' ? 'bg-blue-900/50 text-blue-300' :
                          selectedPlanet.rarity === 'Uncommon' ? 'bg-green-900/50 text-green-300' :
                          'bg-slate-700/50 text-slate-300'
                        }`}>
                          {selectedPlanet.rarity}
                        </div>
                        {selectedPlanet.appearance && (
                          <p className="text-sm text-slate-400 mt-2">Appears: {selectedPlanet.appearance}</p>
                        )}
                      </div>
                    )}
                    
                    {selectedPlanet.strategicResources && (
                      <div className="bg-slate-800/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-3 flex items-center">
                          <Layers className="w-5 h-5 text-yellow-400 mr-2" />
                          Strategic Resources
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPlanet.strategicResources.map((resource, idx) => (
                            <span key={idx} className="px-2 py-1 bg-yellow-900/30 border border-yellow-400/30 rounded text-xs text-yellow-200">
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedPlanet.adaptationRequired && (
                      <div className="bg-slate-800/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-2 flex items-center">
                          <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
                          Adaptation Required
                        </h4>
                        <p className="text-sm text-slate-300">{selectedPlanet.adaptationRequired}</p>
                      </div>
                    )}
                    
                    {selectedPlanet.planetTraits && (
                      <div className="bg-slate-800/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-3 flex items-center">
                          <Sparkles className="w-5 h-5 text-cyan-400 mr-2" />
                          Planet Traits
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPlanet.planetTraits.map((trait, idx) => (
                            <span key={idx} className="px-2 py-1 bg-cyan-900/30 border border-cyan-400/30 rounded text-xs text-cyan-200">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Hybrid Technologies</h2>
          <p className="text-slate-300 text-center mb-8">
            When you control multiple planet types and reach required research tiers, unique hybrid technologies unlock.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-900/50 to-red-900/50 rounded-xl p-6 border border-slate-600">
              <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <Waves className="w-5 h-5 text-blue-400" />
                <span>+</span>
                <Flame className="w-5 h-5 text-red-400" />
              </h4>
              <p className="text-sm text-slate-300 mb-2"><strong>Steam Burst Weapons</strong></p>
              <p className="text-xs text-slate-400">Area-of-effect plasma/steam weapons stabilized by coolant systems</p>
            </div>
            
            <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 rounded-xl p-6 border border-slate-600">
              <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <Snowflake className="w-5 h-5 text-cyan-400" />
                <span>+</span>
                <Wind className="w-5 h-5 text-purple-400" />
              </h4>
              <p className="text-sm text-slate-300 mb-2"><strong>Cryo-Ion Drives</strong></p>
              <p className="text-xs text-slate-400">Extremely efficient long-range travel technology</p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900/50 to-green-900/50 rounded-xl p-6 border border-slate-600">
              <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <Mountain className="w-5 h-5 text-gray-400" />
                <span>+</span>
                <Leaf className="w-5 h-5 text-green-400" />
              </h4>
              <p className="text-sm text-slate-300 mb-2"><strong>Organic Nanoforges</strong></p>
              <p className="text-xs text-slate-400">Living factories that self-repair and adapt</p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-900/50 to-blue-900/50 rounded-xl p-6 border border-slate-600">
              <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <Skull className="w-5 h-5 text-yellow-400" />
                <span>+</span>
                <Waves className="w-5 h-5 text-blue-400" />
              </h4>
              <p className="text-sm text-slate-300 mb-2"><strong>Radiation-Dissipating Barriers</strong></p>
              <p className="text-xs text-slate-400">Advanced defensive fields that neutralize hazardous environments</p>
            </div>
          </div>
        </motion.section>

        {/* Strategic Resources */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Strategic Resources</h2>
          <p className="text-slate-300 text-center mb-8">
            Unique materials tied to planet types that enable advanced technologies and reinforce specialization.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center space-x-3 mb-4">
                <Wind className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Exotic Gases</h3>
              </div>
              <p className="text-sm text-slate-400 mb-3">From Gas Giants</p>
              <p className="text-sm text-slate-300 mb-3">Rare atmospheric compounds that power advanced reactors and propulsion systems.</p>
              <div className="text-xs text-slate-400">
                • Enables Ion Drive Enhancements<br/>
                • Powers hybrid technologies<br/>
                • Required for gravity manipulation
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center space-x-3 mb-4">
                <Atom className="w-6 h-6 text-purple-300" />
                <h3 className="text-lg font-semibold">Quantum Crystals</h3>
              </div>
              <p className="text-sm text-slate-400 mb-3">From Exotic Worlds</p>
              <p className="text-sm text-slate-300 mb-3">Crystallized spacetime that enables reality-bending technologies.</p>
              <div className="text-xs text-slate-400">
                • Required for Quantum Rift Drives<br/>
                • Enables temporal manipulation<br/>
                • Ultra-rare and extremely valuable
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold">Bio-Essence</h3>
              </div>
              <p className="text-sm text-slate-400 mb-3">From Living Worlds</p>
              <p className="text-sm text-slate-300 mb-3">Living genetic material that powers organic technologies.</p>
              <div className="text-xs text-slate-400">
                • Required for Organic Armor<br/>
                • Enables bio-colonization<br/>
                • Self-replicating resource
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center space-x-3 mb-4">
                <Skull className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold">Rare Metals</h3>
              </div>
              <p className="text-sm text-slate-400 mb-3">From Desolate Worlds</p>
              <p className="text-sm text-slate-300 mb-3">Heavy elements forged in dying star systems, perfect for radiation shielding.</p>
              <div className="text-xs text-slate-400">
                • Required for radiation-hardened hulls<br/>
                • Enables terraforming accelerants<br/>
                • Abundant on harsh worlds
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center space-x-3 mb-4">
                <Snowflake className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-semibold">Cryo-Crystals</h3>
              </div>
              <p className="text-sm text-slate-400 mb-3">From Ice Worlds</p>
              <p className="text-sm text-slate-300 mb-3">Ultra-cold crystalline structures that enable advanced data processing.</p>
              <div className="text-xs text-slate-400">
                • Powers cryo-memory storage<br/>
                • Required for crystal sensors<br/>
                • Maintains absolute zero temperatures
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center space-x-3 mb-4">
                <Flame className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold">Thermal Plasma</h3>
              </div>
              <p className="text-sm text-slate-400 mb-3">From Volcanic Worlds</p>
              <p className="text-sm text-slate-300 mb-3">Superheated matter that can be weaponized or harnessed for energy.</p>
              <div className="text-xs text-slate-400">
                • Powers plasma cannons<br/>
                • Required for geothermal reactors<br/>
                • Enables planet-cracking weapons
              </div>
            </div>
          </div>
        </motion.section>

        {/* Adaptation Technologies */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Adaptation Technologies</h2>
          <p className="text-slate-300 text-center mb-8">
            Specialized technologies required to colonize hostile planet types. Investment in adaptation unlocks new worlds for expansion.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-orange-400 mr-3" />
                Environmental Challenges
              </h3>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-red-400">
                  <h4 className="font-semibold text-red-400 mb-2">Volcanic Worlds</h4>
                  <p className="text-sm text-slate-300 mb-2">Extreme heat and toxic atmosphere require specialized protection.</p>
                  <p className="text-xs text-slate-400"><strong>Required:</strong> Environmental Stabilization, Heat-Resistant Suits</p>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-cyan-400">
                  <h4 className="font-semibold text-cyan-400 mb-2">Ice Worlds</h4>
                  <p className="text-sm text-slate-300 mb-2">Sub-zero temperatures and crystalline storms challenge colonization.</p>
                  <p className="text-xs text-slate-400"><strong>Required:</strong> Thermal Regulation, Cold-Weather Gear</p>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-yellow-400 mb-2">Desolate Worlds</h4>
                  <p className="text-sm text-slate-300 mb-2">High radiation and scarce resources test survival capabilities.</p>
                  <p className="text-xs text-slate-400"><strong>Required:</strong> Radiation Shielding, Life Support Systems</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Wrench className="w-6 h-6 text-blue-400 mr-3" />
                Adaptation Technologies
              </h3>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Environmental Stabilization</h4>
                  <p className="text-sm text-slate-300 mb-2">Advanced atmospheric processors and climate control systems.</p>
                  <div className="text-xs text-slate-400">
                    • Enables colonization of hostile atmospheres<br/>
                    • Reduces environmental hazard effects<br/>
                    • Prerequisite for many planet types
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Protective Infrastructure</h4>
                  <p className="text-sm text-slate-300 mb-2">Shielded habitats and reinforced colony structures.</p>
                  <div className="text-xs text-slate-400">
                    • Protects colonists from environmental damage<br/>
                    • Increases colony survival rates<br/>
                    • Required for extreme environments
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Adaptive Life Support</h4>
                  <p className="text-sm text-slate-300 mb-2">Flexible systems that adjust to any planetary conditions.</p>
                  <div className="text-xs text-slate-400">
                    • Universal colonization capability<br/>
                    • Reduces adaptation research costs<br/>
                    • Late-game technology unlock
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Conflict Mechanics */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Conflict & Planet Control</h2>
          <p className="text-slate-300 text-center mb-8">
            Wars are fought for tech advantages, not just territory. Control of planets means control of technological domains.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="w-6 h-6 text-red-400 mr-3" />
                Planet Denial Strategies
              </h3>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2">Orbital Bombardment</h4>
                  <p className="text-sm text-slate-300 mb-2">Destroy planetary infrastructure to deny tech benefits to enemies.</p>
                  <div className="text-xs text-slate-400">
                    • Prevents enemy research progress<br/>
                    • Damages planetary resources<br/>
                    • Can trigger diplomatic consequences
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-400 mb-2">Economic Blockade</h4>
                  <p className="text-sm text-slate-300 mb-2">Cut off supply lines to starve hostile colonies.</p>
                  <div className="text-xs text-slate-400">
                    • Slows enemy colony development<br/>
                    • Requires sustained fleet presence<br/>
                    • Less destructive than bombardment
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Espionage Operations</h4>
                  <p className="text-sm text-slate-300 mb-2">Steal research data or sabotage enemy tech development.</p>
                  <div className="text-xs text-slate-400">
                    • Gain access to enemy technologies<br/>
                    • Slow competitor research progress<br/>
                    • Requires intelligence infrastructure
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="w-6 h-6 text-blue-400 mr-3" />
                Diplomatic Alternatives
              </h3>
              
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Research Partnerships</h4>
                  <p className="text-sm text-slate-300 mb-2">Share planetary research rights with allied empires.</p>
                  <div className="text-xs text-slate-400">
                    • Both empires benefit from tech advances<br/>
                    • Builds diplomatic relationships<br/>
                    • Can lead to federation victories
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Technology Trade</h4>
                  <p className="text-sm text-slate-300 mb-2">Exchange access to different planetary tech domains.</p>
                  <div className="text-xs text-slate-400">
                    • Fill gaps in tech specialization<br/>
                    • Enables hybrid technology development<br/>
                    • Reduces need for direct conquest
                  </div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-400 mb-2">Complementary Alliances</h4>
                  <p className="text-sm text-slate-300 mb-2">Form alliances with empires specializing in different domains.</p>
                  <div className="text-xs text-slate-400">
                    • Combine strengths across tech domains<br/>
                    • Essential for federation victory<br/>
                    • Creates mutual dependency
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Special Planet Features */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Special Planet Features</h2>
          <p className="text-slate-300 text-center mb-8">
            Rare planetary variants and anomalies that provide unique strategic opportunities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-6 h-6 text-rainbow-400" />
                <h3 className="text-lg font-semibold">Hybrid Planets</h3>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Rare worlds combining multiple planet types (e.g., Ice-Volcanic, Living-Rocky).
              </p>
              <div className="text-xs text-slate-400">
                • Unlock hybrid techs earlier<br/>
                • Provide multiple resource types<br/>
                • Extremely valuable strategic assets<br/>
                • 5-10% spawn rate
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold">Anomalous Traits</h3>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Special characteristics revealed through surveying that modify planetary benefits.
              </p>
              <div className="text-xs text-slate-400">
                • "Resource Rich" - +50% strategic resources<br/>
                • "Hazardous" - requires adaptation tech<br/>
                • "Ancient Ruins" - bonus research<br/>
                • "Unstable" - random events
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Pristine Worlds</h3>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Perfect examples of their planet type with enhanced research potential.
              </p>
              <div className="text-xs text-slate-400">
                • +100% research speed for that domain<br/>
                • Unlock additional tier 3+ technologies<br/>
                • Highly contested by all empires<br/>
                • 1-2 per galaxy maximum
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default PlanetTypesPage;