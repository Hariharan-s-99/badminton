import { Image } from "expo-image";
import type { PropsWithChildren } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
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
  ] as [string, string, ...string[]], // colors tuple
  locations: [0, 0.05, 0.1, 0.25, 0.4, 0.6, 0.75, 0.9, 1] as [
    number,
    number,
    ...number[]
  ], // locations tuple
};

type Props = PropsWithChildren<{
  backgroundImage?: any;
  overrideGradient?: boolean;
  winzzLogo?: boolean;
}>;

export default function ParallaxScrollView({
  children,
  backgroundImage,
  overrideGradient = false,
  winzzLogo = true,
}: Props) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.selectContent}
    >
      {/* <View style={styles.container}> */}
      {/* Fixed background image */}
      {backgroundImage && (
        <Image
          source={backgroundImage}
          style={styles.backgroundImageFixed}
          contentFit="cover"
          cachePolicy="memory-disk"
          onLoad={() => console.log("Background image loaded")}
          onError={(error) => console.log("Background image error:", error)}
        />
      )}

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {/* Content Area */}
        <View style={styles.content}>
          {winzzLogo && (
            <Image
              source={require("../assets/images/winzz_logo.svg")}
              style={styles.logo}
              contentFit="cover"
              contentPosition="top center"
            />
          )}
          {children}
        </View>
      </Animated.ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImageFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    opacity: 1,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    zIndex: 2, // Above background image
  },
  scrollViewContent: {
    flexGrow: 1, // Important: allows content to expand and be scrollable
    minHeight: SCREEN_HEIGHT, // Ensures minimum scrollable area
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60, // Safe area padding
    paddingBottom: 16,
    gap: 16,
    zIndex: 5, // Above the image so text is visible
    position: "relative",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
  },
  logo: {
    width: "100%",
    aspectRatio: 498 / 142,
    alignSelf: "center",
  },
  selectContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
});

// Export the blended gradient for reuse
export { BLENDED_WINZZ_GRADIENT };
