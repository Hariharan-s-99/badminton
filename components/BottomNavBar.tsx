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

const ITEMS: Item[] = [
  { route: 'home', label: 'HOME', icon: require('../assets/home/nav-home.png'), width: 28.75, height: 28.75, top: 13, center: 0.099 },
  { route: 'players', label: 'PLAYERS', icon: require('../assets/home/nav-players.png'), width: 35.5, height: 30, top: 12, center: 0.287 },
  { route: 'matches', label: 'MATCHES', icon: require('../assets/home/court.png'), width: 38.5, height: 28.5, top: 13.5, center: 0.718 },
  { route: 'more', label: 'MORE', icon: require('../assets/home/nav-more.png'), width: 38.5, height: 10, top: 25.5, center: 0.887 },
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
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 6) }]}>
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
  wrap: { width: '100%', alignItems: 'center', paddingHorizontal: 8, paddingTop: 7 },
  bar: { width: '100%', maxWidth: 480, height: 67 },
  barInner: { flex: 1 },
  item: { position: 'absolute', top: 0, bottom: 0, width: ITEM_W, alignItems: 'center' },
  icon: { position: 'absolute' },
  label: {
    position: 'absolute',
    top: 42,
    fontFamily: HomeFonts.semiCondensed,
    fontSize: 13.5,
    lineHeight: 17,
    letterSpacing: 0.675,
  },
  center: { position: 'absolute', top: 3.5, alignSelf: 'center', width: 66, height: 66 },
  centerImg: { width: 66, height: 66 },
});
