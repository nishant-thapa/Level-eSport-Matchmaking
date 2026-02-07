import { create } from 'zustand';
import {
  getStoredUser,
  getUser,
  googleSignupUser,
  appleSignupUser,
  updateUser
} from '../service/authService';
import { performLogout } from '../service/logoutService';


/**
 * Authentication Store
 * Manages user authentication state and related operations using Zustand.
 * Handles OAuth login, logout, and role-based access control.
 */
export const useAuthStore = create((set) => ({
  // Authentication State
  user: null,
  isAuthenticated: true,
  isAdmin: false,
  isCustomer: false,
  isInitialized: false,

  /**
   * Initializes authentication state from stored user data
   * @returns {Promise<void>}
   */
  initAuth: async () => {
    const user = await getStoredUser();
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isCustomer: user?.role === 'customer',
      isInitialized: true
    });
  },

  /**
   * Handles Google signup and updates authentication state
   * @param {Object} payload - Google signup data
   * @returns {Promise<void>}
   */
  google_signup: async (payload) => {
    const user = await googleSignupUser(payload);
    if (!user) return;
    set({
      user,
      isAuthenticated: true,
      isAdmin: user?.role === 'admin',
      isCustomer: user?.role === 'customer',
      isInitialized: true
    });
  },

  /**
   * Handles Apple signup and updates authentication state
   * @param {Object} payload - Apple signup data
   * @returns {Promise<void>}
   */
  apple_signup: async (payload) => {
    const user = await appleSignupUser(payload);
    if (!user) return;
    set({
      user,
      isAuthenticated: true,
      isAdmin: user?.role === 'admin',
      isCustomer: user?.role === 'customer',
      isInitialized: true
    });
  },

  /**
   * Updates user profile information
   * @param {Object} payload - Updated user data
   * @returns {Promise<void>}
   */
  update_user: async (payload) => {
    const user = await updateUser(payload);
    set({ user });
  },

  /**
   * Refreshes user data from the backend
   * @returns {Promise<void>}
   */
  get_user: async () => {
    const user = await getUser();
    set({ user });
  },

  /**
   * Updates user wallet balance without full API call
   * @param {number} newWalletBalance - New wallet balance
   */
  update_wallet_balance: (newWalletBalance) => {
    set((state) => ({
      user: state.user ? {
        ...state.user,
        wallet_balance: newWalletBalance
      } : state.user
    }));
  },

  /**
   * Handles user logout and resets authentication state
   * @returns {Promise<void>}
   */
  logout: async () => {
    await performLogout();
    set({
      user: null,
      isAdmin: false,
      isCustomer: false,
      isAuthenticated: false,
      isInitialized: true
    });
  }
}));