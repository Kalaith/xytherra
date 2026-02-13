import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import EmpireSpecializationRadar from './EmpireSpecializationRadar';
import ColonizationTimeline from './ColonizationTimeline';
import EmpireIdentityPanel from './EmpireIdentityPanel';

interface SpecializationDashboardProps {
  className?: string;
}

const SpecializationDashboard: React.FC<SpecializationDashboardProps> = ({ className = '' }) => {
  const gameState = useGameStore();
  const currentEmpire = gameState.empires[gameState.playerEmpireId];

  if (!currentEmpire) {
    return (
      <div className={`bg-slate-900 rounded-xl p-8 text-center ${className}`}>
        <h2 className="text-2xl font-bold text-white mb-4">Empire Specialization</h2>
        <p className="text-slate-400">No empire data available</p>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 px-6 py-4 bg-slate-800/50 rounded-t-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Empire Specialization Dashboard</h2>
        <p className="text-slate-400">
          Track your empire's technological identity shaped by colonization choices
        </p>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-6">
        {/* Specialization Radar - Main focal point */}
        <div className="lg:col-span-5 xl:col-span-4">
          <EmpireSpecializationRadar
            empire={currentEmpire}
            size="large"
            interactive={true}
            showLabels={true}
          />
        </div>

        {/* Colonization Timeline - Shows the journey */}
        <div className="lg:col-span-7 xl:col-span-5">
          <ColonizationTimeline empire={currentEmpire} showProjections={true} />
        </div>

        {/* Empire Identity Panel - Strategic insights */}
        <div className="lg:col-span-12 xl:col-span-3">
          <EmpireIdentityPanel empire={currentEmpire} showRecommendations={true} />
        </div>
      </div>

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-6 mb-6 p-4 bg-slate-800/30 rounded-lg"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {currentEmpire.colonizationHistory?.order?.length || 0}
            </div>
            <div className="text-xs text-slate-400">Colonies</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {currentEmpire.technologies?.size || 0}
            </div>
            <div className="text-xs text-slate-400">Technologies</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {currentEmpire.techDomainWeights
                ? new Set(
                    Object.entries(currentEmpire.techDomainWeights)
                      .filter(([_, weight]) => weight > 0)
                      .map(([domain]) => domain)
                  ).size
                : 0}
            </div>
            <div className="text-xs text-slate-400">Active Domains</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {currentEmpire.colonizationHistory?.order
                ? new Set(currentEmpire.colonizationHistory.order.map(c => c.planetType)).size
                : 0}
            </div>
            <div className="text-xs text-slate-400">Planet Types</div>
          </div>
        </div>
      </motion.div>

      {/* Pro Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mx-6 mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20"
      >
        <h3 className="text-sm font-semibold text-blue-400 mb-2">💡 Specialization Tips</h3>
        <div className="text-xs text-slate-300 space-y-1">
          <p>
            • <strong>First colonies matter most:</strong> Your first 3 colonies get 3x, 2x, and
            1.5x specialization weight
          </p>
          <p>
            • <strong>Balance vs Focus:</strong> Deep specialization unlocks unique technologies,
            but diversity provides flexibility
          </p>
          <p>
            • <strong>Hybrid Technologies:</strong> Some advanced techs require colonies on multiple
            planet types
          </p>
          <p>
            • <strong>Plan ahead:</strong> Use the galaxy map to scout planet types before
            committing to colonization
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SpecializationDashboard;
