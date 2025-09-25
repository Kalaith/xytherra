import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Sparkles, 
  Users, 
  Leaf,
  Target,
  Globe,
  Zap,
  Heart,
  ArrowRight,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

interface VictoryCondition {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  description: string;
  requirements: string[];
  strategy: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  timeframe: string;
  examples: string[];
  planetFocus: string[];
  tips: string[];
}

const victoryConditions: VictoryCondition[] = [
  {
    id: 'domination',
    name: 'Domination Victory',
    icon: Crown,
    color: 'text-red-400',
    bgGradient: 'from-red-900 to-orange-800',
    description: 'Conquer enough unique planet types to control all major technology domains',
    requirements: [
      'Control at least 5 different planet types',
      'Achieve Tier 2+ research on each controlled type',
      'Maintain control for 20+ consecutive turns',
      'Defeat any rival empires contesting key planets'
    ],
    strategy: 'Aggressive expansion focusing on planetary diversity over specialization',
    difficulty: 'Medium',
    timeframe: 'Mid to Late Game (150-200 turns)',
    examples: [
      'Control Water + Volcanic + Rocky + Gas + Living worlds',
      'Establish military superiority through hybrid technologies',
      'Use combined tech advantages to overwhelm specialized empires'
    ],
    planetFocus: ['All Types', 'Military Priority', 'Hybrid Combinations'],
    tips: [
      'Prioritize contested planet types early',
      'Build diverse fleets using multiple tech domains',
      'Focus on denying rivals their preferred planet types'
    ]
  },
  {
    id: 'tech-ascendancy',
    name: 'Tech Ascendancy Victory',
    icon: Sparkles,
    color: 'text-purple-400',
    bgGradient: 'from-purple-900 to-indigo-800',
    description: 'Master all technology domains and unlock Stellar Engineering capabilities',
    requirements: [
      'Achieve Tier 3 (Mastery) on all 7 planet types',
      'Unlock at least 3 different hybrid technologies',
      'Complete the Stellar Engineering project',
      'Construct a Dyson Sphere or Artificial Planet'
    ],
    strategy: 'Long-term technological supremacy through comprehensive research',
    difficulty: 'Expert',
    timeframe: 'Late Game (250+ turns)',
    examples: [
      'Build research networks across diverse planetary types',
      'Invest heavily in science infrastructure',
      'Unlock reality-bending technologies'
    ],
    planetFocus: ['All Types Required', 'Research Infrastructure', 'Long-term Investment'],
    tips: [
      'Establish early research agreements with other empires',
      'Focus on planet types that boost research speed',
      'Protect research colonies from military threats'
    ]
  },
  {
    id: 'federation',
    name: 'Federation Victory',
    icon: Users,
    color: 'text-blue-400',
    bgGradient: 'from-blue-900 to-cyan-800',
    description: 'Unite empires with complementary planet-tech mastery into a galactic coalition',
    requirements: [
      'Form permanent alliances with 3+ other empires',
      'Each ally must specialize in different planet types',
      'Achieve collective control of all 7 planet domains',
      'Pass the Galactic Unity Resolution'
    ],
    strategy: 'Diplomatic coordination focusing on mutual technological benefits',
    difficulty: 'Hard',
    timeframe: 'Mid to Late Game (180-220 turns)',
    examples: [
      'Oceanic Concord (Shields) + Forge Union (Weapons) + Nomad Fleet (Propulsion)',
      'Share hybrid technologies across federation members',
      'Coordinate expansion to avoid technological overlap'
    ],
    planetFocus: ['Specialization', 'Complementary Partners', 'Diplomatic Balance'],
    tips: [
      'Specialize heavily in 2-3 planet types for bargaining power',
      'Maintain positive relations early in the game',
      'Coordinate colonization efforts with potential allies'
    ]
  },
  {
    id: 'survival',
    name: 'Survival Victory',
    icon: Leaf,
    color: 'text-green-400',
    bgGradient: 'from-green-900 to-emerald-800',
    description: 'Terraform or adapt to every environment, proving universal adaptability',
    requirements: [
      'Successfully colonize all 7 planet types',
      'Adapt to hazardous environments without terraforming OR',
      'Terraform hostile worlds to habitable status',
      'Maintain colonies on each type for 30+ turns'
    ],
    strategy: 'Adaptive expansion with focus on survival and environmental technologies',
    difficulty: 'Easy',
    timeframe: 'Early to Mid Game (100-150 turns)',
    examples: [
      'Develop environmental suits for volcanic worlds',
      'Create underwater habitats for ocean planets',
      'Build radiation-resistant colonies on desolate worlds'
    ],
    planetFocus: ['Environmental Adaptation', 'Survival Tech', 'Gradual Expansion'],
    tips: [
      'Invest early in adaptation technologies',
      'Choose starting faction with survival bonuses',
      'Focus on sustainable colony growth over rapid expansion'
    ]
  }
];

const VictoryPage: React.FC = () => {
  const [selectedVictory, setSelectedVictory] = useState<VictoryCondition | null>(null);
  const [activeTab, setActiveTab] = useState<'requirements' | 'strategy' | 'examples'>('requirements');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-900/30';
      case 'Medium': return 'bg-yellow-900/30';
      case 'Hard': return 'bg-orange-900/30';
      case 'Expert': return 'bg-red-900/30';
      default: return 'bg-slate-800/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Victory Conditions
          </h1>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Multiple paths to galactic supremacy based on planetary mastery. Each victory type rewards different 
            strategic approaches to colonization and technological development.
          </p>
        </motion.div>

        {/* Victory Path Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {victoryConditions.map((victory, index) => (
            <motion.div
              key={victory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              onClick={() => setSelectedVictory(victory)}
              className="cursor-pointer group"
            >
              <div className={`bg-gradient-to-br ${victory.bgGradient} rounded-xl p-8 border border-slate-600 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl h-full`}>
                <div className="flex items-center justify-between mb-6">
                  <victory.icon className={`w-12 h-12 ${victory.color}`} />
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(victory.difficulty)} ${getDifficultyBg(victory.difficulty)}`}>
                      {victory.difficulty}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{victory.name}</h3>
                <p className="text-slate-300 mb-6">{victory.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-slate-400">{victory.timeframe}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-slate-400">{victory.strategy}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex space-x-1">
                    {victory.requirements.slice(0, 3).map((_, idx) => (
                      <div key={idx} className="w-2 h-2 bg-blue-400 rounded-full opacity-60" />
                    ))}
                    {victory.requirements.length > 3 && (
                      <span className="text-xs text-slate-400 ml-1">+{victory.requirements.length - 3}</span>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Victory Detail Modal */}
        {selectedVictory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedVictory(null)}
          >
            <div 
              className={`bg-gradient-to-br ${selectedVictory.bgGradient} rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-600`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <selectedVictory.icon className={`w-12 h-12 ${selectedVictory.color}`} />
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{selectedVictory.name}</h2>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(selectedVictory.difficulty)} ${getDifficultyBg(selectedVictory.difficulty)}`}>
                        {selectedVictory.difficulty}
                      </span>
                      <span className="text-slate-300">{selectedVictory.timeframe}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVictory(null)}
                  className="text-slate-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>

              <p className="text-slate-200 text-lg mb-6">{selectedVictory.description}</p>

              {/* Tabs */}
              <div className="flex space-x-4 mb-6 border-b border-slate-600">
                {(['requirements', 'strategy', 'examples'] as const).map((tab) => (
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
              {activeTab === 'requirements' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Victory Requirements
                    </h4>
                    <ul className="space-y-3">
                      {selectedVictory.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <Globe className="w-5 h-5 text-purple-400 mr-2" />
                      Planet Focus Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVictory.planetFocus.map((focus, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'strategy' && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-3">Core Strategy</h4>
                    <p className="text-slate-300">{selectedVictory.strategy}</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-2" />
                      Strategic Tips
                    </h4>
                    <ul className="space-y-2">
                      {selectedVictory.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start">
                          <ArrowRight className="w-3 h-3 text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'examples' && (
                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Example Scenarios</h4>
                    <div className="space-y-4">
                      {selectedVictory.examples.map((example, idx) => (
                        <div key={idx} className="border-l-2 border-blue-400 pl-4 py-2">
                          <p className="text-slate-300 text-sm">{example}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Victory Design Philosophy */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Victory Design Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Multiple Paths</h3>
              <p className="text-slate-300 text-sm">
                Four distinct victory conditions reward different strategic approaches 
                and playstyles.
              </p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Planet-Based</h3>
              <p className="text-slate-300 text-sm">
                All victories tied to planetary mastery and colonization choices, 
                reinforcing core mechanics.
              </p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Meaningful Choice</h3>
              <p className="text-slate-300 text-sm">
                Each path requires different colonization strategies and 
                technological priorities.
              </p>
            </div>
            <div className="text-center">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Emergent Stories</h3>
              <p className="text-slate-300 text-sm">
                Victory conditions create narrative moments that reflect 
                your empire's unique journey.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default VictoryPage;