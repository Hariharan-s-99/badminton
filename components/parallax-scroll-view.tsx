import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// ✨ BRIGHTER & REDDER Blended gradient
// Defined as a tuple to satisfy TypeScript
const BLENDED_WINZZ_GRADIENT = {
  colors: [
    "#C83C48",
    "#AF333D",
    "#962A33",
    "#7D212A",
    "#641720",
    "#4B0E16",
    "#32070D",
    "#190305",
    "#000000",
  ] as [string, string, ...string[]],  // colors tuple
  locations: [
    0, 0.05, 0.1, 0.25, 0.4, 0.6, 0.75, 0.9, 1,
  ] as [number, number, ...number[]],    // locations tuple
};

// Header gradient (first part of blended gradient)
const HEADER_GRADIENT = {
  colors: BLENDED_WINZZ_GRADIENT.colors.slice(0, 3) as [string, string, ...string[]],
  locations: [0, 0.5, 1] as [number, number, number],
};

// Header height (10% of screen height)
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.1;

type Props = PropsWithChildren<{}>;

export default function ParallaxScrollView({ children }: Props) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          "clamp"
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [2, 1, 1],
          "clamp"
        ),
      },
    ],
  }));

  return (
    <Animated.ScrollView
      style={styles.scrollView}
      scrollEventThrottle={16}
      onScroll={scrollHandler}
      showsVerticalScrollIndicator={false}
    >
      {/* Main background with **brighter, redder** blended gradient */}
      <LinearGradient
        colors={BLENDED_WINZZ_GRADIENT.colors}
        locations={BLENDED_WINZZ_GRADIENT.locations}
        style={styles.gradientBackground}
      >
        {/* Parallax Header */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <LinearGradient
            colors={HEADER_GRADIENT.colors}
            locations={HEADER_GRADIENT.locations}
            style={styles.headerFill}
          />
        </Animated.View>

        {/* Spacer to push content below header */}
        <View style={styles.headerSpacer} />

        {/* Content Area */}
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  gradientBackground: {
    width: SCREEN_WIDTH,
    minHeight: SCREEN_HEIGHT,
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    width: SCREEN_WIDTH,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
  },
  headerFill: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerSpacer: {
    height: HEADER_HEIGHT,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: "transparent",
  },
});

// Export the blended gradient for reuse
export { BLENDED_WINZZ_GRADIENT };
