import { create } from 'zustand';

export type SidebarMode = 'expanded' | 'collapsed';

interface UIState {
  /** Desktop sidebar mode (expanded vs collapsed rail) */
  sidebarMode: SidebarMode;
  /** Temporary desktop peek expansion while hovering the rail */
  sidebarPeekOpen: boolean;
  /** Mobile overlay sidebar open state */
  mobileSidebarOpen: boolean;
  activeEnvironmentId: string | null;
  toggleSidebarMode: () => void;
  setSidebarMode: (mode: SidebarMode) => void;
  setSidebarPeekOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebar: (open: boolean) => void;
  setActiveEnvironment: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarMode: 'collapsed',
  sidebarPeekOpen: false,
  mobileSidebarOpen: false,
  activeEnvironmentId: null,
  toggleSidebarMode: () =>
    set((state) => ({
      sidebarMode: state.sidebarMode === 'expanded' ? 'collapsed' : 'expanded',
      sidebarPeekOpen: false,
    })),
  setSidebarMode: (mode) => set({ sidebarMode: mode, sidebarPeekOpen: false }),
  setSidebarPeekOpen: (open) => set({ sidebarPeekOpen: open }),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  setMobileSidebar: (open) => set({ mobileSidebarOpen: open }),
  setActiveEnvironment: (id) => set({ activeEnvironmentId: id }),
}));
