import React, { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import type { Empire, TechDomain } from '../../types/game.d.ts';

interface EmpireSpecializationRadarProps {
  empire: Empire;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  interactive?: boolean;
  className?: string;
}

interface RadarDataPoint {
  domain: string;
  value: number;
  rawWeight: number;
  fullMark: number;
  color: string;
}

const EmpireSpecializationRadar: React.FC<EmpireSpecializationRadarProps> = ({
  empire,
  size = 'medium',
  showLabels: _showLabels = true,
  interactive = true,
  className = '',
}) => {
  const getDomainColor = (domain: TechDomain): string => {
    switch (domain) {
      case 'weapons':
        return '#EF4444';
      case 'shields':
        return '#3B82F6';
      case 'biotech':
        return '#10B981';
      case 'propulsion':
        return '#8B5CF6';
      case 'sensors':
        return '#EC4899';
      case 'industry':
        return '#F59E0B';
      case 'survival':
        return '#F97316';
      case 'experimental':
        return '#06B6D4';
      default:
        return '#6B7280';
    }
  };

  const getDomainDisplayName = (domain: TechDomain): string => {
    switch (domain) {
      case 'weapons':
        return 'Weapons';
      case 'shields':
        return 'Shields';
      case 'biotech':
        return 'Biotech';
      case 'propulsion':
        return 'Propulsion';
      case 'sensors':
        return 'Sensors';
      case 'industry':
        return 'Industry';
      case 'survival':
        return 'Survival';
      case 'experimental':
        return 'Experimental';
      default: {
        const domainStr = String(domain);
        return domainStr.charAt(0).toUpperCase() + domainStr.slice(1);
      }
    }
  };

  const radarData = useMemo((): RadarDataPoint[] => {
    // Get tech domain weights from empire, defaulting to 0 if not present
    const weights = empire.techDomainWeights || {
      weapons: 0,
      shields: 0,
      biotech: 0,
      propulsion: 0,
      sensors: 0,
      industry: 0,
      survival: 0,
      experimental: 0,
    };

    // Find max weight for scaling
    const maxWeight = Math.max(...Object.values(weights));
    const scaleFactor = maxWeight > 0 ? 100 / maxWeight : 1;

    return Object.entries(weights).map(([domain, weight]) => ({
      domain: getDomainDisplayName(domain as TechDomain),
      value: Math.min(weight * scaleFactor, 100),
      rawWeight: weight,
      fullMark: 100,
      color: getDomainColor(domain as TechDomain),
    }));
  }, [empire.techDomainWeights]);

  const getChartSize = () => {
    switch (size) {
      case 'small':
        return { width: 200, height: 200, fontSize: 10 };
      case 'medium':
        return { width: 300, height: 300, fontSize: 11 };
      case 'large':
        return { width: 400, height: 400, fontSize: 12 };
      default:
        return { width: 300, height: 300, fontSize: 11 };
    }
  };

  const chartSize = getChartSize();

  type CustomTooltipProps = {
    active?: boolean;
    payload?: Array<{ payload: { rawWeight: number; value: number } }>;
    label?: string;
  };

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{label}</p>
          <p className="text-slate-300 text-sm">Weight: {data.rawWeight.toFixed(1)}</p>
          <p className="text-slate-300 text-sm">Strength: {data.value.toFixed(0)}%</p>
        </div>
      );
    }
    return null;
  };

  const getDominantDomains = () => {
    if (!empire.techDomainWeights) return [];

    const totalWeight = Object.values(empire.techDomainWeights).reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) return [];

    return Object.entries(empire.techDomainWeights)
      .filter(([_, weight]) => weight / totalWeight > 0.3) // >30% is dominant
      .map(([domain, weight]) => ({
        domain: getDomainDisplayName(domain as TechDomain),
        percentage: Math.round((weight / totalWeight) * 100),
        color: getDomainColor(domain as TechDomain),
      }))
      .sort((a, b) => b.percentage - a.percentage);
  };

  const dominantDomains = getDominantDomains();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-slate-800/50 rounded-xl p-4 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-1">Empire Specialization</h3>
        {dominantDomains.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {dominantDomains.map((domain, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: domain.color + '20',
                  color: domain.color,
                  border: `1px solid ${domain.color}30`,
                }}
              >
                {domain.domain} {domain.percentage}%
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">Establish colonies to develop specialization</p>
        )}
      </div>

      <div style={{ width: chartSize.width, height: chartSize.height }} className="mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="#374151" strokeWidth={1} radialLines={true} />
            <PolarAngleAxis
              dataKey="domain"
              tick={{
                fill: '#9CA3AF',
                fontSize: chartSize.fontSize,
                fontWeight: 500,
              }}
              className="text-slate-400"
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Specialization"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{
                fill: '#3B82F6',
                r: 3,
                strokeWidth: 0,
              }}
            />
            {interactive && <Tooltip content={<CustomTooltip />} />}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Colonization Summary */}
      {empire.colonizationHistory &&
        empire.colonizationHistory.order &&
        empire.colonizationHistory.order.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-slate-300">Colony Progression:</h4>
            <div className="space-y-1">
              {empire.colonizationHistory.order.slice(0, 3).map((colony, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">
                    #{colony.order}: {colony.planetType}
                  </span>
                  <span
                    className="font-medium px-2 py-1 rounded"
                    style={{
                      backgroundColor: `${getDomainColor('shields')}20`,
                      color: getDomainColor('shields'),
                    }}
                  >
                    ×{colony.weight}
                  </span>
                </div>
              ))}
              {empire.colonizationHistory.order.length > 3 && (
                <div className="text-xs text-slate-500">
                  +{empire.colonizationHistory.order.length - 3} more colonies...
                </div>
              )}
            </div>
          </div>
        )}
    </motion.div>
  );
};

export default EmpireSpecializationRadar;
