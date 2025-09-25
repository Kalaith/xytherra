import { useCallback, useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import type { Empire, Planet, ResourceType } from '../types/game.d.ts';
import type { PartialResourceMap, EmpireId, PlanetId } from '../types/gameTypes';

export const usePlayerEmpire = () => {
  const playerEmpireId = useGameStore((state) => state.playerEmpireId);
  const empires = useGameStore((state) => state.empires);
  
  return useMemo(() => {
    return empires[playerEmpireId] || null;
  }, [empires, playerEmpireId]);
};

export const useEmpireResources = (empireId?: EmpireId) => {
  const playerEmpire = usePlayerEmpire();
  const targetEmpire = useGameStore((state) => empireId ? state.empires[empireId] : null);
  
  const empire = empireId ? targetEmpire : playerEmpire;
  
  return useMemo(() => {
    if (!empire) return null;
    
    return {
      resources: empire.resources,
      income: empire.resourceIncome,
      canAfford: (cost: PartialResourceMap): boolean => {
        return Object.entries(cost).every(([resource, amount]) => 
          empire.resources[resource as ResourceType] >= (amount || 0)
        );
      }
    };
  }, [empire]);
};

export const usePlanetOperations = () => {
  const colonizePlanet = useGameStore((state) => state.colonizePlanet);
  const surveyPlanet = useGameStore((state) => state.surveyPlanet);
  const playerEmpire = usePlayerEmpire();
  
  const colonize = useCallback((planetId: PlanetId) => {
    if (!playerEmpire) {
      throw new Error('No player empire found');
    }
    colonizePlanet(planetId, playerEmpire.id);
  }, [colonizePlanet, playerEmpire]);
  
  const survey = useCallback((planetId: PlanetId) => {
    if (!playerEmpire) {
      throw new Error('No player empire found');
    }
    surveyPlanet(planetId, playerEmpire.id);
  }, [surveyPlanet, playerEmpire]);
  
  return { colonize, survey };
};

export const usePlanetInfo = (planetId?: PlanetId) => {
  const galaxy = useGameStore((state) => state.galaxy);
  const playerEmpire = usePlayerEmpire();
  
  return useMemo(() => {
    if (!planetId || !playerEmpire) return null;
    
    for (const system of Object.values(galaxy.systems)) {
      const planet = system.planets.find(p => p.id === planetId);
      if (planet) {
        return {
          planet,
          system,
          isSurveyed: planet.surveyedBy.includes(playerEmpire.id),
          isColonized: Boolean(planet.colonizedBy),
          isPlayerColony: planet.colonizedBy === playerEmpire.id,
          canColonize: !planet.colonizedBy && planet.surveyedBy.includes(playerEmpire.id),
          canSurvey: !planet.surveyedBy.includes(playerEmpire.id)
        };
      }
    }
    return null;
  }, [planetId, galaxy, playerEmpire]);
};

export const useGameActions = () => {
  const nextTurn = useGameStore((state) => state.nextTurn);
  const resetGame = useGameStore((state) => state.resetGame);
  const addNotification = useGameStore((state) => state.addNotification);
  
  return {
    nextTurn,
    resetGame,
    notify: useCallback((
      title: string, 
      message: string, 
      type: 'info' | 'success' | 'warning' | 'error' = 'info'
    ) => {
      addNotification({ type, title, message });
    }, [addNotification])
  };
};

export const useNotifications = () => {
  const notifications = useGameStore((state) => state.uiState.notifications);
  const markNotificationRead = useGameStore((state) => state.markNotificationRead);
  const clearNotifications = useGameStore((state) => state.clearNotifications);
  
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );
  
  return {
    notifications,
    unreadCount,
    markAsRead: markNotificationRead,
    clearAll: clearNotifications,
    recent: useMemo(() => notifications.slice(-3), [notifications])
  };
};