import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Platform,
  ActivityIndicator,
  Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-simple-toast';

// Store imports
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

// Hook imports
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

import { scaleWidth, scaleHeight } from '../../utils/scaling';

// Constants
const GOOGLE_WEB_CLIENT_ID = "901665380294-lhur8lkcqkdt1d0e9b5q3p25mknfejbs.apps.googleusercontent.com";
const PRIVACY_URL = "https://level.com.np/privacy";
const TERMS_URL = "https://level.com.np/terms";

const Auth = () => {
  const insets = useSafeAreaInsets();
  const { google_signup, apple_signup } = useAuthStore();
  const { isLight } = useThemeStore();
  const { isConnected } = useNetworkStatus();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const colors = {
    background: isLight ? "#ffffff" : "#000000",
    text: isLight ? "#000000" : "#ffffff",
    textSecondary: isLight ? "#555555" : "#999999",
    buttonBackground: 'transparent',
    buttonBorder: isLight ? '#000000' : '#ffffff',
    authSectionBg: isLight ? '#ffffff' : '#1e1e1e',
    success: '#00C851',
    headerBg: '#000000'
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    if (!isConnected) {
      Toast.show('No internet connection.', Toast.SHORT);
      return;
    }

    try {
      setIsGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();

      if (!userInfo?.data?.idToken) {
        return;
      }

      const payload = { id_token: userInfo.data.idToken };
      await google_signup(payload);
    } catch (error) {
      if (__DEV__) {
        console.error('Google Sign-In Error:', error);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (!isConnected) {
      Toast.show('No internet connection.', Toast.SHORT);
      return;
    }
    try {
      setIsAppleLoading(true);
      const available = await AppleAuthentication.isAvailableAsync();
      if (!available) {
        return;
      }
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential?.identityToken) {
        Toast.show('Apple Sign-In failed.');
        return;
      }

      const fullName = credential.fullName ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim() : undefined;
      const payload = {
        id_token: credential.identityToken,
        email: credential.email,
        full_name: fullName
      };

      await apple_signup(payload);
    } catch (err) {
      // User canceled or error
    } finally {
      setIsAppleLoading(false);
    }
  };

  const getAuthButtons = () => {
    const buttons = [
      {
        id: 'google',
        icon: isGoogleLoading ?
          <ActivityIndicator size="small" color={colors.text} /> :
          <AntDesign name="google" size={scaleWidth(20)} color={colors.text} />,
        text: 'Continue with Google',
        onPress: handleGoogleSignIn,
        disabled: isGoogleLoading
      }
    ];

    if (Platform.OS === 'ios') {
      buttons.push({
        id: 'apple',
        icon: isAppleLoading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <AntDesign name="apple1" size={scaleWidth(20)} color={colors.text} />
        ),
        text: 'Continue with Apple',
        onPress: handleAppleSignIn,
        disabled: isAppleLoading
      });
    }

    return buttons;
  };

  const handleOpenTerms = () => {
    Linking.openURL(TERMS_URL).catch(err => {
      if (__DEV__) console.error('Error opening terms URL:', err);
      Toast.show('Could not open Terms of Service', Toast.SHORT);
    });
  };

  const handleOpenPrivacy = () => {
    Linking.openURL(PRIVACY_URL).catch(err => {
      if (__DEV__) console.error('Error opening privacy URL:', err);
      Toast.show('Could not open Privacy Policy', Toast.SHORT);
    });
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.headerContainer, { backgroundColor: colors.headerBg }]}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require('../../assets/level.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={[styles.tagline, { color: colors.success }]}>
                  Verssa
                </Text>
                <View style={[styles.taglineUnderline, { backgroundColor: colors.success }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Auth Section */}
        <View style={[styles.authSection, { backgroundColor: colors.authSectionBg }]}>
          <View style={styles.welcomeTextContainer}>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              Welcome
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
              Choose your preferred sign-in method
            </Text>
          </View>

          {/* Auth Buttons */}
          <View style={styles.buttonsContainer}>
            {getAuthButtons().map((button) => (
              <Pressable
                key={button.id}
                style={[styles.authButton, {
                  backgroundColor: colors.buttonBackground,
                  borderColor: colors.buttonBorder,
                }]}
                onPress={button.onPress}
                disabled={button.disabled}
              >
                <View style={styles.buttonContent}>
                  {button.icon}
                  <Text style={[styles.buttonText, { color: colors.text }]}>
                    {button.text}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Terms */}
          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
              <Text>By continuing, you agree to our </Text>
              <Text
                style={[styles.termsLink, { color: colors.success }]}
                onPress={handleOpenTerms}
              >
                Terms of Service
              </Text>
              <Text> and </Text>
              <Text
                style={[styles.termsLink, { color: colors.success }]}
                onPress={handleOpenPrivacy}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    position: 'relative',
    flex: 1
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: scaleHeight(20),
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scaleWidth(20),
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: scaleWidth(180),
    height: scaleHeight(80),
  },
  tagline: {
    fontSize: scaleWidth(11),
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: scaleHeight(6),
  },
  taglineUnderline: {
    width: scaleWidth(60),
    height: scaleHeight(2),
  },
  authSection: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
    justifyContent: 'center',
    gap: scaleHeight(20),
  },
  welcomeTextContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: scaleWidth(24),
    fontWeight: '700',
    marginBottom: scaleHeight(6),
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: scaleWidth(14),
    textAlign: 'center',
    lineHeight: scaleHeight(20),
  },
  buttonsContainer: {
    gap: scaleHeight(16),
    justifyContent: 'center',
    marginBottom: scaleHeight(30),
  },
  authButton: {
    borderRadius: scaleWidth(16),
    borderWidth: 1.5,
    paddingVertical: scaleHeight(12),
    justifyContent: 'center',
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scaleWidth(12),
  },
  buttonText: {
    fontSize: scaleWidth(16),
    fontWeight: '600',
  },
  termsContainer: {
    paddingHorizontal: scaleWidth(10),
  },
  termsText: {
    fontSize: scaleWidth(12),
    textAlign: 'center',
    lineHeight: scaleHeight(18),
  },
  termsLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default Auth;
