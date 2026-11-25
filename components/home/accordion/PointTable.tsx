import { DimensionValue, Image, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { Colors, HomeFonts } from '../../../constants';
import { PointRow } from '../../../data/homeMock';
import { TEAM_LOGOS } from '../../../data/teams';
import Panel from '../Panel';

// POINT TABLE page: outlined box with a header and 3 standings rows.
// Figma 339x142 at the 360 frame; columns are placed by their centre as a
// fraction of the box's inner width (336.8) so they spread on wider phones.

export const POINT_TABLE_HEIGHT = 142;

const INNER_W = 336.8;
const ROW_H = 40;
const COL_W = 60;

const at = (centre: number): { left: DimensionValue; marginLeft: number } => ({
  left: `${(centre / INNER_W) * 100}%`,
  marginLeft: -COL_W / 2,
});

// header centre / value centre (values in POINTS DIFF sit right of the header)
const COLS = {
  played: { head: 131.5, value: 131.5 },
  won: { head: 172.5, value: 173 },
  lost: { head: 208.5, value: 207.5 },
  points: { head: 249, value: 248.5 },
  diff: { head: 303.5, value: 308.5 },
};

// Absolutely placed column, vertically centred in its row.
function Cell({ centre, style, children }: { centre: number; style: StyleProp<TextStyle>; children: string }) {
  return (
    <View style={[styles.col, at(centre)]}>
      <Text style={[styles.colText, style]}>{children}</Text>
    </View>
  );
}

function Row({ r }: { r: PointRow }) {
  const logo = TEAM_LOGOS[r.team];
  return (
    <View style={styles.row}>
      <View style={styles.posSlot}>
        <Text style={styles.pos}>{r.pos}</Text>
      </View>
      <View style={styles.logoSlot}>
        <Image source={logo.source} resizeMode="contain" style={{ width: 31 * logo.ratio, height: 31 }} />
      </View>
      <View style={styles.who}>
        <Text style={styles.player}>{r.players[0]}</Text>
        <Text style={styles.player}>{r.players[1]}</Text>
        <Text style={styles.teamName} numberOfLines={1}>
          {r.team}
        </Text>
      </View>
      <Cell centre={COLS.played.value} style={styles.value}>{`${r.played}`}</Cell>
      <Cell centre={COLS.won.value} style={[styles.value, { color: Colors.RATE_GREEN }]}>{`${r.won}`}</Cell>
      <Cell centre={COLS.lost.value} style={[styles.value, { color: Colors.BRAND_RED }]}>{`${r.lost}`}</Cell>
      <Cell centre={COLS.points.value} style={[styles.value, { color: Colors.GOLD_TEXT }]}>{`${r.points}`}</Cell>
      <Cell centre={COLS.diff.value} style={[styles.value, { color: Colors.RATE_GREEN }]}>
        {`${r.diff >= 0 ? '+' : ''}${r.diff}`}
      </Cell>
    </View>
  );
}

export default function PointTable({ rows }: { rows: PointRow[] }) {
  return (
    <Panel height={POINT_TABLE_HEIGHT} border={1} shade={false} style={styles.box}>
      <View style={styles.header}>
        <View style={styles.headLeft}>
          <Text style={[styles.head, styles.hash]}>#</Text>
          <Text style={styles.head}>TEAM / PLAYERS</Text>
        </View>
        <Cell centre={COLS.played.head} style={styles.head}>PLAYED</Cell>
        <Cell centre={COLS.won.head} style={styles.head}>WON</Cell>
        <Cell centre={COLS.lost.head} style={styles.head}>LOST</Cell>
        <Cell centre={COLS.points.head} style={styles.head}>POINTS</Cell>
        <Cell centre={COLS.diff.head} style={styles.head}>POINTS DIFF</Cell>
      </View>
      {rows.slice(0, 3).map((r) => (
        <View key={r.pos}>
          <View style={styles.divider} />
          <Row r={r} />
        </View>
      ))}
    </Panel>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: 1.2, marginHorizontal: 3.4 },
  header: { height: 19.5 },
  headLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 9 },
  head: { fontFamily: HomeFonts.semiBold, fontSize: 8.5, lineHeight: 11, letterSpacing: 0.6, color: Colors.WHITE },
  hash: { width: 16 },
  col: { position: 'absolute', top: 0, bottom: 0, width: COL_W, justifyContent: 'center' },
  colText: { textAlign: 'center' },

  divider: { height: 0.75, marginLeft: 7, marginRight: 5, backgroundColor: Colors.FIELD_BORDER },
  row: { height: ROW_H - 0.75 },
  posSlot: { position: 'absolute', left: 9, top: 0, bottom: 0, justifyContent: 'center' },
  pos: { fontFamily: HomeFonts.semiBold, fontSize: 8.5, lineHeight: 11, color: Colors.WHITE },
  logoSlot: { position: 'absolute', left: 23, top: 0, bottom: 0, width: 32, alignItems: 'center', justifyContent: 'center' },
  who: { position: 'absolute', left: 61, top: 4.25 },
  player: { fontFamily: HomeFonts.regular, fontSize: 9, lineHeight: 9.5, letterSpacing: 0.5, color: Colors.WHITE },
  teamName: { marginTop: 1.5, fontFamily: HomeFonts.semiCondensed, fontSize: 9.5, lineHeight: 11, letterSpacing: 0.3, color: Colors.FIELD_BORDER },
  value: { fontFamily: HomeFonts.semiBold, fontSize: 10, lineHeight: 12, letterSpacing: 0.4, color: Colors.WHITE, marginTop: 1 },
});
