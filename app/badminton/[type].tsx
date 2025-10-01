import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Tournament } from '../utils/types';
import { generateRoundRobinMatches, generateTeams, generateTimeSlots } from '../utils/utils';
import TournamentReviewTabs from './TournamentReviewTabs';
import TournamentSetupForm from './TournamentSetupForm';

// Dark Red Theme Colors
const COLORS = {
  BACKGROUND: '#1A0505',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B89090',
  PRIMARY: '#8B0000',
  ACCENT: '#FF6B6B',
  CARD_BG: 'rgba(139, 0, 0, 0.25)',
  BORDER: 'rgba(139, 0, 0, 0.4)',
};

export default function TournamentScreen() {
  const insets = useSafeAreaInsets();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const WIN_POINTS = 3;
  const LOSS_POINTS = 1;

  const handleTournamentCreated = (newTournament: Tournament) => {
    setTournament(newTournament);
    Toast.show({
      type: 'success',
      text1: 'Tournament Created!',
      text2: 'Your tournament is ready to start.',
      text1Style: { color: COLORS.TEXT_PRIMARY },
      text2Style: { color: COLORS.TEXT_SECONDARY },
    });
  };

  const shuffleTeams = () => {
    if (!tournament) return;
    const newTeams = generateTeams(tournament.players).map((newTeam) => {
      const oldTeam = tournament.teams.find(
        (t) => (t.player1 === newTeam.player1 && t.player2 === newTeam.player2) || (t.player1 === newTeam.player2 && t.player2 === newTeam.player1)
      );
      return { ...newTeam, points: oldTeam?.points || 0, wins: oldTeam?.wins || 0, losses: oldTeam?.losses || 0 };
    });
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
    Toast.show({
      type: 'success',
      text1: 'Teams Shuffled!',
      text2: 'New team pairings generated.',
      text1Style: { color: COLORS.TEXT_PRIMARY },
      text2Style: { color: COLORS.TEXT_SECONDARY },
    });
  };

  const handleCompleteMatch = (matchId: string, team1Score: number, team2Score: number) => {
    if (!tournament) return;
    const match = tournament.matches.find((m) => m.id === matchId);
    if (!match || match.completed) {
      Alert.alert('Error', 'Match already completed or not found.', [
        { text: 'OK', style: 'cancel' },
      ]);
      return;
    }

    const winnerId = team1Score > team2Score ? match.team1.id : team2Score > team1Score ? match.team2.id : null;
    if (!winnerId) {
      Alert.alert('Match Tied', 'Scores are equal. Match cannot be completed.', [
        { text: 'OK', style: 'cancel' },
      ]);
      return;
    }

    const newTeams = tournament.teams.map((team) => {
      if (team.id === winnerId) {
        return { ...team, wins: team.wins + 1, points: team.points + WIN_POINTS };
      }
      if (team.id === (winnerId === match.team1.id ? match.team2.id : match.team1.id)) {
        return { ...team, losses: team.losses + 1, points: team.points + LOSS_POINTS };
      }
      return team;
    });

    const newMatches = tournament.matches.map((m) =>
      m.id === matchId
        ? { ...m, completed: true, winner: newTeams.find((t) => t.id === winnerId), score: `${team1Score} - ${team2Score}` }
        : m
    );

    setTournament({ ...tournament, teams: newTeams, matches: newMatches });
    Toast.show({
      type: 'success',
      text1: 'Match Completed!',
      text2: `${newTeams.find((t) => t.id === winnerId)?.name} wins!`,
      text1Style: { color: COLORS.TEXT_PRIMARY },
      text2Style: { color: COLORS.TEXT_SECONDARY },
    });
  };

  const handleBackPress = () => {
    if (tournament) {
      setTournament(null);
      Toast.show({
        type: 'info',
        text1: 'Back to Setup',
        text2: 'You can create a new tournament.',
        text1Style: { color: COLORS.TEXT_PRIMARY },
        text2Style: { color: COLORS.TEXT_SECONDARY },
      });
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Stack.Screen options={{ title: 'Tournament Fixtures', headerShown: false }} />
      <ParallaxScrollView backgroundImage={require('../../assets/images/badmintonBack.svg')}>
        <View style={[styles.header, { marginTop: insets.top + 10 }]}>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <View style={styles.backIconContainer}>
                <Text style={styles.backIconText}>←</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{tournament ? tournament.name : 'Setup New Tournament'}</Text>
            {tournament && (
              <Text style={styles.subtitle}>
                {tournament.date} • {tournament.teams.length} Teams • {tournament.matches.length} Matches
              </Text>
            )}
          </View>
        </View>
        <View style={styles.content}>
          {tournament ? (
            <TournamentReviewTabs
              tournament={tournament}
              onShuffle={shuffleTeams}
              onCompleteMatch={handleCompleteMatch}
            />
          ) : (
            <TournamentSetupForm onTournamentCreated={handleTournamentCreated} />
          )}
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
    alignItems: 'center',
    position: 'relative',
  },
  headerContent: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    textShadowColor: 'rgba(139, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 4,
  },
  backIcon: {
    position: 'absolute',
    left: 16,
    top: 10,
    zIndex: 20,
  },
  backIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  backIconText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: -2,
  },
  content: {
    minHeight: 600,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});