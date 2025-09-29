import { COLORS, globalStyles } from '@/app/utils/styles';
import { Match } from '@/app/utils/types';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface MatchCardProps {
  match: Match;
  scores: { team1: string; team2: string };
  onScoreChange: (matchId: string, teamKey: 'team1' | 'team2', value: string) => void;
  onComplete: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, scores, onScoreChange, onComplete }) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[globalStyles.card, styles.matchCard, match.completed && styles.completedCard]}>
      <View style={styles.header}>
        <Text style={styles.matchNumber}>Match {match.matchNumber}</Text>
        <View style={styles.meta}>
          <Text style={styles.court}>Court {match.court}</Text>
          <Text style={styles.time}>{match.timeSlot}</Text>
        </View>
      </View>
      {match.completed ? (
        <View style={styles.result}>
          <Text style={styles.resultText}>{match.winner?.name} WON ({match.score})</Text>
          <Text style={styles.scoreDetail}>
            {match.team1.name}: {match.team1.id === match.winner?.id ? 3 : 1}pt | {match.team2.name}: {match.team2.id === match.winner?.id ? 3 : 1}pt
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.scoreRow}>
            <View style={styles.scoreWrapper}>
              <Text style={styles.teamName}>{match.team1.name}</Text>
              <TextInput
                style={styles.scoreInput}
                keyboardType="numeric"
                placeholder="Score"
                value={scores.team1}
                onChangeText={(text) => onScoreChange(match.id, 'team1', text)}
                maxLength={2}
              />
              <Text style={styles.pointsText}>{match.team1.points} total points</Text>
            </View>
            <Text style={styles.vs}>VS</Text>
            <View style={styles.scoreWrapper}>
              <Text style={styles.teamName}>{match.team2.name}</Text>
              <TextInput
                style={styles.scoreInput}
                keyboardType="numeric"
                placeholder="Score"
                value={scores.team2}
                onChangeText={(text) => onScoreChange(match.id, 'team2', text)}
                maxLength={2}
              />
              <Text style={styles.pointsText}>{match.team2.points} total points</Text>
            </View>
          </View>
          <TouchableOpacity style={globalStyles.button} onPress={onComplete}>
            <Text style={globalStyles.buttonText}>Complete Match</Text>
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  matchCard: { borderLeftWidth: 4, borderLeftColor: COLORS.ACCENT },
  completedCard: { backgroundColor: '#E8F5E9', borderLeftColor: COLORS.SUCCESS },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  matchNumber: { fontSize: 16, fontWeight: 'bold', color: COLORS.PRIMARY },
  meta: { alignItems: 'flex-end' },
  court: { fontSize: 12, fontWeight: '600', color: COLORS.ACCENT },
  time: { fontSize: 12, color: COLORS.TEXT_SECONDARY },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 12 },
  scoreWrapper: { flex: 1, alignItems: 'center', marginHorizontal: 8 },
  teamName: { fontSize: 14, fontWeight: '600', color: COLORS.PRIMARY, marginBottom: 4 },
  scoreInput: {
    backgroundColor: COLORS.INPUT,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    width: 60,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  pointsText: { fontSize: 10, color: COLORS.TEXT_SECONDARY, marginTop: 4 },
  vs: { fontSize: 18, fontWeight: 'bold', color: COLORS.ACCENT, marginTop: 20 },
  result: { alignItems: 'center', padding: 12 },
  resultText: { fontSize: 16, fontWeight: 'bold', color: COLORS.SUCCESS },
  scoreDetail: { fontSize: 12, color: COLORS.TEXT_SECONDARY, marginTop: 4 },
});

export default MatchCard;