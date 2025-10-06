import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import SportSelection from "./SportSelection";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 5000);
  }, []);
  return (
    <ParallaxScrollView
      backgroundImage={require("../assets/images/app_background.svg")}
      winzzLogo={!loading}
    >
      {loading ? (
        <View style={styles.loaderContainer}>
          <Image
            source={require("../assets/images/winzz_logo.svg")}
            style={styles.logo}
            contentFit="cover"
            contentPosition="top center"
          />
          <ActivityIndicator
            size="large"
            color="#FF4C4C"
            style={styles.loader}
          />
        </View>
      ) : (
        <SportSelection />
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    aspectRatio: 498 / 142,
    alignSelf: "center",
    marginBottom: 16,
  },
  loader: {
    marginTop: 8,
    alignSelf: "center",
  },
});
