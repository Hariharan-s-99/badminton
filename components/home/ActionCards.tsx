import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors, HomeFonts } from '../../constants';

// "START NEW MATCH" and "TOURNAMENT" buttons side by side.
export const ACTION_CARDS_HEIGHT = 75;

export default function ActionCards() {
  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: Colors.CARD_RED }]}>
        <Image source={require('../../assets/home/play.png')} style={[styles.ring, styles.playIcon]} />
        <View>
          <Text style={styles.start}>START</Text>
          <Text style={styles.heading}>NEW MATCH</Text>
          <Text style={styles.small}>Let the game begin!</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: Colors.ORANGE }]}>
        <View style={styles.ring}>
          <Image source={require('../../assets/home/cup-ring.png')} style={[StyleSheet.absoluteFill, styles.ringImage]} />
          <Image source={require('../../assets/home/cup.png')} style={styles.cup} />
        </View>
        <View>
          <Text style={styles.heading}>TOURNAMENT</Text>
          <Text style={styles.sub}>Create or Join</Text>
          <Text style={styles.sub}>Tournaments</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { height: ACTION_CARDS_HEIGHT, flexDirection: 'row', gap: 10 },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 9,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  ring: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  ringImage: { width: 46, height: 46 },
  playIcon: { transform: [{ rotate: '90deg' }] },
  cup: { width: 22, height: 25 },
  start: { fontFamily: HomeFonts.condensed, fontSize: 12, lineHeight: 14, color: Colors.WHITE, letterSpacing: 0.5 },
  heading: { fontFamily: HomeFonts.bold, fontSize: 12.5, lineHeight: 15, color: Colors.WHITE, letterSpacing: 1.4 },
  small: { fontFamily: HomeFonts.regular, fontSize: 7.5, lineHeight: 11, color: Colors.WHITE, letterSpacing: 0.8 },
  sub: { fontFamily: HomeFonts.semiCondensed, fontSize: 8.5, lineHeight: 11, color: Colors.WHITE, letterSpacing: 0.5 },
});
