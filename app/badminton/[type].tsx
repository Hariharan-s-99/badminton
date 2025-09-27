import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Color variables (matching badminton app theme)
const COLORS = {
  TEXT_PRIMARY: '#4A4A4A',
  BUTTON_PRIMARY: 'rgba(180, 131, 131, 0.26)',
  BUTTON_ACCENT: 'rgba(99, 7, 7, 0.7)',
  BUTTON_SUCCESS: 'rgba(34, 139, 34, 0.8)',
  INPUT_BORDER: 'rgba(74, 74, 74, 0.3)',
  BACK_ICON_BACKGROUND: 'rgba(122, 8, 8, 0.4)',
  TEAM_BACKGROUND: 'rgba(255, 255, 255, 0.9)',
  MATCH_BACKGROUND: 'rgba(240, 248, 255, 0.9)',
  FIXTURE_HEADER: 'rgba(99, 7, 7, 0.1)',
  ROUND_HEADER: 'rgba(180, 131, 131, 0.4)',
};

// Types
interface Team {
  id: string;
  name: string;
  player1: string;
  player2: string;
  wins: number;
  losses: number;
  points: number;
}

interface Match {
  id: string;
  matchNumber: number;
  team1: Team;
  team2: Team;
  round: number;
  court?: number;
  timeSlot?: string;
  completed: boolean;
  winner?: Team;
  score?: string;
}

interface Tournament {
  name: string;
  date: string;
  players: string[];
  teams: Team[];
  matches: Match[];
  currentRound: number;
  totalRounds: number;
  format: 'round-robin';
}

// Utility functions
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateTeams = (players: string[]): Team[] => {
  const shuffledPlayers = shuffleArray(players);
  const teams: Team[] = [];
  
  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    if (i + 1 < shuffledPlayers.length) {
      teams.push({
        id: `team-${i / 2 + 1}`,
        name: `Team ${i / 2 + 1}`,
        player1: shuffledPlayers[i],
        player2: shuffledPlayers[i + 1],
        wins: 0,
        losses: 0,
        points: 0,
      });
    }
  }
  
  return teams;
};

const generateRoundRobinMatches = (teams: Team[]): Match[] => {
  const matches: Match[] = [];
  let matchNumber = 1;
  
  // Generate all possible matches (every team plays every other team once)
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: `match-${matchNumber}`,
        matchNumber,
        team1: teams[i],
        team2: teams[j],
        round: Math.ceil(matchNumber / Math.floor(teams.length / 2)),
        completed: false,
      });
      matchNumber++;
    }
  }
  
  return matches;
};

const generateTimeSlots = (numMatches: number, matchesPerRound: number): string[] => {
  const slots: string[] = [];
  const startHour = 9; // 9 AM
  const matchDuration = 30; // 30 minutes per match
  const breakBetweenRounds = 15; // 15 minutes break between rounds
  
  let currentTime = startHour * 60; // Convert to minutes
  
  for (let i = 0; i < numMatches; i++) {
    // Add break time between rounds
    if (i > 0 && i % matchesPerRound === 0) {
      currentTime += breakBetweenRounds;
    }
    
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    slots.push(timeString);
    
    currentTime += matchDuration;
  }
  
  return slots;
};

