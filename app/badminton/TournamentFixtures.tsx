import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Color constants
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
  ACTIVE_TAB: "#FF9E9E",
  COMPLETED_CARD: "rgba(139, 0, 0, 0.3)",
  SUCCESS: "#4CAF50",
  GOLD: '#FFD700',
  SILVER: '#C0C0C0',
  BRONZE: '#CD7F32',
};

// Interfaces
interface TournamentData {
  id: string;
  name: string;
  format: "singles" | "doubles";
  players: string[]; // List of actual player names
  fixtureType: "wpl" | "roundrobin";
  createdAt?: string;
}

interface Match {
  id: string;
  teamA: string; // Team name
  teamB: string; // Team name
  scoreA: number | null;
  scoreB: number | null;
  completed: boolean;
}

interface TeamDetail {
  teamName: string;
  players: string[];
}

type Tab = "fixtures" | "points" | "teams";

const TEAM_NAMES = [
  "Net Ninjas",
  "PowerShuttlers",
  "Smash Assassins",
  "Net Warriors",
  "Smash Lords",
  "FireFeathers",
  "Titans",
  "Falcons",
  "Quantum Smashers",
  "Falcon Smashers",
  "ThunderShuttler",
  "ShuttlerWarriors",
  "Ace kings",
  "Kinght rider",
  "Hot Shots",
];

