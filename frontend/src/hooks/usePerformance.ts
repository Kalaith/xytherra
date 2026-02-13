import { useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import type { Empire } from '../types/game.d.ts';

// Performance optimized selectors that only subscribe to what they need
export const useEmpireSelector = (empireId: string) => {
  return useGameStore((state) => state.empires[empireId]);
};

export const usePlayerEmpireSelector = () => {
  return useGameStore((state) => ({
    playerEmpireId: state.playerEmpireId,
    empire: state.empires[state.playerEmpireId]
  }));
};

export const useGalaxyStatsSelector = () => {
  return useGameStore((state) => {
    const systems = Object.values(state.galaxy.systems);
    const totalPlanets = systems.reduce((count, system) => 
      count + system.planets.length, 0
    );
    const colonizedPlanets = systems.reduce((count, system) =>
      count + system.planets.filter(p => p.colonizedBy).length, 0
    );
    
    return {
      totalSystems: systems.length,
      totalPlanets,
      colonizedPlanets,
      exploredSystems: systems.filter(s => s.discoveredBy.length > 0).length
    };
  });
};

// Memoized computations for expensive operations
export const useEmpireStats = (empire: Empire | null) => {
  return useMemo(() => {
    if (!empire) return null;
    
    const totalShips = empire.fleets.reduce((count, fleet) => 
      count + fleet.ships.length, 0
    );
    
    const totalFleetPower = empire.fleets.reduce((power, fleet) =>
      power + fleet.ships.reduce((shipPower, ship) => 
        shipPower + ship.stats.attack, 0
      ), 0
    );
    
    const resourceTotal = Object.values(empire.resources)
      .reduce((sum, amount) => sum + amount, 0);
    
    const incomeTotal = Object.values(empire.resourceIncome)
      .reduce((sum, amount) => sum + amount, 0);
    
    return {
      totalShips,
      totalFleetPower,
      resourceTotal,
      incomeTotal,
      techProgress: empire.technologies.size,
      colonyCount: empire.colonies.length
    };
  }, [empire]);
};

export const useVisibleSystems = (playerEmpireId: string) => {
  return useGameStore((state) => {
    const systems = Object.values(state.galaxy.systems);
    return systems.filter(system => 
      system.discoveredBy.includes(playerEmpireId)
    );
  });
};

export const useSystemDetails = (systemId: string, playerEmpireId: string) => {
  return useGameStore((state) => {
    const system = state.galaxy.systems[systemId];
    if (!system) return null;
    
    const isDiscovered = system.discoveredBy.includes(playerEmpireId);
    const surveyedPlanets = system.planets.filter(p => 
      p.surveyedBy.includes(playerEmpireId)
    );
    const colonizedPlanets = system.planets.filter(p => 
      p.colonizedBy === playerEmpireId
    );
    
    return {
      system,
      isDiscovered,
      surveyedPlanets,
      colonizedPlanets,
      explorationComplete: surveyedPlanets.length === system.planets.length
    };
  });
};

// Cache for expensive calculations
const calculationCache = new Map<string, { value: unknown; timestamp: number }>();
const cacheTtl = 5000; // 5 seconds

export const useCachedCalculation = <T>(
  key: string,
  calculation: () => T,
  dependencies: unknown[]
): T => {
  return useMemo(() => {
    const cacheKey = `${key}-${JSON.stringify(dependencies)}`;
    const cached = calculationCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheTtl) {
      return cached.value as T;
    }
    
    const value = calculation();
    calculationCache.set(cacheKey, { value, timestamp: Date.now() });
    
    return value;
  }, [key, calculation, ...dependencies]);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  return useMemo(() => {
    const startTime = performance.now();
    
    return {
      measureRender: () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (renderTime > 16.67) { // More than one frame at 60fps
          console.warn(`Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
        
        return renderTime;
      }
    };
  }, [componentName]);
};
