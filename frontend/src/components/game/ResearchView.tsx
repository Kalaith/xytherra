import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { TECHNOLOGIES } from '../../data/gameData';
import type { Technology, TechDomain } from '../../types/game.d.ts';

const ResearchView: React.FC = () => {
  const gameState = useGameStore();
  const playerEmpireId = gameState.playerEmpireId;
  const playerEmpire = gameState.empires[playerEmpireId];

  if (!playerEmpire) return null;

  // Ensure technologies is a Set (handle persistence conversion)
  const playerTechnologies = playerEmpire.technologies instanceof Set 
    ? playerEmpire.technologies 
    : new Set(Array.isArray(playerEmpire.technologies) ? playerEmpire.technologies : []);

  const availableTechs = Object.entries(TECHNOLOGIES).filter(([techId, tech]) => 
    !playerTechnologies.has(techId) && 
    tech.prerequisites.every(prereq => playerTechnologies.has(prereq))
  );

  const researchedTechs = Object.entries(TECHNOLOGIES).filter(([techId]) => 
    playerTechnologies.has(techId)
  );

  const getDomainColor = (domain: TechDomain) => {
    switch (domain) {
      case 'weapons': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'shields': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'biotech': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'propulsion': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'sensors': return 'text-pink-400 bg-pink-500/20 border-pink-500/30';
      case 'industry': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'survival': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'experimental': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTierName = (tier: number) => {
    switch (tier) {
      case 1: return 'Survey';
      case 2: return 'Colony';
      case 3: return 'Mastery';
      default: return 'Unknown';
    }
  };

  const startResearch = (techId: string) => {
    gameState.startResearch(playerEmpireId, techId);
  };

  return (
    <div className="absolute inset-0 bg-slate-900 overflow-y-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Research Laboratory</h1>
          <p className="text-slate-400">Advance your empire through technological discovery</p>
        </div>

        {/* Current Research */}
        {playerEmpire.currentResearch && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg p-6 mb-8 border border-blue-500/30"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Current Research</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-400">
                  {TECHNOLOGIES[playerEmpire.currentResearch].name}
                </h3>
                <p className="text-slate-300 text-sm mb-2">
                  {TECHNOLOGIES[playerEmpire.currentResearch].description}
                </p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs border ${getDomainColor(TECHNOLOGIES[playerEmpire.currentResearch].domain)}`}>
                  {TECHNOLOGIES[playerEmpire.currentResearch].domain.charAt(0).toUpperCase() + TECHNOLOGIES[playerEmpire.currentResearch].domain.slice(1)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.round((playerEmpire.researchProgress[playerEmpire.currentResearch] / TECHNOLOGIES[playerEmpire.currentResearch].cost) * 100)}%
                </div>
                <div className="text-sm text-slate-400">
                  {Math.floor(playerEmpire.researchProgress[playerEmpire.currentResearch] || 0)} / {TECHNOLOGIES[playerEmpire.currentResearch].cost}
                </div>
                <div className="w-32 bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((playerEmpire.researchProgress[playerEmpire.currentResearch] / TECHNOLOGIES[playerEmpire.currentResearch].cost) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Available Technologies */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Available Research</h2>
          {availableTechs.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <p className="text-slate-400">No technologies available for research</p>
              <p className="text-slate-500 text-sm mt-2">Discover new planets or complete current research to unlock more</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTechs.map(([techId, tech]) => (
                <motion.div
                  key={techId}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                  onClick={() => !playerEmpire.currentResearch && startResearch(techId)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-white">{tech.name}</h3>
                    <div className="flex items-center space-x-1">
                      <div className={`px-2 py-1 rounded text-xs border ${getDomainColor(tech.domain)}`}>
                        {getTierName(tech.tier)}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-3">{tech.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className={`px-3 py-1 rounded-full text-xs border ${getDomainColor(tech.domain)}`}>
                      {tech.domain.charAt(0).toUpperCase() + tech.domain.slice(1)}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Cost: {tech.cost} 🔬
                    </div>
                  </div>
                  
                  {tech.prerequisites.length > 0 && (
                    <div className="mt-2 text-xs text-slate-500">
                      Requires: {tech.prerequisites.map(prereq => 
                        TECHNOLOGIES[prereq]?.name || prereq
                      ).join(', ')}
                    </div>
                  )}
                  
                  {playerEmpire.currentResearch && (
                    <div className="mt-2 text-xs text-slate-500">
                      Complete current research to unlock
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Researched Technologies */}
        {researchedTechs.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Discovered Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {researchedTechs.map(([techId, tech]) => (
                <div
                  key={techId}
                  className="bg-slate-800/50 rounded-lg p-3 border border-green-500/30"
                >
                  <h4 className="text-sm font-medium text-green-400 mb-1">{tech.name}</h4>
                  <div className={`inline-block px-2 py-1 rounded text-xs border ${getDomainColor(tech.domain)}`}>
                    {tech.domain.charAt(0).toUpperCase() + tech.domain.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchView;