import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Waves, 
  Flame, 
  Leaf, 
  Wind, 
  Skull,
  Heart,
  Plane,
  Compass,
  Star,
  ArrowRight
} from 'lucide-react';

interface Faction {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  homeworld: string;
  homeworldType: string;
  startingBonus: string;
  description: string;
  playstyle: string;
  strengths: string[];
  weaknesses: string[];
  emergentIdentity: string;
  lore: string;
}

const factions: Faction[] = [
  {
    id: 'forge-union',
    name: 'Forge Union',
    icon: Flame,
    color: 'text-red-400',
    bgGradient: 'from-red-900 to-orange-800',
    homeworld: 'Pyraxis Prime',
    homeworldType: 'Volcanic World',
    startingBonus: '+20% weapons research, +15% energy production',
    description: 'Industrial militarists who emerged from the molten forges of Pyraxis Prime',
    playstyle: 'Aggressive expansion with superior firepower',
    strengths: ['Early weapon superiority', 'High energy output', 'Thermal resistance'],
    weaknesses: ['Vulnerable to shields', 'Slow colonization of cold worlds', 'Limited sensors'],
    emergentIdentity: 'weapons-focused traders with efficient fleets',
    lore: 'Born in the crucible of volcanic storms, the Forge Union believes that strength through fire purifies the galaxy. Their massive orbital foundries churn out weapons of unmatched destructive power.'
  },
  {
    id: 'oceanic-concord',
    name: 'Oceanic Concord',
    icon: Waves,
    color: 'text-blue-400',
    bgGradient: 'from-blue-900 to-cyan-800',
    homeworld: 'Nerevia Prime',
    homeworldType: 'Water World',
    startingBonus: '+20% shield research, +25% food production',
    description: 'Peaceful aquatic civilization focused on defense and sustainability',
    playstyle: 'Defensive expansion with strong diplomatic ties',
    strengths: ['Superior shields', 'Sustainable growth', 'Heat dissipation'],
    weaknesses: ['Limited offensive power', 'Slow on desolate worlds', 'Vulnerable to bioweapons'],
    emergentIdentity: 'defensive-heavy empire with brewing weapons edge',
    lore: 'The depths of Nerevia taught patience and resilience. The Concord believes in protection over aggression, creating impenetrable barriers while fostering life across the stars.'
  },
  {
    id: 'verdant-kin',
    name: 'Verdant Kin',
    icon: Leaf,
    color: 'text-green-400',
    bgGradient: 'from-green-900 to-emerald-800',
    homeworld: 'Gaia Nexus',
    homeworldType: 'Living World',
    startingBonus: '+30% biotech research, +20% colony growth rate',
    description: 'Bio-symbiotic collective that merges with planetary ecosystems',
    playstyle: 'Adaptive colonization with organic technology',
    strengths: ['Rapid adaptation', 'Self-healing systems', 'Biological warfare'],
    weaknesses: ['Vulnerable to radiation', 'Slow on sterile worlds', 'Limited industry'],
    emergentIdentity: 'biotech mastery specialists with regenerative capabilities',
    lore: 'The Verdant Kin evolved alongside their world, becoming one with nature itself. They spread life wherever they go, transforming barren worlds into gardens.'
  },
  {
    id: 'nomad-fleet',
    name: 'The Nomad Fleet',
    icon: Wind,
    color: 'text-purple-400',
    bgGradient: 'from-purple-900 to-indigo-800',
    homeworld: 'Tempest Station',
    homeworldType: 'Gas Giant',
    startingBonus: '+30% propulsion research, +25% fuel efficiency',
    description: 'Eternal wanderers who harvest the storms of gas giants',
    playstyle: 'Highly mobile hit-and-run tactics',
    strengths: ['Superior mobility', 'Fuel abundance', 'Storm harvesting'],
    weaknesses: ['Fragile ships', 'Limited ground forces', 'Vulnerable when stationary'],
    emergentIdentity: 'fast, fuel-rich traders with superior propulsion',
    lore: 'Never settling, always moving. The Nomad Fleet believes home is wherever the wind takes them, riding the cosmic storms between stars.'
  },
  {
    id: 'ashborn-syndicate',
    name: 'Ashborn Syndicate',
    icon: Skull,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-900 to-amber-800',
    homeworld: 'Cinder Reach',
    homeworldType: 'Desolate World',
    startingBonus: '+25% survival research, +30% salvage efficiency',
    description: 'Hardy scavengers who thrive in the harshest environments',
    playstyle: 'Opportunistic expansion with resource efficiency',
    strengths: ['Environmental immunity', 'Resource efficiency', 'Salvage expertise'],
    weaknesses: ['Limited growth rate', 'Poor diplomacy', 'Vulnerable to biotech'],
    emergentIdentity: 'survivalists with scrappy, efficient fleets',
    lore: 'Forged by necessity in the wasteland of Cinder Reach, the Syndicate knows that only the adaptive survive. They turn scraps into starships and ash into empires.'
  }
];

