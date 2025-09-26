import React from 'react';
import { useGameStore } from './stores/gameStore';
import { GameSetup } from './components/game/GameSetup';
import GalaxyView from './components/game/GalaxyView';
import { GameUI } from './components/game/GameUI';
import ResearchView from './components/game/ResearchView';
import DiplomacyView from './components/game/DiplomacyView';
import ColonyView from './components/game/ColonyView';
import SpecializationDashboard from './components/game/SpecializationDashboard';
import './styles/globals.css';

function App() {
  const phase = useGameStore((state) => state.phase);
  const currentView = useGameStore((state) => state.uiState.currentView);
  
  const renderGameView = () => {
    switch (currentView) {
      case 'galaxy':
        return <GalaxyView />;
      case 'research':
        return <ResearchView />;
      case 'diplomacy':
        return <DiplomacyView />;
      case 'colony':
        return <ColonyView />;
      case 'specialization':
        return <SpecializationDashboard className="absolute inset-0 overflow-y-auto" />;
      case 'fleets':
      case 'victory':
        return (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
              <p className="text-slate-400">The {currentView} view is under development</p>
            </div>
          </div>
        );
      default:
        return <GalaxyView />;
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {phase === 'setup' && <GameSetup />}
      {phase === 'playing' && (
        <>
          {renderGameView()}
          <GameUI />
        </>
      )}
      {phase === 'ended' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Game Over</h1>
            <p className="text-xl text-slate-400">Check the victory screen for results</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
