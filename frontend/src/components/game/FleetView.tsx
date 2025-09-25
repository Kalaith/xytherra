import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Zap, 
  Shield, 
  Target, 
  Users, 
  Plus, 
  Settings,
  Navigation,
  Swords,
  Activity,
  Star
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import type { Fleet, Ship, ShipStats } from '../../types/game.d.ts';

const FleetView: React.FC = () => {
  const gameState = useGameStore();
  const playerEmpireId = gameState.playerEmpireId;
  const playerEmpire = gameState.empires[playerEmpireId];
  const [selectedFleet, setSelectedFleet] = useState<string | null>(null);
  const [designMode, setDesignMode] = useState(false);

  if (!playerEmpire) return null;

  const fleets = playerEmpire.fleets || [];

  const getFleetStrength = (fleet: Fleet): number => {
    return fleet.ships.reduce((total, ship) => {
      return total + (ship.stats?.attack || 10) + (ship.stats?.defense || 10);
    }, 0);
  };

  const getFleetExperience = (fleet: Fleet): number => {
    return fleet.ships.reduce((total, ship) => total + (ship.experience || 0), 0) / Math.max(fleet.ships.length, 1);
  };

  const getExperienceRank = (experience: number): { rank: string; color: string } => {
    if (experience >= 100) return { rank: 'Legendary', color: 'text-purple-400' };
    if (experience >= 75) return { rank: 'Elite', color: 'text-orange-400' };
    if (experience >= 50) return { rank: 'Veteran', color: 'text-blue-400' };
    if (experience >= 25) return { rank: 'Experienced', color: 'text-green-400' };
    return { rank: 'Rookie', color: 'text-gray-400' };
  };

  const selectedFleetData = selectedFleet ? fleets.find(f => f.id === selectedFleet) : null;

  // Sample ship designs for new fleets
  const shipDesigns = [
    {
      id: 'corvette',
      name: 'Corvette',
      class: 'Light',
      stats: { health: 100, attack: 20, defense: 15, speed: 8, range: 2 },
      cost: { minerals: 150, alloys: 50, energy: 100 }
    },
    {
      id: 'frigate', 
      name: 'Frigate',
      class: 'Medium',
      stats: { health: 200, attack: 35, defense: 25, speed: 6, range: 3 },
      cost: { minerals: 300, alloys: 100, energy: 200 }
    },
    {
      id: 'destroyer',
      name: 'Destroyer', 
      class: 'Heavy',
      stats: { health: 400, attack: 60, defense: 40, speed: 4, range: 4 },
      cost: { minerals: 500, alloys: 200, energy: 300 }
    }
  ];

  return (
    <div className="absolute inset-0 bg-slate-900 overflow-y-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Fleet Command</h1>
              <p className="text-slate-400">Command your space armadas across the galaxy</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setDesignMode(!designMode)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  designMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Ship Designer</span>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Fleet</span>
              </button>
            </div>
          </div>
        </div>

        {fleets.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <Rocket className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Fleets</h3>
            <p className="text-slate-400 mb-4">Build your first fleet to explore and defend your empire</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Build First Fleet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fleet List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-4">Active Fleets ({fleets.length})</h2>
              
              {fleets.map((fleet) => {
                const strength = getFleetStrength(fleet);
                const experience = getFleetExperience(fleet);
                const rank = getExperienceRank(experience);
                
                return (
                  <motion.div
                    key={fleet.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedFleet(fleet.id)}
                    className={`bg-slate-800 rounded-lg p-4 border cursor-pointer transition-colors ${
                      selectedFleet === fleet.id 
                        ? 'border-blue-500 bg-slate-700' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{fleet.name}</h3>
                        <p className="text-slate-400 text-sm">
                          {fleet.ships.length} ships • {fleet.mission || 'Idle'}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs border ${rank.color} bg-opacity-20`}>
                        <Star className="w-3 h-3 inline mr-1" />
                        {rank.rank}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Swords className="w-4 h-4 text-red-400 mr-1" />
                          <span className="text-white font-semibold">{strength}</span>
                        </div>
                        <div className="text-xs text-slate-400">Combat Power</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Navigation className="w-4 h-4 text-blue-400 mr-1" />
                          <span className="text-white font-semibold">
                            {fleet.coordinates ? `${Math.round(fleet.coordinates.x)}, ${Math.round(fleet.coordinates.y)}` : 'Unknown'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">Position</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Activity className="w-4 h-4 text-green-400 mr-1" />
                          <span className="text-white font-semibold">{Math.round(experience)}</span>
                        </div>
                        <div className="text-xs text-slate-400">Experience</div>
                      </div>
                    </div>
                    
                    {/* Ship Composition */}
                    <div className="flex space-x-2 text-xs">
                      {fleet.ships.reduce((acc, ship) => {
                        const existing = acc.find(item => item.design === ship.design.name);
                        if (existing) {
                          existing.count++;
                        } else {
                          acc.push({ design: ship.design.name, count: 1 });
                        }
                        return acc;
                      }, [] as Array<{design: string; count: number}>).map(({ design, count }) => (
                        <span key={design} className="bg-slate-700 px-2 py-1 rounded text-slate-300">
                          {count}x {design}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Fleet Details / Ship Designer */}
            <div className="sticky top-8">
              {designMode ? (
                <ShipDesignerPanel shipDesigns={shipDesigns} />
              ) : selectedFleetData ? (
                <FleetDetailPanel fleet={selectedFleetData} />
              ) : (
                <div className="bg-slate-800 rounded-lg p-8 text-center">
                  <Rocket className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Select a Fleet</h3>
                  <p className="text-slate-400">Choose a fleet to view details and issue commands</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Fleet Detail Panel Component
const FleetDetailPanel: React.FC<{ fleet: Fleet }> = ({ fleet }) => {
  const missions = ['Idle', 'Explore', 'Patrol', 'Attack', 'Defend', 'Colonize'];
  
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">{fleet.name}</h3>
        <p className="text-slate-400">Fleet Command Interface</p>
      </div>
      
      {/* Fleet Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700 rounded p-3">
          <div className="text-sm text-slate-400 mb-1">Ships</div>
          <div className="text-xl font-semibold text-white">{fleet.ships.length}</div>
        </div>
        <div className="bg-slate-700 rounded p-3">
          <div className="text-sm text-slate-400 mb-1">Mission</div>
          <div className="text-xl font-semibold text-white">{fleet.mission || 'Idle'}</div>
        </div>
      </div>
      
      {/* Mission Control */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">Mission Assignment</h4>
        <div className="grid grid-cols-2 gap-2">
          {missions.map(mission => (
            <button
              key={mission}
              className={`p-2 rounded text-sm transition-colors ${
                fleet.mission === mission.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {mission}
            </button>
          ))}
        </div>
      </div>
      
      {/* Ships in Fleet */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Ship Roster</h4>
        <div className="space-y-2">
          {fleet.ships.map((ship, index) => (
            <div key={index} className="bg-slate-700 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Rocket className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-white font-medium">{ship.design.name}</span>
                </div>
                <div className="text-slate-400 text-xs">
                  Exp: {ship.experience || 0}
                </div>
              </div>
              
              {ship.stats && (
                <div className="flex space-x-4 text-xs text-slate-400">
                  <div className="flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    {ship.stats.attack}
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    {ship.stats.defense}
                  </div>
                  <div className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {ship.stats.health}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {fleet.ships.length === 0 && (
            <p className="text-slate-400 text-center py-4">No ships in fleet</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Ship Designer Panel Component
const ShipDesignerPanel: React.FC<{ shipDesigns: any[] }> = ({ shipDesigns }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Ship Designer</h3>
        <p className="text-slate-400">Design and build new ship classes</p>
      </div>
      
      <div className="space-y-4">
        {shipDesigns.map(design => (
          <div key={design.id} className="bg-slate-700 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-white font-semibold">{design.name}</h4>
                <p className="text-slate-400 text-sm">{design.class} Class Vessel</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                Build
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
              <div className="flex items-center">
                <Zap className="w-3 h-3 text-red-400 mr-1" />
                <span className="text-white">{design.stats.attack}</span>
                <span className="text-slate-400 ml-1">Attack</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-3 h-3 text-blue-400 mr-1" />
                <span className="text-white">{design.stats.defense}</span>
                <span className="text-slate-400 ml-1">Defense</span>
              </div>
              <div className="flex items-center">
                <Navigation className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-white">{design.stats.speed}</span>
                <span className="text-slate-400 ml-1">Speed</span>
              </div>
            </div>
            
            <div className="text-xs text-slate-400">
              Cost: {Object.entries(design.cost).map(([resource, amount]) => 
                `${amount} ${resource}`
              ).join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FleetView;