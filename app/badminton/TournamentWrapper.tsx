import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import CreateTournament from "./CreateTournament";

export default function TournamentScreen() {
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
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.TITLE_COLOR,
    textAlign: "center",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  content: {
    minHeight: 600,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
