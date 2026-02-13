import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  Users,
  Zap,
  Coins,
  Wheat,
  Microscope,
  Wrench,
  Sparkles,
  TrendingUp,
  Factory,
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { getResourceColor } from '../../constants/uiConstants';
import { gameConstants } from '../../constants/gameConstants';
import { Button } from '../ui/Button';
import type { Colony, Building as BuildingType, Planet } from '../../types/game.d.ts';

const ColonyView: React.FC = () => {
  const gameState = useGameStore();
  const playerEmpireId = gameState.playerEmpireId;
  const playerEmpire = gameState.empires[playerEmpireId];
  const [selectedColony, setSelectedColony] = useState<string | null>(null);

  if (!playerEmpire) return null;

  // Get all planets with colonies
  const colonies: Array<{ planet: Planet; colony: Colony; system: string }> = [];

  Object.values(gameState.galaxy.systems).forEach(system => {
    system.planets.forEach(planet => {
      if (planet.colony && planet.colony.empireId === playerEmpireId) {
        colonies.push({
          planet,
          colony: planet.colony,
          system: system.name,
        });
      }
    });
  });

  const getResourceIcon = (resource: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      energy: <Zap className={`w-4 h-4 ${getResourceColor('energy')}`} />,
      minerals: <Coins className={`w-4 h-4 ${getResourceColor('minerals')}`} />,
      food: <Wheat className={`w-4 h-4 ${getResourceColor('food')}`} />,
      research: <Microscope className={`w-4 h-4 ${getResourceColor('research')}`} />,
      alloys: <Wrench className={`w-4 h-4 ${getResourceColor('alloys')}`} />,
      exoticMatter: <Sparkles className={`w-4 h-4 ${getResourceColor('exoticMatter')}`} />,
    };

    return iconMap[resource] || <Building className="w-4 h-4 text-gray-400" />;
  };

  const getColonySpecialization = (colony: Colony) => {
    const totalOutput = Object.values(colony.resourceOutput).reduce((sum, val) => sum + val, 0);
    if (totalOutput === 0)
      return { name: 'Developing', color: 'text-gray-400', icon: <Building /> };

    const dominant = Object.entries(colony.resourceOutput).sort(([, a], [, b]) => b - a)[0];

    switch (dominant[0]) {
      case 'energy':
        return { name: 'Energy Hub', color: 'text-yellow-400', icon: <Zap /> };
      case 'minerals':
        return { name: 'Mining World', color: 'text-gray-400', icon: <Coins /> };
      case 'food':
        return { name: 'Agricultural', color: 'text-green-400', icon: <Wheat /> };
      case 'research':
        return { name: 'Research Station', color: 'text-blue-400', icon: <Microscope /> };
      case 'alloys':
        return { name: 'Industrial', color: 'text-orange-400', icon: <Factory /> };
      default:
        return { name: 'Balanced', color: 'text-white', icon: <Building /> };
    }
  };

  const getPopulationGrowth = (colony: Colony) => {
    const growthRate = Math.max(
      0,
      colony.resourceOutput.food - colony.population * gameConstants.COLONY.FOOD_CONSUMPTION_PER_POP
    );
    return Math.round(growthRate * 100) / 100;
  };

  const getColonyHappiness = (colony: Colony, planet: Planet) => {
    let happiness = gameConstants.COLONY.BASE_HAPPINESS;

    // Population density effect
    if (
      colony.population >
      planet.size * gameConstants.COLONY.HAPPINESS_EFFECTS.OVERCROWDING_THRESHOLD
    ) {
      happiness -= gameConstants.COLONY.HAPPINESS_EFFECTS.OVERCROWDING_PENALTY;
    } else if (colony.population < planet.size) {
      happiness += gameConstants.COLONY.HAPPINESS_EFFECTS.UNDERPOPULATED_BONUS;
    }

    // Development level effect
    happiness +=
      colony.developmentLevel * gameConstants.COLONY.HAPPINESS_EFFECTS.DEVELOPMENT_BONUS_PER_LEVEL;

    // Building effects
    colony.buildings.forEach(building => {
      if (building.effects.happiness) happiness += building.effects.happiness;
    });

    return Math.max(0, Math.min(100, happiness));
  };

  const selectedColonyData = selectedColony
    ? colonies.find(c => c.colony.id === selectedColony)
    : null;

  return (
    <div className="absolute inset-0 bg-slate-900 overflow-y-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Colony Management</h1>
          <p className="text-slate-400">Oversee the development of your galactic empire</p>
        </div>

        {colonies.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <Building className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Colonies</h3>
            <p className="text-slate-400">
              Explore the galaxy and colonize planets to expand your empire
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colony List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Your Colonies ({colonies.length})
              </h2>

              {colonies.map(({ planet, colony, system }) => {
                const specialization = getColonySpecialization(colony);
                const happiness = getColonyHappiness(colony, planet);
                const growth = getPopulationGrowth(colony);

                return (
                  <motion.div
                    key={colony.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedColony(colony.id)}
                    className={`bg-slate-800 rounded-lg p-4 border cursor-pointer transition-colors ${
                      selectedColony === colony.id
                        ? 'border-blue-500 bg-slate-700'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{planet.name}</h3>
                        <p className="text-slate-400 text-sm">
                          {system} System • {planet.type}
                        </p>
                      </div>
                      <div
                        className={`flex items-center px-3 py-1 rounded-full text-xs border ${specialization.color} bg-opacity-20`}
                      >
                        {specialization.icon}
                        <span className="ml-1">{specialization.name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-blue-400 mr-1" />
                          <span className="text-white font-semibold">{colony.population}</span>
                        </div>
                        <div className="text-xs text-slate-400">Population</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                          <span className="text-white font-semibold">
                            {colony.developmentLevel}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">Development</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <span
                            className={`text-sm font-semibold ${
                              happiness >= 75
                                ? 'text-green-400'
                                : happiness >= 50
                                  ? 'text-yellow-400'
                                  : happiness >= 25
                                    ? 'text-orange-400'
                                    : 'text-red-400'
                            }`}
                          >
                            {happiness}%
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">Happiness</div>
                      </div>
                    </div>

                    {/* Resource Output */}
                    <div className="flex space-x-4 text-xs">
                      {Object.entries(colony.resourceOutput)
                        .filter(([, val]) => val > 0)
                        .map(([resource, amount]) => (
                          <div key={resource} className="flex items-center">
                            {getResourceIcon(resource)}
                            <span className="ml-1 text-slate-300">
                              +{Math.round(amount * 10) / 10}
                            </span>
                          </div>
                        ))}
                    </div>

                    {growth > 0 && (
                      <div className="mt-2 text-xs text-green-400 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Population growing by {growth}/turn
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Colony Details */}
            <div className="sticky top-8">
              {selectedColonyData ? (
                <ColonyDetailPanel
                  colony={selectedColonyData.colony}
                  planet={selectedColonyData.planet}
                  system={selectedColonyData.system}
                />
              ) : (
                <div className="bg-slate-800 rounded-lg p-8 text-center">
                  <Building className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Select a Colony</h3>
                  <p className="text-slate-400">
                    Choose a colony from the list to view detailed information and management
                    options
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Colony Detail Panel Component
const ColonyDetailPanel: React.FC<{ colony: Colony; planet: Planet; system: string }> = ({
  colony,
  planet,
  system,
}) => {
  const availableBuildings: BuildingType[] = [
    {
      id: 'power-plant',
      type: 'energy',
      name: 'Power Plant',
      description: 'Generates energy for the colony',
      cost: { energy: 0, minerals: 100, food: 0, research: 0, alloys: 20, exoticMatter: 0 },
      upkeep: { energy: 0, minerals: 1, food: 0, research: 0, alloys: 0, exoticMatter: 0 },
      effects: { energyOutput: 5 },
      prerequisites: [],
    },
    {
      id: 'mining-facility',
      type: 'minerals',
      name: 'Mining Facility',
      description: 'Extracts minerals from the planet',
      cost: { energy: 50, minerals: 75, food: 0, research: 0, alloys: 15, exoticMatter: 0 },
      upkeep: { energy: 2, minerals: 0, food: 0, research: 0, alloys: 0, exoticMatter: 0 },
      effects: { mineralOutput: 4 },
      prerequisites: [],
    },
    {
      id: 'research-lab',
      type: 'research',
      name: 'Research Laboratory',
      description: 'Conducts scientific research',
      cost: { energy: 100, minerals: 50, food: 0, research: 0, alloys: 30, exoticMatter: 5 },
      upkeep: { energy: 3, minerals: 0, food: 0, research: 0, alloys: 1, exoticMatter: 0 },
      effects: { researchOutput: 3 },
      prerequisites: [],
    },
  ];

  const getBuildingIcon = (type: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      energy: <Zap className={`w-5 h-5 ${getResourceColor('energy')}`} />,
      minerals: <Coins className={`w-5 h-5 ${getResourceColor('minerals')}`} />,
      research: <Microscope className={`w-5 h-5 ${getResourceColor('research')}`} />,
    };

    return iconMap[type] || <Building className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">{planet.name}</h3>
        <p className="text-slate-400">
          {system} System • Development Level {colony.developmentLevel}
        </p>
      </div>

      {/* Colony Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700 rounded p-3">
          <div className="text-sm text-slate-400 mb-1">Population</div>
          <div className="text-xl font-semibold text-white">{colony.population}</div>
        </div>
        <div className="bg-slate-700 rounded p-3">
          <div className="text-sm text-slate-400 mb-1">Buildings</div>
          <div className="text-xl font-semibold text-white">{colony.buildings.length}</div>
        </div>
      </div>

      {/* Current Buildings */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">Current Buildings</h4>
        {colony.buildings.length === 0 ? (
          <p className="text-slate-400 text-sm">No buildings constructed yet</p>
        ) : (
          <div className="space-y-2">
            {colony.buildings.map((building, index) => (
              <div
                key={index}
                className="bg-slate-700 rounded p-3 flex items-center justify-between"
              >
                <div className="flex items-center">
                  {getBuildingIcon(building.type)}
                  <div className="ml-3">
                    <div className="text-white font-medium">{building.name}</div>
                    <div className="text-slate-400 text-xs">{building.description}</div>
                  </div>
                </div>
                <Button variant="danger" size="sm">
                  Demolish
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Buildings */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Available Buildings</h4>
        <div className="space-y-2">
          {availableBuildings.map(building => (
            <div key={building.id} className="bg-slate-700 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getBuildingIcon(building.type)}
                  <div className="ml-3">
                    <div className="text-white font-medium">{building.name}</div>
                    <div className="text-slate-400 text-xs">{building.description}</div>
                  </div>
                </div>
                <Button variant="primary" size="sm">
                  Build
                </Button>
              </div>

              <div className="flex space-x-4 text-xs text-slate-400">
                <div>Cost:</div>
                {Object.entries(building.cost)
                  .filter(([, val]) => val > 0)
                  .map(([resource, amount]) => (
                    <div key={resource} className="flex items-center">
                      <span>
                        {amount} {resource}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColonyView;
