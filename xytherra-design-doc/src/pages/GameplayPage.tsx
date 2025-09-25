import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves, 
  Flame, 
  Mountain, 
  Play, 
  Pause, 
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Target
} from 'lucide-react';

interface GameTurn {
  turn: number;
  phase: string;
  title: string;
  description: string;
  actions: string[];
  outcomes: string[];
  newTech: string[];
  decisions: {
    decision: string;
    options: string[];
    chosen: string;
    reasoning: string;
  }[];
  empireStatus: {
    colonies: number;
    fleetPower: number;
    techDomains: string[];
    majorThreat: string;
  };
  planetFocus?: {
    planet: string;
    type: string;
    icon: React.ElementType;
    color: string;
  };
}

const gameplayWalkthrough: GameTurn[] = [
  {
    turn: 1,
    phase: "Early Expansion",
    title: "First Steps",
    description: "The Oceanic Concord begins their journey from the water world Nerevia Prime.",
    actions: [
      "Survey nearby star systems",
      "Build initial science and colony ships",
      "Establish basic infrastructure on homeworld"
    ],
    outcomes: [
      "Discovered volcanic world Cindralis with high energy potential",
      "Identified rocky world Terranova with stable conditions", 
      "+20% shield research bonus active from homeworld"
    ],
    newTech: ["Hydrodynamic Shielding"],
    decisions: [{
      decision: "First colonization target",
      options: ["Rocky World (safer)", "Volcanic World (powerful)", "Continue exploration"],
      chosen: "Rocky World (safer)",
      reasoning: "Establish stable resource foundation before attempting high-risk volcanic colonization"
    }],
    empireStatus: {
      colonies: 1,
      fleetPower: 2,
      techDomains: ["Shields"],
      majorThreat: "None"
    },
    planetFocus: {
      planet: "Nerevia Prime",
      type: "Water World", 
      icon: Waves,
      color: "text-blue-400"
    }
  },
  {
    turn: 10,
    phase: "Early Expansion", 
    title: "Second Colony",
    description: "Successful colonization of Terranova provides industrial backbone.",
    actions: [
      "Establish Terranova colony",
      "Begin nano-forging research",
      "Upgrade home fleet with new shields"
    ],
    outcomes: [
      "Rocky world colonized successfully",
      "+15% faster ship construction", 
      "Stable mineral income established"
    ],
    newTech: ["Nano-Forging", "Adaptive Housing"],
    decisions: [{
      decision: "Next expansion priority",
      options: ["Volcanic world", "Explore for gas giants", "Consolidate current colonies"],
      chosen: "Volcanic world",
      reasoning: "Need weapons technology to balance shield specialization"
    }],
    empireStatus: {
      colonies: 2,
      fleetPower: 4,
      techDomains: ["Shields", "Industry"],
      majorThreat: "None"
    },
    planetFocus: {
      planet: "Terranova",
      type: "Rocky World",
      icon: Mountain, 
      color: "text-gray-400"
    }
  },
  {
    turn: 20,
    phase: "Rival Contact",
    title: "The Forge Union",
    description: "First contact with aggressive neighbors changes everything.",
    actions: [
      "Diplomatic contact with Forge Union",
      "Rush colony ship to Cindralis",
      "Begin defensive fleet buildup"
    ],
    outcomes: [
      "Forge Union claims nearby volcanic systems",
      "Tense standoff over Cindralis",
      "Shield technology provides defensive advantage"
    ],
    newTech: ["Coolant Recycling", "Heat-Resistant Hulls"],
    decisions: [{
      decision: "Response to Forge Union aggression",
      options: ["Military buildup", "Diplomatic approach", "Rush colonization"],
      chosen: "Rush colonization", 
      reasoning: "Secure key volcanic planet before it's too late"
    }],
    empireStatus: {
      colonies: 2,
      fleetPower: 6,
      techDomains: ["Shields", "Industry"],
      majorThreat: "Forge Union expansion"
    }
  },
  {
    turn: 30,
    phase: "The Scramble",
    title: "Racing for Cindralis",
    description: "Both empires race to claim the valuable volcanic world.",
    actions: [
      "Launch colony ship with military escort",
      "Fortify existing colonies",
      "Establish Cindralis colony amid volcanic eruptions"
    ],
    outcomes: [
      "Successfully colonized Cindralis first",
      "Forge Union fleet arrives too late",
      "Volcanic hazards damage initial infrastructure"
    ],
    newTech: ["Steam Burst Weapons", "Thermal Overdrive"],
    decisions: [{
      decision: "Deal with volcanic hazards",
      options: ["Invest in stabilizers", "Accept losses", "Abandon colony"],
      chosen: "Invest in stabilizers",
      reasoning: "Long-term volcanic tech worth the initial investment"
    }],
    empireStatus: {
      colonies: 3,
      fleetPower: 7,
      techDomains: ["Shields", "Industry", "Weapons"],
      majorThreat: "Forge Union rivalry"
    },
    planetFocus: {
      planet: "Cindralis",
      type: "Volcanic World",
      icon: Flame,
      color: "text-red-400"
    }
  },
  {
    turn: 40,
    phase: "Emerging Identity",
    title: "Balanced Power",
    description: "The Concord develops a unique defensive-industrial-weapons identity.",
    actions: [
      "Unlock hybrid steam weapons technology", 
      "Establish trade routes between colonies",
      "Begin exploration for additional planet types"
    ],
    outcomes: [
      "Steam Burst Weapons provide area-of-effect capability",
      "Balanced fleet composition developed",
      "Economic stability through diverse colonies"
    ],
    newTech: ["Plasma Cannons", "Geothermal Reactors", "Steam Burst Weapons (Hybrid)"],
    decisions: [{
      decision: "Future expansion strategy",
      options: ["Seek gas giants for mobility", "Find living worlds for biotech", "Consolidate current advantage"],
      chosen: "Seek gas giants for mobility",
      reasoning: "Need speed to compete with Forge Union expansion"
    }],
    empireStatus: {
      colonies: 3,
      fleetPower: 12,
      techDomains: ["Shields", "Industry", "Weapons"],
      majorThreat: "Forge Union military buildup"
    }
  },
  {
    turn: 50,
    phase: "Strategic Positioning", 
    title: "The Path Forward",
    description: "Multiple strategic paths emerge as the galaxy becomes more crowded.",
    actions: [
      "Scout for gas giant systems",
      "Upgrade fleets with hybrid technologies",
      "Consider diplomatic options"
    ],
    outcomes: [
      "Located gas giant system beyond Forge Union territory",
      "Fleet now combines shields, industry, and weapons effectively",
      "Other factions begin making contact"
    ],
    newTech: ["Industrial Foundries", "Thermal Shielding"],
    decisions: [{
      decision: "Long-term victory strategy",
      options: ["Domination through conquest", "Federation through diplomacy", "Tech ascendancy through research"],
      chosen: "Federation through diplomacy",
      reasoning: "Balanced tech profile makes excellent federation partner"
    }],
    empireStatus: {
      colonies: 3,
      fleetPower: 16,
      techDomains: ["Shields", "Industry", "Weapons"],
      majorThreat: "Multiple expanding empires"
    }
  }
];