// Fisher-Yates shuffle algorithm for better randomization
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const TournamentPage: React.FC = () => {
  const params = useLocalSearchParams<{ tournamentData?: string, id: string }>();
  const navigation = useNavigation<NavigationProp<any>>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("fixtures");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse tournament data with validation
  const tournament: TournamentData | null = useMemo(() => {
    if (params.tournamentData) {
      try {
        const parsedTournament = JSON.parse(params.tournamentData);
        if (!parsedTournament?.players?.length) {
          throw new Error("No players provided in tournament data");
        }
        return parsedTournament;
      } catch (e) {
        setError("Invalid tournament data. Please try again.");
        return null;
      }
    }
    return null;
  }, [params.tournamentData]);

  // Generate shuffled team details
  const teamDetails: TeamDetail[] = useMemo(() => {
    if (!tournament) return [];

    if (tournament.format === "singles") {
      // For singles, each player is their own team with a team name
      const shuffledPlayers = shuffleArray(tournament.players);
      const availableTeamNames = shuffleArray([...TEAM_NAMES]);
      
      return shuffledPlayers.map((player, index) => ({
        teamName: availableTeamNames[index] || `Team ${index + 1}`,
        players: [player],
      }));
    } else {
      // For doubles, shuffle players and pair them up
      const shuffledPlayers = shuffleArray(tournament.players);
      const teams: TeamDetail[] = [];
      const availableTeamNames = shuffleArray([...TEAM_NAMES]);
      
      // Create pairs of players
      for (let i = 0; i < shuffledPlayers.length; i += 2) {
        if (i + 1 < shuffledPlayers.length) {
          teams.push({
            teamName: availableTeamNames[teams.length] || `Team ${teams.length + 1}`,
            players: [shuffledPlayers[i], shuffledPlayers[i + 1]],
          });
        } else {
          // If odd number of players, last player gets a team alone
          teams.push({
            teamName: availableTeamNames[teams.length] || `Team ${teams.length + 1}`,
            players: [shuffledPlayers[i]],
          });
        }
      }
      
      return teams;
    }
  }, [tournament]);

  // Set navigation options
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: tournament?.name || "Tournament",
      contentStyle: { backgroundColor: COLORS.BACKGROUND },
    });
  }, [tournament?.name, navigation]);

  // Generate fixtures with optimization and randomization
  useEffect(() => {
    if (!tournament || !teamDetails.length) {
      setIsLoading(false);
      setError("No teams available to generate fixtures");
      return;
    }

    setIsLoading(true);
    const fixtures: Match[] = [];

    // Optimized round-robin fixture generation
    const generateFixtures = () => {
      for (let i = 0; i < teamDetails.length; i++) {
        for (let j = i + 1; j < teamDetails.length; j++) {
          fixtures.push({
            id: `match-${i}-${j}`,
            teamA: teamDetails[i].teamName,
            teamB: teamDetails[j].teamName,
            scoreA: null,
            scoreB: null,
            completed: false,
          });
        }
      }
    };

    generateFixtures();
    // ⭐️ NEW: Randomize the order of the fixtures
    const shuffledFixtures = shuffleArray(fixtures); 
    setMatches(shuffledFixtures);
    setIsLoading(false);
  }, [teamDetails, tournament]);

  // Enhanced score update with robust validation
  const updateScore = (id: string, team: "A" | "B", value: string) => {
    const cleanedValue = value.trim();
    if (cleanedValue === "") {
      setMatches(prev =>
        prev.map(m =>
          m.id === id && !m.completed ? { ...m, [`score${team}`]: null } : m
        )
      );
      return;
    }

    const parsedValue = Number(cleanedValue);
    if (
      isNaN(parsedValue) ||
      parsedValue < 0 ||
      parsedValue > 21 ||
      !Number.isInteger(parsedValue)
    ) {
      return;
    }

    setMatches(prev =>
      prev.map(m =>
        m.id === id && !m.completed ? { ...m, [`score${team}`]: parsedValue } : m
      )
    );
  };

  // Handle match completion
  const completeMatch = (id: string) => {
    setMatches(prev =>
      prev.map(m =>
        m.id === id && m.scoreA !== null && m.scoreB !== null
          ? { ...m, completed: true }
          : m
      )
    );
  };

  // Handle match edit (reopen completed match)
  const editMatch = (id: string) => {
    setMatches(prev =>
      prev.map(m =>
        m.id === id ? { ...m, completed: false } : m
      )
    );
  };

  // Optimized points table with Net Run Rate
  const pointsTable = useMemo(() => {
    const teamStats: Record<string, { 
      points: number;
      scored: number;
      conceded: number;
      matchesPlayed: number;
    }> = {};
    
    teamDetails.forEach(team => {
      teamStats[team.teamName] = {
        points: 0,
        scored: 0,
        conceded: 0,
        matchesPlayed: 0,
      };
    });

    matches.forEach(match => {
      if (match.completed && match.scoreA !== null && match.scoreB !== null) {
        // Ensure team exists in stats object
        if (!teamStats[match.teamA]) {
          teamStats[match.teamA] = { points: 0, scored: 0, conceded: 0, matchesPlayed: 0 };
        }
        if (!teamStats[match.teamB]) {
          teamStats[match.teamB] = { points: 0, scored: 0, conceded: 0, matchesPlayed: 0 };
        }
        
        teamStats[match.teamA].scored += match.scoreA;
        teamStats[match.teamA].conceded += match.scoreB;
        teamStats[match.teamA].matchesPlayed += 1;
        
        teamStats[match.teamB].scored += match.scoreB;
        teamStats[match.teamB].conceded += match.scoreA;
        teamStats[match.teamB].matchesPlayed += 1;
        
        if (match.scoreA > match.scoreB) {
          teamStats[match.teamA].points += 2;
        } else if (match.scoreB > match.scoreA) {
          teamStats[match.teamB].points += 2;
        }
      }
    });

    return Object.entries(teamStats)
      .map(([team, stats]) => {
        // Calculate NRR: (Total runs scored / 21 * matches) - (Total runs conceded / 21 * matches)
        const matchesPlayed = stats.matchesPlayed || 1; // Avoid division by zero
        const nrr = (stats.scored / (21 * matchesPlayed)) - (stats.conceded / (21 * matchesPlayed));
        
        return {
          team,
          pts: stats.points,
          nrr: nrr,
          scored: stats.scored,
          conceded: stats.conceded,
          matchesPlayed: stats.matchesPlayed,
        };
      })
      .sort((a, b) => {
        // Sort by points first, then by NRR
        if (b.pts !== a.pts) {
          return b.pts - a.pts;
        }
        return b.nrr - a.nrr;
      });
  }, [matches, teamDetails]);

  // Render match card
  const renderMatchCard = (match: Match, index: number) => {
    const isCompleted = match.completed;
    const canComplete = match.scoreA !== null && match.scoreB !== null;
    const winner =
      isCompleted && match.scoreA !== null && match.scoreB !== null
        ? match.scoreA > match.scoreB
          ? match.teamA
          : match.scoreB > match.scoreA
          ? match.teamB
          : "Draw"
        : null;

    const getScoreStyle = (teamName: string, score: number | null) => {
      if (!isCompleted || score === null) return {};
      if (winner === teamName) {
        return {
          borderColor: COLORS.ACCENT,
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          borderWidth: 2,
        };
      }
      return {};
    };

    // Get team members for display
    const teamAMembers = teamDetails.find(t => t.teamName === match.teamA)?.players || [];
    const teamBMembers = teamDetails.find(t => t.teamName === match.teamB)?.players || [];

    return (
      <View
        key={match.id}
        style={[styles.matchCard, isCompleted && styles.completedCard]}
        accessibilityLabel={`Match ${index + 1}`}
      >
        {isCompleted && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={COLORS.SUCCESS}
            style={styles.completedIcon}
          />
        )}
        <Text style={styles.matchTitle}>Match {index + 1}</Text>
        
        <View style={styles.teamRow}>
          <View style={styles.teamInfoContainer}>
            <Text 
              style={[styles.teamName, isCompleted && styles.completedTeamName]}
              numberOfLines={1} 
              ellipsizeMode="tail" // Truncate long names in Fixtures view
            >
              {match.teamA}
            </Text>
            <Text style={styles.teamMembers}>
              {teamAMembers.join(', ')}
            </Text>
          </View>
          <TextInput
            keyboardType="numeric"
            maxLength={2}
            placeholder="0"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={match.scoreA?.toString() || ""}
            onChangeText={val => updateScore(match.id, "A", val)}
            style={[
              styles.scoreInput,
              isCompleted && styles.completedScoreInput,
              getScoreStyle(match.teamA, match.scoreA),
            ]}
            editable={!isCompleted}
            accessibilityLabel={`Score for ${match.teamA}`}
          />
        </View>

        <Text style={styles.vsText}>VS</Text>

        <View style={styles.teamRow}>
          <View style={styles.teamInfoContainer}>
            <Text 
              style={[styles.teamName, isCompleted && styles.completedTeamName]}
              numberOfLines={1} 
              ellipsizeMode="tail" // Truncate long names in Fixtures view
            >
              {match.teamB}
            </Text>
            <Text style={styles.teamMembers}>
              {teamBMembers.join(', ')}
            </Text>
          </View>
          <TextInput
            keyboardType="numeric"
            maxLength={2}
            placeholder="0"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={match.scoreB?.toString() || ""}
            onChangeText={val => updateScore(match.id, "B", val)}
            style={[
              styles.scoreInput,
              isCompleted && styles.completedScoreInput,
              getScoreStyle(match.teamB, match.scoreB),
            ]}
            editable={!isCompleted}
            accessibilityLabel={`Score for ${match.teamB}`}
          />
        </View>

        {!isCompleted && (
          <TouchableOpacity
            style={[styles.completeButton, !canComplete && styles.buttonDisabled]}
            onPress={() => completeMatch(match.id)}
            disabled={!canComplete}
            accessibilityLabel="Mark match as completed"
          >
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
        
        {isCompleted && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => editMatch(match.id)}
            accessibilityLabel="Edit match"
          >
            <Ionicons name="pencil" size={18} color={COLORS.TEXT_PRIMARY} style={{ marginRight: 8 }} />
            <Text style={styles.editButtonText}>Edit Match</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render points table (Includes Matches Played and corrected flex)
  const renderPointsTable = () => (
    <View style={styles.pointsTableContainer} accessibilityLabel="Points table">
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.headerText, { flex: 0.1, textAlign: "center" }]}>#</Text>
        <Text style={[styles.headerText, { flex: 0.50, textAlign: "left" }]}>Team</Text> 
        <Text style={[styles.headerText, { flex: 0.15, textAlign: "center" }]}>MP</Text> 
        <Text style={[styles.headerText, { flex: 0.15, textAlign: "center" }]}>Pts</Text>
        <Text style={[styles.headerText, { flex: 0.25, textAlign: "right" }]}>NRR</Text> 
      </View>
      {pointsTable.length === 0 ? (
        <Text style={styles.emptyText}>
          No matches completed yet. Complete fixtures to see the standings.
        </Text>
      ) : (
        pointsTable.map((item, index) => {
          const rankColor =
            index === 0 ? COLORS.GOLD :
            index === 1 ? COLORS.SILVER :
            index === 2 ? COLORS.BRONZE : COLORS.TEXT_PRIMARY;
          const isTopRank = index < 3;
          const nrrColor = item.nrr > 0 ? COLORS.SUCCESS : item.nrr < 0 ? COLORS.ERROR : COLORS.TEXT_SECONDARY;

          return (
            <View
              key={item.team}
              style={[
                styles.tableRow,
                index % 2 === 1 && styles.alternateRow,
                isTopRank && styles.topRankRow, // Highlight top 3
              ]}
            >
              {/* Rank */}
              <Text
                style={[styles.tableCellText, styles.rankText, { flex: 0.1, textAlign: "center", color: rankColor }]}
              >
                {index + 1}
              </Text>
              {/* Team Name */}
              <View style={{ flex: 0.50, justifyContent: 'center' }}>
                <Text style={[styles.tableCellText, { textAlign: "left", fontWeight: isTopRank ? '800' : '500' }]}>
                  {item.team}
                </Text>
              </View>
              {/* Matches Played (MP) VALUE */}
              <Text style={[styles.tableCellText, { flex: 0.15, textAlign: "center", fontWeight: 'bold' }]}>
                {item.matchesPlayed}
              </Text>
              {/* Points (Emphasized) */}
              <Text style={[styles.tableCellText, styles.pointsText, { flex: 0.15, textAlign: "center" }]}>
                {item.pts}
              </Text>
              {/* NRR (Color-coded) */}
              <Text style={[styles.tableCellText, styles.nrrText, { flex: 0.25, textAlign: "right", color: nrrColor }]}>
                {item.nrr > 0 ? `+${item.nrr.toFixed(3)}` : item.nrr.toFixed(3)}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );

  // Render teams preview
  const renderTeamsPreview = () => (
    <View style={styles.teamsContainer}>
      {teamDetails.length === 0 ? (
        <Text style={styles.emptyText}>No team details available.</Text>
      ) : (
        teamDetails.map((team, index) => (
          <View key={team.teamName} style={styles.teamCard} accessibilityLabel={`Team ${team.teamName}`}>
            <View style={styles.teamHeader}>
              <Text style={styles.teamIndex}>{index + 1}.</Text>
              <Text style={styles.teamFullName}>{team.teamName}</Text>
            </View>
            <Text style={styles.playersTitle}>
              {tournament?.format === 'singles' ? 'Player:' : 'Team Members:'}
            </Text>
            <View style={styles.playersList}>
              {team.players.map((player, pIndex) => (
                <Text key={pIndex} style={styles.playerItem}>
                  • {player}
                </Text>
              ))}
            </View>
          </View>
        ))
      )}
    </View>
  );

  // Render content based on active tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.ACCENT} />
          <Text style={styles.loadingText}>Generating fixtures...</Text>
        </View>
      );
    }

    if (error || !tournament) {
      return (
        <View style={styles.content}>
          <Text style={styles.errorText}>{error || "Tournament data not found"}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoading(true);
              setMatches([]);
            }}
            accessibilityLabel="Retry loading tournament data"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.mainContent}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "fixtures" && styles.activeTabStyle]}
            onPress={() => setActiveTab("fixtures")}
            accessibilityLabel="View fixtures"
          >
            <Text style={styles.tabText}>Fixtures</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "points" && styles.activeTabStyle]}
            onPress={() => setActiveTab("points")}
            accessibilityLabel="View points table"
          >
            <Text style={styles.tabText}>Points Table</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "teams" && styles.activeTabStyle]}
            onPress={() => setActiveTab("teams")}
            accessibilityLabel="View team details"
          >
            <Text style={styles.tabText}>Teams Preview</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === "fixtures" && (
            <>
              <Text style={styles.sectionTitle}>Upcoming Matches</Text>
              {matches.length === 0 ? (
                <Text style={styles.emptyText}>No fixtures available.</Text>
              ) : (
                matches.map(renderMatchCard)
              )}
            </>
          )}
          {activeTab === "points" && (
            <>
              <Text style={styles.sectionTitle}>League Standings</Text>
              {renderPointsTable()}
            </>
          )}
          {activeTab === "teams" && (
            <>
              <Text style={styles.sectionTitle}>Team Details</Text>
              {renderTeamsPreview()}
            </>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <ParallaxScrollView
      winzzLogo={true}
      backgroundImage={require("../../assets/images/badmintonBack.svg")}
    >
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.BACKGROUND },
        }}
      />
      {renderContent()}
    </ParallaxScrollView>
  );
};

