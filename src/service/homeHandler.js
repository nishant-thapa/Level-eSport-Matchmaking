import { Linking } from 'react-native';

/**
 * Generic function to handle opening external links
 * @param {string} url - The URL to open
 */
export const handleExternalLink = async (url) => {
  if (!url) {
    return;
  }

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  } catch (error) {
    if (__DEV__) console.log(error)
  }
};