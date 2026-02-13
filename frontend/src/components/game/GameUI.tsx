import React from 'react';
import { motion } from 'framer-motion';
import {
  SkipForward,
  Settings,
  Bell,
  X,
  Zap,
  Coins,
  Wheat,
  Microscope,
  Wrench,
  Sparkles,
  Trophy,
  Handshake,
  Crosshair,
} from 'lucide-react';
import type { SidePanel, GameView } from '../../types/game.d.ts';
import type { Planet } from '../../types/game.d.ts';
import { useGameStore } from '../../stores/gameStore';
import { uiConstants, getResourceColor, getNotificationColor } from '../../constants/uiConstants';
import { Button } from '../ui/Button';
import { ResizableSidebarLayout } from '../ui/ResizableSidebarLayout';
import VictoryPanel from './VictoryPanel';
import DiplomacyPanel from './DiplomacyPanel';
import CombatLog from './CombatLog';

const resourceIcons = {
  energy: Zap,
  minerals: Coins,
  food: Wheat,
  research: Microscope,
  alloys: Wrench,
  exoticMatter: Sparkles,
} as const;

const sidePanelTitles: Record<Exclude<SidePanel, 'none'>, string> = {
  'planet-info': 'Planet Information',
  'colony-management': 'Colony Management',
  'research-tree': 'Research Tree',
  'empire-overview': 'Empire Overview',
  'victory-conditions': 'Victory Conditions',
  diplomacy: 'Diplomacy',
  'combat-log': 'Combat Log',
  'fleet-details': 'Fleet Details',
};

const panelButtons: Array<{
  id: SidePanel;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'victory-conditions', label: 'Victory', icon: Trophy },
  { id: 'diplomacy', label: 'Diplomacy', icon: Handshake },
  { id: 'combat-log', label: 'Combat Log', icon: Crosshair },
];

const viewButtons: Array<{ id: GameView; label: string }> = [
  { id: 'galaxy', label: 'Galaxy' },
  { id: 'colony', label: 'Colonies' },
  { id: 'specialization', label: 'Specialization' },
  { id: 'research', label: 'Research' },
  { id: 'diplomacy', label: 'Diplomacy' },
];

