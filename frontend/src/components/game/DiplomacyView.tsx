import React from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Sword, Shield, Handshake, Heart, Zap, Activity } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import type { DiplomaticRelation, Empire } from '../../types/game.d.ts';

const DiplomacyView: React.FC = () => {
  const gameState = useGameStore();
  const playerEmpireId = gameState.playerEmpireId;
  const playerEmpire = gameState.empires[playerEmpireId];

  if (!playerEmpire) return null;

  const otherEmpires = Object.values(gameState.empires).filter(
    empire => empire.id !== playerEmpireId
  );

  const getRelationIcon = (relation: DiplomaticRelation) => {
    switch (relation) {
      case 'war':
        return <Sword className="w-5 h-5 text-red-500" />;
      case 'hostile':
        return <Zap className="w-5 h-5 text-orange-500" />;
      case 'neutral':
        return <Shield className="w-5 h-5 text-gray-400" />;
      case 'friendly':
        return <Handshake className="w-5 h-5 text-green-500" />;
      case 'allied':
        return <Heart className="w-5 h-5 text-blue-500" />;
      case 'federated':
        return <Users className="w-5 h-5 text-purple-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRelationColor = (relation: DiplomaticRelation) => {
    switch (relation) {
      case 'war':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'hostile':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'neutral':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'friendly':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'allied':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'federated':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPersonalityDescription = (empire: Empire) => {
    if (!empire.aiPersonality) return 'Player Empire';

    const descriptions = {
      aggressive: 'Militaristic and expansion-focused empire. Prefers conquest over diplomacy.',
      expansionist:
        'Rapid territorial growth is their priority. Always seeking new worlds to claim.',
      defensive: 'Fortress-building and cautious. Focuses on strong defenses and stability.',
      diplomatic: 'Peace-seeking and cooperative. Prefers negotiation and mutual benefit.',
      economic: 'Trade and resource focused. Seeks to dominate through economic power.',
      scientific: 'Research and technology driven. Values knowledge and technological advancement.',
    };

    return descriptions[empire.aiPersonality] || 'Unknown personality type';
  };

  const getPersonalityIcon = (empire: Empire) => {
    if (!empire.aiPersonality) return <Crown className="w-4 h-4" />;

    switch (empire.aiPersonality) {
      case 'aggressive':
        return <Sword className="w-4 h-4 text-red-500" />;
      case 'expansionist':
        return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'defensive':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'diplomatic':
        return <Handshake className="w-4 h-4 text-green-500" />;
      case 'economic':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'scientific':
        return <Zap className="w-4 h-4 text-cyan-500" />;
      default:
        return <Crown className="w-4 h-4" />;
    }
  };

  const getStrengthRating = (empire: Empire) => {
    const score =
      empire.colonies.length * 10 +
      empire.technologies.size * 5 +
      empire.combatExperience * 2 +
      empire.totalWars * 3;

    if (score >= 100) return { rating: 'Dominant', color: 'text-red-400' };
    if (score >= 75) return { rating: 'Strong', color: 'text-orange-400' };
    if (score >= 50) return { rating: 'Moderate', color: 'text-yellow-400' };
    if (score >= 25) return { rating: 'Weak', color: 'text-green-400' };
    return { rating: 'Emerging', color: 'text-gray-400' };
  };

  return (
    <div className="absolute inset-0 bg-slate-900 overflow-y-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Galactic Diplomacy</h1>
          <p className="text-slate-400">Manage relationships with other galactic powers</p>
        </div>

        {/* Player Empire Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-6 mb-8 border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded-full mr-3"
                style={{ backgroundColor: playerEmpire.color }}
              />
              <div>
                <h2 className="text-xl font-semibold text-white">{playerEmpire.name}</h2>
                <p className="text-blue-400 text-sm">Your Empire</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-300">
              <div>
                Colonies: <span className="font-semibold">{playerEmpire.colonies.length}</span>
              </div>
              <div>
                Technologies:{' '}
                <span className="font-semibold">{playerEmpire.technologies.size}</span>
              </div>
              <div>
                Wars Won: <span className="font-semibold">{playerEmpire.totalWars}</span>
              </div>
            </div>
          </div>
          <p className="text-slate-300 text-sm">
            Leading faction in the galactic community. Your diplomatic choices will shape the future
            of the galaxy.
          </p>
        </motion.div>

        {/* Other Empires */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Known Empires</h2>

          {otherEmpires.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <p className="text-slate-400">You are alone in the galaxy...</p>
              <p className="text-slate-500 text-sm mt-2">
                Explore more systems to discover other civilizations
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {otherEmpires.map(empire => {
                const relation = playerEmpire.diplomaticStatus[empire.id] || 'neutral';
                const strength = getStrengthRating(empire);

                return (
                  <motion.div
                    key={empire.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: empire.color + '30',
                            border: `2px solid ${empire.color}`,
                          }}
                        >
                          {getPersonalityIcon(empire)}
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{empire.name}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <div
                              className={`flex items-center px-3 py-1 rounded-full text-sm border ${getRelationColor(relation)}`}
                            >
                              {getRelationIcon(relation)}
                              <span className="ml-1 capitalize">{relation}</span>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs ${strength.color}`}>
                              {strength.rating}
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm">
                            {getPersonalityDescription(empire)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-slate-700/50 rounded p-3 text-center">
                        <div className="text-lg font-semibold text-white">
                          {empire.colonies.length}
                        </div>
                        <div className="text-xs text-slate-400">Colonies</div>
                      </div>
                      <div className="bg-slate-700/50 rounded p-3 text-center">
                        <div className="text-lg font-semibold text-white">
                          {empire.technologies.size}
                        </div>
                        <div className="text-xs text-slate-400">Technologies</div>
                      </div>
                      <div className="bg-slate-700/50 rounded p-3 text-center">
                        <div className="text-lg font-semibold text-white">
                          {empire.fleets.length}
                        </div>
                        <div className="text-xs text-slate-400">Fleets</div>
                      </div>
                      <div className="bg-slate-700/50 rounded p-3 text-center">
                        <div className="text-lg font-semibold text-white">{empire.totalWars}</div>
                        <div className="text-xs text-slate-400">Wars Won</div>
                      </div>
                    </div>

                    {empire.combatExperience > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-slate-400 mb-1">
                          <Activity className="w-3 h-3 mr-1" />
                          Combat Experience: {empire.combatExperience}
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${Math.min(empire.combatExperience, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Diplomatic Actions */}
                    <div className="flex space-x-2">
                      <button
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                        disabled={relation === 'war'}
                      >
                        Negotiate
                      </button>
                      <button
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                        disabled={relation === 'allied' || relation === 'federated'}
                      >
                        Alliance
                      </button>
                      <button
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                        disabled={relation === 'war'}
                      >
                        Declare War
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiplomacyView;
