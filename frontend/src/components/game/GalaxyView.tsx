import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Circle,
  ArrowLeft,
  Eye,
  Users
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import type { PlanetType, StarSystem, Planet, Hyperlane } from '../../types/game.d.ts';
import { GAME_CONSTANTS } from '../../constants/gameConstants';

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

// System importance classification
const getSystemImportance = (system: StarSystem): 'strategic' | 'resource-rich' | 'standard' => {
  const planetTypes = system.planets.map(p => p.type);
  const hasRarePlanets = planetTypes.some(type => ['exotic', 'living'].includes(type));
  const planetCount = system.planets.length;

  if (hasRarePlanets) return 'strategic';
  if (planetCount >= 4) return 'resource-rich';
  return 'standard';
};

const getSystemSize = (importance: string): string => {
  switch (importance) {
    case 'strategic': return 'w-6 h-6';
    case 'resource-rich': return 'w-5 h-5';
    default: return 'w-4 h-4';
  }
};

const getSystemColor = (importance: string, isControlled: boolean): string => {
  if (isControlled) {
    switch (importance) {
      case 'strategic': return 'text-blue-300 drop-shadow-lg';
      case 'resource-rich': return 'text-blue-400 drop-shadow-md';
      default: return 'text-blue-500';
    }
  }

  switch (importance) {
    case 'strategic': return 'text-purple-300';
    case 'resource-rich': return 'text-yellow-300';
    default: return 'text-yellow-400';
  }
};

// Hyperlane Network Component - Renders connection lines between systems
interface HyperlaneNetworkProps {
  systems: Record<string, StarSystem>;
  hyperlanes: Record<string, Hyperlane>;
  playerEmpireId: string;
}

