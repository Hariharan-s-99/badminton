import StyledButton from "@/components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const COLORS = {
  BACKGROUND: "#1A0505",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#B89090",
  CARD_BG: "rgba(139, 0, 0, 0.15)",
  INPUT_BG: "rgba(0, 0, 0, 0.3)",
  BORDER: "rgba(139, 0, 0, 0.5)",
  ACCENT: "#FF6B6B",
  PRIMARY: "#8B0000",
  ERROR: "#FF4D4D",
  LIGHT_BG: "rgba(255, 255, 255, 0.08)",
};

type TournamentFormat = "singles" | "doubles";
type Step = "select" | "setup" | "players" | "fixtures";

interface SavedTournament {
  id: string;
  name: string;
  format: TournamentFormat;
  players: string[];
  fixtureType: "wpl" | "roundrobin";
  createdAt: string;
  isComplete?: boolean;
}

// Utility to generate a simple unique hash
const generateHash = (length: number = 8): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const TournamentSetupForm: React.FC = () => {
  const [step, setStep] = useState<Step>("select");
  const [name, setName] = useState("");
  const [format, setFormat] = useState<TournamentFormat>("singles");
  const [numPlayers, setNumPlayers] = useState(2);
  const [errors, setErrors] = useState<{ name?: string; players?: string }>({});
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<"wpl" | "roundrobin">(
    "wpl"
  );
  const [showWPLDesc, setShowWPLDesc] = useState(false);
  const [showRRDesc, setShowRRDesc] = useState(false);
  const [savedTournaments, setSavedTournaments] = useState<SavedTournament[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | null
  >(null);

  const minPlayers = format === "doubles" ? 4 : 2;
  const playerStep = format === "doubles" ? 2 : 1;

  // Load saved tournaments on mount
  useEffect(() => {
    loadSavedTournaments();
  }, []);

  const loadSavedTournaments = async () => {
    try {
      setLoading(true);
      const keys = await AsyncStorage.getAllKeys();
      const tournamentKeys = keys.filter(
        (key) => key.includes("-") && key.length > 10
      );

      const tournaments: SavedTournament[] = [];
      for (const key of tournamentKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const tournament = JSON.parse(data);
          // Only show incomplete tournaments
          if (!tournament.isComplete) {
            tournaments.push(tournament);
          }
        }
      }

      // Sort by most recent
      tournaments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setSavedTournaments(tournaments);
    } catch (error) {
      console.error("Error loading tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTournament = (tournament: SavedTournament) => {
    setSelectedTournamentId(tournament.id);
    setName(tournament.name);
    setFormat(tournament.format);
    setPlayers(tournament.players);
    setNumPlayers(tournament.players.length);
    setSelectedFixture(tournament.fixtureType);

    Toast.show({
      type: "info",
      text1: "Tournament Loaded",
      text2: `Continue with ${tournament.name}`,
      position: "top",
      visibilityTime: 2000,
    });

    // Navigate to TournamentPage
    router.push({
      pathname: "/badminton/TournamentFixtures",
      params: { tournamentData: JSON.stringify(tournament) },
    });
  };

  const deleteTournament = async (tournamentId: string) => {
    try {
      await AsyncStorage.removeItem(tournamentId);
      setSavedTournaments((prev) => prev.filter((t) => t.id !== tournamentId));

      Toast.show({
        type: "success",
        text1: "Deleted",
        text2: "Tournament removed successfully",
        position: "top",
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error("Error deleting tournament:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete tournament",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  /** Validation for tournament name and number of players */
  const validateSetup = () => {
    const newErrors: { name?: string; players?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Tournament name cannot be empty.";
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (numPlayers < minPlayers) {
      newErrors.players = `Minimum ${minPlayers} players required for ${format}.`;
    } else if (format === "doubles" && numPlayers % 2 !== 0) {
      newErrors.players = "Number of players must be even for doubles.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Validation for players (unique & filled) */
  const validatePlayers = () => {
    const trimmed = players.map((p) => p.trim());
    const hasEmpty = trimmed.some((p) => !p);
    const hasDuplicate = new Set(trimmed).size !== trimmed.length;

    if (hasEmpty) {
      setErrors({ players: "All player names must be filled." });
      return false;
    }
    if (hasDuplicate) {
      setErrors({ players: "All player names must be unique." });
      return false;
    }

    setErrors({});
    return true;
  };

  /** Save tournament and navigate */
  const saveTournament = async () => {
    try {
      const tournamentId = `${name
        .trim()
        .replace(/\s+/g, "_")}-${generateHash()}`;
      const tournamentData = {
        id: tournamentId,
        name: name.trim(),
        format,
        players: players.map((p) => p.trim()), // Trim all player names before saving
        fixtureType: selectedFixture,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(tournamentId, JSON.stringify(tournamentData));

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Tournament Created!",
        text2: `${tournamentData.name} has been saved successfully.`,
        position: "top",
        visibilityTime: 3000,
      });

      // Use Expo Router's push method
      router.push({
        pathname: "/badminton/TournamentFixtures",
        params: { tournamentData: JSON.stringify(tournamentData) },
      });
    } catch (error) {
      console.error("Error saving tournament:", error);
      setErrors({ players: "Failed to save tournament. Try again." });

      // Show error toast
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save tournament. Please try again.",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  /** Step navigation */
  const handleGoSetup = () => {
    if (!validateSetup()) return;
    setPlayers(Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`));
    setStep("players");
  };

  const handleGoPlayers = () => {
    if (!validatePlayers()) return;
    setStep("fixtures");
  };

  const handleGoFixtures = () => {
    saveTournament();
  };

  const handleIncrement = () => setNumPlayers((prev) => prev + playerStep);
  const handleDecrement = () =>
    setNumPlayers((prev) => Math.max(minPlayers, prev - playerStep));

  /** Step Indicator */
  const renderStepIndicator = () => {
    const steps: Step[] = ["select", "setup", "players", "fixtures"];
    const currentIndex = steps.indexOf(step);

    return (
      <View style={styles.stepperContainer}>
        {steps.slice(1).map((s, i) => (
          <View key={s} style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                (step === s || currentIndex > i + 1) && styles.activeStepCircle,
              ]}
            >
              <Text style={styles.stepNumber}>{i + 1}</Text>
            </View>
            {i !== steps.length - 2 && (
              <View
                style={[
                  styles.stepLine,
                  currentIndex > i + 1 && styles.activeStepLine,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  /** Select Tournament Step */
  if (step === "select") {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tournaments</Text>
        <Text style={styles.subtitle}>Continue or create a new tournament</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.ACCENT} />
            <Text style={styles.loadingText}>Loading tournaments...</Text>
          </View>
        ) : (
          <>
            {/* Saved Tournaments */}
            {savedTournaments.length > 0 && (
              <View style={styles.savedSection}>
                <Text style={styles.sectionTitle}>Incomplete Tournaments</Text>
                {savedTournaments.map((tournament) => (
                  <View key={tournament.id} style={styles.tournamentCard}>
                    <TouchableOpacity
                      style={styles.tournamentInfo}
                      onPress={() => loadTournament(tournament)}
                    >
                      <View style={styles.tournamentHeader}>
                        <Text style={styles.tournamentName}>
                          {tournament.name}
                        </Text>
                        <Text style={styles.tournamentDate}>
                          {new Date(tournament.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.tournamentDetails}>
                        <Text style={styles.tournamentMeta}>
                          {tournament.format.charAt(0).toUpperCase() +
                            tournament.format.slice(1)}{" "}
                          • {tournament.players.length} players
                        </Text>
                        <Text style={styles.tournamentMeta}>
                          {tournament.fixtureType === "wpl"
                            ? "WPL Style"
                            : "Round-robin"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteTournament(tournament.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={COLORS.ERROR}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Create New Button */}
            <TouchableOpacity
              style={styles.createNewButton}
              onPress={() => setStep("setup")}
            >
              <Ionicons
                name="add-circle-outline"
                size={32}
                color={COLORS.ACCENT}
              />
              <Text style={styles.createNewText}>Create New Tournament</Text>
            </TouchableOpacity>

            {savedTournaments.length === 0 && (
              <Text style={styles.emptyText}>
                No incomplete tournaments. Start by creating a new one!
              </Text>
            )}
          </>
        )}
      </ScrollView>
    );
  }

  /** Player Entry Step */
  if (step === "players") {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStepIndicator()}
        <Text style={styles.title}>Edit Player Names</Text>

        {players.map((player, idx) => (
          <TextInput
            key={idx}
            style={styles.playerInput}
            placeholder={`Player ${idx + 1}`}
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={player}
            onChangeText={(text) => {
              const newPlayers = [...players];
              newPlayers[idx] = text;
              setPlayers(newPlayers);
              // Clear error when user starts typing
              if (errors.players) {
                setErrors({});
              }
            }}
          />
        ))}

        {errors.players && (
          <Text style={styles.errorText}>{errors.players}</Text>
        )}

        <View style={styles.goButtonContainer}>
          <StyledButton title="GO" onPress={handleGoPlayers} />
        </View>
      </ScrollView>
    );
  }

  /** Fixture Selection Step */
  if (step === "fixtures") {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStepIndicator()}
        <Text style={styles.title}>Select Fixture Type</Text>

        {/* WPL Option */}
        <View style={styles.fixtureRow}>
          <TouchableOpacity
            style={[
              styles.fixtureOption,
              selectedFixture === "wpl" && styles.selectedFixture,
            ]}
            onPress={() => setSelectedFixture("wpl")}
          >
            <Text style={styles.fixtureText}>WPL Style</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoIcon}
            onPress={() => setShowWPLDesc((prev) => !prev)}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={COLORS.TEXT_SECONDARY}
            />
          </TouchableOpacity>
        </View>
        {showWPLDesc && (
          <Text style={styles.fixtureDesc}>
            WPL style: Teams play in a league format with points-based
            standings. Top teams advance to playoffs/eliminations.
          </Text>
        )}

        {/* Round-robin Option */}
        <View style={styles.fixtureRow}>
          <TouchableOpacity
            style={[
              styles.fixtureOption,
              selectedFixture === "roundrobin" && styles.selectedFixture,
            ]}
            onPress={() => setSelectedFixture("roundrobin")}
          >
            <Text style={styles.fixtureText}>Round-robin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoIcon}
            onPress={() => setShowRRDesc((prev) => !prev)}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={COLORS.TEXT_SECONDARY}
            />
          </TouchableOpacity>
        </View>
        {showRRDesc && (
          <Text style={styles.fixtureDesc}>
            Round-robin: Every player/team competes against every other
            player/team. Winner determined by total wins or points.
          </Text>
        )}

        {errors.players && (
          <Text style={styles.errorText}>{errors.players}</Text>
        )}

        <View style={styles.goButtonContainer}>
          <StyledButton title="GO" onPress={handleGoFixtures} />
        </View>
      </ScrollView>
    );
  }

  /** Setup Step */
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {renderStepIndicator()}
      <Text style={styles.title}>Create Tournament</Text>

      {/* Tournament Name */}
      <TextInput
        style={[styles.input, errors.name ? { borderColor: COLORS.ERROR } : {}]}
        placeholder="Tournament Name"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
        }}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/* Format Selector */}
      <View style={styles.formatContainer}>
        {(["singles", "doubles"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.formatOption,
              format === type && styles.activeFormat,
            ]}
            onPress={() => {
              setFormat(type);
              // Adjust player count when switching formats
              if (type === "singles") {
                // If currently even (for doubles), keep it; otherwise keep as is
                setNumPlayers((prev) => prev);
              } else if (type === "doubles") {
                // Ensure even number for doubles
                setNumPlayers((prev) => (prev % 2 === 0 ? prev : prev + 1));
              }
              setErrors({});
            }}
          >
            <Text
              style={[
                styles.formatText,
                format === type && styles.activeFormatText,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Player Stepper */}
      <View style={styles.stepper}>
        <TouchableOpacity onPress={handleDecrement} style={styles.circleButton}>
          <Text style={styles.circleText}>−</Text>
        </TouchableOpacity>

        <View style={styles.stepperCountBox}>
          <Text style={styles.playerCount}>{numPlayers}</Text>
          <Text style={styles.playerLabel}>players</Text>
        </View>

        <TouchableOpacity onPress={handleIncrement} style={styles.circleButton}>
          <Text style={styles.circleText}>+</Text>
        </TouchableOpacity>
      </View>
      {errors.players && <Text style={styles.errorText}>{errors.players}</Text>}

      <View style={styles.goButtonContainer}>
        <StyledButton title="GO" onPress={handleGoSetup} />
      </View>
    </ScrollView>
  );
};

/** Styles */
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "ConcertOne_400Regular",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.INPUT_BG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
  },
  formatContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginBottom: 20,
  },
  formatOption: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    backgroundColor: COLORS.LIGHT_BG,
    alignItems: "center",
  },
  activeFormat: { backgroundColor: COLORS.PRIMARY, borderColor: COLORS.ACCENT },
  formatText: { fontSize: 18, fontWeight: "600", color: COLORS.TEXT_SECONDARY },
  activeFormatText: { color: COLORS.TEXT_PRIMARY },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
  },
  circleText: {
    fontSize: 32,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "bold",
    lineHeight: 32,
  },
  stepperCountBox: {
    alignItems: "center",
    marginHorizontal: 32,
  },
  playerCount: {
    fontSize: 38,
    fontWeight: "bold",
    color: COLORS.ACCENT,
  },
  playerLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  goButtonContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 14,
    textAlign: "center",
    marginVertical: 6,
  },
  playerInput: {
    padding: 4,
    fontSize: 30,
    fontFamily: "ConcertOne_400Regular",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  stepContainer: { flexDirection: "row", alignItems: "center" },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.LIGHT_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  activeStepCircle: { backgroundColor: COLORS.PRIMARY },
  stepNumber: { color: COLORS.TEXT_PRIMARY, fontWeight: "bold" },
  stepLine: { width: 40, height: 2, backgroundColor: COLORS.LIGHT_BG },
  activeStepLine: { backgroundColor: COLORS.ACCENT },
  fixtureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  fixtureOption: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.LIGHT_BG,
    alignItems: "center",
    marginRight: 10,
  },
  selectedFixture: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
  },
  fixtureText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
  },
  infoIcon: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  fixtureDesc: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  // Selection Step Styles
  selectContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 16,
    marginTop: 12,
  },
  savedSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.ACCENT,
    marginBottom: 16,
  },
  tournamentCard: {
    flexDirection: "row",
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: 12,
    overflow: "hidden",
  },
  tournamentInfo: {
    flex: 1,
    padding: 16,
  },
  tournamentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  tournamentDate: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 8,
  },
  tournamentDetails: {
    gap: 4,
  },
  tournamentMeta: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 77, 77, 0.1)",
  },
  createNewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.ACCENT,
    borderStyle: "dashed",
    padding: 20,
    gap: 12,
  },
  createNewText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.ACCENT,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  scrollView: {
    flex: 1,
  },
});

export default TournamentSetupForm;
