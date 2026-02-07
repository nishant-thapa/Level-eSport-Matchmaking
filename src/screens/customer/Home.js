"use client"

import { useNavigation } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { useCallback, useEffect, useState } from "react"
import { RefreshControl, StatusBar, StyleSheet, View } from "react-native"
import { useSafeAreaInsets, initialWindowMetrics } from "react-native-safe-area-context"
import Toast from "react-native-simple-toast"

// Custom Components
import GameCarousel from "../../component/customer/GameCarousel"
import Header from "../../component/customer/Header"
import StatsContainer from "../../component/customer/StatsContainer"
import UpcommingList from "../../component/customer/UpcommingList"

// Custom Hooks & Context
import { useNetworkStatus } from "../../hooks/useNetworkStatus"

// API Queries
import { useGameProfiles } from "../../queries/useGameProfiles"
import { useGames } from "../../queries/useGames"
import { useUpcomingChallenges } from "../../queries/useUpcomingChallenges"
import { useInfiniteMatches } from "../../queries/useMatches"

// Services & Utilities
import { queryClient } from "../../lib/queryClient"

// State Management
import { useAuthStore } from "../../store/authStore"
import { useThemeStore } from "../../store/themeStore"

// New import for handleJoinGame
import { handleJoinGame } from "../../service/homeHandler"
import { scaleHeight } from "../../utils/scaling"

/**
 * ========================================================================
 * HOME SCREEN COMPONENT
 * ========================================================================
 *
 * Main dashboard screen that displays:
 * - User profile header with wallet balance and social media links
 * - User statistics (wins/losses) with quick action buttons
 * - Promotional banners carousel
 * - Available games carousel for navigation
 * - Upcoming challenges list with join functionality
 *
 * Features:
 * - Pull-to-refresh functionality
 * - Network connectivity awareness
 * - Dynamic theme support (light/dark mode)
 * - Bottom sheet integration for challenge joining
 * - Social media integration
 */