// ----------------------------------------------------------------------
// --- Main Tournament Fixture Component ---
// ----------------------------------------------------------------------
export default function TournamentFixture() {
  const insets = useSafeAreaInsets();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [viewMode, setViewMode] = useState<'teams' | 'fixtures' | 'schedule'>('teams');
  const [selectedRound, setSelectedRound] = useState<number | null>(null);

  // Mock data - in real app, this would come from navigation params or previous screen
  const mockTournamentData = {
    name: "Sunday Smash Championship",
    date: "2025-09-28",
    players: ["Alice Chen", "Bob Smith", "Charlie Brown", "Diana Prince", "Eve Adams", "Frank Miller", "Grace Lee", "Henry Wilson"]
  };

  useEffect(() => {
    initializeTournament();
  }, []);

  const initializeTournament = () => {
    const teams = generateTeams(mockTournamentData.players);
    const matches = generateRoundRobinMatches(teams);
    const matchesPerRound = Math.floor(teams.length / 2);
    const timeSlots = generateTimeSlots(matches.length, matchesPerRound);
    
    // Assign time slots and courts to matches
    const scheduledMatches = matches.map((match, index) => ({
      ...match,
      timeSlot: timeSlots[index],
      court: (index % 2) + 1, // Assuming 2 courts
    }));
    
    const newTournament: Tournament = {
      ...mockTournamentData,
      teams,
      matches: scheduledMatches,
      currentRound: 1,
      totalRounds: Math.ceil(matches.length / matchesPerRound),
      format: 'round-robin',
    };
    
    setTournament(newTournament);
  };

  const shuffleTeams = () => {
    if (!tournament) return;
    
    const newTeams = generateTeams(tournament.players);
    const newMatches = generateRoundRobinMatches(newTeams);
    const matchesPerRound = Math.floor(newTeams.length / 2);
    const timeSlots = generateTimeSlots(newMatches.length, matchesPerRound);
    
    const scheduledMatches = newMatches.map((match, index) => ({
      ...match,
      timeSlot: timeSlots[index],
      court: (index % 2) + 1,
    }));
    
    setTournament({
      ...tournament,
      teams: newTeams,
      matches: scheduledMatches,
      totalRounds: Math.ceil(newMatches.length / matchesPerRound),
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  const startTournament = () => {
    Alert.alert(
      'Start Tournament! 🏆',
      'All fixtures are ready. Start the tournament now?',
      [
        { text: 'Review Again', style: 'cancel' },
        { 
          text: 'Start Playing!', 
          onPress: () => {
            Alert.alert('Tournament Started!', 'This would navigate to the live tournament management screen.');
          }
        },
      ]
    );
  };

  const getMatchesByRound = (round: number) => {
    return tournament?.matches.filter(match => match.round === round) || [];
  };

  const getAllRounds = () => {
    if (!tournament) return [];
    const rounds = [];
    for (let i = 1; i <= tournament.totalRounds; i++) {
      rounds.push(i);
    }
    return rounds;
  };

  if (!tournament) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Creating Tournament Fixtures...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.mainContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          title: 'Tournament Fixtures',
          headerShown: false,
        }}
      />
      
      <ParallaxScrollView
        backgroundImage={require('../../assets/images/badmintonBack.svg')}
      >
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.tournamentName}>{tournament.name}</Text>
            <Text style={styles.tournamentInfo}>
              {tournament.date} • {tournament.teams.length} Teams • {tournament.matches.length} Matches
            </Text>
          </View>

          {/* View Mode Selector */}
          <View style={styles.viewModeSelector}>
            <TouchableOpacity 
              style={[styles.modeButton, viewMode === 'teams' && styles.activeModeButton]}
              onPress={() => setViewMode('teams')}
            >
              <Text style={[styles.modeButtonText, viewMode === 'teams' && styles.activeModeText]}>
                Teams
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeButton, viewMode === 'fixtures' && styles.activeModeButton]}
              onPress={() => setViewMode('fixtures')}
            >
              <Text style={[styles.modeButtonText, viewMode === 'fixtures' && styles.activeModeText]}>
                Fixtures
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeButton, viewMode === 'schedule' && styles.activeModeButton]}
              onPress={() => setViewMode('schedule')}
            >
              <Text style={[styles.modeButtonText, viewMode === 'schedule' && styles.activeModeText]}>
                Schedule
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content based on view mode */}
          {viewMode === 'teams' && <TeamsView tournament={tournament} onShuffle={shuffleTeams} />}
          {viewMode === 'fixtures' && <FixturesView tournament={tournament} />}
          {viewMode === 'schedule' && <ScheduleView tournament={tournament} />}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.shuffleButton} onPress={shuffleTeams}>
              <Text style={styles.shuffleButtonText}>🔀 Shuffle Teams</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.startButton} onPress={startTournament}>
              <Text style={styles.startButtonText}>🚀 START TOURNAMENT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ParallaxScrollView>

      {/* Back Button */}
      <TouchableOpacity 
        style={[styles.backIcon, { top: insets.top + 10 }]} 
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <View style={styles.backIconContainer}>
          <Text style={styles.backIconText}>←</Text>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

