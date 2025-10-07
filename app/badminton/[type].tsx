import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import CreateTournament from "./CreateTournament";

// Dark Red Theme Colors
const COLORS = {
  BACKGROUND: "#1A0505",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#B89090",
  PRIMARY: "#8B0000",
  ACCENT: "#FF6B6B",
  CARD_BG: "rgba(139, 0, 0, 0.25)",
  BORDER: "rgba(139, 0, 0, 0.4)",
};

export default function TournamentScreen() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen
        options={{ title: "Tournament Fixtures", headerShown: false }}
      />
      <ParallaxScrollView
        winzzLogo={true}
        backgroundImage={require("../../assets/images/badmintonBack.svg")}
      >
        <View style={styles.content}>
          <CreateTournament />
        </View>
      </ParallaxScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "center",
    position: "relative",
  },
  headerContent: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 60,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    textShadowColor: "rgba(139, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    marginTop: 4,
  },
  backIcon: {
    position: "absolute",
    left: 16,
    top: 10,
    zIndex: 20,
  },
  backIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  backIconText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: -2,
  },
  content: {
    minHeight: 600,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