export const GameUI: React.FC = () => {
  const gameState = useGameStore();
  const playerEmpire = gameState.empires[gameState.playerEmpireId];
  const notifications = gameState.uiState.notifications;
  const sidePanel = gameState.uiState.sidePanel;
  const isSidebarOpen = sidePanel !== 'none';
  const combatLog = gameState.uiState.combatLog ?? [];
  const combatLogCount = combatLog.length;

  if (!playerEmpire) {
    return null;
  }

  const notificationsToShow = notifications.slice(-uiConstants.LAYOUT.MAX_NOTIFICATIONS_DISPLAY);

  const handlePanelToggle = (panel: SidePanel) => {
    if (panel === 'none') return;
    gameState.setSidePanel(sidePanel === panel ? 'none' : panel);
  };

  const renderSidePanelContent = () => {
    switch (sidePanel) {
      case 'planet-info':
        return <PlanetInfoPanel />;
      case 'empire-overview':
        return <EmpireOverviewPanel />;
      case 'victory-conditions':
        return <VictoryPanel />;
      case 'diplomacy':
        return <DiplomacyPanel />;
      case 'combat-log':
        return (
          <CombatLog
            combatResults={combatLog}
            onClearLog={combatLog.length ? gameState.clearCombatLog : undefined}
          />
        );
      case 'colony-management':
        return <div className="text-slate-400">Colony tools coming soon.</div>;
      case 'research-tree':
        return <div className="text-slate-400">Research tree coming soon.</div>;
      default:
        return <div className="text-slate-400">Select a panel to view details.</div>;
    }
  };

  const renderResourceMeters = () => (
    <div className="flex flex-wrap items-center gap-4">
      {Object.entries(playerEmpire.resources).map(([resource, amount]) => {
        const Icon = resourceIcons[resource as keyof typeof resourceIcons];
        const color = getResourceColor(resource);
        const income =
          playerEmpire.resourceIncome[resource as keyof typeof playerEmpire.resourceIncome];

        return (
          <div key={resource} className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${color}`} />
            <div className="text-white">
              <span className="font-semibold">{Math.floor(amount)}</span>
              <span className="ml-1 text-xs text-slate-400">
                ({income > 0 ? '+' : ''}
                {Math.floor(income)})
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex h-full flex-col gap-4 px-4 pb-4 pt-4">
      <header className="pointer-events-auto rounded-2xl border border-slate-800/60 bg-slate-900/85 px-6 py-4 shadow-lg shadow-slate-900/40 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-lg font-semibold text-white">{playerEmpire.name}</div>
              <div className="text-sm text-slate-400">Turn {gameState.turn}</div>
            </div>
          </div>
          <div className="flex flex-1 min-w-[240px] justify-center">{renderResourceMeters()}</div>
          <div className="flex items-center gap-2">
            {panelButtons.map(({ id, label, icon: Icon }) => {
              const isActive = sidePanel === id;
              const showBadge = id === 'combat-log' && combatLogCount > 0;
              return (
                <Button
                  key={id}
                  variant={isActive ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handlePanelToggle(id)}
                  className="whitespace-nowrap flex items-center"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {showBadge && (
                    <span className="ml-2 rounded-full bg-red-500/80 px-2 text-xs font-semibold text-white">
                      {combatLogCount > 9 ? '9+' : combatLogCount}
                    </span>
                  )}
                </Button>
              );
            })}
            <Button
              variant="primary"
              onClick={() => gameState.nextTurn()}
              className="whitespace-nowrap"
            >
              <SkipForward className="h-4 w-4" />
              Next Turn
            </Button>
            <Button variant="secondary" size="sm" className="px-2">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <ResizableSidebarLayout
        className="flex-1 pointer-events-none"
        mainClassName="relative h-full pointer-events-none"
        sidebarClassName="pointer-events-auto rounded-2xl shadow-xl shadow-slate-900/50"
        storageKey="xytherra:ui:sidebar-width"
        isSidebarOpen={isSidebarOpen}
        sidebar={
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-3">
              <h3 className="text-sm font-semibold text-white">
                {sidePanel !== 'none'
                  ? sidePanelTitles[sidePanel as Exclude<SidePanel, 'none'>]
                  : 'Details'}
              </h3>
              <button
                type="button"
                onClick={() => gameState.setSidePanel('none')}
                className="text-slate-400 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {renderSidePanelContent()}
            </div>
          </div>
        }
      >
        <div className="relative flex h-full w-full">
          {notificationsToShow.length > 0 && (
            <div className="pointer-events-auto absolute right-4 top-0 z-10 w-80 max-w-full space-y-3">
              {notificationsToShow.map(notification => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className={`rounded-xl border ${getNotificationColor(notification.type)} bg-slate-900/85 p-4 shadow-lg shadow-slate-900/50 backdrop-blur`}
                >
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-blue-400" />
                    <div className="flex-1">
                      <div className="font-semibold text-white">{notification.title}</div>
                      <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => gameState.markNotificationRead(notification.id)}
                      className="text-slate-400 transition hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ResizableSidebarLayout>

      <footer className="pointer-events-auto rounded-2xl border border-slate-800/60 bg-slate-900/85 px-6 py-4 shadow-lg shadow-slate-900/40 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {viewButtons.map(view => (
              <Button
                key={view.id}
                variant={gameState.uiState.currentView === view.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => gameState.setCurrentView(view.id)}
              >
                {view.label}
              </Button>
            ))}
          </div>

          {playerEmpire.currentResearch && (
            <div className="rounded-lg border border-slate-800/60 bg-slate-800/40 px-4 py-2 text-sm text-slate-200">
              <div className="text-xs uppercase tracking-wide text-slate-400">Researching</div>
              <div className="font-semibold text-blue-300">{playerEmpire.currentResearch}</div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-slate-300">
            <div>
              Colonies:{' '}
              <span className="font-semibold text-white">{playerEmpire.colonies.length}</span>
            </div>
            <div>
              Fleets: <span className="font-semibold text-white">{playerEmpire.fleets.length}</span>
            </div>
            <div>
              Technologies:{' '}
              <span className="font-semibold text-white">{playerEmpire.technologies.size}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PlanetInfoPanel: React.FC = () => {
  const gameState = useGameStore();
  const selectedPlanetId = gameState.uiState.selectedPlanet;

  if (!selectedPlanetId) {
    return <div className="text-slate-400">No planet selected</div>;
  }

  let selectedPlanet: Planet | null = null;
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
        <h4 className="text-lg font-semibold text-white">{selectedPlanet.name}</h4>
        <p className="capitalize text-slate-400">{selectedPlanet.type} World</p>
      </div>

      {isSurveyed ? (
        <div className="space-y-3">
          <div>
            <span className="text-sm text-slate-400">Size</span>
            <p className="text-white">{selectedPlanet.size}/5</p>
          </div>

          {selectedPlanet.traits.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-slate-400">Traits</span>
              <div className="space-y-2">
                {selectedPlanet.traits.map((trait, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-800/60 bg-slate-800/40 p-3"
                  >
                    <div className="font-medium text-white">{trait.name}</div>
                    <div className="text-xs text-slate-400">{trait.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isColonized && (
            <div>
              <span className="text-sm text-slate-400">Status</span>
              <p className="text-green-400">
                Colonized {isPlayerColony ? '(Your Colony)' : '(Enemy Colony)'}
              </p>
            </div>
          )}

          {!isColonized && (
            <Button
              variant={isSurveyed ? 'success' : 'secondary'}
              onClick={() => {
                if (isSurveyed) {
                  gameState.colonizePlanet(selectedPlanet.id, playerEmpireId);
                }
              }}
              className="w-full"
              disabled={!isSurveyed}
            >
              {isSurveyed ? 'Colonize Planet' : 'Survey Required'}
            </Button>
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

const EmpireOverviewPanel: React.FC = () => {
  const gameState = useGameStore();
  const playerEmpire = gameState.empires[gameState.playerEmpireId];

  if (!playerEmpire) {
    return <div className="text-slate-400">No empire data</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-white">{playerEmpire.name}</h4>
        <p className="capitalize text-slate-400">{playerEmpire.faction.replace('-', ' ')}</p>
      </div>

      <div>
        <h5 className="mb-2 text-sm font-medium text-white">Technologies</h5>
        <div className="max-h-32 space-y-2 overflow-y-auto">
          {Array.from(playerEmpire.technologies).map(techId => (
            <div
              key={techId}
              className="rounded-lg border border-slate-800/60 bg-slate-800/40 p-2 text-sm text-white"
            >
              {techId}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h5 className="mb-2 text-sm font-medium text-white">
          Colonies ({playerEmpire.colonies.length})
        </h5>
        <div className="max-h-32 space-y-2 overflow-y-auto">
          {playerEmpire.colonies.map(planetId => (
            <div
              key={planetId}
              className="rounded-lg border border-slate-800/60 bg-slate-800/40 p-2 text-sm text-white"
            >
              {planetId}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
