import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, HomeFonts } from '../constants';
import GradientBorder from './home/GradientBorder';

type Item = {
  route: string;
  label: string;
  icon: ImageSourcePropType;
  width: number;
  height: number;
  top: number;
  center: number;
};

// Measured on the 360x740 reference (bar 349x57, 5px side margin). `center`
// is a fraction of the bar's inner width; `top` is from the bar's top edge.
const ITEMS: Item[] = [
  { route: 'home', label: 'HOME', icon: require('../assets/home/nav-home.png'), width: 24.5, height: 24.5, top: 11, center: 0.0939 },
  { route: 'players', label: 'PLAYERS', icon: require('../assets/home/nav-players.png'), width: 31.5, height: 26.6, top: 8.5, center: 0.2722 },
  { route: 'matches', label: 'MATCHES', icon: require('../assets/home/court.png'), width: 33, height: 24.4, top: 10.5, center: 0.7299 },
  { route: 'more', label: 'MORE', icon: require('../assets/home/nav-more.png'), width: 28.5, height: 7.4, top: 22.5, center: 0.8977 },
];

const ITEM_W = 64;

type Props = BottomTabBarProps & { onCenterPress?: () => void };

export default function BottomNavBar({ state, navigation, onCenterPress }: Props) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name;

  const press = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (activeRoute !== name && !event.defaultPrevented) navigation.navigate(name);
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 7) }]}>
      <GradientBorder radius={8} width={0.9} style={styles.bar} innerStyle={styles.barInner}>
        {ITEMS.map((item) => {
          const focused = activeRoute === item.route;
          return (
            <Pressable
              key={item.route}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: focused }}
              onPress={() => press(item.route)}
              style={[styles.item, { left: `${item.center * 100}%`, marginLeft: -ITEM_W / 2 }]}
            >
              <Image
                source={item.icon}
                style={[styles.icon, { width: item.width, height: item.height, top: item.top }]}
              />
              <Text style={[styles.label, { color: focused ? Colors.BRAND_RED : Colors.NAV_LABEL }]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </GradientBorder>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="New match"
        onPress={onCenterPress}
        style={styles.center}
      >
        <Image source={require('../assets/home/nav-shuttle.png')} style={styles.centerImg} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center', paddingHorizontal: 5, paddingTop: 6 },
  bar: { width: '100%', maxWidth: 480, height: 57 },
  barInner: { flex: 1 },
  item: { position: 'absolute', top: 0, bottom: 0, width: ITEM_W, alignItems: 'center' },
  icon: { position: 'absolute' },
  label: {
    position: 'absolute',
    top: 36,
    fontFamily: HomeFonts.semiCondensed,
    fontSize: 13.5,
    lineHeight: 17,
    letterSpacing: 0.675,
  },
  center: { position: 'absolute', top: 0, alignSelf: 'center', width: 60, height: 60 },
  centerImg: { width: 60, height: 60 },
});
