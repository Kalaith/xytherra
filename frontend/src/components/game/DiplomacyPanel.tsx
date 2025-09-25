import React from 'react';
import { Users, Sword, Shield, Handshake, Heart, Zap } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import type { DiplomaticRelation, Empire } from '../../types/game.d.ts';

const DiplomacyPanel: React.FC = () => {
  const empires = useGameStore((state) => state.empires);
  const playerEmpireId = useGameStore((state) => state.playerEmpireId);
  const playerEmpire = empires[playerEmpireId];
  
  if (!playerEmpire) return null;

  const otherEmpires = Object.values(empires).filter(empire => empire.id !== playerEmpireId);

  const getRelationIcon = (relation: DiplomaticRelation) => {
    switch (relation) {
      case 'war':
        return <Sword className="w-4 h-4 text-red-500" />;
      case 'hostile':
        return <Zap className="w-4 h-4 text-orange-500" />;
      case 'neutral':
        return <Shield className="w-4 h-4 text-gray-400" />;
      case 'friendly':
        return <Handshake className="w-4 h-4 text-green-500" />;
      case 'allied':
        return <Heart className="w-4 h-4 text-blue-500" />;
      case 'federated':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRelationColor = (relation: DiplomaticRelation) => {
    switch (relation) {
      case 'war':
        return 'text-red-400 bg-red-500/20';
      case 'hostile':
        return 'text-orange-400 bg-orange-500/20';
      case 'neutral':
        return 'text-gray-400 bg-gray-500/20';
      case 'friendly':
        return 'text-green-400 bg-green-500/20';
      case 'allied':
        return 'text-blue-400 bg-blue-500/20';
      case 'federated':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPersonalityDescription = (empire: Empire) => {
    if (!empire.aiPersonality) return 'Player Empire';
    
    const descriptions = {
      aggressive: 'Militaristic and expansion-focused',
      expansionist: 'Rapid territorial growth',
      defensive: 'Fortress-building and cautious',
      diplomatic: 'Peace-seeking and cooperative',
      economic: 'Trade and resource focused',
      scientific: 'Research and technology driven'
    };
    
    return descriptions[empire.aiPersonality] || 'Unknown';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2 text-blue-400" />
        Galactic Powers
      </h3>
      
      <div className="space-y-3">
        {otherEmpires.map((empire) => {
          const relation = playerEmpire.diplomaticStatus[empire.id] || 'neutral';
          
          return (
            <div key={empire.id} className="bg-gray-700 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: empire.color }}
                  />
                  <span className="text-white font-medium">
                    {empire.name}
                  </span>
                </div>
                
                <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getRelationColor(relation)}`}>
                  {getRelationIcon(relation)}
                  <span className="ml-1 capitalize">{relation}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 mb-2">
                {getPersonalityDescription(empire)}
              </div>
              
              <div className="flex justify-between text-xs text-gray-300">
                <span>Colonies: {empire.colonies.length}</span>
                <span>Techs: {empire.technologies.size}</span>
                <span>Wars: {empire.totalWars}</span>
              </div>
              
              {empire.combatExperience > 0 && (
                <div className="mt-2">
                  <div className="flex items-center text-xs text-gray-400">
                    <Sword className="w-3 h-3 mr-1" />
                    Combat Experience: {empire.combatExperience}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {otherEmpires.length === 0 && (
        <div className="text-gray-400 text-center py-4">
          You are alone in the galaxy...
        </div>
      )}
    </div>
  );
};

export default DiplomacyPanel;