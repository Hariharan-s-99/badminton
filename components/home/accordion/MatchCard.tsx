import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, Stop, LinearGradient as SvgGradient, Text as SvgText } from 'react-native-svg';
import { Colors, HomeFonts, ResultGoldGradient } from '../../../constants';
import { Match, Side } from '../../../data/homeMock';
import { TEAM_LOGOS } from '../../../data/teams';
import CardFrame from './CardFrame';

export const MATCH_CARD_HEIGHT = 63;

const LOGO_H = 47;
const LOGO_SLOT = { left: 44, right: 46 };
const SCORE_W = 87.5;

const two = (n = 0) => String(n).padStart(2, '0');

function TeamLogo({ side, align }: { side: Side; align: 'left' | 'right' }) {
  const logo = TEAM_LOGOS[side.team];
  const slot = LOGO_SLOT[align];
  const width = Math.min(slot, LOGO_H * logo.ratio);
  return (
    <View style={[styles.logoSlot, { width: slot, alignItems: align === 'left' ? 'flex-start' : 'flex-end' }]}>
      <Image source={logo.source} resizeMode="contain" style={{ width, height: LOGO_H }} />
    </View>
  );
}

function Players({ side, right = false }: { side: Side; right?: boolean }) {
  return (
    <View style={[styles.players, right && styles.alignEnd]}>
      {side.players.map((p, i) => (
        <View key={i} style={[styles.player, right && styles.reverse]}>
          <Image source={require('../../../assets/home/char-profile.png')} style={styles.avatar} />
          <Text style={styles.name} numberOfLines={1}>
            {p}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Score({ m, completed }: { m: Match; completed: boolean }) {
  const [a, b] = [two(m.score?.[0]), two(m.score?.[1])];
  return (
    <LinearGradient colors={[Colors.SCORE_RED, Colors.SCORE_TEAL]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.scoreEdge}>
      <View style={styles.scoreBody}>
        <Text style={styles.score} numberOfLines={1}>
          <Text style={completed && { color: Colors.BRAND_RED }}>{a}</Text>-<Text style={completed && { color: Colors.SCORE_TEAL }}>{b}</Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

function Result({ text }: { text: string }) {
  return (
    <Svg width={140} height={14} style={styles.result}>
      <Defs>
        <SvgGradient id="result" x1="0" y1="0" x2="1" y2="0">
          {ResultGoldGradient.colors.map((c, i) => (
            <Stop key={c} offset={ResultGoldGradient.locations[i]} stopColor={c} />
          ))}
        </SvgGradient>
      </Defs>
      <SvgText
        x={70}
        y={11.4}
        textAnchor="middle"
        fill="url(#result)"
        fontFamily={HomeFonts.semiBold}
        fontSize={11}
        letterSpacing={1}
      >
        {text}
      </SvgText>
    </Svg>
  );
}

export default function MatchCard({ m, completed = false }: { m: Match; completed?: boolean }) {
  return (
    <View style={styles.card}>
      <View style={styles.fill}>
        <Image source={require('../../../assets/home/card-splash-left.png')} style={[styles.splash, { left: 0 }]} />
        <Image source={require('../../../assets/home/card-splash-right.png')} style={[styles.splash, { right: 0 }]} />
      </View>
      <CardFrame />

      <Text style={[styles.meta, styles.rules]}>{m.rules}</Text>
      <Text style={[styles.meta, styles.court]}>{m.court}</Text>

      <View style={styles.row}>
        <View style={styles.side}>
          <TeamLogo side={m.left} align="left" />
          <Players side={m.left} />
        </View>
        <View style={styles.centre} />
        <View style={[styles.side, styles.sideRight]}>
          <Players side={m.right} right />
          <TeamLogo side={m.right} align="right" />
        </View>
      </View>

      <View style={styles.centreAbs} pointerEvents="none">
        <Text style={styles.title}>{m.title}</Text>
        <Score m={m} completed={completed} />
        {completed && m.result ? <Result text={m.result} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { height: MATCH_CARD_HEIGHT },
  fill: { ...StyleSheet.absoluteFillObject, borderRadius: 6, overflow: 'hidden', backgroundColor: Colors.PANEL_SOLID },
  splash: { position: 'absolute', top: 0, width: 64, height: MATCH_CARD_HEIGHT },

  meta: { position: 'absolute', top: 2, width: 80, fontFamily: HomeFonts.condensed, fontSize: 7, lineHeight: 8 },
  rules: { right: '50%', marginRight: 64.5, textAlign: 'right', color: Colors.LIVE_GOLD },
  court: { left: '50%', marginLeft: 63.5, color: Colors.LIVE_TEAL },

  row: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 3.5 },
  side: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 5.5, minWidth: 0 },
  sideRight: { justifyContent: 'flex-end', paddingLeft: 0, paddingRight: 4.5 },
  centre: { width: SCORE_W + 8 },
  logoSlot: { height: LOGO_H, justifyContent: 'center', marginTop: -1.5 },

  players: { marginHorizontal: 2, gap: 7, flexShrink: 1, minWidth: 0 },
  alignEnd: { alignItems: 'flex-end' },
  player: { flexDirection: 'row', alignItems: 'center', gap: 3, maxWidth: '100%' },
  reverse: { flexDirection: 'row-reverse' },
  avatar: { width: 15, height: 15 },
  name: { flexShrink: 1, fontFamily: HomeFonts.semiBold, fontSize: 11.5, lineHeight: 15, letterSpacing: 0.5, color: Colors.WHITE },

  centreAbs: { position: 'absolute', top: -5.5, left: 0, right: 0, alignItems: 'center' },
  title: { height: 12, fontFamily: HomeFonts.semiBold, fontSize: 11, lineHeight: 12, letterSpacing: 0.8, color: Colors.WHITE },
  scoreEdge: { marginTop: 11, width: SCORE_W, height: 33, borderRadius: 5, padding: 1 },
  scoreBody: { flex: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.PANEL_SOLID },
  score: { fontFamily: HomeFonts.score, fontSize: 26, lineHeight: 31, color: Colors.WHITE },
  result: { marginTop: 1 },
});