const FactionsPage: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lore' | 'mechanics'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Starting Factions
          </h1>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Each faction begins with a unique homeworld that defines their technological path and cultural identity. 
            Choose your starting world wisely - it shapes your entire empire's destiny.
          </p>
        </motion.div>

        {/* Faction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {factions.map((faction, index) => (
            <motion.div
              key={faction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedFaction(faction)}
              className="cursor-pointer group"
            >
              <div className={`bg-gradient-to-br ${faction.bgGradient} rounded-xl p-6 border border-slate-600 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl h-full`}>
                <div className="flex items-center justify-between mb-4">
                  <faction.icon className={`w-10 h-10 ${faction.color}`} />
                  <div className="text-right">
                    <p className="text-xs text-slate-300">{faction.homeworldType}</p>
                    <p className="text-sm font-semibold text-slate-200">{faction.homeworld}</p>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{faction.name}</h3>
                <p className="text-sm text-slate-300 mb-4">{faction.description}</p>
                
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="text-slate-400">Playstyle:</span>
                    <span className="text-slate-200 ml-1">{faction.playstyle}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-400">Starting Bonus:</span>
                    <span className={`ml-1 ${faction.color}`}>{faction.startingBonus}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-1">
                    {faction.strengths.slice(0, 2).map((_, idx) => (
                      <div key={idx} className="w-2 h-2 bg-green-400 rounded-full opacity-60" />
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Faction Detail Modal */}
        {selectedFaction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedFaction(null)}
          >
            <div 
              className={`bg-gradient-to-br ${selectedFaction.bgGradient} rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-600`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <selectedFaction.icon className={`w-12 h-12 ${selectedFaction.color}`} />
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{selectedFaction.name}</h2>
                    <p className="text-lg text-slate-200">{selectedFaction.homeworld}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFaction(null)}
                  className="text-slate-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-4 mb-6 border-b border-slate-600">
                {(['overview', 'lore', 'mechanics'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 px-1 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-white border-b-2 border-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <p className="text-slate-200 text-lg">{selectedFaction.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold mb-3 flex items-center">
                        <Star className="w-5 h-5 text-green-400 mr-2" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {selectedFaction.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold mb-3 flex items-center">
                        <Compass className="w-5 h-5 text-red-400 mr-2" />
                        Weaknesses
                      </h4>
                      <ul className="space-y-2">
                        {selectedFaction.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-2">Emergent Identity</h4>
                    <p className="text-slate-300">{selectedFaction.emergentIdentity}</p>
                  </div>
                </div>
              )}

              {activeTab === 'lore' && (
                <div className="space-y-4">
                  <p className="text-slate-200 leading-relaxed">{selectedFaction.lore}</p>
                </div>
              )}

              {activeTab === 'mechanics' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-3">Starting Advantages</h4>
                    <p className={`text-sm ${selectedFaction.color} mb-2`}>{selectedFaction.startingBonus}</p>
                    <p className="text-sm text-slate-300">Homeworld: {selectedFaction.homeworld} ({selectedFaction.homeworldType})</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-3">Recommended Playstyle</h4>
                    <p className="text-slate-300">{selectedFaction.playstyle}</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-3">Strategic Considerations</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Early expansion should prioritize complementary planet types</li>
                      <li>• Leverage starting bonuses to establish technological leads</li>
                      <li>• Plan colonization order to mitigate faction weaknesses</li>
                      <li>• Consider diplomatic opportunities with factions having complementary strengths</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Design Philosophy */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Faction Design Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Meaningful Choices</h3>
              <p className="text-slate-300 text-sm">
                Each faction's homeworld creates lasting strategic implications, 
                not just cosmetic differences.
              </p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Emergent Identity</h3>
              <p className="text-slate-300 text-sm">
                Factions develop unique personalities based on their 
                colonization choices and planetary discoveries.
              </p>
            </div>
            <div className="text-center">
              <Plane className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Adaptive Strategy</h3>
              <p className="text-slate-300 text-sm">
                Starting bonuses guide but don't lock players into 
                single-dimensional strategies.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default FactionsPage;