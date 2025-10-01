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

// Dark Red Theme Colors
const COLORS = {
  BACKGROUND: '#1A0505',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B89090',
  PRIMARY: '#8B0000',
  ACCENT: '#FF6B6B',
  SUCCESS: '#4CAF50',
  CARD_BG: 'rgba(139, 0, 0, 0.15)',
  CARD_COMPLETED: 'rgba(76, 175, 80, 0.15)',
  INPUT_BG: 'rgba(0, 0, 0, 0.3)',
  BORDER: 'rgba(139, 0, 0, 0.5)',
  BUTTON_BG: '#8B0000',
};

const MatchCard: React.FC<MatchCardProps> = ({ match, scores, onScoreChange, onComplete }) => {
  return (
    <Animated.View 
      entering={FadeIn} 
      exiting={FadeOut} 
      style={[
        styles.card, 
        styles.matchCard, 
        match.completed && styles.completedCard
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.matchNumber}>Match {match.matchNumber}</Text>
        <View style={styles.meta}>
          <Text style={styles.court}>Court {match.court}</Text>
          <Text style={styles.time}>{match.timeSlot}</Text>
        </View>
      </View>
      {match.completed ? (
        <View style={styles.result}>
          <Text style={styles.resultText}>🏆 {match.winner?.name} WON</Text>
          <Text style={styles.scoreText}>({match.score})</Text>
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
                placeholder="0"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                value={scores.team1}
                onChangeText={(text) => onScoreChange(match.id, 'team1', text)}
                maxLength={2}
              />
              <Text style={styles.pointsText}>{match.team1.points} pts</Text>
            </View>
            <Text style={styles.vs}>VS</Text>
            <View style={styles.scoreWrapper}>
              <Text style={styles.teamName}>{match.team2.name}</Text>
              <TextInput
                style={styles.scoreInput}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                value={scores.team2}
                onChangeText={(text) => onScoreChange(match.id, 'team2', text)}
                maxLength={2}
              />
              <Text style={styles.pointsText}>{match.team2.points} pts</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={onComplete}>
            <Text style={styles.buttonText}>✓ Complete Match</Text>
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  matchCard: { 
    borderLeftWidth: 4, 
    borderLeftColor: COLORS.ACCENT 
  },
  completedCard: { 
    backgroundColor: COLORS.CARD_COMPLETED, 
    borderLeftColor: COLORS.SUCCESS,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 0, 0, 0.2)',
  },
  matchNumber: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: COLORS.TEXT_PRIMARY,
    textShadowColor: 'rgba(139, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  meta: { 
    alignItems: 'flex-end' 
  },
  court: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: COLORS.ACCENT,
    marginBottom: 2,
  },
  time: { 
    fontSize: 12, 
    color: COLORS.TEXT_SECONDARY 
  },
  scoreRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginVertical: 16,
    alignItems: 'center',
  },
  scoreWrapper: { 
    flex: 1, 
    alignItems: 'center', 
    marginHorizontal: 8 
  },
  teamName: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: COLORS.TEXT_PRIMARY, 
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreInput: {
    backgroundColor: COLORS.INPUT_BG,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    width: 70,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  pointsText: { 
    fontSize: 11, 
    color: COLORS.TEXT_SECONDARY, 
    marginTop: 6,
    fontWeight: '500',
  },
  vs: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.ACCENT, 
    marginTop: 20,
    textShadowColor: 'rgba(255, 107, 107, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  result: { 
    alignItems: 'center', 
    padding: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    marginTop: 8,
  },
  resultText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.SUCCESS,
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreDetail: { 
    fontSize: 12, 
    color: COLORS.TEXT_SECONDARY, 
    marginTop: 4,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.BUTTON_BG,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default MatchCard;