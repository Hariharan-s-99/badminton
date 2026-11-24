import { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors, HomeFonts } from '../../constants';
import { PERFORMANCE } from '../../data/homeMock';
import Panel from './Panel';
import SectionTitle from './SectionTitle';

export const PERFORMANCE_HEIGHT = 91;

type StatProps = { icon: ReactNode; label: string; value: string; color: string; sub: string };

function Stat({ icon, label, value, color, sub }: StatProps) {
  return (
    <Panel style={styles.tile} border={0.75} radius={6} contentStyle={styles.tileContent}>
      <View style={styles.tileTop}>
        {icon}
        <View style={styles.tileText}>
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
          <Text style={[styles.value, { color }]}>{value}</Text>
        </View>
      </View>
      <Text style={styles.sub}>{sub}</Text>
    </Panel>
  );
}

const icon = (source: number, rotate = 0) => (
  <Image source={source} style={[styles.icon, rotate ? { transform: [{ rotate: `${rotate}deg` }] } : null]} />
);

export default function PerformancePanel() {
  const p = PERFORMANCE;
  return (
    <Panel height={PERFORMANCE_HEIGHT} contentStyle={styles.content}>
      <SectionTitle title="MY PERFORMANCE" />
      <View style={styles.tiles}>
        <Stat icon={icon(require('../../assets/home/shield.png'))} label="RANK" value={`#${p.rank}`} color={Colors.WHITE} sub={`Out of ${p.outOf} Players`} />
        <Stat icon={icon(require('../../assets/home/target.png'))} label="WIN RATE" value={`${p.winRate}%`} color={Colors.BRAND_RED} sub={`Top ${p.topPercent}% Players`} />
        <Stat icon={icon(require('../../assets/home/shuttlecock.png'), 35)} label="MATCHES" value={`${p.matches}`} color={Colors.STAT_GREEN} sub="Total Played" />
        <Stat icon={icon(require('../../assets/home/fire.png'))} label="WIN STREAK" value={`+${p.streak}`} color={Colors.STREAK_ORANGE} sub="Keep it up!" />
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 5, paddingTop: 3, paddingBottom: 6 },
  tiles: { flex: 1, flexDirection: 'row', gap: 5, marginTop: 2 },
  tile: { flex: 1 },
  tileContent: { justifyContent: 'center', paddingHorizontal: 3 },
  tileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { width: 23, height: 23 },
  tileText: { marginLeft: 2, alignItems: 'center', flexShrink: 1 },
  label: { fontFamily: HomeFonts.semiCondensed, fontSize: 9.5, lineHeight: 11, color: Colors.WHITE, letterSpacing: 0.2 },
  value: { fontFamily: HomeFonts.semiCondensed, fontSize: 19, lineHeight: 22, letterSpacing: 0.8 },
  sub: { marginTop: 3, textAlign: 'center', fontFamily: HomeFonts.semiCondensed, fontSize: 7, color: Colors.WHITE, letterSpacing: 0.3 },
});
