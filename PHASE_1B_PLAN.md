# Phase 1B Implementation Plan: Empire Specialization & Visualization
*Building on Phase 1A's Core Planet-Tech System*

## **Current Status ✅**
**Phase 1A Complete:**
- ✅ Planet-tech unlocking system (survey → Tier 1, colonize → Tier 2)
- ✅ Colonization history tracking with weighted order (3x, 2x, 1.5x, 1x)
- ✅ Empire specialization calculation across tech domains
- ✅ Technology validation against planet requirements
- ✅ Core PlanetTechService with all unlocking logic
- ✅ GameStore integration for survey/colonize/research workflows

## **Phase 1B Goals 🎯**
Transform the basic planet-tech system into a visually rich, strategic experience where:
1. **Players see their empire's emerging identity** through specialization visualizations
2. **Colonization choices feel meaningful** with immediate visual feedback
3. **Empire comparison** enables strategic planning against other empires
4. **UI clearly communicates** planet-tech relationships and requirements

---

## **Implementation Tasks**

### **Task 1: Empire Specialization Visualization Dashboard**
*Priority: HIGH - Core visual feedback for player decisions*

#### **1.1 Specialization Radar Chart Component**
**File:** `src/components/game/EmpireSpecializationRadar.tsx`

**Features:**
- 8-axis radar chart showing tech domain strengths
- Real-time updates as colonies are established
- Color-coded domains matching tech categories
- Hover tooltips with specific weights and colony contributions
- Animation when values change

**Implementation:**
```typescript
interface SpecializationRadarProps {
  empire: Empire;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  interactive?: boolean;
}

// Uses Recharts RadarChart with custom styling
// Scales domain weights to 0-100 for visualization
// Color scheme matches tech domain colors from ResearchView
```

#### **1.2 Colonization Timeline Component**
**File:** `src/components/game/ColonizationTimeline.tsx`

**Features:**
- Horizontal timeline showing colonization order
- Planet type icons with multiplier weights (3x, 2x, etc.)
- Click to highlight affected technologies
- Visual connection to specialization radar
- "What if" planning mode for future colonies

**Visual Design:**
```
Colony 1 ──[🌊 Oceanic]──×3.0─┐
Colony 2 ──[🏔️ Mountain]─×2.0─┤── Shields: 8.5 pts
Colony 3 ──[🌋 Volcanic]──×1.5─┘    Weapons: 3.5 pts
```

#### **1.3 Empire Identity Panel**
**File:** `src/components/game/EmpireIdentityPanel.tsx`

**Features:**
- Dynamic empire description based on specialization
- "Dominant" domains (>40% of total specialization)
- "Secondary" domains (20-40%)
- Historical colonization achievements
- Predicted specialization with next colony choices

**Identity Generation Logic:**
```typescript
// Example outputs:
// "Oceanic Shield Masters" - 60% Shields, 25% Biotech
// "Balanced Explorers" - No domain >30%
// "Volcanic Weapon Forgers" - 55% Weapons, 30% Industry
```

### **Task 2: Enhanced Research View Integration**
*Priority: HIGH - Show planet-tech connections clearly*

#### **2.1 Planet-Based Technology Grouping**
**Update:** `src/components/game/ResearchView.tsx`

**New Layout:**
- Group technologies by required planet type
- Show "Locked" vs "Available" vs "Researched" states
- Visual indicators for colony requirements
- Progress bars for mastery-locked Tier 3 techs

**UI Structure:**
```
🌊 OCEANIC TECHNOLOGIES
├─ Tier 1 (Survey) ✅ Available
│  ├─ Hydrodynamic Shielding [Researched]
│  └─ Tidal Generators [Available]
├─ Tier 2 (Colony) ✅ Available  
│  ├─ Deep Sea Mining [Available]
│  └─ Pressure Adaptation [Researching...]
└─ Tier 3 (Mastery) ⏳ 35% Complete
   └─ Oceanic Mastery Core [Locked]

🏔️ MOUNTAIN TECHNOLOGIES
├─ Tier 1 (Survey) ❌ Requires Survey
├─ Tier 2 (Colony) ❌ Requires Colony
└─ Tier 3 (Mastery) ❌ Requires Colony + Mastery
```

#### **2.2 Planet Requirement Tooltips**
**Enhancement:** Detailed tooltips showing exactly what's needed

**Tooltip Content:**
- "Requires: Colony on Oceanic world" 
- "You have: 2 Oceanic colonies (Aquatilla, Tidal Prime)"
- "Hybrid Tech: Requires Desert + Volcanic colonies"
- "Mastery Progress: 35/100 points invested"

