import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors, GoldGradient, HomeFonts } from '../../constants';

export const HEADER_HEIGHT = 212;

export default function ProfileHeader() {
  return (
    <View style={styles.root}>
      <Image source={require('../../assets/home/char-profile.png')} style={styles.avatar} />

      <View style={styles.info}>
        <Text style={styles.hi}>
          Hi, <Text style={styles.red}>Player</Text>
        </Text>
        <Text style={styles.tagline}>Play Hard,Win Easy!</Text>

        <View style={styles.badge}>
          <LinearGradient
            colors={GoldGradient.colors}
            locations={GoldGradient.locations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Image source={require('../../assets/home/crown.png')} style={styles.crown} />
          <Text style={styles.badgeText}>GOLD PLAYER</Text>
        </View>

        <Text style={styles.ranking}>
          <Text style={styles.red}>#2</Text> Chennai Ranking
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: HEADER_HEIGHT, flexDirection: 'row', alignItems: 'flex-start', paddingTop: 54, paddingLeft: 2 },
  avatar: { width: 72, height: 72 },
  info: { marginLeft: 12, marginTop: 6, alignItems: 'flex-start' },
  hi: { fontFamily: HomeFonts.medium, fontSize: 20, lineHeight: 24, color: Colors.WHITE },
  tagline: { fontFamily: HomeFonts.medium, fontSize: 13, lineHeight: 16, color: Colors.WHITE },
  red: { color: Colors.BRAND_RED },
  badge: {
    marginTop: 5,
    height: 17,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 0.75,
    borderColor: Colors.GOLD_EDGE,
    overflow: 'hidden',
  },
  crown: { width: 12, height: 10, marginRight: 3 },
  badgeText: { fontFamily: HomeFonts.medium, fontSize: 9.5, color: Colors.GOLD_TEXT },
  ranking: { marginTop: 5, fontFamily: HomeFonts.medium, fontSize: 12, color: Colors.WHITE },
});
