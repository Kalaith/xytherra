import React from 'react';
import { useGameStore } from './stores/gameStore';
import { GameSetup } from './components/game/GameSetup';
import { GalaxyView } from './components/game/GalaxyView';
import { GameUI } from './components/game/GameUI';
import './styles/globals.css';

function App() {
  const phase = useGameStore((state) => state.phase);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {phase === 'setup' && <GameSetup />}
      {phase === 'playing' && (
        <>
          <GalaxyView />
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
