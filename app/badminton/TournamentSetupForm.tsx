import StyledButton from "@/components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
type Step = "setup" | "players" | "fixtures";

// Utility to generate a simple unique hash
const generateHash = (length: number = 8): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const TournamentSetupForm: React.FC = () => {
  const [step, setStep] = useState<Step>("setup");
  const [name, setName] = useState("");
  const [format, setFormat] = useState<TournamentFormat>("singles");
  const [numPlayers, setNumPlayers] = useState(2);
  const [errors, setErrors] = useState<{ name?: string; players?: string }>({});
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<"wpl" | "roundrobin">("wpl");
  const [showWPLDesc, setShowWPLDesc] = useState(false);
  const [showRRDesc, setShowRRDesc] = useState(false);

  const minPlayers = format === "doubles" ? 4 : 2;
  const playerStep = format === "doubles" ? 2 : 1;

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
      const tournamentId = `${name.trim().replace(/\s+/g, '_')}-${generateHash()}`;
      const tournamentData = {
        id: tournamentId,
        name: name.trim(),
        format,
        players: players.map(p => p.trim()), // Trim all player names before saving
        fixtureType: selectedFixture,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(tournamentId, JSON.stringify(tournamentData));
      
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Tournament Created!',
        text2: `${tournamentData.name} has been saved successfully.`,
        position: 'top',
        visibilityTime: 3000,
      });
      
      // Use Expo Router's push method
      router.push({
        pathname: '/badminton/TournamentPage',
        params: { tournamentData: JSON.stringify(tournamentData) }
      });
    } catch (error) {
      console.error("Error saving tournament:", error);
      setErrors({ players: "Failed to save tournament. Try again." });
      
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save tournament. Please try again.',
        position: 'top',
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
    const steps: Step[] = ["setup", "players", "fixtures"];
    return (
      <View style={styles.stepperContainer}>
        {steps.map((s, i) => (
          <View key={s} style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                (step === s || steps.indexOf(step) > i) && styles.activeStepCircle,
              ]}
            >
              <Text style={styles.stepNumber}>{i + 1}</Text>
            </View>
            {i !== steps.length - 1 && (
              <View
                style={[styles.stepLine, steps.indexOf(step) > i && styles.activeStepLine]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  /** Player Entry Step */
  if (step === "players") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

        {errors.players && <Text style={styles.errorText}>{errors.players}</Text>}

        <View style={styles.goButtonContainer}>
          <StyledButton title="GO" onPress={handleGoPlayers} />
        </View>
      </ScrollView>
    );
  }

  /** Fixture Selection Step */
  if (step === "fixtures") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {renderStepIndicator()}
        <Text style={styles.title}>Select Fixture Type</Text>

        {/* WPL Option */}
        <View style={styles.fixtureRow}>
          <TouchableOpacity
            style={[styles.fixtureOption, selectedFixture === "wpl" && styles.selectedFixture]}
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
            WPL style: Teams play in a league format with points-based standings. 
            Top teams advance to playoffs/eliminations.
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
            Round-robin: Every player/team competes against every other player/team. 
            Winner determined by total wins or points.
          </Text>
        )}

        {errors.players && <Text style={styles.errorText}>{errors.players}</Text>}

        <View style={styles.goButtonContainer}>
          <StyledButton title="GO" onPress={handleGoFixtures} />
        </View>
      </ScrollView>
    );
  }

  /** Setup Step */
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
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
            style={[styles.formatOption, format === type && styles.activeFormat]}
            onPress={() => {
              setFormat(type);
              // Adjust player count when switching formats
              if (type === "singles") {
                // If currently even (for doubles), keep it; otherwise keep as is
                setNumPlayers((prev) => prev);
              } else if (type === "doubles") {
                // Ensure even number for doubles
                setNumPlayers((prev) => prev % 2 === 0 ? prev : prev + 1);
              }
              setErrors({});
            }}
          >
            <Text
              style={[styles.formatText, format === type && styles.activeFormatText]}
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
});

export default TournamentSetupForm;