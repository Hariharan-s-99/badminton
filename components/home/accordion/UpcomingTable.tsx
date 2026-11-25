import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors, HomeFonts } from '../../../constants';
import { Match, Side } from '../../../data/homeMock';
import { TEAM_LOGOS } from '../../../data/teams';
import Panel from '../Panel';
import { Chevron } from '../SectionTitle';

// UPCOMING MATCHES page: header row + 3 fixture rows in an inner outlined box,
// "VIEW FULL FIXTURES" link underneath. Figma 340x145.5 at the 360 frame.

export const UPCOMING_TABLE_HEIGHT = 145.5;

const ROW_H = 35.4;
const MATCH_COL = 46.5;
const COURT_COL = 38.3;
const LOGO = 30;

function Team({ side, right = false }: { side: Side; right?: boolean }) {
  const logo = TEAM_LOGOS[side.team];
  return (
    <View style={[styles.team, right && styles.teamRight]}>
      <View style={[styles.logoSlot, right ? styles.logoSlotRight : styles.logoSlotLeft]}>
        <Image source={logo.source} resizeMode="contain" style={{ width: LOGO * logo.ratio, height: LOGO }} />
      </View>
      <View style={styles.avatars}>
        <Image source={require('../../../assets/home/char-profile.png')} style={styles.avatar} />
        <Image source={require('../../../assets/home/char-profile.png')} style={styles.avatar} />
      </View>
      <View style={[styles.names, right && styles.namesRight]}>
        {side.players.map((p, i) => (
          <Text key={i} style={styles.name} numberOfLines={1}>
            {p}
          </Text>
        ))}
      </View>
    </View>
  );
}

function Row({ m, first }: { m: Match; first: boolean }) {
  return (
    <View style={[styles.row, !first && styles.rowDivider]}>
      <Text style={[styles.cell, styles.matchCol]}>{m.title}</Text>
      <View style={styles.vDivider} />
      <View style={styles.middle}>
        <Team side={m.left} />
        <Text style={styles.vs}>VS</Text>
        <Team side={m.right} right />
      </View>
      <View style={styles.vDivider} />
      <Text style={[styles.cell, styles.courtCol]}>{m.court}</Text>
    </View>
  );
}

export default function UpcomingTable({ matches }: { matches: Match[] }) {
  return (
    <Panel height={UPCOMING_TABLE_HEIGHT} border={1} shade={false} style={styles.box}>
      <View style={styles.header}>
        <Text style={[styles.head, styles.matchCol]}>MATCHES</Text>
        <Text style={[styles.head, styles.middleHead]}>TEAM / PLAYERS</Text>
        <Text style={[styles.head, styles.courtCol]}>COURT</Text>
      </View>

      <Panel border={1} shade={false} style={styles.rows}>
        {matches.slice(0, 3).map((m, i) => (
          <Row key={m.id} m={m} first={i === 0} />
        ))}
      </Panel>

      <View style={styles.footer}>
        <Text style={styles.link}>VIEW FULL FIXTURES</Text>
        <Chevron color={Colors.LINK_BLUE} style={styles.chevron} />
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: 1.2, marginHorizontal: 3.4 },
  header: { height: 14.6, flexDirection: 'row', alignItems: 'center' },
  head: { fontFamily: HomeFonts.semiBold, fontSize: 9.5, lineHeight: 12, letterSpacing: 0.6, color: Colors.WHITE, textAlign: 'center' },
  middleHead: { flex: 1 },
  matchCol: { width: MATCH_COL + 0.75 },
  courtCol: { width: COURT_COL + 0.75 },

  // inner box shares its left/right edges with the outer one
  rows: { height: 3 * ROW_H + 2, marginHorizontal: -1 },
  row: { height: ROW_H, flexDirection: 'row', alignItems: 'center' },
  rowDivider: { borderTopWidth: 0.75, borderTopColor: Colors.FIELD_BORDER },
  cell: { fontFamily: HomeFonts.semiBold, fontSize: 8.5, lineHeight: 12, letterSpacing: 0.3, color: Colors.WHITE, textAlign: 'center' },
  vDivider: { width: 0.75, height: 25, backgroundColor: Colors.FIELD_BORDER },

  middle: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  team: { flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 },
  teamRight: { flexDirection: 'row-reverse' },
  // logo centre 18.5 from the left divider / 23.5 from the right one
  logoSlotLeft: { width: 37, marginLeft: 0 },
  logoSlotRight: { width: 37, marginRight: 5 },
  logoSlot: { alignItems: 'center' },
  avatars: { gap: 2, marginHorizontal: 3.5 },
  avatar: { width: 13, height: 13 },
  names: { marginLeft: 6, flexShrink: 1, minWidth: 0 },
  namesRight: { marginLeft: 0, marginRight: 4, alignItems: 'flex-end' },
  name: { fontFamily: HomeFonts.regular, fontSize: 11, lineHeight: 15, letterSpacing: 0.5, color: Colors.WHITE },
  vs: { width: 30, textAlign: 'center', fontFamily: HomeFonts.semiBold, fontSize: 26, lineHeight: 30, color: Colors.WHITE },

  footer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingLeft: 8 },
  link: { fontFamily: HomeFonts.semiCondensed, fontSize: 10.5, lineHeight: 12, letterSpacing: 1.3, color: Colors.LINK_BLUE },
  chevron: { marginLeft: 6 },
});