// Updated styles with responsive design
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: width * 0.04,
    paddingTop: 10,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: "900",
    color: COLORS.ACCENT,
    marginBottom: 20,
    textAlign: "left",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: 'rgba(255, 255, 255, 0)',
    marginHorizontal: width * 0.04,
    marginTop: 15,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabStyle: {
    backgroundColor: 'rgba(139, 0, 0, 0.5)',
    borderBottomColor: COLORS.ACCENT,
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
  },
  matchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 15,
    padding: width * 0.05,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 15,
    backdropFilter: 'blur(10px)',
  },
  completedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderLeftColor: COLORS.SUCCESS,
    borderColor: 'rgba(255, 255, 255, 0)',
    shadowColor: COLORS.SUCCESS,
  },
  completedIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  matchTitle: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: COLORS.ACCENT,
    marginBottom: 10,
  },
  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  teamInfoContainer: {
    flex: 1,
    paddingRight: 10,
  },
  teamName: {
    fontSize: width * 0.045,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "700",
    marginBottom: 2,
  },
  teamMembers: {
    fontSize: width * 0.032,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  completedTeamName: {
    color: COLORS.TEXT_SECONDARY,
    opacity: 0.7,
  },
  scoreInput: {
    width: width * 0.18,
    textAlign: "center",
    fontSize: width * 0.06,
    fontWeight: "900",
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    marginLeft: 10,
  },
  completedScoreInput: {
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vsText: {
    textAlign: "center",
    color: COLORS.TEXT_SECONDARY,
    fontSize: width * 0.035,
    marginVertical: 4,
    fontWeight: "bold",
  },
  completeButton: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: COLORS.PRIMARY,
    opacity: 0.6,
  },
  completeButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
  },
  editButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  // START OF POINTS TABLE STYLE IMPROVEMENTS
  pointsTableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slightly visible background
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', // Light border for definition
    overflow: "hidden",
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row", // 👈 Check this is set correctly to 'row'
    paddingVertical: 12, 
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: 'rgba(139, 0, 0, 0.6)', // Darker header for contrast
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ACCENT, // Accent color line
    paddingVertical: 14,
  },
  headerText: {
    fontSize: width * 0.038, // Slightly smaller
    fontWeight: "900",
    color: COLORS.TEXT_PRIMARY,
  },
  alternateRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  topRankRow: { // New style for top 3 rows
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  tableCellText: {
    fontSize: width * 0.038,
    color: COLORS.TEXT_PRIMARY,
  },
  rankText: {
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  pointsText: {
    fontWeight: "900",
    fontSize: width * 0.048, // Larger and bolder for emphasis
    color: COLORS.ACCENT,
    backgroundColor: 'rgba(139, 0, 0, 0.3)', // Subtle background on points
    borderRadius: 5,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  nrrText: { // New style for NRR
    fontWeight: "700",
    fontSize: width * 0.038,
  },
  // END OF POINTS TABLE STYLE IMPROVEMENTS
  teamsContainer: {
    paddingHorizontal: width * 0.01,
  },
  teamCard: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 15,
    padding: width * 0.05,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.ACCENT,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    backdropFilter: 'blur(10px)',
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  teamIndex: {
    fontSize: width * 0.05,
    fontWeight: '900',
    color: COLORS.ACCENT,
    marginRight: 10,
  },
  teamFullName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  playersTitle: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
    marginTop: 5,
    marginBottom: 5,
  },
  playersList: {
    paddingLeft: 10,
    marginBottom: 10,
  },
  playerItem: {
    fontSize: width * 0.04,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 2,
  },
  detailSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 8,
  },
  detailTextSmall: {
    fontSize: width * 0.035,
    color: COLORS.TEXT_SECONDARY,
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 10,
    fontSize: width * 0.04,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: width * 0.04,
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: width * 0.035,
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
  retryButton: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: "center",
    marginHorizontal: width * 0.2,
  },
  retryButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});

export default TournamentPage;