// ----------------------------------------------------------------------
// --- Teams View Component ---
// ----------------------------------------------------------------------
const TeamsView = ({ tournament, onShuffle }: {
  tournament: Tournament;
  onShuffle: () => void;
}) => (
  <View style={styles.viewContainer}>
    <Text style={styles.sectionTitle}>🏸 Doubles Teams</Text>
    <Text style={styles.sectionSubtitle}>
      {tournament.teams.length} teams will compete in round-robin format
    </Text>
    
    <View style={styles.teamsGrid}>
      {tournament.teams.map((team, index) => (
        <View key={team.id} style={styles.teamCard}>
          <View style={styles.teamHeader}>
            <Text style={styles.teamName}>{team.name}</Text>
            <View style={styles.teamStats}>
              <Text style={styles.teamRecord}>0-0</Text>
            </View>
          </View>
          <Text style={styles.teamPlayers}>
            {team.player1}
          </Text>
          <Text style={styles.teamPlayers}>
            {team.player2}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

// ----------------------------------------------------------------------
// --- Fixtures View Component ---
// ----------------------------------------------------------------------
const FixturesView = ({ tournament }: { tournament: Tournament }) => {
  const getAllRounds = () => {
    const rounds = [];
    for (let i = 1; i <= tournament.totalRounds; i++) {
      rounds.push(i);
    }
    return rounds;
  };

  const getMatchesByRound = (round: number) => {
    return tournament.matches.filter(match => match.round === round);
  };

  return (
    <View style={styles.viewContainer}>
      <Text style={styles.sectionTitle}>🗓️ Match Fixtures</Text>
      <Text style={styles.sectionSubtitle}>
        Round-robin format: Every team plays every other team
      </Text>
      
      <ScrollView style={styles.fixturesList} showsVerticalScrollIndicator={false}>
        {getAllRounds().map(round => (
          <View key={round} style={styles.roundContainer}>
            <Text style={styles.roundTitle}>Round {round}</Text>
            
            {getMatchesByRound(round).map((match, index) => (
              <View key={match.id} style={styles.fixtureCard}>
                <View style={styles.fixtureHeader}>
                  <Text style={styles.matchNumber}>Match {match.matchNumber}</Text>
                  <View style={styles.matchMeta}>
                    <Text style={styles.courtInfo}>Court {match.court}</Text>
                    <Text style={styles.timeInfo}>{match.timeSlot}</Text>
                  </View>
                </View>
                
                <View style={styles.fixtureTeams}>
                  <View style={styles.fixtureTeam}>
                    <Text style={styles.fixtureTeamName}>{match.team1.name}</Text>
                    <Text style={styles.fixtureTeamPlayers}>
                      {match.team1.player1} & {match.team1.player2}
                    </Text>
                  </View>
                  
                  <Text style={styles.vsText}>VS</Text>
                  
                  <View style={styles.fixtureTeam}>
                    <Text style={styles.fixtureTeamName}>{match.team2.name}</Text>
                    <Text style={styles.fixtureTeamPlayers}>
                      {match.team2.player1} & {match.team2.player2}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ----------------------------------------------------------------------
// --- Schedule View Component ---
// ----------------------------------------------------------------------
const ScheduleView = ({ tournament }: { tournament: Tournament }) => {
  const groupMatchesByTime = () => {
    const grouped: { [key: string]: Match[] } = {};
    tournament.matches.forEach(match => {
      if (match.timeSlot) {
        if (!grouped[match.timeSlot]) {
          grouped[match.timeSlot] = [];
        }
        grouped[match.timeSlot].push(match);
      }
    });
    return grouped;
  };

  const groupedMatches = groupMatchesByTime();
  const timeSlots = Object.keys(groupedMatches).sort();

  return (
    <View style={styles.viewContainer}>
      <Text style={styles.sectionTitle}>⏰ Tournament Schedule</Text>
      <Text style={styles.sectionSubtitle}>
        Matches organized by time slots across courts
      </Text>
      
      <ScrollView style={styles.scheduleList} showsVerticalScrollIndicator={false}>
        {timeSlots.map(timeSlot => (
          <View key={timeSlot} style={styles.timeSlotContainer}>
            <Text style={styles.timeSlotTitle}>{timeSlot}</Text>
            
            <View style={styles.courtsContainer}>
              {groupedMatches[timeSlot].map(match => (
                <View key={match.id} style={styles.scheduleMatchCard}>
                  <View style={styles.scheduleMatchHeader}>
                    <Text style={styles.scheduleMatchNumber}>
                      Match {match.matchNumber}
                    </Text>
                    <Text style={styles.scheduleCourtNumber}>
                      Court {match.court}
                    </Text>
                  </View>
                  
                  <View style={styles.scheduleTeams}>
                    <Text style={styles.scheduleTeamName}>
                      {match.team1.name}
                    </Text>
                    <Text style={styles.scheduleVs}>vs</Text>
                    <Text style={styles.scheduleTeamName}>
                      {match.team2.name}
                    </Text>
                  </View>
                  
                  <Text style={styles.scheduleTeamPlayers}>
                    {match.team1.player1} & {match.team1.player2}
                  </Text>
                  <Text style={styles.scheduleTeamPlayers}>
                    {match.team2.player1} & {match.team2.player2}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ----------------------------------------------------------------------
// --- Styles ---
// ----------------------------------------------------------------------
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    minHeight: 1000,
    paddingBottom: 100,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: COLORS.TEAM_BACKGROUND,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  tournamentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 5,
  },
  tournamentInfo: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    opacity: 0.7,
    textAlign: 'center',
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.FIXTURE_HEADER,
    borderRadius: 25,
    padding: 4,
    marginBottom: 25,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeModeButton: {
    backgroundColor: COLORS.BUTTON_ACCENT,
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  activeModeText: {
    color: 'white',
  },
  viewContainer: {
    flex: 1,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamCard: {
    width: '48%',
    backgroundColor: COLORS.TEAM_BACKGROUND,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BUTTON_ACCENT,
  },
  teamStats: {
    backgroundColor: COLORS.FIXTURE_HEADER,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  teamRecord: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  teamPlayers: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  fixturesList: {
    maxHeight: 500,
  },
  roundContainer: {
    marginBottom: 25,
  },
  roundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.ROUND_HEADER,
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  fixtureCard: {
    backgroundColor: COLORS.MATCH_BACKGROUND,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  fixtureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BUTTON_ACCENT,
  },
  matchMeta: {
    alignItems: 'flex-end',
  },
  courtInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.BUTTON_ACCENT,
  },
  timeInfo: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    opacity: 0.7,
  },
  fixtureTeams: {
    alignItems: 'center',
  },
  fixtureTeam: {
    alignItems: 'center',
    marginVertical: 5,
  },
  fixtureTeamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 3,
  },
  fixtureTeamPlayers: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    opacity: 0.8,
  },
  vsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.BUTTON_ACCENT,
    marginVertical: 8,
  },
  scheduleList: {
    maxHeight: 500,
  },
  timeSlotContainer: {
    marginBottom: 25,
  },
  timeSlotTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: COLORS.BUTTON_ACCENT,
    textAlign: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  courtsContainer: {
    gap: 10,
  },
  scheduleMatchCard: {
    backgroundColor: COLORS.TEAM_BACKGROUND,
    borderRadius: 10,
    padding: 12,
    elevation: 1,
  },
  scheduleMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleMatchNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.BUTTON_ACCENT,
  },
  scheduleCourtNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.FIXTURE_HEADER,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  scheduleTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  scheduleTeamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    flex: 2,
    textAlign: 'center',
  },
  scheduleVs: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.BUTTON_ACCENT,
    flex: 1,
    textAlign: 'center',
  },
  scheduleTeamPlayers: {
    fontSize: 11,
    color: COLORS.TEXT_PRIMARY,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 2,
  },
  actionButtons: {
    gap: 15,
    marginTop: 20,
  },
  shuffleButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  shuffleButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: COLORS.BUTTON_SUCCESS,
    paddingVertical: 20,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 20,
  },
  backIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.BACK_ICON_BACKGROUND,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  backIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -2,
  },
});