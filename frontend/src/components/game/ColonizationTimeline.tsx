import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Empire, PlanetType } from '../../types/game.d.ts';

interface ColonizationTimelineProps {
  empire: Empire;
  showProjections?: boolean;
  className?: string;
}

interface TimelineEvent {
  order: number;
  planetType: PlanetType;
  weight: number;
  turn: number;
  planetId: string;
  isProjected?: boolean;
}

const ColonizationTimeline: React.FC<ColonizationTimelineProps> = ({
  empire,
  showProjections = false,
  className = ''
}) => {

  const getPlanetTypeIcon = (planetType: PlanetType): string => {
    switch (planetType) {
      case 'water': return '🌊';
      case 'volcanic': return '🌋';
      case 'rocky': return '🗿';
      case 'gas': return '☁️';
      case 'ice': return '❄️';
      case 'living': return '�';
      case 'desolate': return '�';
      case 'exotic': return '✨';
      default: return '🪐';
    }
  };

  const getPlanetTypeColor = (planetType: PlanetType): string => {
    switch (planetType) {
      case 'water': return '#3B82F6'; // Blue
      case 'volcanic': return '#EF4444'; // Red
      case 'rocky': return '#6B7280'; // Gray
      case 'gas': return '#EC4899'; // Pink
      case 'ice': return '#06B6D4'; // Cyan
      case 'living': return '#10B981'; // Emerald
      case 'desolate': return '#F59E0B'; // Amber
      case 'exotic': return '#8B5CF6'; // Purple
      default: return '#6B7280';
    }
  };

  const getWeightColor = (weight: number): string => {
    if (weight >= 3.0) return '#10B981'; // Green for 3x
    if (weight >= 2.0) return '#3B82F6'; // Blue for 2x
    if (weight >= 1.5) return '#F59E0B'; // Amber for 1.5x
    return '#6B7280'; // Gray for 1x+
  };

  const timelineEvents = useMemo((): TimelineEvent[] => {
    if (!empire.colonizationHistory?.order) return [];

    return empire.colonizationHistory.order
      .sort((a, b) => a.order - b.order)
      .map(colony => ({
        order: colony.order,
        planetType: colony.planetType,
        weight: colony.weight,
        turn: colony.turn,
        planetId: colony.planetId,
        isProjected: false
      }));
  }, [empire.colonizationHistory]);

  const getEmpireIdentityHint = (): string => {
    if (timelineEvents.length === 0) {
      return "Establish your first colony to begin specialization";
    }

    const totalWeight = timelineEvents.reduce((sum, event) => sum + event.weight, 0);
    const dominantTypes = new Map<PlanetType, number>();

    timelineEvents.forEach(event => {
      dominantTypes.set(
        event.planetType, 
        (dominantTypes.get(event.planetType) || 0) + event.weight
      );
    });

    const sortedTypes = Array.from(dominantTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    if (sortedTypes.length === 0) return "";

    const [primaryType, primaryWeight] = sortedTypes[0];
    const primaryPercentage = Math.round((primaryWeight / totalWeight) * 100);

    if (primaryPercentage > 50) {
      return `${getPlanetTypeIcon(primaryType)} ${primaryType.charAt(0).toUpperCase() + primaryType.slice(1)} Specialists (${primaryPercentage}%)`;
    } else if (sortedTypes.length > 1) {
      const [secondaryType] = sortedTypes[1];
      return `${getPlanetTypeIcon(primaryType)}${getPlanetTypeIcon(secondaryType)} Hybrid Empire`;
    } else {
      return `${getPlanetTypeIcon(primaryType)} Emerging ${primaryType.charAt(0).toUpperCase() + primaryType.slice(1)} Focus`;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`bg-slate-800/50 rounded-xl p-4 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-1">
          Colonization Timeline
        </h3>
        <p className="text-sm text-slate-400">
          {getEmpireIdentityHint()}
        </p>
      </div>

      {timelineEvents.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🚀</div>
          <p className="text-slate-400 text-sm">
            Survey planets and establish your first colony to begin your empire's specialization journey
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {timelineEvents.map((event, idx) => (
            <motion.div
              key={event.planetId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg"
            >
              {/* Order Badge */}
              <div className="flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: getPlanetTypeColor(event.planetType) }}
                >
                  {event.order}
                </div>
              </div>

              {/* Planet Info */}
              <div className="flex-grow">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getPlanetTypeIcon(event.planetType)}</span>
                  <span className="text-white font-medium capitalize">
                    {event.planetType} World
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Turn {event.turn} • Colony #{event.order}
                </div>
              </div>

              {/* Weight Badge */}
              <div className="flex-shrink-0">
                <div 
                  className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{ 
                    backgroundColor: getWeightColor(event.weight) + '30',
                    color: getWeightColor(event.weight),
                    border: `1px solid ${getWeightColor(event.weight)}50`
                  }}
                >
                  ×{event.weight.toFixed(1)}
                </div>
              </div>

              {/* Connection Line (except for last item) */}
              {idx < timelineEvents.length - 1 && (
                <div className="absolute left-8 mt-12 w-0.5 h-4 bg-slate-600"></div>
              )}
            </motion.div>
          ))}

          {/* Next Colony Projection */}
          {showProjections && timelineEvents.length < 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: timelineEvents.length * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-slate-700/10 rounded-lg border border-dashed border-slate-600"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-500 flex items-center justify-center text-xs text-slate-500">
                  {timelineEvents.length + 1}
                </div>
              </div>
              <div className="flex-grow">
                <span className="text-slate-400 text-sm">
                  Next colony: ×{timelineEvents.length === 0 ? '3.0' : 
                                timelineEvents.length === 1 ? '2.0' : 
                                timelineEvents.length === 2 ? '1.5' : '1.2'} weight
                </span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Specialization Summary */}
      {timelineEvents.length > 0 && (
        <div className="mt-4 p-3 bg-slate-700/20 rounded-lg">
          <div className="text-xs text-slate-400 mb-2">Specialization Impact:</div>
          <div className="flex flex-wrap gap-1">
            {Array.from(new Set(timelineEvents.map(e => e.planetType))).map(planetType => {
              const typeWeight = timelineEvents
                .filter(e => e.planetType === planetType)
                .reduce((sum, e) => sum + e.weight, 0);
              
              return (
                <span
                  key={planetType}
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: getPlanetTypeColor(planetType) + '20',
                    color: getPlanetTypeColor(planetType),
                    border: `1px solid ${getPlanetTypeColor(planetType)}30`
                  }}
                >
                  {getPlanetTypeIcon(planetType)} {typeWeight.toFixed(1)}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ColonizationTimeline;
