import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface Sport {
  id: string;
  name: string;
  emoji: string;
  gradient: [string, string];
}

const sports: Sport[] = [
  {
    id: "badminton",
    name: "Badminton",
    emoji: "🏸",
    gradient: ["#4A1419", "#8B0000"],
  },
  {
    id: "cricket",
    name: "Cricket",
    emoji: "🏏",
    gradient: ["#1A1A1A", "#2D2D2D"],
  },
  {
    id: "football",
    name: "Football",
    emoji: "⚽",
    gradient: ["#1A1A1A", "#2D2D2D"],
  },
  {
    id: "tennis",
    name: "Tennis",
    emoji: "🎾",
    gradient: ["#1A1A1A", "#2D2D2D"],
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    emoji: "🏓",
    gradient: ["#1A1A1A", "#2D2D2D"],
  },
];

export default function SportSelection() {
  const handleSportPress = (sport: Sport) => {
    if (sport.id === "badminton") {
      console.log(`Selected sport: ${sport.name}`);
      router.push("./badminton");
    } else {
      console.log(`${sport.name} is locked - Coming Soon!`);
    }
  };

  const isLocked = (sportId: string) => sportId !== "badminton";

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Pick Your Game
        </ThemedText>
        <View style={styles.divider} />
      </ThemedView>

      <View style={styles.sportsContainer}>
        {sports.map((sport, index) => (
          <TouchableOpacity
            key={sport.id}
            style={[
              styles.sportButton,
              { marginTop: index === 0 ? 0 : 12 },
              isLocked(sport.id) && styles.lockedButton,
            ]}
            onPress={() => handleSportPress(sport)}
            activeOpacity={isLocked(sport.id) ? 1 : 0.85}
            disabled={isLocked(sport.id)}
          >
            <LinearGradient
              colors={sport.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <View style={styles.buttonContent}>
                <Text
                  style={[
                    styles.emoji,
                    isLocked(sport.id) && styles.lockedEmoji,
                  ]}
                >
                  {sport.emoji}
                </Text>
                <Text
                  style={[
                    styles.sportName,
                    isLocked(sport.id) ? styles.lockedText : styles.activeText,
                  ]}
                >
                  {sport.name}
                </Text>
                <View
                  style={[
                    styles.arrow,
                    isLocked(sport.id)
                      ? styles.lockedArrow
                      : styles.activeArrow,
                  ]}
                >
                  <Text
                    style={[
                      styles.arrowText,
                      isLocked(sport.id)
                        ? styles.lockedArrowText
                        : styles.activeArrowText,
                    ]}
                  >
                    {isLocked(sport.id) ? "🔒" : "→"}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>More sports coming soon!</Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 24,
  },
  logo: {
    width: "100%",
    aspectRatio: 498 / 142,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: {
    textAlign: "center",
    color: "#E8E8E8",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  divider: {
    width: 80,
    height: 4,
    backgroundColor: "#8B0000",
    borderRadius: 2,
  },
  sportsContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  sportButton: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emoji: {
    fontSize: 36,
    marginRight: 16,
  },
  lockedEmoji: {
    opacity: 0.4,
  },
  sportName: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#E8E8E8",
    opacity: 0.6,
    fontWeight: "500",
  },
  // --- ACTIVE (UNLOCKED) STYLES ---
  activeText: {
    color: "#E8E8E8",
  },
  activeArrow: {
    backgroundColor: "rgba(232, 232, 232, 0.15)",
  },
  activeArrowText: {
    color: "#E8E8E8",
  },
  // --- LOCKED STYLES ---
  lockedButton: {
    opacity: 0.6,
  },
  lockedText: {
    color: "#6B6B6B",
  },
  lockedArrow: {
    backgroundColor: "rgba(232, 232, 232, 0.05)",
  },
  lockedArrowText: {
    color: "#6B6B6B",
    fontSize: 16,
  },
});
