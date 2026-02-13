import React from 'react';
import { Trophy, Target, Crown, DollarSign } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';

const VictoryPanel: React.FC = () => {
  const checkVictoryConditions = useGameStore(state => state.checkVictoryConditions);
  const playerEmpireId = useGameStore(state => state.playerEmpireId);

  const victoryProgress = React.useMemo(() => {
    const allProgress = checkVictoryConditions();
    return allProgress.filter(progress =>
      progress.description.includes(useGameStore.getState().empires[playerEmpireId]?.name || '')
    );
  }, [checkVictoryConditions, playerEmpireId]);

  const getVictoryIcon = (type: string) => {
    switch (type) {
      case 'domination':
        return <Crown className="w-5 h-5 text-red-500" />;
      case 'technology':
        return <Target className="w-5 h-5 text-blue-500" />;
      case 'diplomatic':
        return <Trophy className="w-5 h-5 text-green-500" />;
      case 'economic':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 0.8) return 'bg-green-500';
    if (progress >= 0.5) return 'bg-yellow-500';
    if (progress >= 0.2) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  if (victoryProgress.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-gold" />
        Victory Progress
      </h3>

      <div className="space-y-3">
        {victoryProgress.map((victory, index) => (
          <div key={index} className="bg-gray-700 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {getVictoryIcon(victory.type)}
                <span className="text-white font-medium ml-2 capitalize">
                  {victory.type.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <span className="text-gray-300 text-sm">{Math.round(victory.progress * 100)}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(victory.progress)}`}
                style={{ width: `${victory.progress * 100}%` }}
              />
            </div>

            <p className="text-gray-300 text-xs">{victory.description.split(': ')[1]}</p>

            {victory.completed && (
              <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                <Trophy className="w-3 h-3 mr-1" />
                Completed!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VictoryPanel;
