// Environment-aware configuration system
export type Environment = 'development' | 'staging' | 'production';

interface BaseConfig {
  // Game Balance
  gameBalance: {
    startingResources: Record<string, number>;
    resourceIncomeMultipliers: Record<string, number>;
    researchCostMultiplier: number;
    combatBalancing: {
      attackBonuses: Record<string, number>;
      defenseBonuses: Record<string, number>;
      experienceGainRates: Record<string, number>;
    };
    victoryThresholds: Record<string, number>;
  };
  
  // UI Configuration
  ui: {
    animationSpeed: number;
    notificationDuration: number;
    maxNotifications: number;
    autoSaveInterval: number;
    debugMode: boolean;
  };
  
  // Performance Settings
  performance: {
    maxRenderFPS: number;
    enablePerformanceMonitoring: boolean;
    cacheTimeout: number;
    maxCacheSize: number;
  };
  
  // Feature Flags
  features: {
    enableTutorial: boolean;
    enableMultiplayer: boolean;
    enableAI: boolean;
    enableCustomFactions: boolean;
    enableModSupport: boolean;
  };
}

const baseConfig: BaseConfig = {
  gameBalance: {
    startingResources: {
      energy: 50,
      minerals: 50,
      food: 20,
      research: 10,
      alloys: 0,
      exoticMatter: 0
    },
    resourceIncomeMultipliers: {
      energy: 1.0,
      minerals: 1.0,
      food: 1.0,
      research: 1.0,
      alloys: 1.0,
      exoticMatter: 1.0
    },
    researchCostMultiplier: 1.0,
    combatBalancing: {
      attackBonuses: {
        'forge-union': 1.1,
        'oceanic-concord': 0.95,
        'verdant-kin': 0.9,
        'nomad-fleet': 1.05,
        'ashborn-syndicate': 1.0
      },
      defenseBonuses: {
        'forge-union': 1.0,
        'oceanic-concord': 1.15,
        'verdant-kin': 1.1,
        'nomad-fleet': 0.9,
        'ashborn-syndicate': 1.05
      },
      experienceGainRates: {
        winner: 10,
        loser: 5
      }
    },
    victoryThresholds: {
      domination: 0.6,
      technology: 0.8,
      diplomatic: 0.75
    }
  },
  ui: {
    animationSpeed: 1.0,
    notificationDuration: 5000,
    maxNotifications: 3,
    autoSaveInterval: 30000,
    debugMode: false
  },
  performance: {
    maxRenderFPS: 60,
    enablePerformanceMonitoring: false,
    cacheTimeout: 5000,
    maxCacheSize: 100
  },
  features: {
    enableTutorial: true,
    enableMultiplayer: false,
    enableAI: true,
    enableCustomFactions: false,
    enableModSupport: false
  }
};

// Environment-specific overrides
const developmentConfig: Partial<BaseConfig> = {
  ui: {
    ...baseConfig.ui,
    debugMode: true,
    autoSaveInterval: 10000
  },
  performance: {
    ...baseConfig.performance,
    enablePerformanceMonitoring: true
  },
  features: {
    ...baseConfig.features,
    enableCustomFactions: true,
    enableModSupport: true
  }
};

const stagingConfig: Partial<BaseConfig> = {
  gameBalance: {
    ...baseConfig.gameBalance,
    researchCostMultiplier: 0.8 // Faster research for testing
  },
  performance: {
    ...baseConfig.performance,
    enablePerformanceMonitoring: true
  }
};

const productionConfig: Partial<BaseConfig> = {
  ui: {
    ...baseConfig.ui,
    debugMode: false
  },
  performance: {
    ...baseConfig.performance,
    enablePerformanceMonitoring: false
  }
};

// Configuration merger
const mergeConfig = (base: BaseConfig, override: Partial<BaseConfig>): BaseConfig => {
  return {
    gameBalance: { ...base.gameBalance, ...override.gameBalance },
    ui: { ...base.ui, ...override.ui },
    performance: { ...base.performance, ...override.performance },
    features: { ...base.features, ...override.features }
  };
};

// Get current environment
const getCurrentEnvironment = (): Environment => {
  if (typeof window !== 'undefined') {
    // Browser environment
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
    if (hostname.includes('staging') || hostname.includes('test')) {
      return 'staging';
    }
  }
  
  // Fallback to development for now
  const nodeEnv: Environment = 'development';
  return nodeEnv || 'development';
};

// Create final configuration
const createConfig = (): BaseConfig => {
  const environment = getCurrentEnvironment();
  
  switch (environment) {
    case 'development':
      return mergeConfig(baseConfig, developmentConfig);
    case 'staging':
      return mergeConfig(baseConfig, stagingConfig);
    case 'production':
      return mergeConfig(baseConfig, productionConfig);
    default:
      return baseConfig;
  }
};

// Export the configuration
export const config = createConfig();

// Configuration utilities
export const getGameBalanceSetting = <K extends keyof BaseConfig['gameBalance']>(
  key: K
): BaseConfig['gameBalance'][K] => {
  return config.gameBalance[key];
};

export const getUISetting = <K extends keyof BaseConfig['ui']>(
  key: K
): BaseConfig['ui'][K] => {
  return config.ui[key];
};

export const isFeatureEnabled = <K extends keyof BaseConfig['features']>(
  feature: K
): boolean => {
  return config.features[feature];
};

// Runtime configuration updates (for dev tools)
export const updateConfig = (updates: Partial<BaseConfig>): void => {
  if (config.ui.debugMode) {
    Object.assign(config, mergeConfig(config, updates));
    console.log('Configuration updated:', updates);
  }
};

// Configuration validation
export const validateConfig = (cfg: BaseConfig): string[] => {
  const errors: string[] = [];
  
  // Validate resource multipliers
  Object.entries(cfg.gameBalance.resourceIncomeMultipliers).forEach(([resource, multiplier]) => {
    if (typeof multiplier !== 'number' || multiplier < 0 || multiplier > 10) {
      errors.push(`Invalid resource multiplier for ${resource}: ${multiplier}`);
    }
  });
  
  // Validate victory thresholds
  Object.entries(cfg.gameBalance.victoryThresholds).forEach(([condition, threshold]) => {
    if (typeof threshold !== 'number' || threshold < 0 || threshold > 1) {
      errors.push(`Invalid victory threshold for ${condition}: ${threshold}`);
    }
  });
  
  // Validate UI settings
  if (cfg.ui.maxNotifications < 1 || cfg.ui.maxNotifications > 10) {
    errors.push(`Invalid maxNotifications: ${cfg.ui.maxNotifications}`);
  }
  
  if (cfg.ui.notificationDuration < 1000 || cfg.ui.notificationDuration > 30000) {
    errors.push(`Invalid notificationDuration: ${cfg.ui.notificationDuration}`);
  }
  
  return errors;
};

// Initialize and validate configuration
const validationErrors = validateConfig(config);
if (validationErrors.length > 0) {
  console.error('Configuration validation errors:', validationErrors);
}