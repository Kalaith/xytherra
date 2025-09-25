import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Waves, 
  Flame, 
  Mountain, 
  Wind, 
  Snowflake, 
  Leaf, 
  Skull,
  Atom,
  Star,
  Circle
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import type { PlanetType, StarSystem, Planet } from '../../types/game.d.ts';

const PLANET_ICONS = {
  water: Waves,
  volcanic: Flame,
  rocky: Mountain,
  gas: Wind,
  ice: Snowflake,
  living: Leaf,
  desolate: Skull,
  exotic: Atom
} as const;

const PLANET_COLORS = {
  water: 'text-blue-400',
  volcanic: 'text-red-400',
  rocky: 'text-gray-400',
  gas: 'text-purple-400',
  ice: 'text-cyan-400',
  living: 'text-green-400',
  desolate: 'text-yellow-400',
  exotic: 'text-purple-300'
} as const;

interface SystemDisplayProps {
  system: StarSystem;
  onSystemClick: (system: StarSystem) => void;
  onPlanetClick: (planet: Planet) => void;
}

const SystemDisplay: React.FC<SystemDisplayProps> = ({ system, onSystemClick, onPlanetClick }) => {
  const playerEmpireId = useGameStore((state) => state.playerEmpireId);
  const isDiscovered = system.discoveredBy.includes(playerEmpireId);
  
  if (!isDiscovered) {
    // Undiscovered system - show as dim star
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="absolute cursor-pointer"
        style={{
          left: `${system.coordinates.x}%`,
          top: `${system.coordinates.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={() => onSystemClick(system)}
      >
        <Star className="w-3 h-3 text-slate-500" />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      className="absolute cursor-pointer"
      style={{
        left: `${system.coordinates.x}%`,
        top: `${system.coordinates.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Central star */}
      <div 
        className="relative"
        onClick={() => onSystemClick(system)}
      >
        <Star className="w-4 h-4 text-yellow-300" />
        
        {/* Planets orbiting around the star */}
        {system.planets.map((planet, index) => {
          const angle = (index * 360) / system.planets.length;
          const radius = 15 + index * 8; // Increasing orbit radius
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          
          const PlanetIcon = PLANET_ICONS[planet.type];
          const planetColor = PLANET_COLORS[planet.type];
          const isSurveyed = planet.surveyedBy.includes(playerEmpireId);
          const isColonized = planet.colonizedBy !== undefined;
          
          return (
            <motion.div
              key={planet.id}
              className="absolute cursor-pointer"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)'
              }}
              whileHover={{ scale: 1.3 }}
              onClick={(e) => {
                e.stopPropagation();
                onPlanetClick(planet);
              }}
            >
              {isSurveyed ? (
                <div className="relative">
                  <PlanetIcon className={`w-3 h-3 ${planetColor}`} />
                  {isColonized && (
                    <div className="absolute -top-1 -right-1">
                      <Circle className="w-2 h-2 text-green-400 fill-current" />
                    </div>
                  )}
                </div>
              ) : (
                <Circle className="w-2 h-2 text-slate-400" />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* System name */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap">
        {system.name}
      </div>
    </motion.div>
  );
};

export const GalaxyView: React.FC = () => {
  const galaxy = useGameStore((state) => state.galaxy);
  const selectedPlanet = useGameStore((state) => state.uiState.selectedPlanet);
  const setSelectedPlanet = useGameStore((state) => state.setSelectedPlanet);
  const setSidePanel = useGameStore((state) => state.setSidePanel);
  const addNotification = useGameStore((state) => state.addNotification);

  const systems = useMemo(() => Object.values(galaxy.systems), [galaxy.systems]);

  const handleSystemClick = (system: StarSystem) => {
    addNotification({
      type: 'info',
      title: `System: ${system.name}`,
      message: `Contains ${system.planets.length} planets`
    });
  };

  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(planet.id);
    setSidePanel('planet-info');
    
    addNotification({
      type: 'info',
      title: `Planet: ${planet.name}`,
      message: `${planet.type} world in the ${planet.systemId} system`
    });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Background stars */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Galaxy content */}
      <div className="relative w-full h-full">
        {/* Systems */}
        {systems.map((system) => (
          <SystemDisplay
            key={system.id}
            system={system}
            onSystemClick={handleSystemClick}
            onPlanetClick={handlePlanetClick}
          />
        ))}
        
        {/* Galaxy info overlay */}
        <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-sm">
          <h3 className="font-semibold mb-2">Galaxy Overview</h3>
          <div className="space-y-1 text-slate-300">
            <div>Size: {galaxy.size}</div>
            <div>Systems: {systems.length}</div>
            <div>Seed: {galaxy.seed}</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-sm">
          <h3 className="font-semibold mb-3">Legend</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PLANET_ICONS).map(([type, Icon]) => (
              <div key={type} className="flex items-center space-x-2">
                <Icon className={`w-3 h-3 ${PLANET_COLORS[type as PlanetType]}`} />
                <span className="text-xs text-slate-300 capitalize">
                  {type === 'gas' ? 'Gas Giant' : `${type} World`}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-600">
            <div className="flex items-center space-x-2 mb-1">
              <Star className="w-3 h-3 text-yellow-300" />
              <span className="text-xs text-slate-300">Star System</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <Circle className="w-2 h-2 text-slate-400" />
              <span className="text-xs text-slate-300">Unsurveyed Planet</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Circle className="w-3 h-3 text-blue-400" />
                <Circle className="w-2 h-2 text-green-400 fill-current absolute -top-0.5 -right-0.5" />
              </div>
              <span className="text-xs text-slate-300">Colonized Planet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};