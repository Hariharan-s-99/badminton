import MatchCard from '@/components/ui/MatchCard';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, globalStyles } from '../utils/styles';
import { Tournament } from '../utils/types';

interface FixturesPointsTabProps {
  tournament: Tournament;
  scores: { [matchId: string]: { team1: string; team2: string } };
  onScoreChange: (matchId: string, teamKey: 'team1' | 'team2', value: string) => void;
  onCompleteMatch: (matchId: string, team1Score: number, team2Score: number) => void;
}

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
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>🗓️ Match Schedule</Text>
      <Text style={globalStyles.subtitle}>Enter scores to update standings.</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {getAllRounds().map((round) => (
          <View key={round} style={styles.roundContainer}>
            <Text style={styles.roundTitle}>Round {round}</Text>
            {getMatchesByRound(round).map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                scores={scores[match.id] || { team1: '', team2: '' }}
                onScoreChange={onScoreChange}
                onComplete={() => handleComplete(match)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  roundContainer: { marginBottom: 16 },
  roundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    backgroundColor: COLORS.ACCENT,
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
});

export default FixturesPointsTab;