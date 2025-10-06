import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const COLORS = {
  BACKGROUND: "#1A0505",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#B89090",
  CARD_BG: "rgba(139, 0, 0, 0.15)",
  BORDER: "rgba(139, 0, 0, 0.5)",
  ACCENT: "#FF6B6B",
};

interface TournamentData {
  id: string;
  name: string;
  format: "singles" | "doubles";
  players: string[];
  fixtureType: "wpl" | "roundrobin";
  createdAt?: string;
}

const TournamentPage: React.FC = () => {
  const params = useLocalSearchParams();
  
  // Parse tournament data from params
  const tournament: TournamentData | null = params.tournamentData 
    ? JSON.parse(params.tournamentData as string) 
    : null;

  // Ensure tournament data exists
  if (!tournament) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Tournament Details" }} />
        <View style={styles.content}>
          <Text style={styles.errorText}>Tournament data not found</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: tournament.name }} />
      
      <Text style={styles.title}>{tournament.name}</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Tournament ID:</Text>
        <Text style={styles.infoText}>{tournament.id}</Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Format:</Text>
        <Text style={styles.infoText}>
          {tournament.format.charAt(0).toUpperCase() + tournament.format.slice(1)}
        </Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Fixture Type:</Text>
        <Text style={styles.infoText}>
          {tournament.fixtureType === "wpl" ? "WPL Style" : "Round-robin"}
        </Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Players ({tournament.players?.length || 0}):</Text>
        {tournament.players && tournament.players.length > 0 ? (
          tournament.players.map((player: string, index: number) => (
            <Text key={`player-${index}`} style={styles.infoText}>
              {index + 1}. {player}
            </Text>
          ))
        ) : (
          <Text style={styles.infoText}>No players added</Text>
        )}
      </View>

      {tournament.createdAt && (
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Created:</Text>
          <Text style={styles.infoText}>
            {new Date(tournament.createdAt).toLocaleDateString()} at{" "}
            {new Date(tournament.createdAt).toLocaleTimeString()}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "ConcertOne_400Regular",
    marginBottom: 24,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.ACCENT,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.ACCENT,
    textAlign: "center",
  },
});

export default TournamentPage;