const GameplayPage: React.FC = () => {
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTurn(prev => {
          if (prev >= gameplayWalkthrough.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000 / playSpeed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, playSpeed]);

  const currentTurnData = gameplayWalkthrough[currentTurn];

  const nextTurn = () => {
    if (currentTurn < gameplayWalkthrough.length - 1) {
      setCurrentTurn(currentTurn + 1);
    }
  };

  const prevTurn = () => {
    if (currentTurn > 0) {
      setCurrentTurn(currentTurn - 1);
    }
  };

  const reset = () => {
    setCurrentTurn(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Sample Gameplay: Oceanic Concord
          </h1>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            Follow the first 50 turns of an Oceanic Concord playthrough. Watch how early colonization 
            choices create lasting strategic advantages and shape diplomatic relationships.
          </p>
        </motion.div>

        {/* Timeline Controls */}
        <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <button
                onClick={reset}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400">Speed:</span>
                <button
                  onClick={() => setPlaySpeed(1)}
                  className={`px-2 py-1 rounded text-sm ${playSpeed === 1 ? 'bg-blue-600' : 'bg-slate-600'}`}
                >
                  1x
                </button>
                <button
                  onClick={() => setPlaySpeed(2)}
                  className={`px-2 py-1 rounded text-sm ${playSpeed === 2 ? 'bg-blue-600' : 'bg-slate-600'}`}
                >
                  2x
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={prevTurn}
                disabled={currentTurn === 0}
                className="p-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="px-4 py-2 bg-slate-700 rounded-lg">
                Turn {currentTurnData.turn} / {gameplayWalkthrough[gameplayWalkthrough.length - 1].turn}
              </span>
              
              <button
                onClick={nextTurn}
                disabled={currentTurn === gameplayWalkthrough.length - 1}
                className="p-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentTurn + 1) / gameplayWalkthrough.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Turn Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTurn}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Turn Header */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-slate-400">{currentTurnData.phase}</span>
                    </div>
                    <h2 className="text-3xl font-bold">{currentTurnData.title}</h2>
                  </div>
                  {currentTurnData.planetFocus && (
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <currentTurnData.planetFocus.icon className={`w-6 h-6 ${currentTurnData.planetFocus.color}`} />
                        <span className="font-semibold">{currentTurnData.planetFocus.planet}</span>
                      </div>
                      <span className="text-xs text-slate-400">{currentTurnData.planetFocus.type}</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-300">{currentTurnData.description}</p>
              </div>

              {/* Actions & Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 text-blue-400 mr-2" />
                    Actions Taken
                  </h3>
                  <ul className="space-y-2">
                    {currentTurnData.actions.map((action, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-sm text-slate-300 flex items-start"
                      >
                        <ChevronRight className="w-3 h-3 text-blue-400 mt-1 mr-2 flex-shrink-0" />
                        {action}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    Outcomes
                  </h3>
                  <ul className="space-y-2">
                    {currentTurnData.outcomes.map((outcome, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-sm text-slate-300 flex items-start"
                      >
                        <CheckCircle className="w-3 h-3 text-green-400 mt-1 mr-2 flex-shrink-0" />
                        {outcome}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* New Technologies */}
              {currentTurnData.newTech.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    Technologies Unlocked
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentTurnData.newTech.map((tech, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="px-3 py-1 bg-yellow-900/30 border border-yellow-400/30 rounded-full text-sm text-yellow-200"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Major Decisions */}
              {currentTurnData.decisions.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
                    Key Decisions
                  </h3>
                  {currentTurnData.decisions.map((decision, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-slate-700/50 rounded-lg p-4"
                    >
                      <h4 className="font-semibold mb-2 text-orange-300">{decision.decision}</h4>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {decision.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className={`px-3 py-2 rounded text-xs text-center ${
                              option === decision.chosen
                                ? 'bg-green-900/50 border border-green-400 text-green-200'
                                : 'bg-slate-600/50 text-slate-400'
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong>Reasoning:</strong> {decision.reasoning}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Empire Status Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 sticky top-4">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 text-purple-400 mr-2" />
                  Empire Status
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-slate-400">Colonies</span>
                    <div className="flex items-center mt-1">
                      <div className="flex-1 bg-slate-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(currentTurnData.empireStatus.colonies / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{currentTurnData.empireStatus.colonies}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-slate-400">Fleet Power</span>
                    <div className="flex items-center mt-1">
                      <div className="flex-1 bg-slate-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(currentTurnData.empireStatus.fleetPower / 20) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{currentTurnData.empireStatus.fleetPower}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-slate-400 mb-2 block">Tech Domains</span>
                    <div className="flex flex-wrap gap-2">
                      {currentTurnData.empireStatus.techDomains.map((domain, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="px-2 py-1 bg-blue-900/30 border border-blue-400/30 rounded text-xs text-blue-200"
                        >
                          {domain}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-slate-400">Major Threat</span>
                    <p className={`text-sm font-semibold mt-1 ${
                      currentTurnData.empireStatus.majorThreat === 'None' 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {currentTurnData.empireStatus.majorThreat}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameplayPage;