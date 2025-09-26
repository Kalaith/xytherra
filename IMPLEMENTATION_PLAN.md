# Implementation Plan: Core Planet-Tech System
*Phase 1 - Highest Priority Features for Xytherra*

## **Overview**

This plan implements the core planet-driven technology system that makes Xytherra unique. Instead of traditional research trees, technologies unlock through planetary colonization with weighted empire specialization.

## **Implementation Phases**

### **Phase 1A: Planet-Tech Unlocking System**
*Priority: CRITICAL - This is the core innovation*

#### **1.1 Empire Colonization History Tracking**

**New Data Structures:**
```typescript
interface EmpireColonizationHistory {
  order: PlanetColonization[];
  weights: Record<TechDomain, number>;
  currentSpecialization: TechDomain[];
}

interface PlanetColonization {
  planetId: string;
  planetType: PlanetType;
  turn: number;
  order: number; // 1st, 2nd, 3rd colony, etc.
  weight: number; // 3.0, 2.0, 1.5, etc.
}
```

**Implementation Steps:**
1. Add `colonizationHistory` to Empire interface
2. Update `colonizePlanet()` to track colonization order
3. Calculate domain weights (first colony = 3x, second = 2x, third = 1.5x)
4. Update empire specialization scores

**Files to Modify:**
- `src/types/game.d.ts` - Add new interfaces
- `src/stores/gameStore.ts` - Update colonizePlanet function
- `src/services/empireService.ts` - Add weight calculation methods

#### **1.2 Planet-Based Technology Unlocking**

**Core Logic:**
```typescript
// When a planet is surveyed → Unlock Tier 1 tech
// When a planet is colonized → Unlock Tier 2 tech
// When planet reaches mastery → Unlock Tier 3 tech
```

**Implementation Steps:**
1. Create `unlockPlanetTechnologies()` function
2. Auto-unlock Tier 1 tech on survey
3. Auto-unlock Tier 2 tech on colonization
4. Add mastery progression system for Tier 3
5. Remove traditional research tree UI

**New Service Methods:**
```typescript
class PlanetTechService {
  static unlockSurveyTech(planet: Planet, empireId: string): string[]
  static unlockColonyTech(planet: Planet, empireId: string): string[]
  static checkMasteryUnlocks(planet: Planet, empire: Empire): string[]
  static calculateEmpireSpecialization(empire: Empire): Record<TechDomain, number>
}
```

#### **1.3 Technology Validation System**

**Implementation Steps:**
1. Validate tech requirements against controlled planets
2. Prevent research of techs without proper planet types
3. Update research UI to show planet requirements
4. Add "requires [planet type] colony" messages

### **Phase 1B: Colonization Order Weighting**
*Priority: HIGH - Creates empire identity*

#### **1.4 Dynamic Empire Specialization**

**Weighting Formula:**
```typescript
const COLONIZATION_WEIGHTS = {
  1: 3.0,  // First colony
  2: 2.0,  // Second colony
  3: 1.5,  // Third colony
  4: 1.2,  // Fourth colony
  5: 1.0   // Fifth+ colonies
};
```

**Implementation Steps:**
1. Calculate domain strengths after each colonization
2. Update empire stats in real-time
3. Create specialization visualization (radar charts)
4. Affect research speeds based on specialization
5. Add empire identity descriptions

#### **1.5 Empire Tech DNA Visualization**

**UI Components:**
1. **Specialization Radar Chart** - Shows current domain strengths
2. **Colonization Timeline** - Displays planet colonization order
3. **Empire Identity Panel** - Dynamic description based on tech DNA
4. **Comparison Tool** - Compare different colonization paths

### **Phase 1C: Mastery System**
*Priority: MEDIUM - Enables Tier 3 technologies*

#### **1.6 Planet Mastery Mechanics**

**Mastery Requirements:**
```typescript
interface PlanetMastery {
  planetId: string;
  currentLevel: number; // 0-100
  masteryPoints: number; // Accumulated over time
  requiredInvestment: number; // Research points needed
  masteryBonuses: Record<string, number>;
}
```

**Implementation Steps:**
1. Add mastery tracking to colonies
2. Create mastery investment UI
3. Implement mastery point accumulation
4. Unlock Tier 3 techs at mastery completion
5. Add mastery bonuses (enhanced resource output, etc.)

## **Detailed Implementation Steps**

### **Step 1: Update Empire Data Structure**

**File:** `src/types/game.d.ts`

```typescript
// Add to Empire interface
interface Empire {
  // ... existing fields ...
  colonizationHistory: EmpireColonizationHistory;
  techDomainWeights: Record<TechDomain, number>;
  specializationLevel: Record<TechDomain, 'weak' | 'moderate' | 'strong' | 'dominant'>;
  planetMasteries: Record<string, PlanetMastery>; // planetId -> mastery
}
```

### **Step 2: Create Planet-Tech Service**

**File:** `src/services/planetTechService.ts`

```typescript
export class PlanetTechService {
  /**
   * Unlock technologies when surveying a planet
   */
  static unlockSurveyTechnologies(planet: Planet, empireId: string): {
    unlockedTechs: string[];
    notifications: string[];
  } {
    const unlockedTechs: string[] = [];
    const planetTechs = Object.values(TECHNOLOGIES).filter(
      tech => tech.requiredPlanetType === planet.type && tech.tier === 1
    );

    planetTechs.forEach(tech => {
      unlockedTechs.push(tech.id);
    });

    return {
      unlockedTechs,
      notifications: unlockedTechs.map(techId => 
        `Discovered ${TECHNOLOGIES[techId].name} through planetary survey!`
      )
    };
  }

  /**
   * Calculate empire specialization based on colonization history
   */
  static calculateEmpireSpecialization(empire: Empire): Record<TechDomain, number> {
    const domainWeights: Record<TechDomain, number> = {
      shields: 0, weapons: 0, industry: 0, propulsion: 0,
      sensors: 0, biotech: 0, survival: 0, experimental: 0
    };

    empire.colonizationHistory.order.forEach(colonization => {
      const planetInfo = PLANET_TYPES[colonization.planetType];
      domainWeights[planetInfo.domain] += colonization.weight;
    });

    return domainWeights;
  }

  /**
   * Update colonization history when colonizing a planet
   */
  static updateColonizationHistory(
    empire: Empire,
    planet: Planet,
    turn: number
  ): EmpireColonizationHistory {
    const order = empire.colonizationHistory.order.length + 1;
    const weight = COLONIZATION_WEIGHTS[order] || 1.0;

    const newColonization: PlanetColonization = {
      planetId: planet.id,
      planetType: planet.type,
      turn,
      order,
      weight
    };

    const updatedHistory = {
      ...empire.colonizationHistory,
      order: [...empire.colonizationHistory.order, newColonization]
    };

    // Recalculate weights
    updatedHistory.weights = this.calculateEmpireSpecialization({
      ...empire,
      colonizationHistory: updatedHistory
    });

    return updatedHistory;
  }
}
```

### **Step 3: Update Game Store Integration**

**File:** `src/stores/gameStore.ts`

**Modify the `colonizePlanet` function:**

```typescript
colonizePlanet: (planetId, empireId) => {
  set((state) => {
    const empire = state.empires[empireId];
    if (!empire) return state;
    
    // Find the planet and add colony
    Object.values(state.galaxy.systems).forEach(system => {
      const planet = system.planets.find(p => p.id === planetId);
      if (planet && !planet.colonizedBy) {
        
        // Existing colonization logic...
        
        // NEW: Update colonization history
        const updatedHistory = PlanetTechService.updateColonizationHistory(
          empire, planet, state.turn
        );
        empire.colonizationHistory = updatedHistory;
        
        // NEW: Unlock colony technologies (Tier 2)
        const colonyTechResult = PlanetTechService.unlockColonyTechnologies(planet, empireId);
        colonyTechResult.unlockedTechs.forEach(techId => {
          empire.technologies.add(techId);
        });
        
        // NEW: Update empire specialization
        empire.techDomainWeights = PlanetTechService.calculateEmpireSpecialization(empire);
        
        // Add notifications for unlocked techs
        colonyTechResult.notifications.forEach(message => {
          get().addNotification({
            type: 'success',
            title: 'Technology Unlocked',
            message
          });
        });
        
        get().addNotification({
          type: 'success',
          title: 'Colony Established',
          message: `Successfully colonized ${planet.name}! Technologies unlocked.`
        });
      }
    });
    return state;
  });
}
```

### **Step 4: Create Specialization Visualization Component**

**File:** `src/components/game/EmpireSpecializationView.tsx`

```typescript
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const EmpireSpecializationView: React.FC<{ empire: Empire }> = ({ empire }) => {
  const specializationData = Object.entries(empire.techDomainWeights).map(([domain, weight]) => ({
    domain: domain.charAt(0).toUpperCase() + domain.slice(1),
    value: Math.min(weight * 20, 100), // Scale for visualization
    fullMark: 100
  }));

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Empire Specialization</h3>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={specializationData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="domain" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} />
            <Radar
              name="Specialization"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-semibold">Colonization History:</h4>
        {empire.colonizationHistory.order.map((colonization, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>#{colonization.order}: {colonization.planetType}</span>
            <span className="text-blue-400">×{colonization.weight}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### **Step 5: Update Research View**

**File:** `src/components/game/ResearchView.tsx`

Replace traditional research tree with planet-based unlock display:

```typescript
export const ResearchView: React.FC = () => {
  const gameState = useGameStore();
  const playerEmpire = gameState.empires[gameState.playerEmpireId];

  // Group available techs by planet type requirement
  const techsByPlanet = useMemo(() => {
    const groups: Record<PlanetType, Technology[]> = {} as Record<PlanetType, Technology[]>;
    
    Object.values(TECHNOLOGIES).forEach(tech => {
      if (!groups[tech.requiredPlanetType]) {
        groups[tech.requiredPlanetType] = [];
      }
      groups[tech.requiredPlanetType].push(tech);
    });
    
    return groups;
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Planet-Based Technologies</h2>
        <p className="text-slate-400">
          Technologies unlock through planetary exploration and colonization. 
          Survey planets for Tier 1, colonize for Tier 2, achieve mastery for Tier 3.
        </p>
      </div>

      {Object.entries(techsByPlanet).map(([planetType, techs]) => {
        const hasColony = playerEmpire.colonies.some(colonyId => {
          // Check if player has this planet type colonized
          // Implementation needed to link colony to planet type
        });

        return (
          <PlanetTechSection
            key={planetType}
            planetType={planetType as PlanetType}
            technologies={techs}
            hasAccess={hasColony}
            empire={playerEmpire}
          />
        );
      })}
    </div>
  );
};
```

## **Testing Strategy**

### **Test Cases for Core System:**

1. **Colonization Order Tests:**
   - First colony gets 3x weight
   - Second colony gets 2x weight
   - Empire specialization updates correctly

2. **Technology Unlocking Tests:**
   - Survey unlocks Tier 1 tech
   - Colonization unlocks Tier 2 tech
   - Cannot research tech without proper planet

3. **Specialization Calculation Tests:**
   - Domain weights calculate correctly
   - Radar chart displays properly
   - Empire identity updates dynamically

## **Migration Plan**

### **Backward Compatibility:**
1. Add default values for new empire fields
2. Migrate existing save games gradually
3. Provide fallback for missing colonization history

### **Rollout Strategy:**
1. **Week 1:** Implement data structures and basic unlocking
2. **Week 2:** Add colonization tracking and weight calculation  
3. **Week 3:** Create UI components and visualizations
4. **Week 4:** Integration testing and polish

## **Success Metrics**

- [ ] Technologies unlock automatically on planet events
- [ ] Colonization order affects empire specialization 
- [ ] UI displays dynamic empire identity
- [ ] Cannot research inappropriate technologies
- [ ] Mastery system enables Tier 3 technologies

This implementation transforms Xytherra from a traditional 4X into the unique planet-tech system described in the design document.