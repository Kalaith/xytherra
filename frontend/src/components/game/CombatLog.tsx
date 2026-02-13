import React from 'react';
import { Sword, Shield, Target, Activity } from 'lucide-react';
import type { CombatResult } from '../../types/game.d.ts';

interface CombatLogProps {
  combatResults: CombatResult[];
  onClearLog?: () => void;
}

const CombatLog: React.FC<CombatLogProps> = ({ combatResults, onClearLog }) => {
  if (combatResults.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Sword className="w-5 h-5 mr-2 text-red-500" />
          Combat Log
        </h3>
        <div className="text-gray-400 text-center py-4">No battles fought yet</div>
      </div>
    );
  }

  const getWinnerIcon = (winner: string) => {
    switch (winner) {
      case 'attacker':
        return <Sword className="w-4 h-4 text-red-500" />;
      case 'defender':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getWinnerColor = (winner: string) => {
    switch (winner) {
      case 'attacker':
        return 'text-red-400 bg-red-500/20';
      case 'defender':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Sword className="w-5 h-5 mr-2 text-red-500" />
          Combat Log
        </h3>
        {onClearLog && (
          <button
            onClick={onClearLog}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Clear Log
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {combatResults.map((result, index) => (
          <div key={index} className="bg-gray-700 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">Battle #{combatResults.length - index}</div>
              <div
                className={`flex items-center px-2 py-1 rounded-full text-xs ${getWinnerColor(result.winner)}`}
              >
                {getWinnerIcon(result.winner)}
                <span className="ml-1 capitalize">{result.winner} Victory</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Attacker Stats */}
              <div className="bg-gray-600 rounded p-2">
                <div className="text-red-400 font-medium mb-1 flex items-center">
                  <Sword className="w-3 h-3 mr-1" />
                  Attacker
                </div>
                <div className="text-gray-300">
                  <div>Empire: {result.attacker.empire}</div>
                  <div>Damage Dealt: {Math.round(result.defender.damage)}</div>
                  <div>Ships Lost: {result.attacker.shipsLost}</div>
                  <div>Experience: +{result.experienceGained[result.attacker.empire] || 0}</div>
                </div>
              </div>

              {/* Defender Stats */}
              <div className="bg-gray-600 rounded p-2">
                <div className="text-blue-400 font-medium mb-1 flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Defender
                </div>
                <div className="text-gray-300">
                  <div>Empire: {result.defender.empire}</div>
                  <div>Damage Dealt: {Math.round(result.attacker.damage)}</div>
                  <div>Ships Lost: {result.defender.shipsLost}</div>
                  <div>Experience: +{result.experienceGained[result.defender.empire] || 0}</div>
                </div>
              </div>
            </div>

            {result.planetCaptured && (
              <div className="mt-2 flex items-center text-xs text-yellow-400 bg-yellow-500/20 rounded px-2 py-1">
                <Activity className="w-3 h-3 mr-1" />
                Planet Captured!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombatLog;
