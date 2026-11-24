import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors, HomeFonts } from '../../constants';
import { LIVE_MATCHES, Match, Side } from '../../data/homeMock';
import { TEAM_LOGOS } from '../../data/teams';
import Panel from './Panel';
import SectionTitle, { Dot } from './SectionTitle';

export const LIVE_MATCHES_HEIGHT = 198;

const LOGO = 46;

const two = (n = 0) => String(n).padStart(2, '0');

function TeamLogo({ side }: { side: Side }) {
  const logo = TEAM_LOGOS[side.team];
  return <Image source={logo.source} resizeMode="contain" style={{ width: LOGO * logo.ratio, height: LOGO }} />;
}

function Players({ side, right = false }: { side: Side; right?: boolean }) {
  return (
    <View style={[styles.players, right && styles.alignEnd]}>
      {side.players.map((p) => (
        <View key={p} style={[styles.player, right && styles.reverse]}>
          <Image source={require('../../assets/home/char-profile.png')} style={styles.avatar} />
          <Text style={styles.name} numberOfLines={1}>
            {p}
          </Text>
        </View>
      ))}
    </View>
  );
}

function MatchCard({ m }: { m: Match }) {
  return (
    <View style={styles.cardWrap}>
      <LinearGradient
        colors={[Colors.LIVE_EDGE_LEFT, Colors.LIVE_EDGE_RIGHT]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardEdge}
      >
        <View style={styles.cardBody}>
          <LinearGradient
            colors={[Colors.LIVE_TINT_RED, 'transparent', 'transparent', Colors.LIVE_TINT_BLUE]}
            locations={[0, 0.2, 0.75, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <TeamLogo side={m.left} />
          <Players side={m.left} />

          <View style={styles.center}>
            <View style={styles.info}>
              <Text style={[styles.infoText, { color: Colors.LIVE_GOLD }]}>{m.rules}</Text>
              <Text style={[styles.infoText, { color: Colors.LIVE_TEAL }]}>{m.court}</Text>
            </View>
            <LinearGradient
              colors={[Colors.SCORE_RED, Colors.SCORE_TEAL]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scoreEdge}
            >
              <View style={styles.scoreBody}>
                <Text style={styles.score} numberOfLines={1}>{`${two(m.score?.[0])}-${two(m.score?.[1])}`}</Text>
              </View>
            </LinearGradient>
          </View>

          <Players side={m.right} right />
          <TeamLogo side={m.right} />
        </View>
      </LinearGradient>

      <View style={styles.titleTab}>
        <Text style={styles.title}>{m.title}</Text>
      </View>
    </View>
  );
}

export default function LiveMatches() {
  return (
    <Panel height={LIVE_MATCHES_HEIGHT} contentStyle={styles.content}>
      <SectionTitle title="LIVE MATCHES" icon={<Dot color={Colors.BRAND_RED} />} />
      <View style={styles.cards}>
        {LIVE_MATCHES.slice(0, 2).map((m) => (
          <MatchCard key={m.id} m={m} />
        ))}
      </View>
      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === 0 ? Colors.BRAND_RED : Colors.FIELD_BORDER }]} />
        ))}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 5, paddingTop: 3 },
  cards: { flex: 1, gap: 12, paddingTop: 6 },

  cardWrap: { flex: 1 },
  cardEdge: { flex: 1, borderRadius: 6, padding: 1.2 },
  cardBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.PANEL_SOLID,
  },
  titleTab: { position: 'absolute', top: -7, alignSelf: 'center', paddingHorizontal: 8, backgroundColor: Colors.PANEL_SOLID },
  title: { fontFamily: HomeFonts.bold, fontSize: 11.5, lineHeight: 14, letterSpacing: 1.1, color: Colors.WHITE },

  players: { marginHorizontal: 3, gap: 8, flexShrink: 1 },
  alignEnd: { alignItems: 'flex-end' },
  player: { flexDirection: 'row', alignItems: 'center', gap: 3, maxWidth: '100%' },
  reverse: { flexDirection: 'row-reverse' },
  avatar: { width: 16, height: 16 },
  name: { flexShrink: 1, fontFamily: HomeFonts.bold, fontSize: 10, letterSpacing: 0.7, color: Colors.WHITE },

  center: { flex: 1, minWidth: 76, alignItems: 'center' },
  info: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  infoText: { fontFamily: HomeFonts.condensed, fontSize: 6.5, letterSpacing: 0.2 },
  scoreEdge: { width: '100%', maxWidth: 96, height: 34, borderRadius: 5, padding: 1 },
  scoreBody: { flex: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.PANEL_SOLID },
  score: { fontFamily: HomeFonts.bold, fontSize: 25, lineHeight: 30, letterSpacing: 2.5, color: Colors.WHITE },

  dots: { height: 14, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4, paddingRight: 4 },
  dot: { width: 5.5, height: 5.5, borderRadius: 2.75 },
});
