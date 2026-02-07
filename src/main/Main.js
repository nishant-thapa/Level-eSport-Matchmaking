import { NavigationContainer } from '@react-navigation/native';
import { ErrorBoundary } from 'react-error-boundary';
import AppErrorFallback from '../component/customer/fallback/AppErrorFallback';
import { navigationRef, NavigationService } from '../service/navigationService';
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';


// Navigation
import SignupNavigator from '../navigation/SignupNavigator';
import CustomerNavigator from '../navigation/CustomerNavigator';

// Store
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

// Queries
import { useGames } from '../queries/useGames';
import NoConnection from '../screens/NoConnection';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

//============ Prevent Auto Hide Splash Screen ============
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {

  //============ Store Hooks ============
  const {
    isAuthenticated,
    initAuth,
    isCustomer,
    isInitialized
  } = useAuthStore();

  // ================ Initialize App Prequisites ================
  const { initializeTheme } = useThemeStore();
  useGames()

  // Network
  const { isConnected } = useNetworkStatus();

  //============ Animation Ref ============
  const fadeAnim = useRef(new Animated.Value(0)).current;

  //============ Initialize App ============
  useEffect(() => {
    const init = async () => {
      // Initialize theme from saved preferences
      await initializeTheme();

      // Initialize authentication
      await initAuth();
    }
    init();
  }, []);

  //============ Fade In Animation ============
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  //============ Handle App State Changes ============
  useEffect(() => {
    if (isInitialized && getContent() !== null) {
      SplashScreen.hide();
    }
  }, [isInitialized, isAuthenticated, isCustomer]);

  //============ Content Renderer ============
  function getContent() {
    if (!isInitialized) return null;

    if (isAuthenticated && isCustomer) {
      return <CustomerNavigator />;
    }

    return <SignupNavigator />;
  }

  //============ Main Render ============
  return (
    isConnected ? (
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          NavigationService.executePendingNavigation();
        }}
      >
        <ErrorBoundary
          FallbackComponent={AppErrorFallback}
          onError={(error, info) => {
            if (__DEV__) console.error('Navigation Error:', error, info);
          }}
        >
          {getContent()}
        </ErrorBoundary>
      </NavigationContainer>
    ) : (
      <NoConnection onRetry={async () => {
        try {
          await initializeTheme();
          await initAuth();
        } catch {}
      }} />
    )
  );
}

