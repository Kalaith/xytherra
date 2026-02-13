import type { StarSystem, Galaxy, Hyperlane, Coordinates } from '../types/game.d.ts';

// Distance calculation between two points
const calculateDistance = (a: Coordinates, b: Coordinates): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Generate a unique ID for a hyperlane
const generateHyperlaneId = (systemId1: string, systemId2: string): string => {
  // Ensure consistent ordering for bidirectional connections
  return [systemId1, systemId2].sort().join('_');
};

// Simple hyperlane generation using distance-based connections
export const generateHyperlanes = (systems: Record<string, StarSystem>): Record<string, Hyperlane> => {
  const systemList = Object.values(systems);
  const hyperlanes: Record<string, Hyperlane> = {};
  const connections = new Set<string>(); // Track connections to avoid duplicates

  // Configuration - Adjusted for the actual coordinate system
  const maxConnectionDistance = 30; // Maximum distance for direct connections (increased)
  const minConnectionsPerSystem = 2; // Minimum connections per system
  const maxConnectionsPerSystem = 4; // Maximum connections per system

  console.log(`Generating hyperlanes for ${systemList.length} systems...`);

  // Step 1: Connect each system to its nearest neighbors
  systemList.forEach(system => {
    // Find all systems within connection range, sorted by distance
    const nearbySystemsWithDistance = systemList
      .filter(other => other.id !== system.id)
      .map(other => ({
        system: other,
        distance: calculateDistance(system.coordinates, other.coordinates)
      }))
      .filter(({ distance }) => distance <= maxConnectionDistance)
      .sort((a, b) => a.distance - b.distance);

    // Connect to closest systems up to the maximum
    let connectionsAdded = 0;
    for (const { system: targetSystem, distance } of nearbySystemsWithDistance) {
      if (connectionsAdded >= maxConnectionsPerSystem) break;

      const hyperlaneId = generateHyperlaneId(system.id, targetSystem.id);

      // Skip if connection already exists
      if (connections.has(hyperlaneId)) continue;

      // Create the hyperlane
      const hyperlane: Hyperlane = {
        id: hyperlaneId,
        fromSystemId: system.id,
        toSystemId: targetSystem.id,
        distance,
        travelTime: Math.ceil(distance / 10), // Simple travel time calculation
        condition: 'open'
      };

      hyperlanes[hyperlaneId] = hyperlane;
      connections.add(hyperlaneId);

      // Add connection to both systems
      if (!system.hyperlanes) system.hyperlanes = [];
      if (!targetSystem.hyperlanes) targetSystem.hyperlanes = [];

      if (!system.hyperlanes.includes(targetSystem.id)) {
        system.hyperlanes.push(targetSystem.id);
      }
      if (!targetSystem.hyperlanes.includes(system.id)) {
        targetSystem.hyperlanes.push(system.id);
      }

      connectionsAdded++;
    }
  });

  // Step 2: Ensure minimum connectivity (connect isolated systems)
  systemList.forEach(system => {
    if (!system.hyperlanes || system.hyperlanes.length < minConnectionsPerSystem) {
      // Find the closest systems that we're not already connected to
      const unconnectedSystems = systemList
        .filter(other =>
          other.id !== system.id &&
          (!system.hyperlanes || !system.hyperlanes.includes(other.id))
        )
        .map(other => ({
          system: other,
          distance: calculateDistance(system.coordinates, other.coordinates)
        }))
        .sort((a, b) => a.distance - b.distance);

      const connectionsNeeded = minConnectionsPerSystem - (system.hyperlanes?.length || 0);

      for (let i = 0; i < Math.min(connectionsNeeded, unconnectedSystems.length); i++) {
        const { system: targetSystem, distance } = unconnectedSystems[i];
        const hyperlaneId = generateHyperlaneId(system.id, targetSystem.id);

        if (!connections.has(hyperlaneId)) {
          const hyperlane: Hyperlane = {
            id: hyperlaneId,
            fromSystemId: system.id,
            toSystemId: targetSystem.id,
            distance,
            travelTime: Math.ceil(distance / 10),
            condition: 'open'
          };

          hyperlanes[hyperlaneId] = hyperlane;
          connections.add(hyperlaneId);

          // Add connections to both systems
          if (!system.hyperlanes) system.hyperlanes = [];
          if (!targetSystem.hyperlanes) targetSystem.hyperlanes = [];

          system.hyperlanes.push(targetSystem.id);
          targetSystem.hyperlanes.push(system.id);
        }
      }
    }
  });

  console.log(`Generated ${Object.keys(hyperlanes).length} hyperlanes`);
  console.log(`Systems connectivity:`, systemList.map(s => ({ 
    name: s.name, 
    connections: s.hyperlanes?.length || 0 
  })));

  return hyperlanes;
};

// Update existing galaxy with hyperlanes
export const addHyperlanesToGalaxy = (galaxy: Galaxy): Galaxy => {
  // Initialize empty hyperlanes arrays for all systems
  Object.values(galaxy.systems).forEach(system => {
    system.hyperlanes = [];
  });

  // Generate hyperlanes
  const hyperlanes = generateHyperlanes(galaxy.systems);

  return {
    ...galaxy,
    hyperlanes
  };
};

// Get all hyperlanes connected to a specific system
export const getSystemHyperlanes = (systemId: string, galaxy: Galaxy): Hyperlane[] => {
  return Object.values(galaxy.hyperlanes).filter(lane =>
    lane.fromSystemId === systemId || lane.toSystemId === systemId
  );
};

// Check if two systems are connected by a hyperlane
export const areSystemsConnected = (systemId1: string, systemId2: string, galaxy: Galaxy): boolean => {
  const hyperlaneId = generateHyperlaneId(systemId1, systemId2);
  return !!galaxy.hyperlanes[hyperlaneId];
};

// Check if galaxy has hyperlanes and generate them if missing
export const ensureGalaxyHasHyperlanes = (galaxy: Galaxy): Galaxy => {
  // Check if hyperlanes exist and are not empty
  if (!galaxy.hyperlanes || Object.keys(galaxy.hyperlanes).length === 0) {
    console.log('Galaxy missing hyperlanes, generating...');
    return addHyperlanesToGalaxy(galaxy);
  }
  
  // Check if all systems have hyperlane references
  const systemsWithoutHyperlanes = Object.values(galaxy.systems).filter(system => 
    !system.hyperlanes || system.hyperlanes.length === 0
  );
  
  if (systemsWithoutHyperlanes.length > 0) {
    console.log(`${systemsWithoutHyperlanes.length} systems missing hyperlane references, regenerating...`);
    return addHyperlanesToGalaxy(galaxy);
  }
  
  return galaxy;
};