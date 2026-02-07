"use client"

import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { useMemo } from "react"
import { Octicons, MaterialCommunityIcons, Ionicons, FontAwesome6 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useThemeStore } from "../../store/themeStore"
import { useAuthStore } from "../../store/authStore"
import { scaleWidth, scaleHeight } from "../../utils/scaling"

const Header = ({
  player_name,
  wallet_balance,
  profile_picture,
  handleProfile,
  handleHeaderGamePoint
}) => {
  const phrase = "Get ready for the battle."

 

  const { isLight } = useThemeStore()
  const { user } = useAuthStore()
  const { displayName, themeStyles } = useMemo(() => {
    const firstName = player_name ? player_name.split(" ")[0] : ""
    const computedDisplayName = firstName.length > 10 ? `${firstName.slice(0, 10)}...` : firstName

    const computedThemeStyles = {
      textColor: isLight ? "#333333" : "#EAEAEA",
      iconColor: isLight ? "#000000" : "#EAEAEA",
      buttonBackground: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.1)",
      profileBackground: isLight ? "#dadada" : "#444444",
    }

    return {
      displayName: computedDisplayName,
      themeStyles: computedThemeStyles,
    }
  }, [player_name, isLight])

  const ProfileImage = () => {
    if (profile_picture) {
      return (
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: profile_picture }}
            style={styles.profileImage}
            resizeMode="cover"
            accessibilityLabel={`${player_name}'s profile picture`}
          />
        </View>
      )
    }

    return (
      <View style={styles.profileImageContainer}>
        <View style={[styles.profileFallback, { backgroundColor: themeStyles.profileBackground }]}>
          <Octicons name="feed-person" size={scaleWidth(32)} color={themeStyles.iconColor} accessibilityLabel="Default profile icon" />
        </View>
      </View>
    )
  }

  return (
    <View style={[
      styles.header,
      {
        backgroundColor: isLight ? 'transparent' : '#000000',
        borderColor: isLight ? '#333333' : '#ffffff' ,
        shadowColor: isLight ? '#000' : '#fff',
      }
    ]}>
      {/* Left Section - Profile and User Info */}
      <View style={styles.leftSection}>
        <Pressable
          style={styles.profileContainer}
          onPress={handleProfile}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <ProfileImage />
        </Pressable>

        <View style={styles.userInfo}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: scaleWidth(6) }}>
            <Text
              style={[styles.greeting, { color: themeStyles.textColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
              accessibilityLabel={`Hi, ${displayName}`}
            >
              {
                displayName ? `Hi, ${displayName}` : "Hi, (⁠◠⁠‿⁠◕⁠)"
              }
            </Text>
            <FontAwesome6 name="hand-peace" size={scaleWidth(18)} color={themeStyles.iconColor} />
          </View>

          <Text
            style={[styles.subtitle, { color: themeStyles.textColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityLabel={phrase}
          >
            {phrase}
          </Text>
        </View>

      </View>


      {/* Right Section - Balance */}
      <View style={styles.rightSection}>
        <Pressable
          onPress={handleHeaderGamePoint}
        >
          <LinearGradient
            colors={['#ffffff', '#f8fbff', '#f0f8ff', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceContainer}
          >
            <View style={styles.balanceContent}>
              <MaterialCommunityIcons 
                name="star-four-points-outline" 
                size={scaleWidth(16)} 
                color="#00bf63" 
              />

              <Text style={styles.balanceText}>
                {typeof wallet_balance === "number" ? wallet_balance.toFixed(2) : wallet_balance}
              </Text>
            </View>
            <Ionicons name="add" size={scaleWidth(14)} color="#00bf63" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: scaleWidth(15),
    paddingTop: scaleHeight(12),
    paddingBottom: scaleHeight(12),
 
 
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  profileContainer: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    borderRadius: scaleWidth(28),
    marginRight: scaleWidth(12),
    position: 'relative',
  },
  profileImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: scaleWidth(28),
  },
  profileFallback: {
    width: "100%",
    height: "100%",
    borderRadius: scaleWidth(28),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: scaleWidth(2),
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  greeting: {
    fontSize: scaleWidth(16),
    fontWeight: "700",
    marginBottom: 2,
    lineHeight: scaleHeight(24),
  },
  subtitle: {
    fontSize: scaleWidth(14),
    fontWeight: "500",
    opacity: 0.8,
    lineHeight: scaleHeight(18),
    paddingVertical: scaleHeight(2),
  },
  rightSection: {
    alignItems: "flex-end",
    gap: scaleWidth(10),
  },
  balanceContainer: {
    paddingHorizontal: scaleWidth(14),
    paddingVertical: scaleHeight(10),
    borderRadius: scaleWidth(24),
    flexDirection: "row",
    alignItems: "center",
   
  },
  balanceContent: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: scaleWidth(8),
  },
  balanceText: {
    fontSize: scaleWidth(14),
    fontWeight: "700",
    color: "#000000",
    marginLeft: scaleWidth(6),
  },
})