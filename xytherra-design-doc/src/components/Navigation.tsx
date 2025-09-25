import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Globe, 
  Network, 
  Users, 
  Trophy, 
  PlayCircle 
} from 'lucide-react';

interface NavigationProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ setCurrentSection }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home', key: 'home' },
    { path: '/planets', icon: Globe, label: 'Planet Types', key: 'planets' },
    { path: '/tech-tree', icon: Network, label: 'Tech System', key: 'tech' },
    { path: '/factions', icon: Users, label: 'Factions', key: 'factions' },
    { path: '/victory', icon: Trophy, label: 'Victory', key: 'victory' },
    { path: '/gameplay', icon: PlayCircle, label: 'Gameplay', key: 'gameplay' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">X</span>
            </div>
            <h1 className="text-xl font-bold text-white">Xytherra</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ path, icon: Icon, label, key }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setCurrentSection(key)}
                  className={`px-2 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 min-w-[44px] justify-center sm:justify-start ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;