const Home = () => {
  /*
   * ====================================================================
   * HOOKS & STATE MANAGEMENT
   * ====================================================================
   */

  // Navigation and UI hooks
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  // Global state management
  const { user, get_user } = useAuthStore()
  const { isLight } = useThemeStore()
  const { isConnected } = useNetworkStatus()

  // Local component state
  const [refreshing, setRefreshing] = useState(false)


  // API data queries
  const { data: games = [] } = useGames()
  const { data: gameProfiles = [] } = useGameProfiles()
  const { data: upcomingChallenges, isLoading: isUpcomingLoading } = useUpcomingChallenges()

  /*
   * ====================================================================
   * Mounting User Data & Upcoming Challenges
   * ====================================================================
   */

  useEffect(() => {
    const mountData = async () => {
      try {
        // Refresh user data
        await get_user();

        // Refresh upcoming challenges
        await queryClient.invalidateQueries({ queryKey: ["upcomingChallenges"] });
      } catch (error) {
        if (__DEV__) {
          console.error("Mount Data Error:", error);
        }
      }
    };

    mountData();
  }, []);



  /*
   * ====================================================================
   * DATA REFRESH LOGIC
   * ====================================================================
   */

  /**
   * Handles pull-to-refresh functionality
   * Only executes if network connection is available
   */
  const onRefresh = useCallback(async () => {
    if (!isConnected) {
      Toast.show("No internet connection.", Toast.SHORT)
      return
    }

    setRefreshing(true)
    try {
      // Refresh user data
      await refreshUserData()

      // Invalidate upcoming challenges to force refresh
      await queryClient.invalidateQueries({ queryKey: ["upcomingChallenges"] })

      // You can add more query invalidations here if needed
    } catch (error) {
      if (__DEV__) {
        console.error("Refresh Error:", error);
      }
    } finally {
      // Always ensure refreshing state is reset
      setRefreshing(false)
    }
  }, [isConnected])

  /**
   * Refreshes user data from the server
   * Called on app focus and manual refresh
   * @returns {Promise} A promise that resolves when user data is refreshed
   */
  const refreshUserData = async () => {
    if (!isConnected) return Promise.reject("No internet connection")
    return get_user()
  }

  /*
   * ====================================================================
   * NAVIGATION HANDLERS
   * ====================================================================
   */

  /**
   * Navigate to user profile screen
   * Passes current user data as navigation parameter
   */
  const handleProfile = () => {
    navigation.navigate("profile", { userData: user })
  }



  /*
   * ====================================================================
   * GAME INTERACTION HANDLERS
   * ====================================================================
   */

  /**
   * Handles game card press from the carousel
   *
   * Logic Flow:
   * 1. Check network connectivity
   * 2. Look for existing game profile
   * 3. If profile exists -> navigate to game category
   * 4. If no profile -> navigate to profile creation
   *
   * @param {Object} game - Selected game object
   */
  const handleGameCardPress = (game) => {
    // Network connectivity check
    if (!isConnected) {
      return
    }

    // Check if user has a profile for this game
    const existingProfile = gameProfiles?.find((profile) => profile.game_id === game.game_id)

    if (existingProfile) {
      // User has profile - go to game category
      navigation.navigate("inCategory", { game })
    } else {
      // No profile - create one first
      navigation.navigate("editGameInfo", {
        game: {
          game_id: game.game_id,
          game_name: game.game_name,
          game_modes: game.game_modes,
          game_logo_url: game.game_logo_url
        }
      })
    }
  }

  const handleHeaderGamePoint = () => {
    navigation.navigate("pointsIn")
  }


  /**
   * Handles challenge confirmation
   * Shows the join game sheet with challenge-specific data
   *
   * @param {Object} game - Challenge object to join
   */
  const handleConfirmChallenge = async (game) => {
    // Official tournaments - not implemented yet
    console.log("JOINING TOURNAMENT")
    Toast.show("NOT IMPLEMENTED", Toast.SHORT)
  }









  /*
   * ====================================================================
   * RENDER METHODS
   * ====================================================================
   */

  /**
   * Renders different sections of the home screen
   * Used by FlashList for optimized scrolling performance
   *
   * @param {Object} item - Section item with type identifier
   * @returns {JSX.Element} - Rendered section component
   */
  const renderSection = ({ item }) => {
    switch (item.type) {
      case "stats":
        return (
          <StatsContainer
            num_loss={user?.num_loss || 0}
            num_win={user?.num_win || 0}
            handleMatches={() => navigation.navigate("match")}
          />
        )

      case "games":
        return <GameCarousel games={games} handleGameCardPress={handleGameCardPress} />

      case "upcoming":
        return <UpcommingList games={upcomingChallenges} handleConfirmChallenge={handleConfirmChallenge} />

      default:
        return null
    }
  }

  /*
   * ====================================================================
   * MAIN COMPONENT RENDER
   * ====================================================================
   */
  // Use initialWindowMetrics for immediate inset values to prevent layout shift
  const topInset = insets.top || initialWindowMetrics?.insets?.top || 0
  
  // eef0f2
  return (
    <View
      style={[
        styles.container, 
        {
          backgroundColor: isLight ? "#ffffff" : "#000000",
          paddingTop: topInset,
        },
      ]}
    >
      {/* Status bar configuration for theme consistency */}
      <StatusBar translucent backgroundColor="transparent" barStyle={isLight ? "dark-content" : "light-content"} />

      {/* Fixed Header at the top */}
      <Header
        player_name={user?.full_name} 
        wallet_balance={user?.wallet_balance}
        profile_picture={user?.profile_picture}
        handleProfile={handleProfile}
        handleHeaderGamePoint={handleHeaderGamePoint}
      />

      {/* Main content list with optimized scrolling */}
      <FlashList
        data={[{ type: "stats" }, { type: "games" }, { type: "upcoming" }]}
        renderItem={renderSection}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            colors={[isLight ? '#000000' : '#ffffff']}
            tintColor={isLight ? '#000000' : '#ffffff'}
            progressBackgroundColor={isLight ? '#ffffff' : '#000000'}
            // progressViewOffset={insets.top}
          />
        }
      />

      {/* Note: Bottom sheet is handled globally by BottomSheetProvider */}

    </View>
  )
}

export default Home

/*
 * ========================================================================
 * COMPONENT STYLES
 * ========================================================================
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    // Additional padding can be added here if needed
  },
})
