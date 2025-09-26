import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Settings,
  Bell,
  X,
  Zap,
  Coins,
  Wheat,
  Microscope,
  Wrench,
  Sparkles
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { UI_CONSTANTS, getResourceColor, getNotificationColor } from '../../constants/uiConstants';
import { Button } from '../ui/Button';
import VictoryPanel from './VictoryPanel';
import DiplomacyPanel from './DiplomacyPanel';
import CombatLog from './CombatLog';

const RESOURCE_ICONS = {
  energy: Zap,
  minerals: Coins,
  food: Wheat,
  research: Microscope,
  alloys: Wrench,
  exoticMatter: Sparkles
} as const;

export const GameUI: React.FC = () => {
  const gameState = useGameStore();
  const playerEmpire = gameState.empires[gameState.playerEmpireId];
  const notifications = gameState.uiState.notifications;
  
  if (!playerEmpire) {
    return null;
  }

  return (
    <>
      {/* Top UI Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Empire Info */}
          <div className="flex items-center space-x-4">
            <div className="text-lg font-bold text-white">
              {playerEmpire.name}
            </div>
            <div className="text-sm text-slate-400">
              Turn {gameState.turn}
            </div>
          </div>

          {/* Center: Resources */}
          <div className="flex items-center space-x-6">
            {Object.entries(playerEmpire.resources).map(([resource, amount]) => {
              const Icon = RESOURCE_ICONS[resource as keyof typeof RESOURCE_ICONS];
              const color = getResourceColor(resource);
              const income = playerEmpire.resourceIncome[resource as keyof typeof playerEmpire.resourceIncome];
              
              return (
                <div key={resource} className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <div className="text-white">
                    <span className="font-semibold">{Math.floor(amount)}</span>
                    <span className="text-xs text-slate-400 ml-1">
                      ({income > 0 ? '+' : ''}{Math.floor(income)})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Game Controls */}
          <div className="flex items-center space-x-2">
            {/* Panel Access Buttons */}
            <div title="Victory Conditions">
              <Button
                variant={gameState.uiState.sidePanel === 'victory-conditions' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => gameState.setSidePanel(gameState.uiState.sidePanel === 'victory-conditions' ? 'none' : 'victory-conditions')}
              >
                🏆
              </Button>
            </div>
            
            <div title="Diplomacy">
              <Button
                variant={gameState.uiState.sidePanel === 'diplomacy' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => gameState.setSidePanel(gameState.uiState.sidePanel === 'diplomacy' ? 'none' : 'diplomacy')}
              >
                🤝
              </Button>
            </div>
            
            <div title="Combat Log">
              <Button
                variant={gameState.uiState.sidePanel === 'combat-log' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => gameState.setSidePanel(gameState.uiState.sidePanel === 'combat-log' ? 'none' : 'combat-log')}
              >
                ⚔️
              </Button>
            </div>

            <Button
              variant="primary"
              onClick={() => gameState.nextTurn()}
            >
              <SkipForward className="w-4 h-4" />
              Next Turn
            </Button>
            
            <Button variant="secondary" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-40 space-y-2 max-w-sm">
          {notifications.slice(-UI_CONSTANTS.LAYOUT.MAX_NOTIFICATIONS_DISPLAY).map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`bg-slate-800/90 backdrop-blur-sm border rounded-lg p-4 ${getNotificationColor(notification.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-white">{notification.title}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{notification.message}</p>
                </div>
                <button
                  onClick={() => gameState.markNotificationRead(notification.id)}
                  className="text-slate-400 hover:text-white ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Side Panel */}
      {gameState.uiState.sidePanel !== 'none' && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          className="fixed top-20 right-4 bottom-4 w-80 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg z-30"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">
              {gameState.uiState.sidePanel === 'planet-info' && 'Planet Information'}
              {gameState.uiState.sidePanel === 'colony-management' && 'Colony Management'}
              {gameState.uiState.sidePanel === 'research-tree' && 'Research Tree'}
              {gameState.uiState.sidePanel === 'empire-overview' && 'Empire Overview'}
              {gameState.uiState.sidePanel === 'victory-conditions' && 'Victory Conditions'}
              {gameState.uiState.sidePanel === 'diplomacy' && 'Diplomacy'}
              {gameState.uiState.sidePanel === 'combat-log' && 'Combat Log'}
            </h3>
            <button
              onClick={() => gameState.setSidePanel('none')}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 h-full overflow-y-auto">
            {gameState.uiState.sidePanel === 'planet-info' && (
              <PlanetInfoPanel />
            )}
            {gameState.uiState.sidePanel === 'empire-overview' && (
              <EmpireOverviewPanel />
            )}
            {gameState.uiState.sidePanel === 'victory-conditions' && (
              <VictoryPanel />
            )}
            {gameState.uiState.sidePanel === 'diplomacy' && (
              <DiplomacyPanel />
            )}
            {gameState.uiState.sidePanel === 'combat-log' && (
              <CombatLog combatResults={[]} />
            )}
          </div>
        </motion.div>
      )}

      {/* Bottom UI Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: View Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={gameState.uiState.currentView === 'galaxy' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => gameState.setCurrentView('galaxy')}
            >
              Galaxy
            </Button>
            <Button
              variant={gameState.uiState.currentView === 'colony' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => gameState.setCurrentView('colony')}
            >
              Colonies
            </Button>
            <Button
              variant={gameState.uiState.currentView === 'specialization' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => gameState.setCurrentView('specialization')}
            >
              Specialization
            </Button>
            <Button
              variant={gameState.uiState.currentView === 'research' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => gameState.setCurrentView('research')}
            >
              Research
            </Button>
            <Button
              variant={gameState.uiState.currentView === 'diplomacy' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => gameState.setCurrentView('diplomacy')}
            >
              Diplomacy
            </Button>
          </div>

          {/* Center: Current Research */}
          {playerEmpire.currentResearch && (
            <div className="bg-slate-700/50 rounded-lg px-4 py-2">
              <div className="text-sm text-slate-300">Researching:</div>
              <div className="font-semibold text-blue-400">
                {playerEmpire.researchProgress && playerEmpire.researchProgress[playerEmpire.currentResearch] !== undefined 
                  ? `${Math.floor((playerEmpire.researchProgress[playerEmpire.currentResearch] / 100) * 100)}%`
                  : '0%'
                }
              </div>
            </div>
          )}

          {/* Right: Empire Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-slate-400">
              Colonies: <span className="text-white font-semibold">{playerEmpire.colonies.length}</span>
            </div>
            <div className="text-slate-400">
              Fleets: <span className="text-white font-semibold">{playerEmpire.fleets.length}</span>
            </div>
            <div className="text-slate-400">
              Technologies: <span className="text-white font-semibold">{playerEmpire.technologies.size}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Planet Info Panel Component
const PlanetInfoPanel: React.FC = () => {
  const gameState = useGameStore();
  const selectedPlanetId = gameState.uiState.selectedPlanet;
  
  if (!selectedPlanetId) {
    return <div className="text-slate-400">No planet selected</div>;
  }

  // Find the planet
  let selectedPlanet = null;
  for (const system of Object.values(gameState.galaxy.systems)) {
    const planet = system.planets.find(p => p.id === selectedPlanetId);
    if (planet) {
      selectedPlanet = planet;
      break;
    }
  }

  if (!selectedPlanet) {
    return <div className="text-slate-400">Planet not found</div>;
  }

  const playerEmpireId = gameState.playerEmpireId;
  const isSurveyed = selectedPlanet.surveyedBy.includes(playerEmpireId);
  const isColonized = selectedPlanet.colonizedBy !== undefined;
  const isPlayerColony = selectedPlanet.colonizedBy === playerEmpireId;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-lg text-white">{selectedPlanet.name}</h4>
        <p className="text-slate-400 capitalize">{selectedPlanet.type} World</p>
      </div>

      {isSurveyed ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-400">Size</label>
            <p className="text-white">{selectedPlanet.size}/5</p>
          </div>

          {selectedPlanet.traits.length > 0 && (
            <div>
              <label className="text-sm text-slate-400">Traits</label>
              <div className="space-y-1">
                {selectedPlanet.traits.map((trait, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded p-2">
                    <div className="font-medium text-white">{trait.name}</div>
                    <div className="text-xs text-slate-400">{trait.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isColonized && (
            <div>
              <label className="text-sm text-slate-400">Status</label>
              <p className="text-green-400">
                Colonized {isPlayerColony ? '(Your Colony)' : '(Enemy Colony)'}
              </p>
            </div>
          )}

          {!isColonized && isSurveyed && (
            <Button
              variant="success"
              onClick={() => gameState.colonizePlanet(selectedPlanet.id, playerEmpireId)}
              className="w-full"
            >
              Colonize Planet
            </Button>
          )}
          
          {!isColonized && !isSurveyed && (
            <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                This planet must be surveyed before colonization.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-slate-400">This planet has not been surveyed yet.</p>
          <Button
            variant="primary"
            onClick={() => gameState.surveyPlanet(selectedPlanet.id, playerEmpireId)}
            className="w-full"
          >
            Survey Planet
          </Button>
        </div>
      )}
    </div>
  );
};

// Empire Overview Panel Component
const EmpireOverviewPanel: React.FC = () => {
  const gameState = useGameStore();
  const playerEmpire = gameState.empires[gameState.playerEmpireId];
  
  if (!playerEmpire) {
    return <div className="text-slate-400">No empire data</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-lg text-white">{playerEmpire.name}</h4>
        <p className="text-slate-400 capitalize">{playerEmpire.faction.replace('-', ' ')}</p>
      </div>

      <div>
        <h5 className="font-medium text-white mb-2">Technologies</h5>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {Array.from(playerEmpire.technologies).map(techId => (
            <div key={techId} className="bg-slate-700/50 rounded p-2">
              <div className="text-sm text-white">{techId}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h5 className="font-medium text-white mb-2">Colonies ({playerEmpire.colonies.length})</h5>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {playerEmpire.colonies.map(planetId => (
            <div key={planetId} className="bg-slate-700/50 rounded p-2">
              <div className="text-sm text-white">{planetId}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};