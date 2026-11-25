import { ReactNode, useRef, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants';
import { COMPLETED_MATCHES, LIVE_MATCHES, POINT_TABLE, UPCOMING_MATCHES } from '../../../data/homeMock';
import Panel from '../Panel';
import SectionTitle, { Dot } from '../SectionTitle';
import MatchCard from './MatchCard';
import PointTable from './PointTable';
import UpcomingTable from './UpcomingTable';


export const ACCORDION_HEIGHT = 173;

type Page = { key: string; title: string; dot: string; link?: { text: string; color: string }; body: ReactNode };

const PAGES: Page[] = [
  {
    key: 'live',
    title: 'LIVE MATCHES',
    dot: Colors.BRAND_RED,
    link: { text: 'VIEW ALL', color: Colors.BRAND_RED },
    body: <Cards matches={LIVE_MATCHES} />,
  },
  {
    key: 'completed',
    title: 'COMPLETED MATCHES',
    dot: Colors.RATE_GREEN,
    link: { text: 'VIEW ALL', color: Colors.BRAND_RED },
    body: <Cards matches={COMPLETED_MATCHES} completed />,
  },
  {
    key: 'upcoming',
    title: 'UPCOMING MATCHES',
    dot: Colors.LINK_BLUE,
    body: <UpcomingTable matches={UPCOMING_MATCHES} />,
  },
  {
    key: 'points',
    title: 'POINT TABLE',
    dot: Colors.GOLD_TEXT,
    link: { text: 'VIEW FULL POINT TABLE', color: Colors.GOLD_TEXT },
    body: <PointTable rows={POINT_TABLE} />,
  },
];

function Cards({ matches, completed = false }: { matches: typeof LIVE_MATCHES; completed?: boolean }) {
  return (
    <View style={styles.cards}>
      {matches.slice(0, 2).map((m) => (
        <MatchCard key={m.id} m={m} completed={completed} />
      ))}
    </View>
  );
}

function PageView({ page, width }: { page: Page; width?: number }) {
  return (
    <View style={[styles.page, width ? { width } : styles.pageFill]}>
      <SectionTitle
        title={page.title}
        icon={<Dot color={page.dot} />}
        link={page.link?.text ?? null}
        linkColor={page.link?.color}
        style={styles.title}
      />
      {page.body}
    </View>
  );
}

export default function Accordion() {
  const scroller = useRef<ScrollView>(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (Math.abs(w - width) > 0.5) setWidth(w);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index && i >= 0 && i < PAGES.length) setIndex(i);
  };

  const goTo = (i: number) => {
    setIndex(i);
    scroller.current?.scrollTo({ x: i * width, animated: true });
  };

  return (
    <Panel height={ACCORDION_HEIGHT} shade={false} contentStyle={styles.content}>
      <View style={styles.viewport} onLayout={onLayout}>
        {width ? (
          <ScrollView
            ref={scroller}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {PAGES.map((p) => (
              <PageView key={p.key} page={p} width={width} />
            ))}
          </ScrollView>
        ) : (
          <PageView page={PAGES[0]} />
        )}
      </View>

      <View style={styles.dots}>
        {PAGES.map((p, i) => (
          <Pressable key={p.key} onPress={() => goTo(i)} hitSlop={4} accessibilityLabel={`Show ${p.title.toLowerCase()}`}>
            <View style={[styles.dot, { backgroundColor: i === index ? Colors.BRAND_RED : Colors.FIELD_BORDER }]} />
          </Pressable>
        ))}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  content: { overflow: 'hidden' },
  viewport: { flex: 1 },
  page: { height: '100%' },
  pageFill: { width: '100%' },
  title: { height: 16.6, paddingHorizontal: 7.8 },
  cards: { marginTop: 1.7, marginHorizontal: 4.8, gap: 11 },

  dots: { position: 'absolute', right: 6.3, bottom: 1.3, flexDirection: 'row', gap: 3.5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
