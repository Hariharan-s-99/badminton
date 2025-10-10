import ParallaxScrollView from "@/components/parallax-scroll-view";
import StyledButton from "@/components/StyledButton";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  TEXT_PRIMARY: "#E8E8E8",
  BUTTON_PRIMARY: "rgba(180, 131, 131, 0.26)",
  BUTTON_SECONDARY: "rgba(99, 7, 7, 0.26)",
  BACK_ICON_BACKGROUND: "rgba(122, 8, 8, 0.4)",
};

export default function BadmintonScreen() {
  const insets = useSafeAreaInsets();

  const handleOrganizeTournament = () => {
    router.push("/badminton/TournamentWrapper");
  };

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        winzzLogo={true}
        backgroundImage={require("../assets/images/badmintonBack.svg")}
      >
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to Badminton!</Text>
          <Text style={styles.description}>
            Get ready to play the fastest racket sport in the world
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonContainer}>
            <StyledButton title="GO" onPress={handleOrganizeTournament} />
          </View>
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    minHeight: 600,
  },
  welcomeText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    textAlign: "center",
    opacity: 0.9,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    right: 20,
    zIndex: 10,
  },
  primaryButton: {
    backgroundColor: "transparent",
    padding: 0,
  },
  secondaryButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
  },
});