const HyperlaneNetwork: React.FC<HyperlaneNetworkProps> = ({ systems, hyperlanes, playerEmpireId }) => {
  const galaxy = useGameStore((state) => state.galaxy);
  
  // Handle case where hyperlanes might be undefined/null
  if (!hyperlanes || Object.keys(hyperlanes).length === 0) {
    console.log('No hyperlanes to render');
    return null;
  }

  console.log(`=== HYPERLANE NETWORK DEBUG ===`);
  console.log(`Rendering ${Object.keys(hyperlanes).length} hyperlanes`);
  console.log(`Galaxy dimensions: ${galaxy.width} x ${galaxy.height}`);
  console.log(`Using direct coordinate mapping (no transformation)`);
  
  // Track coordinate ranges for debugging
  const allHyperlanes = Object.values(hyperlanes);
  const allXCoords: number[] = [];
  const allYCoords: number[] = [];
  
  allHyperlanes.forEach(hyperlane => {
    const fromSystem = systems[hyperlane.fromSystemId];
    const toSystem = systems[hyperlane.toSystemId];
    if (fromSystem && toSystem) {
      allXCoords.push(fromSystem.coordinates.x, toSystem.coordinates.x);
      allYCoords.push(fromSystem.coordinates.y, toSystem.coordinates.y);
    }
  });
  
  const xRange = { min: Math.min(...allXCoords), max: Math.max(...allXCoords) };
  const yRange = { min: Math.min(...allYCoords), max: Math.max(...allYCoords) };
  
  console.log(`Hyperlane coordinate ranges: X(${xRange.min.toFixed(1)} - ${xRange.max.toFixed(1)}), Y(${yRange.min.toFixed(1)} - ${yRange.max.toFixed(1)})`);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
    >
      {Object.values(hyperlanes).map((hyperlane) => {
        const fromSystem = systems[hyperlane.fromSystemId];
        const toSystem = systems[hyperlane.toSystemId];

        if (!fromSystem || !toSystem) {
          console.log(`Missing system for hyperlane ${hyperlane.id}`);
          return null;
        }

        // Only show hyperlanes if at least one system is discovered
        const fromDiscovered = fromSystem.discoveredBy.includes(playerEmpireId);
        const toDiscovered = toSystem.discoveredBy.includes(playerEmpireId);

        if (!fromDiscovered && !toDiscovered) return null;

        // Use coordinates directly - no transformation
        const fromX = fromSystem.coordinates.x;
        const fromY = fromSystem.coordinates.y;
        const toX = toSystem.coordinates.x;
        const toY = toSystem.coordinates.y;

        console.log(`Hyperlane ${hyperlane.id}:`);
        console.log(`  From: ${fromSystem.name} at (${fromX}, ${fromY})`);
        console.log(`  To: ${toSystem.name} at (${toX}, ${toY})`);

        // Line styling based on hyperlane condition
        const getLineStyle = (condition: Hyperlane['condition']) => {
          switch (condition) {
            case 'open':
              return {
                stroke: '#60a5fa', // blue-400
                strokeWidth: 0.3,
                strokeDasharray: 'none',
                opacity: 0.8
              };
            case 'unstable':
              return {
                stroke: '#f59e0b', // amber-500
                strokeWidth: 0.3,
                strokeDasharray: '2,2',
                opacity: 0.6
              };
            case 'blocked':
              return {
                stroke: '#ef4444', // red-500
                strokeWidth: 0.3,
                strokeDasharray: '1,3',
                opacity: 0.5
              };
          }
        };

        const lineStyle = getLineStyle(hyperlane.condition);

        return (
          <>
            <motion.line
              key={hyperlane.id}
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              {...lineStyle}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: lineStyle.opacity }}
              transition={{ duration: 0.8, delay: Math.random() * 0.5 }}
            />
            
            {/* Debug: Visual markers for key systems - only show a few to avoid clutter */}
            {(fromSystem.name.includes('Alpha') || fromSystem.name.includes('Beta') || toSystem.name.includes('Alpha') || toSystem.name.includes('Beta')) && (
              <>
                <circle cx={fromX} cy={fromY} r="1.5" fill="red" opacity="0.8" />
                <circle cx={toX} cy={toY} r="1.5" fill="blue" opacity="0.8" />
                <text x={fromX + 2} y={fromY - 2} fill="white" fontSize="2.5" opacity="0.9">
                  {fromSystem.name.slice(0, 3)}({fromX.toFixed(0)},{fromY.toFixed(0)})
                </text>
                <text x={toX + 2} y={toY + 2} fill="white" fontSize="2.5" opacity="0.9">
                  {toSystem.name.slice(0, 3)}({toX.toFixed(0)},{toY.toFixed(0)})
                </text>
              </>
            )}
          </>
        );
      })}
    </svg>
  );
};

// System Node for Galaxy View - Clean single node per system
interface SystemNodeProps {
  system: StarSystem;
  onSystemClick: (system: StarSystem) => void;
}

