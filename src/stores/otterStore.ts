import { create } from "zustand";

interface UserRole {
  isVerifier: boolean;
  isIssuer: boolean;
  isAdmin: boolean;
}

interface OtterStore {
  // User role state
  userRole: UserRole;
  setUserRole: (role: Partial<UserRole>) => void;
  
  // Network state
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  
  // UI state
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Transaction state
  pendingTx: string | null;
  setPendingTx: (tx: string | null) => void;
}

export const useOtterStore = create<OtterStore>((set) => ({
  // User role state
  userRole: {
    isVerifier: false,
    isIssuer: false,
    isAdmin: false,
  },
  setUserRole: (role) =>
    set((state) => ({ userRole: { ...state.userRole, ...role } })),
  
  // Network state
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  
  // UI state
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  
  // Transaction state
  pendingTx: null,
  setPendingTx: (tx) => set({ pendingTx: tx }),
}));
