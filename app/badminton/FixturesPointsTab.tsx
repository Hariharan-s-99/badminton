import MatchCard from '@/components/ui/MatchCard';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Tournament } from '../utils/types';

interface FixturesPointsTabProps {
  tournament: Tournament;
  scores: { [matchId: string]: { team1: string; team2: string } };
  onScoreChange: (matchId: string, teamKey: 'team1' | 'team2', value: string) => void;
  onCompleteMatch: (matchId: string, team1Score: number, team2Score: number) => void;
}

// Dark Red Theme Colors
const COLORS = {
  BACKGROUND: '#1A0505',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B89090',
  PRIMARY: '#8B0000',
  ACCENT: '#FF6B6B',
  CARD_BG: 'rgba(139, 0, 0, 0.15)',
  BORDER: 'rgba(139, 0, 0, 0.5)',
};

const FixturesPointsTab: React.FC<FixturesPointsTabProps> = ({ tournament, scores, onScoreChange, onCompleteMatch }) => {
  const getAllRounds = () => Array.from({ length: tournament.totalRounds }, (_, i) => i + 1);
  const getMatchesByRound = (round: number) => tournament.matches.filter((match) => match.round === round);

  const handleComplete = (match: any) => {
    const matchScores = scores[match.id] || { team1: '', team2: '' };
    const score1 = parseInt(matchScores.team1) || 0;
    const score2 = parseInt(matchScores.team2) || 0;

    if (score1 <= 0 || score2 <= 0) {
      Alert.alert('Invalid Score', 'Enter valid, non-zero scores.');
      return;
    }

    onCompleteMatch(match.id, score1, score2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗓️ Match Schedule</Text>
        <Text style={styles.subtitle}>Enter scores to update standings</Text>
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {getAllRounds().map((round) => {
          const roundMatches = getMatchesByRound(round);
          const completedCount = roundMatches.filter(m => m.completed).length;
          
          return (
            <View key={round} style={styles.roundContainer}>
              <View style={styles.roundHeader}>
                <Text style={styles.roundTitle}>Round {round}</Text>
                <View style={styles.roundBadge}>
                  <Text style={styles.roundBadgeText}>
                    {completedCount}/{roundMatches.length}
                  </Text>
                </View>
              </View>
              <View style={styles.matchesContainer}>
                {roundMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    scores={scores[match.id] || { team1: '', team2: '' }}
                    onScoreChange={onScoreChange}
                    onComplete={() => handleComplete(match)}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(139, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  roundContainer: { 
    marginBottom: 24,
  },
  roundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.PRIMARY,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  roundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  roundBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  roundBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  matchesContainer: {
    gap: 12,
  },
});

export default FixturesPointsTab;