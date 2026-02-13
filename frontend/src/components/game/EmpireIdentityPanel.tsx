import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Empire, TechDomain } from '../../types/game.d.ts';

interface EmpireIdentityPanelProps {
  empire: Empire;
  showRecommendations?: boolean;
  className?: string;
}

interface EmpireIdentity {
  title: string;
  description: string;
  dominantDomains: Array<{
    domain: TechDomain;
    strength: 'dominant' | 'strong' | 'moderate';
    percentage: number;
  }>;
  badges: string[];
  recommendations: string[];
}

const EmpireIdentityPanel: React.FC<EmpireIdentityPanelProps> = ({
  empire,
  showRecommendations = true,
  className = ''
}) => {

  const getDomainColor = (domain: TechDomain): string => {
    switch (domain) {
      case 'weapons': return '#EF4444';
      case 'shields': return '#3B82F6';
      case 'biotech': return '#10B981';
      case 'propulsion': return '#8B5CF6';
      case 'sensors': return '#EC4899';
      case 'industry': return '#F59E0B';
      case 'survival': return '#F97316';
      case 'experimental': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const getDomainDisplayName = (domain: TechDomain): string => {
    switch (domain) {
      case 'weapons': return 'Weapons';
      case 'shields': return 'Shields';
      case 'biotech': return 'Biotech';
      case 'propulsion': return 'Propulsion';
      case 'sensors': return 'Sensors';
      case 'industry': return 'Industry';
      case 'survival': return 'Survival';
      case 'experimental': return 'Experimental';
      default: {
        const domainStr = String(domain);
        return domainStr.charAt(0).toUpperCase() + domainStr.slice(1);
      }
    }
  };

  const empireIdentity = useMemo((): EmpireIdentity => {
    if (!empire.techDomainWeights || !empire.colonizationHistory?.order) {
      return {
        title: 'Nascent Empire',
        description: 'Your empire awaits its first steps into the stars. Survey and colonize worlds to develop your unique technological specialization.',
        dominantDomains: [],
        badges: ['🚀 Explorer'],
        recommendations: [
          'Survey your first planet to unlock Tier 1 technologies',
          'Your first colony will receive 3x specialization weight',
          'Choose carefully - early colonies shape your empire identity'
        ]
      };
    }

    const totalWeight = Object.values(empire.techDomainWeights).reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) {
      return {
        title: 'Nascent Empire',
        description: 'Your empire awaits its first steps into the stars.',
        dominantDomains: [],
        badges: ['🚀 Explorer'],
        recommendations: ['Establish your first colony to begin specialization']
      };
    }

    // Calculate domain strengths
    const domainStrengths = Object.entries(empire.techDomainWeights)
      .map(([domain, weight]) => ({
        domain: domain as TechDomain,
        weight,
        percentage: Math.round((weight / totalWeight) * 100)
      }))
      .filter(d => d.percentage > 5) // Only show meaningful domains
      .sort((a, b) => b.weight - a.weight);

    const dominantDomains = domainStrengths.map(d => ({
      domain: d.domain,
      strength: d.percentage >= 40 ? 'dominant' as const :
                d.percentage >= 25 ? 'strong' as const : 'moderate' as const,
      percentage: d.percentage
    }));

    // Generate empire title and description
    let title = '';
    let description = '';
    const badges: string[] = [];

    const primaryDomain = dominantDomains[0];
    const secondaryDomain = dominantDomains[1];

    if (primaryDomain?.percentage >= 50) {
      // Single dominant specialization
      const domainName = getDomainDisplayName(primaryDomain.domain);
      title = `${domainName} Specialists`;
      description = `Your empire has achieved remarkable focus in ${domainName.toLowerCase()}, with ${primaryDomain.percentage}% specialization. This deep expertise grants significant advantages in related technologies.`;
      badges.push(`🏆 ${domainName} Masters`);
    } else if (primaryDomain?.percentage >= 35 && secondaryDomain?.percentage >= 25) {
      // Dual specialization
      const primary = getDomainDisplayName(primaryDomain.domain);
      const secondary = getDomainDisplayName(secondaryDomain.domain);
      title = `${primary}-${secondary} Hybrid`;
      description = `Your empire demonstrates balanced expertise in both ${primary.toLowerCase()} (${primaryDomain.percentage}%) and ${secondary.toLowerCase()} (${secondaryDomain.percentage}%), creating unique strategic opportunities.`;
      badges.push(`⚖️ Balanced Approach`);
    } else if (dominantDomains.length >= 3) {
      // Multi-faceted empire
      title = 'Versatile Empire';
      description = `Your empire maintains diverse capabilities across multiple domains, offering flexibility but potentially lacking focused strength.`;
      badges.push(`🌟 Jack of All Trades`);
    } else if (primaryDomain) {
      // Emerging specialization
      const domainName = getDomainDisplayName(primaryDomain.domain);
      title = `Emerging ${domainName} Empire`;
      description = `Your empire shows promising development in ${domainName.toLowerCase()} (${primaryDomain.percentage}%), with potential for deeper specialization.`;
      badges.push(`📈 Growing Strength`);
    } else {
      title = 'Developing Empire';
      description = 'Your empire is finding its technological identity through colonial expansion.';
      badges.push(`🔍 Discovering Purpose`);
    }

    // Add colony count badges
    const colonyCount = empire.colonizationHistory.order.length;
    if (colonyCount >= 5) badges.push('🏛️ Established Empire');
    else if (colonyCount >= 3) badges.push('🏘️ Growing Empire');
    else if (colonyCount >= 1) badges.push('🏠 Colonial Empire');

    // Add diversity badges
    const uniquePlanetTypes = new Set(empire.colonizationHistory.order.map(c => c.planetType));
    if (uniquePlanetTypes.size >= 4) badges.push('🌍 Diverse Colonizer');

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (primaryDomain && primaryDomain.percentage < 40) {
      const domainName = getDomainDisplayName(primaryDomain.domain);
      recommendations.push(`Consider focusing on ${domainName.toLowerCase()} colonies to strengthen your specialization`);
    }

    if (dominantDomains.length === 1) {
      recommendations.push('Diversify with a secondary specialization to avoid strategic vulnerability');
    }

    if (colonyCount < 3) {
      recommendations.push('Establish more colonies to unlock higher tier technologies');
    }

    const weakestImportantDomains = ['shields', 'weapons'].filter(domain => 
      (empire.techDomainWeights[domain as TechDomain] || 0) < totalWeight * 0.15
    ) as TechDomain[];

    if (weakestImportantDomains.length > 0) {
      const weakDomain = getDomainDisplayName(weakestImportantDomains[0]);
      recommendations.push(`Consider strengthening ${weakDomain.toLowerCase()} for better strategic balance`);
    }

    return {
      title,
      description,
      dominantDomains,
      badges,
      recommendations
    };
  }, [empire]);

  const getStrengthColor = (strength: 'dominant' | 'strong' | 'moderate'): string => {
    switch (strength) {
      case 'dominant': return '#10B981'; // Green
      case 'strong': return '#3B82F6'; // Blue
      case 'moderate': return '#F59E0B'; // Amber
      default: return '#6B7280';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`bg-slate-800/50 rounded-xl p-4 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">
          Empire Identity
        </h3>
        
        <div className="mb-3">
          <h4 className="text-xl font-semibold text-blue-400 mb-2">
            {empireIdentity.title}
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            {empireIdentity.description}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {empireIdentity.badges.map((badge, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Domain Strengths */}
      {empireIdentity.dominantDomains.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-slate-300 mb-2">
            Specialization Breakdown:
          </h5>
          <div className="space-y-2">
            {empireIdentity.dominantDomains.slice(0, 4).map((domain, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getDomainColor(domain.domain) }}
                  />
                  <span className="text-sm text-slate-300">
                    {getDomainDisplayName(domain.domain)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">
                    {domain.percentage}%
                  </span>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: getStrengthColor(domain.strength) + '20',
                      color: getStrengthColor(domain.strength)
                    }}
                  >
                    {domain.strength}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {showRecommendations && empireIdentity.recommendations.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-slate-300 mb-2">
            Strategic Recommendations:
          </h5>
          <div className="space-y-2">
            {empireIdentity.recommendations.slice(0, 3).map((rec, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <p className="text-sm text-slate-400 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EmpireIdentityPanel;