### **Task 3: Galaxy View Enhancements**
*Priority: MEDIUM - Strategic planning support*

#### **3.1 Planet-Tech Preview Mode**
**Update:** `src/components/game/GalaxyView.tsx`

**New Features:**
- Toggle "Tech View" mode showing planet types as tech categories
- Hover over planets to see available tech unlocks
- Visual path planning: "If I colonize X, I'll unlock Y techs"
- Empire specialization comparison overlay

#### **3.2 Colonization Impact Predictor**
**Component:** `src/components/game/ColonizationPreview.tsx`

**Features:**
- Shows specialization changes if planet is colonized
- Calculates new domain weights and percentages
- Highlights newly unlocked technologies
- Strategic recommendation based on current empire gaps

**Preview Panel:**
```
If you colonize [Volcanic World]:
┌─ Domain Changes ─────────────┐
│ Weapons: 45% → 52% (+7%)     │
│ Industry: 20% → 23% (+3%)    │
└──────────────────────────────┘
┌─ New Technologies ───────────┐
│ • Plasma Cannon Mk II        │
│ • Volcanic Forge Systems     │
└──────────────────────────────┘
Recommendation: Excellent for weapon specialization!
```

### **Task 4: Empire Comparison Tools**
*Priority: MEDIUM - Multiplayer awareness*

#### **4.1 Multi-Empire Specialization Comparison**
**Component:** `src/components/game/EmpireComparisonView.tsx`

**Features:**
- Side-by-side radar charts for all empires
- Identification of empire "niches" and conflicts
- Historical specialization trends
- Competitive analysis of colonization strategies

#### **4.2 Diplomacy Integration**
**Update:** `src/components/game/DiplomacyView.tsx`

**New Features:**
- See other empire specializations (if discovered)
- Trade technologies based on specialization compatibility
- Warning about empires with similar specializations (conflict potential)
- Alliance benefits showing complementary specializations

### **Task 5: Tutorial and Onboarding**
*Priority: MEDIUM - Player education*

#### **5.1 Planet-Tech Tutorial Sequence**
**Component:** `src/components/game/PlanetTechTutorial.tsx`

**Tutorial Steps:**
1. "Survey your first planet to unlock Tier 1 technologies"
2. "Establish your first colony - this gets 3x specialization weight!"
3. "Your empire specialization is emerging - check the radar chart"
4. "Plan your second colony to complement or strengthen your specialization"
5. "Research unlocked technologies to advance your empire"

#### **5.2 Interactive Specialization Guide**
**Component:** `src/components/game/SpecializationGuide.tsx`

**Features:**
- Clickable specialization paths showing required planets
- "Build a Shield Empire" vs "Build a Weapon Empire" guided paths
- Historical examples of successful specialization strategies
- Interactive "what-if" colonization planner

---

## **Technical Implementation Details**

### **Data Structure Updates**

#### **Enhanced Empire Interface**
```typescript
interface Empire {
  // ... existing fields ...
  
  // NEW: Detailed specialization tracking
  specializationHistory: SpecializationSnapshot[]; // Per-turn tracking
  dominantDomains: TechDomain[]; // Domains with >40% weight
  secondaryDomains: TechDomain[]; // Domains with 20-40% weight
  empireBadges: string[]; // Achievement-style descriptors
  
  // NEW: Planning and prediction
  plannedColonizations: PlannedColonization[]; // UI planning mode
  projectedSpecialization: Record<TechDomain, number>; // If planned colonies executed
}

interface SpecializationSnapshot {
  turn: number;
  weights: Record<TechDomain, number>;
  totalWeight: number;
  dominantDomain: TechDomain | null;
}

interface PlannedColonization {
  planetId: string;
  planetType: PlanetType;
  isExecuted: boolean;
  projectedWeight: number;
  projectedUnlocks: string[]; // Tech IDs that would unlock
}
```

#### **UI State Management**
```typescript
// Add to gameStore or new uiStore
interface UIState {
  researchView: {
    groupingMode: 'planet' | 'domain' | 'tier';
    showLocked: boolean;
    selectedPlanetType: PlanetType | null;
  };
  
  galaxyView: {
    showTechPreview: boolean;
    selectedColonizationTarget: string | null;
    showSpecializationOverlay: boolean;
  };
  
  specializationView: {
    selectedEmpireIds: string[]; // For comparison
    showHistoricalTrends: boolean;
    timelineRange: [number, number]; // Turn range
  };
}
```

### **Service Layer Updates**

#### **Enhanced PlanetTechService**
```typescript
export class PlanetTechService {
  // ... existing methods ...

  /**
   * Calculate projected specialization if colony is established
   */
  static projectColonizationImpact(
    empire: Empire,
    planet: Planet
  ): ProjectedImpact {
    // Simulate adding the colony and recalculate specialization
    // Return domain changes and newly unlocked techs
  }

  /**
   * Generate empire identity description based on specialization
   */
  static generateEmpireIdentity(empire: Empire): EmpireIdentity {
    // Analyze specialization patterns and generate descriptive text
    // Return title, description, and achievement badges
  }

  /**
   * Compare empires and identify strategic relationships
   */
  static compareEmpireSpecializations(
    empires: Empire[]
  ): EmpireComparison[] {
    // Calculate specialization overlaps, gaps, and complementarity
    // Return strategic analysis for diplomacy and competition
  }
}
```

### **Component Architecture**

#### **Specialization Dashboard Layout**
```typescript
const SpecializationDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      {/* Main radar chart - prominent position */}
      <div className="col-span-6 xl:col-span-4">
        <EmpireSpecializationRadar 
          empire={currentEmpire}
          size="large"
          interactive={true}
        />
      </div>
      
      {/* Colonization timeline */}
      <div className="col-span-6 xl:col-span-5">
        <ColonizationTimeline 
          empire={currentEmpire}
          showProjections={true}
        />
      </div>
      
      {/* Empire identity panel */}
      <div className="col-span-12 xl:col-span-3">
        <EmpireIdentityPanel 
          empire={currentEmpire}
          showRecommendations={true}
        />
      </div>
      
      {/* Comparison tools - collapsible */}
      <div className="col-span-12">
        <EmpireComparisonView 
          empires={visibleEmpires}
          focusEmpire={currentEmpire.id}
        />
      </div>
    </div>
  );
};
```

---

## **Implementation Schedule**

### **Week 1: Core Visualization Components**
- [ ] EmpireSpecializationRadar component with Recharts
- [ ] ColonizationTimeline component with hover interactions  
- [ ] EmpireIdentityPanel with dynamic text generation
- [ ] Basic styling and animations

### **Week 2: Research View Enhancement**
- [ ] Planet-based technology grouping in ResearchView
- [ ] Planet requirement tooltips and validation
- [ ] Tier 1/2/3 visual progression indicators
- [ ] Integration with existing research workflow

### **Week 3: Galaxy View Integration**
- [ ] Tech preview mode in GalaxyView
- [ ] ColonizationPreview component for strategic planning
- [ ] Planet-tech relationship visualization
- [ ] Impact prediction calculations

### **Week 4: Polish and Comparison Tools**
- [ ] Multi-empire comparison views
- [ ] Tutorial sequence for planet-tech system
- [ ] Performance optimization for real-time updates
- [ ] Mobile responsive design improvements

---

## **Success Criteria**

### **User Experience Goals:**
- [ ] Players immediately understand their empire's specialization direction
- [ ] Colonization decisions feel strategic and meaningful
- [ ] Technology unlocking is visually satisfying and clear
- [ ] Comparison with other empires drives competitive gameplay

### **Technical Goals:**
- [ ] Real-time specialization updates under 100ms
- [ ] Smooth animations for all specialization changes
- [ ] Responsive design works on all screen sizes
- [ ] No performance degradation with 8+ empires displayed

### **Strategic Depth Goals:**
- [ ] Players can plan 3-5 colonies ahead strategically
- [ ] Clear trade-offs visible between specialization paths
- [ ] Empire identity emerges naturally from player choices
- [ ] Multiplayer dynamics shift based on specialization awareness

---

## **Risk Mitigation**

### **Information Overload Risk:**
- **Solution:** Progressive disclosure - basic radar → detailed timeline → comparison tools
- **Fallback:** Simple mode that hides advanced features until requested

### **Performance Risk:**
- **Solution:** Memoize radar chart calculations and update only on empire state changes
- **Fallback:** Reduce update frequency for less critical visual elements

### **Complexity Risk:**
- **Solution:** Comprehensive tutorial sequence and interactive guide
- **Fallback:** Traditional research tree toggle for players who prefer familiar mechanics

---

This Phase 1B implementation will transform the functional planet-tech system into a compelling visual experience that makes Xytherra's core innovation shine through every interaction.