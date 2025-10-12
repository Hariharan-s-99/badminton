import { Image } from "expo-image";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { Dimensions, Platform, StatusBar, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Platform.select({
      android: Dimensions.get("screen").height,
      default: Dimensions.get("window").height,
    }),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window, screen }) => {
      setDimensions({
        width: window.width,
        height: Platform.select({
          android: screen.height,
          default: window.height,
        }),
      });
    });

    return () => subscription?.remove();
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Calculate the actual usable height
  const contentMinHeight = Platform.select({
    android: dimensions.height - (StatusBar.currentHeight || 0),
    default: dimensions.height,
  });

  return (
    <View style={styles.container}>
      {backgroundImage && (
        <Image
          source={backgroundImage}
          style={[
            styles.backgroundImageFixed,
            {
              width: dimensions.width,
              height: dimensions.height + insets.top,
              top: -insets.top,
            }
          ]}
          contentFit="cover"
          cachePolicy="memory-disk"
          onLoad={() => console.log("Background image loaded")}
          onError={(error) => console.log("Background image error:", error)}
        />
      )}

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { 
            minHeight: contentMinHeight,
          }
        ]}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
      >
        <View style={[
          styles.content,
          { 
            paddingTop: Math.max(insets.top + 20, 60),
            paddingBottom: Math.max(insets.bottom + 16, 32),
            minHeight: contentMinHeight - 40,
          }
        ]}>
          {winzzLogo && (
            <Image
              source={require("../assets/images/winzz_logo.svg")}
              style={styles.logo}
              contentFit="contain"
              contentPosition="top center"
            />
          )}
          <View style={styles.childrenContainer}>
            {children}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImageFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 1,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
    zIndex: 5,
    position: "relative",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
  },
  childrenContainer: {
    flex: 1,
    gap: 16,
  },
  logo: {
    width: "100%",
    aspectRatio: 498 / 142,
    alignSelf: "center",
  },
});