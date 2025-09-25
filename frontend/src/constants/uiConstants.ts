// Design system constants for consistent UI
export const UI_CONSTANTS = {
  DIMENSIONS: {
    SIDEBAR_WIDTH: 'w-80', // 20rem
    NOTIFICATION_MAX_WIDTH: 'max-w-sm',
    BUTTON_HEIGHT: 'h-10',
    INPUT_HEIGHT: 'h-10',
    ICON_SIZES: {
      SM: 'w-4 h-4',
      MD: 'w-5 h-5',
      LG: 'w-6 h-6',
      XL: 'w-8 h-8'
    }
  },
  
  SPACING: {
    COMPONENT_PADDING: 'p-4',
    TIGHT_SPACING: 'space-x-2 space-y-2',
    NORMAL_SPACING: 'space-x-4 space-y-4',
    LOOSE_SPACING: 'space-x-6 space-y-6'
  },
  
  COLORS: {
    RESOURCES: {
      ENERGY: 'text-yellow-400',
      MINERALS: 'text-gray-400',
      FOOD: 'text-green-400',
      RESEARCH: 'text-blue-400',
      ALLOYS: 'text-purple-400',
      EXOTIC_MATTER: 'text-pink-400'
    },
    
    PLANETS: {
      WATER: 'text-blue-400',
      VOLCANIC: 'text-red-400',
      ROCKY: 'text-gray-400',
      GAS: 'text-purple-400',
      ICE: 'text-cyan-400',
      LIVING: 'text-green-400',
      DESOLATE: 'text-yellow-400',
      EXOTIC: 'text-purple-300'
    },
    
    NOTIFICATIONS: {
      INFO: 'border-blue-500',
      SUCCESS: 'border-green-500',
      WARNING: 'border-yellow-500',
      ERROR: 'border-red-500'
    },
    
    BUTTONS: {
      PRIMARY: 'bg-blue-600 hover:bg-blue-700 text-white',
      SECONDARY: 'bg-slate-600 hover:bg-slate-700 text-white',
      SUCCESS: 'bg-green-600 hover:bg-green-700 text-white',
      WARNING: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      DANGER: 'bg-red-600 hover:bg-red-700 text-white'
    }
  },
  
  ANIMATIONS: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500
    },
    
    EASING: {
      EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
      EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
      EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  
  LAYOUT: {
    HEADER_HEIGHT: 'h-16',
    FOOTER_HEIGHT: 'h-16',
    MAX_CONTENT_WIDTH: 'max-w-7xl',
    CONTAINER_PADDING: 'px-4 sm:px-6 lg:px-8',
    MAX_NOTIFICATIONS_DISPLAY: 3
  },
  
  Z_INDEX: {
    DROPDOWN: 10,
    STICKY: 20,
    FIXED: 30,
    MODAL_BACKDROP: 40,
    MODAL: 50,
    POPOVER: 60,
    TOOLTIP: 70,
    NOTIFICATION: 80
  }
} as const;

// Type-safe color utilities
export const getResourceColor = (resource: string): string => {
  const colorMap: Record<string, string> = {
    energy: UI_CONSTANTS.COLORS.RESOURCES.ENERGY,
    minerals: UI_CONSTANTS.COLORS.RESOURCES.MINERALS,
    food: UI_CONSTANTS.COLORS.RESOURCES.FOOD,
    research: UI_CONSTANTS.COLORS.RESOURCES.RESEARCH,
    alloys: UI_CONSTANTS.COLORS.RESOURCES.ALLOYS,
    exoticMatter: UI_CONSTANTS.COLORS.RESOURCES.EXOTIC_MATTER
  };
  
  return colorMap[resource] || 'text-gray-400';
};

export const getPlanetColor = (planetType: string): string => {
  const colorMap: Record<string, string> = {
    water: UI_CONSTANTS.COLORS.PLANETS.WATER,
    volcanic: UI_CONSTANTS.COLORS.PLANETS.VOLCANIC,
    rocky: UI_CONSTANTS.COLORS.PLANETS.ROCKY,
    gas: UI_CONSTANTS.COLORS.PLANETS.GAS,
    ice: UI_CONSTANTS.COLORS.PLANETS.ICE,
    living: UI_CONSTANTS.COLORS.PLANETS.LIVING,
    desolate: UI_CONSTANTS.COLORS.PLANETS.DESOLATE,
    exotic: UI_CONSTANTS.COLORS.PLANETS.EXOTIC
  };
  
  return colorMap[planetType] || 'text-gray-400';
};

export const getNotificationColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    info: UI_CONSTANTS.COLORS.NOTIFICATIONS.INFO,
    success: UI_CONSTANTS.COLORS.NOTIFICATIONS.SUCCESS,
    warning: UI_CONSTANTS.COLORS.NOTIFICATIONS.WARNING,
    error: UI_CONSTANTS.COLORS.NOTIFICATIONS.ERROR
  };
  
  return colorMap[type] || UI_CONSTANTS.COLORS.NOTIFICATIONS.INFO;
};