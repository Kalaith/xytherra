import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Waves, 
  Flame, 
  Leaf, 
  Wind, 
  Skull,
  Play,
  Settings,
  Users,
  Globe
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import type { FactionType, GameSettings } from '../../types/game.d.ts';

interface FactionInfo {
  id: FactionType;
  name: string;
  icon: React.ElementType;
  color: string;
  homeworld: string;
  description: string;
  bonuses: string[];
}

const FACTIONS: FactionInfo[] = [
  {
    id: 'oceanic-concord',
    name: 'Oceanic Concord',
    icon: Waves,
    color: 'text-blue-400',
    homeworld: 'Water World',
    description: 'Peaceful aquatic civilization focused on defense and sustainability',
    bonuses: ['+20% shield research', '+25% food production', 'Superior heat dissipation']
  },
  {
    id: 'forge-union',
    name: 'Forge Union',
    icon: Flame,
    color: 'text-red-400',
    homeworld: 'Volcanic World',
    description: 'Industrial militarists who emerged from molten forges',
    bonuses: ['+20% weapons research', '+15% energy production', 'Thermal resistance']
  },
  {
    id: 'verdant-kin',
    name: 'Verdant Kin',
    icon: Leaf,
    color: 'text-green-400',
    homeworld: 'Living World',
    description: 'Bio-symbiotic collective that merges with planetary ecosystems',
    bonuses: ['+30% biotech research', '+20% colony growth', 'Biological adaptation']
  },
  {
    id: 'nomad-fleet',
    name: 'Nomad Fleet',
    icon: Wind,
    color: 'text-purple-400',
    homeworld: 'Gas Giant',
    description: 'Eternal wanderers who harvest storms of gas giants',
    bonuses: ['+30% propulsion research', '+25% fuel efficiency', 'Superior mobility']
  },
  {
    id: 'ashborn-syndicate',
    name: 'Ashborn Syndicate',
    icon: Skull,
    color: 'text-yellow-400',
    homeworld: 'Desolate World',
    description: 'Hardy scavengers who thrive in harsh environments',
    bonuses: ['+25% survival research', '+30% salvage efficiency', 'Environmental immunity']
  }
];

export const GameSetup: React.FC = () => {
  const startGame = useGameStore((state) => state.startGame);
  const setPlayerEmpire = useGameStore((state) => state.setPlayerEmpire);
  
  const [selectedFaction, setSelectedFaction] = useState<FactionType>('oceanic-concord');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    galaxySize: 'medium',
    difficulty: 'normal',
    numEmpires: 5,
    victoryConditions: ['domination', 'federation', 'techAscendancy']
  });

  const handleStartGame = () => {
    startGame(gameSettings);
    setPlayerEmpire('empire-0'); // Player is always the first empire
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 bg-clip-text text-transparent">
            Xytherra
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            4X Grand Strategy: Where Planets Are Technology Trees
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Faction Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Choose Your Faction
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FACTIONS.map((faction) => (
                <motion.div
                  key={faction.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedFaction(faction.id)}
                  className={`cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
                    selectedFaction === faction.id
                      ? 'border-blue-400 bg-blue-900/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <faction.icon className={`w-8 h-8 ${faction.color}`} />
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Homeworld</p>
                      <p className="text-sm font-semibold">{faction.homeworld}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{faction.name}</h3>
                  <p className="text-sm text-slate-300 mb-4">{faction.description}</p>
                  
                  <div className="space-y-1">
                    {faction.bonuses.map((bonus, idx) => (
                      <div key={idx} className="text-xs text-slate-400 flex items-center">
                        <div className="w-1 h-1 bg-green-400 rounded-full mr-2" />
                        {bonus}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Game Settings */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Game Settings
              </h2>
              
              <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
                {/* Galaxy Size */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    Galaxy Size
                  </label>
                  <select
                    value={gameSettings.galaxySize}
                    onChange={(e) => setGameSettings({
                      ...gameSettings,
                      galaxySize: e.target.value as 'small' | 'medium' | 'large'
                    })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="small">Small (20 systems)</option>
                    <option value="medium">Medium (35 systems)</option>
                    <option value="large">Large (50 systems)</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={gameSettings.difficulty}
                    onChange={(e) => setGameSettings({
                      ...gameSettings,
                      difficulty: e.target.value as 'easy' | 'normal' | 'hard'
                    })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Number of Empires */}
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Empires</label>
                  <select
                    value={gameSettings.numEmpires}
                    onChange={(e) => setGameSettings({
                      ...gameSettings,
                      numEmpires: parseInt(e.target.value)
                    })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value={3}>3 Empires</option>
                    <option value={4}>4 Empires</option>
                    <option value={5}>5 Empires</option>
                    <option value={6}>6 Empires</option>
                  </select>
                </div>

                {/* Victory Conditions */}
                <div>
                  <label className="block text-sm font-medium mb-2">Victory Conditions</label>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-400">
                      All victory conditions are enabled:
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <div>• Domination: Control 60% of galaxy</div>
                      <div>• Federation: Form peaceful alliance</div>
                      <div>• Tech Ascendancy: Master exotic worlds</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Faction Details */}
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Selected Faction</h3>
              {(() => {
                const faction = FACTIONS.find(f => f.id === selectedFaction)!;
                return (
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <faction.icon className={`w-6 h-6 ${faction.color}`} />
                      <span className="font-semibold">{faction.name}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{faction.description}</p>
                    <div className="text-xs text-slate-400">
                      <p className="font-medium mb-1">Starting Bonuses:</p>
                      {faction.bonuses.map((bonus, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-1 h-1 bg-green-400 rounded-full mr-2" />
                          {bonus}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl py-4 px-6 font-semibold text-lg transition-all duration-300 flex items-center justify-center"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Game
            </motion.button>
          </div>
        </div>

        {/* Game Concept Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-slate-800/30 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-3">Core Innovation: Planets as Technology Trees</h3>
          <p className="text-slate-300 mb-4">
            Unlike traditional 4X games with linear tech progression, Xytherra's technology system is entirely 
            driven by planetary colonization. Each planet type unlocks unique technology domains, and the order 
            of colonization permanently shapes your empire's technological identity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-blue-400">Explore</h4>
              <p className="text-slate-400">
                Discover diverse planetary systems with unique tech domains waiting to be unlocked.
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-400">Expand</h4>
              <p className="text-slate-400">
                Specialized colonization based on planet adaptation technology and strategic planning.
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-purple-400">Evolve</h4>
              <p className="text-slate-400">
                Unlock hybrid technologies through mastery of multiple planetary types.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};