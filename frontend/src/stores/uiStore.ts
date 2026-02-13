import { create } from 'zustand';
import type { GameView, SidePanel, Notification } from '../types/game.d.ts';

export interface UIState {
  // View Management
  currentView: GameView;
  sidePanel: SidePanel;

  // Selection State
  selectedPlanet?: string;
  selectedFleet?: string;
  selectedEmpire?: string;

  // UI Interactions
  isLoading: boolean;
  loadingMessage?: string;

  // Modal Management
  activeModal?: string;
  modalData?: Record<string, unknown>;

  // Notifications
  notifications: Notification[];

  // Tutorial/Help
  tutorialStep?: number;
  showHelp: boolean;

  // Performance
  lastRenderTime: number;
  debugMode: boolean;
}

interface UIActions {
  // View Actions
  setCurrentView: (view: GameView) => void;
  setSidePanel: (panel: SidePanel) => void;

  // Selection Actions
  setSelectedPlanet: (planetId?: string) => void;
  setSelectedFleet: (fleetId?: string) => void;
  setSelectedEmpire: (empireId?: string) => void;

  // Loading Actions
  setLoading: (loading: boolean, message?: string) => void;

  // Modal Actions
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  removeNotification: (notificationId: string) => void;

  // Tutorial Actions
  setTutorialStep: (step?: number) => void;
  toggleHelp: () => void;

  // Debug Actions
  setDebugMode: (enabled: boolean) => void;
  updateRenderTime: () => void;
}

type UIStore = UIState & UIActions;

const createInitialUIState = (): UIState => ({
  currentView: 'galaxy',
  sidePanel: 'none',
  isLoading: false,
  notifications: [],
  showHelp: false,
  lastRenderTime: Date.now(),
  debugMode: false,
});

export const useUIStore = create<UIStore>((set, _get) => ({
  ...createInitialUIState(),

  // View Actions
  setCurrentView: view => set({ currentView: view }),
  setSidePanel: panel => set({ sidePanel: panel }),

  // Selection Actions
  setSelectedPlanet: planetId => set({ selectedPlanet: planetId }),
  setSelectedFleet: fleetId => set({ selectedFleet: fleetId }),
  setSelectedEmpire: empireId => set({ selectedEmpire: empireId }),

  // Loading Actions
  setLoading: (loading, message) =>
    set({
      isLoading: loading,
      loadingMessage: loading ? message : undefined,
    }),

  // Modal Actions
  openModal: (modalId, data) =>
    set({
      activeModal: modalId,
      modalData: data,
    }),
  closeModal: () =>
    set({
      activeModal: undefined,
      modalData: undefined,
    }),

  // Notification Actions
  addNotification: notification => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };

    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));
  },

  markNotificationRead: notificationId => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  },

  clearNotifications: () => set({ notifications: [] }),

  removeNotification: notificationId => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== notificationId),
    }));
  },

  // Tutorial Actions
  setTutorialStep: step => set({ tutorialStep: step }),
  toggleHelp: () => set(state => ({ showHelp: !state.showHelp })),

  // Debug Actions
  setDebugMode: enabled => set({ debugMode: enabled }),
  updateRenderTime: () => set({ lastRenderTime: Date.now() }),
}));
