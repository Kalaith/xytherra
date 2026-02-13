// Simple test to verify hyperlane generation works
import { generateHyperlanes, ensureGalaxyHasHyperlanes } from '../services/hyperlaneService';
import type { StarSystem, Galaxy } from '../types/game.d.ts';

// Mock galaxy for testing
const createTestGalaxy = (): Galaxy => {
  const systems: Record<string, StarSystem> = {};

  // Create 5 test systems in a rough line
  for (let i = 0; i < 5; i++) {
    const systemId = `system-${i}`;
    systems[systemId] = {
      id: systemId,
      name: `Test System ${i}`,
      coordinates: { x: i * 20, y: 50 }, // Line across the galaxy
      planets: [],
      discoveredBy: [],
      hyperlanes: [],
    };
  }

  return {
    size: 'medium',
    systems,
    hyperlanes: {},
    width: 100,
    height: 100,
    seed: 12345,
  };
};

// Test hyperlane generation
export const testHyperlaneGeneration = () => {
  console.log('🧪 Testing hyperlane generation...');

  const testGalaxy = createTestGalaxy();
  console.log('Created test galaxy with systems:', Object.keys(testGalaxy.systems));

  // Test direct generation
  const hyperlanes = generateHyperlanes(testGalaxy.systems);
  console.log('Generated hyperlanes:', Object.keys(hyperlanes));
  console.log('Hyperlane details:', hyperlanes);

  // Test ensure function
  testGalaxy.hyperlanes = {}; // Reset
  const updatedGalaxy = ensureGalaxyHasHyperlanes(testGalaxy);
  console.log('Ensured galaxy hyperlanes:', Object.keys(updatedGalaxy.hyperlanes));

  // Verify systems have hyperlane references
  Object.values(updatedGalaxy.systems).forEach(system => {
    console.log(`System ${system.name} connected to:`, system.hyperlanes);
  });

  console.log('✅ Hyperlane test completed');

  return {
    hyperlanesGenerated: Object.keys(updatedGalaxy.hyperlanes).length,
    systems: Object.keys(updatedGalaxy.systems).length,
    galaxy: updatedGalaxy,
  };
};

// Auto-run test when imported in development
if (process.env.NODE_ENV === 'development') {
  // Comment this out to prevent auto-run, uncomment to test
  // testHyperlaneGeneration();
}
