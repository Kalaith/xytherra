import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import PlanetTypesPage from './pages/PlanetTypesPage';
import TechTreePage from './pages/TechTreePage';
import FactionsPage from './pages/FactionsPage';
import VictoryPage from './pages/VictoryPage';
import GameplayPage from './pages/GameplayPage';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  // Get basename - use root for dev, /xytherra for production
  const basename = import.meta.env.DEV ? '/' : '/xytherra';

  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <Navigation currentSection={currentSection} setCurrentSection={setCurrentSection} />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/planets" element={<PlanetTypesPage />} />
            <Route path="/tech-tree" element={<TechTreePage />} />
            <Route path="/factions" element={<FactionsPage />} />
            <Route path="/victory" element={<VictoryPage />} />
            <Route path="/gameplay" element={<GameplayPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
