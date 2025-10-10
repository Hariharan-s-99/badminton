import { Image } from "expo-image";
import type { PropsWithChildren } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");


type Props = PropsWithChildren<{
  backgroundImage?: any;
  overrideGradient?: boolean;
  winzzLogo?: boolean;
}>;

export default function ParallaxScrollView({
  children,
  backgroundImage,
  winzzLogo = true,
}: Props) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
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
    </View>
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
    zIndex: 2,
  },
  scrollViewContent: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 16,
    zIndex: 5,
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
});
