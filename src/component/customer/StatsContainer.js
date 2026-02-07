import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useThemeStore } from '../../store/themeStore';
import { scaleHeight, scaleWidth } from '../../utils/scaling';
import Toast from 'react-native-simple-toast';

const STATS_ITEMS = [
  { id: 'leaderboard', name: 'Leaderboard', icon: 'trophy-outline', IconLib: Ionicons },
  { id: 'gamepoints', name: 'Game Points', icon: 'receipt-long', IconLib: MaterialIcons },
  { id: 'matches', name: 'My Match', icon: 'gamepad-circle-right', IconLib: MaterialCommunityIcons },
  { id: 'tournament', name: 'Tournament', icon: 'tournament', IconLib: MaterialCommunityIcons },
];

const StatsContainer = ({ handleMatches }) => {
  const { isLight } = useThemeStore();
  const iconColor = isLight ? '#000000' : '#EAEAEA';
  const textColor = isLight ? '#333333' : '#EAEAEA';
  const borderColor = isLight ? '#1A1A1A' : '#EAEAEA';

  const handlePress = (id) => {
    switch (id) {
      case 'matches':
        handleMatches?.();
        break;
      case 'leaderboard':
      case 'gamepoints':
      case 'tournament':
        Toast.show('NOT IMPLEMENTED', Toast.SHORT);
        break;
      default:
        break;
    }
  };

  return (
    <View style={[styles.container, { borderColor }]}>
      {STATS_ITEMS.map((item, index) => (
        <React.Fragment key={item.id}>
          <Pressable style={styles.item} onPress={() => handlePress(item.id)}>
            <View style={styles.iconContainer}>
              <item.IconLib name={item.icon} size={scaleWidth(32)} color={iconColor} />
            </View>
            <Text style={[styles.label, { color: textColor }]}>{item.name}</Text>
          </Pressable>
          {index < STATS_ITEMS.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default StatsContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: scaleWidth(16),
    marginTop: scaleHeight(10),
    borderRadius: scaleWidth(25),
    paddingVertical: scaleHeight(12),
    borderWidth: 1.5,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleWidth(40),
    height: scaleWidth(40),
  },
  label: {
    fontSize: scaleWidth(10),
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: 'grey',
    marginVertical: 5,
    borderRadius: 1.5,
  },
});