const SystemNode: React.FC<SystemNodeProps> = ({ system, onSystemClick }) => {
  const playerEmpireId = useGameStore((state) => state.playerEmpireId);
  const empires = useGameStore((state) => state.empires);

  const isDiscovered = system.discoveredBy.includes(playerEmpireId);
  const controllingEmpire = Object.values(empires).find(empire =>
    empire.colonies.some(colonyId =>
      system.planets.some(planet => planet.id === colonyId)
    )
  );
  const isControlled = controllingEmpire?.id === playerEmpireId;
  const importance = getSystemImportance(system);

  // Use coordinates directly as percentages - same as hyperlanes
  const positionX = system.coordinates.x;
  const positionY = system.coordinates.y;

  console.log(`System ${system.name}: positioned at (${positionX}%, ${positionY}%), discovered: ${isDiscovered}`);

  // Enhanced debug for key systems
  if (system.name.includes('Alpha') || system.name.includes('Beta')) {
    console.log(`🔍 KEY SYSTEM: ${system.name} -> CSS position: left: ${positionX}%, top: ${positionY}%`);
  }

  if (!isDiscovered) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="absolute cursor-pointer"
        style={{
          left: `${positionX}%`,
          top: `${positionY}%`,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={() => onSystemClick(system)}
      >
        <Star className="w-3 h-3 text-slate-500 opacity-60" />
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-slate-500 whitespace-nowrap">
          Unexplored
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      className="absolute cursor-pointer group"
      style={{
        left: `${positionX}%`,
        top: `${positionY}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={() => onSystemClick(system)}
    >
      {/* Empire territory background */}
      {controllingEmpire && (
        <div
          className="absolute inset-0 rounded-full opacity-20 scale-150"
          style={{ backgroundColor: controllingEmpire.color }}
        />
      )}

      {/* System star */}
      <Star className={`${getSystemSize(importance)} ${getSystemColor(importance, isControlled)}`} />

      {/* Empire control indicator */}
      {controllingEmpire && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
          style={{ backgroundColor: controllingEmpire.color }}
        />
      )}

      {/* System name and info */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
        <div className="text-xs text-slate-300 font-medium">{system.name}</div>
        <div className="text-xs text-slate-500">
          {system.planets.length} planet{system.planets.length !== 1 ? 's' : ''}
          {importance !== 'standard' && (
            <span className="ml-1 text-purple-400">★</span>
          )}
        </div>
        
        {/* Debug coordinate display for key systems */}
        {(system.name.includes('Alpha') || system.name.includes('Beta')) && (
          <div className="text-xs text-yellow-400 bg-black bg-opacity-50 rounded px-1 mt-1">
            ({positionX.toFixed(0)},{positionY.toFixed(0)})
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100
                      transition-opacity bg-slate-800 rounded px-2 py-1 text-xs whitespace-nowrap z-10">
        <div className="text-slate-200 font-medium">{system.name}</div>
        <div className="text-slate-400">
          {system.planets.length} planets • {importance}
        </div>
        {controllingEmpire && (
          <div className="text-blue-400">Controlled by {controllingEmpire.name}</div>
        )}
        <div className="text-slate-500">Click to explore system</div>
      </div>
    </motion.div>
  );
};

// Planet display for system detail view
interface PlanetDisplayProps {
  planet: Planet;
  onPlanetClick: (planet: Planet) => void;
}

const PlanetDisplay: React.FC<PlanetDisplayProps> = ({ planet, onPlanetClick }) => {
  const playerEmpireId = useGameStore((state) => state.playerEmpireId);
  const PlanetIcon = PLANET_ICONS[planet.type];
  const planetColor = PLANET_COLORS[planet.type];
  const isSurveyed = planet.surveyedBy.includes(playerEmpireId);
  const isColonized = planet.colonizedBy !== undefined;

  return (
    <motion.div
      whileHover={{ scale: 1.3 }}
      className="cursor-pointer group relative"
      onClick={() => onPlanetClick(planet)}
    >
      {isSurveyed ? (
        <div className="relative">
          <PlanetIcon className={`w-8 h-8 ${planetColor}`} />
          {isColonized && (
            <div className="absolute -top-1 -right-1">
              <Users className="w-3 h-3 text-green-400 fill-current" />
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <Circle className="w-6 h-6 text-slate-400" />
          <Eye className="w-3 h-3 text-slate-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Planet name */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
        <div className="text-sm text-slate-200 font-medium">{planet.name}</div>
        <div className="text-xs text-slate-400 capitalize">{planet.type} World</div>
        {isColonized && (
          <div className="text-xs text-green-400">Colonized</div>
        )}
        {isSurveyed && !isColonized && (
          <div className="text-xs text-blue-400">Surveyed</div>
        )}
      </div>

      {/* Hover tooltip */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100
                      transition-opacity bg-slate-800 rounded px-2 py-1 text-xs whitespace-nowrap z-10">
        <div className="text-slate-200 font-medium">{planet.name}</div>
        <div className="text-slate-400 capitalize">{planet.type} World • Size {planet.size}</div>
        {isColonized && <div className="text-green-400">Colony established</div>}
        {isSurveyed && !isColonized && <div className="text-blue-400">Available for colonization</div>}
        {!isSurveyed && <div className="text-slate-500">Click to survey</div>}
      </div>
    </motion.div>
  );
};

// System Detail View - Shows individual planets in solar system
interface SystemDetailViewProps {
  system: StarSystem;
  onBack: () => void;
  onPlanetClick: (planet: Planet) => void;
}

const SystemDetailView: React.FC<SystemDetailViewProps> = ({ system, onBack, onPlanetClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 z-50"
    >
      {/* Background stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Back button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2
                   bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm rounded-lg
                   text-slate-200 transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Galaxy</span>
      </motion.button>

      {/* System info */}
      <div className="absolute top-6 right-6 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-sm z-10">
        <h3 className="font-semibold text-slate-100 mb-2">{system.name}</h3>
        <div className="space-y-1 text-slate-300">
          <div>Planets: {system.planets.length}</div>
          <div>Type: {getSystemImportance(system)}</div>
        </div>
      </div>

      {/* Central star */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Star className="w-16 h-16 text-yellow-400" />
        </motion.div>
        <div className="text-center mt-4">
          <div className="text-2xl font-bold text-slate-100">{system.name}</div>
          <div className="text-slate-400 capitalize">{getSystemImportance(system)} System</div>
        </div>
      </div>

      {/* Planets in orbital rings */}
      {system.planets.map((planet, index) => {
        const orbitRadius = 120 + (index * 60); // pixels from center
        const angle = (index * 360) / system.planets.length;
        const x = Math.cos((angle * Math.PI) / 180) * orbitRadius;
        const y = Math.sin((angle * Math.PI) / 180) * orbitRadius;

        return (
          <motion.div
            key={planet.id}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Orbital path */}
            <div
              className="absolute border border-slate-600 rounded-full opacity-20 pointer-events-none"
              style={{
                width: `${orbitRadius * 2}px`,
                height: `${orbitRadius * 2}px`,
                left: `${-orbitRadius + (orbitRadius * 0.5)}px`,
                top: `${-orbitRadius + (orbitRadius * 0.5)}px`,
                transformOrigin: 'center center'
              }}
            />

            <PlanetDisplay planet={planet} onPlanetClick={onPlanetClick} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default function GalaxyView() {
  const [currentView, setCurrentView] = useState<'galaxy' | 'system'>('galaxy');
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);

  const galaxy = useGameStore((state) => state.galaxy);
  const playerEmpireId = useGameStore((state) => state.playerEmpireId);
  const setSelectedPlanet = useGameStore((state) => state.setSelectedPlanet);
  const setSidePanel = useGameStore((state) => state.setSidePanel);
  const addNotification = useGameStore((state) => state.addNotification);
  const surveyPlanet = useGameStore((state) => state.surveyPlanet);
  const generateHyperlanes = useGameStore((state) => state.generateHyperlanes); // Add this

  const systems = useMemo(() => Object.values(galaxy.systems), [galaxy.systems]);

  // Debug logging for hyperlanes
  console.log('=== GALAXY DEBUG INFO ===');
  console.log('Window dimensions:', { width: window.innerWidth, height: window.innerHeight });
  console.log('Container aspect ratio:', window.innerWidth / window.innerHeight);
  console.log('Galaxy data:', {
    systemCount: systems.length,
    hyperlaneCount: Object.keys(galaxy.hyperlanes || {}).length,
    galaxyDimensions: { width: galaxy.width, height: galaxy.height },
    galaxyAspectRatio: galaxy.width / galaxy.height
  });
  console.log('Sample systems with coordinates:', systems.slice(0, 5).map(s => ({ 
    name: s.name, 
    rawCoords: s.coordinates,
    hyperlaneConnections: s.hyperlanes?.length || 0,
    discovered: s.discoveredBy.includes(playerEmpireId)
  })));
  
  // Check coordinate ranges to make sure they're reasonable
  const coordRanges = systems.reduce((ranges, system) => {
    return {
      minX: Math.min(ranges.minX, system.coordinates.x),
      maxX: Math.max(ranges.maxX, system.coordinates.x),
      minY: Math.min(ranges.minY, system.coordinates.y),
      maxY: Math.max(ranges.maxY, system.coordinates.y)
    };
  }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  
  console.log('Coordinate ranges:', coordRanges);
  console.log('Expected ranges: X[0-100], Y[0-100]');
  console.log('========================');

  // Statistics for galaxy overview
  const discoveredSystems = useMemo(() =>
    systems.filter(system => system.discoveredBy.includes(playerEmpireId)).length,
    [systems, playerEmpireId]
  );

  const handleSystemClick = (system: StarSystem) => {
    const isDiscovered = system.discoveredBy.includes(playerEmpireId);

    if (!isDiscovered) {
      // Discover the system
      system.discoveredBy.push(playerEmpireId);
      addNotification({
        type: 'success',
        title: 'System Discovered',
        message: `${system.name} system discovered with ${system.planets.length} planets!`
      });
      return;
    }

    // Navigate to system detail view
    setSelectedSystem(system);
    setCurrentView('system');
  };

  const handlePlanetClick = (planet: Planet) => {
    const isSurveyed = planet.surveyedBy.includes(playerEmpireId);

    if (!isSurveyed) {
      // Survey the planet
      surveyPlanet(planet.id, playerEmpireId);
      return;
    }

    // Open planet management
    setSelectedPlanet(planet.id);
    setSidePanel('planet-info');

    addNotification({
      type: 'info',
      title: `Planet: ${planet.name}`,
      message: `${planet.type} world - Click colonize to establish a colony`
    });
  };

  const handleBackToGalaxy = () => {
    setCurrentView('galaxy');
    setSelectedSystem(null);
  };

  // System detail view
  if (currentView === 'system' && selectedSystem) {
    return (
      <AnimatePresence>
        <SystemDetailView
          system={selectedSystem}
          onBack={handleBackToGalaxy}
          onPlanetClick={handlePlanetClick}
        />
      </AnimatePresence>
    );
  }

  // Main galaxy view with system nodes
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

      {/* Hyperlane network - connection lines between systems */}
      <HyperlaneNetwork
        systems={galaxy.systems}
        hyperlanes={galaxy.hyperlanes}
        playerEmpireId={playerEmpireId}
      />

      {/* Galaxy content */}
      <div className="relative w-full h-full" style={{ zIndex: 2 }}>
        {/* System nodes */}
        {systems.map((system) => (
          <SystemNode
            key={system.id}
            system={system}
            onSystemClick={handleSystemClick}
          />
        ))}

        {/* Galaxy info overlay */}
        <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-sm">
          <h3 className="font-semibold mb-2 text-slate-100">Galaxy Overview</h3>
          <div className="space-y-1 text-slate-300">
            <div>Size: <span className="capitalize">{galaxy.size}</span></div>
            <div>Systems: {systems.length}</div>
            <div>Discovered: {discoveredSystems}</div>
            <div>Hyperlanes: {Object.keys(galaxy.hyperlanes || {}).length}</div>
            <div>Seed: {galaxy.seed}</div>
          </div>
          
          {/* Debug button for hyperlane generation */}
          {Object.keys(galaxy.hyperlanes || {}).length === 0 && (
            <button
              onClick={generateHyperlanes}
              className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            >
              Generate Hyperlanes
            </button>
          )}
        </div>

        {/* System legend */}
        <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-sm">
          <h3 className="font-semibold mb-3 text-slate-100">System Types</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-slate-300">Standard System</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-xs text-slate-300">Resource-Rich (4+ planets)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-purple-300" />
              <span className="text-xs text-slate-300">Strategic (rare planets)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-3 h-3 text-slate-500 opacity-60" />
              <span className="text-xs text-slate-300">Unexplored</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-600">
            <h4 className="font-semibold mb-2 text-slate-100">Hyperlanes</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-blue-400 opacity-60" />
                <span className="text-xs text-slate-300">Open Route</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-amber-500 opacity-50" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 2px, currentColor 2px, currentColor 4px)' }} />
                <span className="text-xs text-slate-300">Unstable</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-600">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
              <span className="text-xs text-slate-300">Your Territory</span>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Click systems to explore • Click planets to survey/colonize
            </div>
          </div>
        </div>

        {/* Navigation hint */}
        {discoveredSystems > 0 && (
          <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 text-sm">
            <div className="text-slate-100 font-medium mb-1">Navigation</div>
            <div className="text-slate-300 text-xs">
              Click discovered systems to view planets
            </div>
          </div>
        )}
      </div>
    </div>
  );
};