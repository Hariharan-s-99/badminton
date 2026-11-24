import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors, HomeFonts } from '../../constants';
import { TOP_PLAYERS } from '../../data/homeMock';
import Panel from './Panel';
import SectionTitle from './SectionTitle';

export const TOP_PLAYERS_HEIGHT = 109;

const RATE_COLORS = [Colors.BRAND_RED, Colors.RATE_AMBER, Colors.RATE_ROSE, Colors.RATE_GREEN, Colors.RATE_PURPLE];

export default function TopPlayers() {
  return (
    <Panel height={TOP_PLAYERS_HEIGHT} contentStyle={styles.content}>
      <SectionTitle title="TOP PLAYERS" icon={<Image source={require('../../assets/home/crown.png')} style={styles.crown} />} />
      <View style={styles.cards}>
        {TOP_PLAYERS.slice(0, 5).map((p, i) => (
          <Panel key={p.rank} style={styles.card} border={1} radius={6} contentStyle={styles.cardContent}>
            <View style={styles.rank}>
              <Text style={styles.rankText}>{p.rank}</Text>
            </View>
            <Image source={require('../../assets/home/char-profile.png')} style={styles.avatar} />
            <Text style={styles.name}>{p.name}</Text>
            <Text style={[styles.rate, { color: RATE_COLORS[i] }]}>{`${p.winRate}%`}</Text>
            <Text style={styles.matches}>{`${p.matches} Matches`}</Text>
          </Panel>
        ))}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 6, paddingTop: 3, paddingBottom: 6 },
  crown: { width: 13, height: 11, marginRight: 5 },
  cards: { flex: 1, flexDirection: 'row', gap: 6, marginTop: 3 },
  card: { flex: 1 },
  cardContent: { alignItems: 'center', justifyContent: 'center' },
  rank: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GOLD_TEXT,
  },
  rankText: { fontFamily: HomeFonts.bold, fontSize: 7, lineHeight: 9, color: Colors.WHITE },
  avatar: { width: 32, height: 32 },
  name: { marginTop: 3, fontFamily: HomeFonts.bold, fontSize: 9.5, lineHeight: 11, letterSpacing: 0.9, color: Colors.WHITE },
  rate: { fontFamily: HomeFonts.bold, fontSize: 14.5, lineHeight: 16, letterSpacing: 0.3 },
  matches: { fontFamily: HomeFonts.bold, fontSize: 7.5, lineHeight: 9, letterSpacing: 0.6, color: Colors.WHITE },
});
