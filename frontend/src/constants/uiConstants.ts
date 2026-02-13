// Design system constants for consistent UI
export const uiConstants = {
  DIMENSIONS: {
    SIDEBAR_WIDTH: 'w-80', // 20rem
    NOTIFICATION_MAX_WIDTH: 'max-w-sm',
    BUTTON_HEIGHT: 'h-10',
    INPUT_HEIGHT: 'h-10',
    ICON_SIZES: {
      SM: 'w-4 h-4',
      MD: 'w-5 h-5',
      LG: 'w-6 h-6',
      XL: 'w-8 h-8',
    },
  },

  SPACING: {
    COMPONENT_PADDING: 'p-4',
    TIGHT_SPACING: 'space-x-2 space-y-2',
    NORMAL_SPACING: 'space-x-4 space-y-4',
    LOOSE_SPACING: 'space-x-6 space-y-6',
  },

  COLORS: {
    RESOURCES: {
      ENERGY: 'text-yellow-400',
      MINERALS: 'text-gray-400',
      FOOD: 'text-green-400',
      RESEARCH: 'text-blue-400',
      ALLOYS: 'text-purple-400',
      EXOTIC_MATTER: 'text-pink-400',
    },

    PLANETS: {
      WATER: 'text-blue-400',
      VOLCANIC: 'text-red-400',
      ROCKY: 'text-gray-400',
      GAS: 'text-purple-400',
      ICE: 'text-cyan-400',
      LIVING: 'text-green-400',
      DESOLATE: 'text-yellow-400',
      EXOTIC: 'text-purple-300',
    },

    NOTIFICATIONS: {
      INFO: 'border-blue-500',
      SUCCESS: 'border-green-500',
      WARNING: 'border-yellow-500',
      ERROR: 'border-red-500',
    },

    BUTTONS: {
      PRIMARY: 'bg-blue-600 hover:bg-blue-700 text-white',
      SECONDARY: 'bg-slate-600 hover:bg-slate-700 text-white',
      SUCCESS: 'bg-green-600 hover:bg-green-700 text-white',
      WARNING: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      DANGER: 'bg-red-600 hover:bg-red-700 text-white',
    },
  },

  ANIMATIONS: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },

    EASING: {
      EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
      EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
      EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  LAYOUT: {
    HEADER_HEIGHT: 'h-16',
    FOOTER_HEIGHT: 'h-16',
    MAX_CONTENT_WIDTH: 'max-w-7xl',
    CONTAINER_PADDING: 'px-4 sm:px-6 lg:px-8',
    MAX_NOTIFICATIONS_DISPLAY: 3,
  },

  Z_INDEX: {
    DROPDOWN: 10,
    STICKY: 20,
    FIXED: 30,
    MODAL_BACKDROP: 40,
    MODAL: 50,
    POPOVER: 60,
    TOOLTIP: 70,
    NOTIFICATION: 80,
  },
} as const;

// Type-safe color utilities
export const getResourceColor = (resource: string): string => {
  const colorMap: Record<string, string> = {
    energy: uiConstants.COLORS.RESOURCES.ENERGY,
    minerals: uiConstants.COLORS.RESOURCES.MINERALS,
    food: uiConstants.COLORS.RESOURCES.FOOD,
    research: uiConstants.COLORS.RESOURCES.RESEARCH,
    alloys: uiConstants.COLORS.RESOURCES.ALLOYS,
    exoticMatter: uiConstants.COLORS.RESOURCES.EXOTIC_MATTER,
  };

  return colorMap[resource] || 'text-gray-400';
};

export const getPlanetColor = (planetType: string): string => {
  const colorMap: Record<string, string> = {
    water: uiConstants.COLORS.PLANETS.WATER,
    volcanic: uiConstants.COLORS.PLANETS.VOLCANIC,
    rocky: uiConstants.COLORS.PLANETS.ROCKY,
    gas: uiConstants.COLORS.PLANETS.GAS,
    ice: uiConstants.COLORS.PLANETS.ICE,
    living: uiConstants.COLORS.PLANETS.LIVING,
    desolate: uiConstants.COLORS.PLANETS.DESOLATE,
    exotic: uiConstants.COLORS.PLANETS.EXOTIC,
  };

  return colorMap[planetType] || 'text-gray-400';
};

export const getNotificationColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    info: uiConstants.COLORS.NOTIFICATIONS.INFO,
    success: uiConstants.COLORS.NOTIFICATIONS.SUCCESS,
    warning: uiConstants.COLORS.NOTIFICATIONS.WARNING,
    error: uiConstants.COLORS.NOTIFICATIONS.ERROR,
  };

  return colorMap[type] || uiConstants.COLORS.NOTIFICATIONS.INFO;
};
