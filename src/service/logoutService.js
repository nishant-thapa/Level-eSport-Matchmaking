import AsyncStorage from '@react-native-async-storage/async-storage';
import { persister, queryClient } from '../lib/queryClient';

/**
 * Centralized logout function that handles all cleanup tasks
 * - Clears all React Query cache and resets queries
 * - Clears all stored authentication data
 * - Resets authentication state
 * @returns {Promise<void>}
 */
export const performLogout = async () => {
  try {
    // Step 1: Clear all React Query cache and reset queries
    queryClient.clear();
    // 2. Clear persisted cache in AsyncStorage
    await persister.removeClient();

    // Step 2: Clear all stored authentication data
    await AsyncStorage.multiRemove([
      '@access_token',
      '@refresh_token',
      '@user',
    ]);

    // Step 3: Small delay to ensure all operations complete
    await new Promise((resolve) => setTimeout(resolve, 400));

  } catch (error) {
    if (__DEV__) {
      console.log('Error during logout:', error);
    }
  }
};

