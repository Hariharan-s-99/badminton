import { Team } from '@/app/utils/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TeamCardProps {
  team: Team;
  index: number;
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
  BORDER: 'rgba(139, 0, 0, 0.5)',
};

const TeamCard: React.FC<TeamCardProps> = ({ team, index }) => {
  return (
    <View style={[styles.card, styles.teamCard]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.indexBadge}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          <Text style={styles.teamName}>{team.name}</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.points}>{team.points}</Text>
          <Text style={styles.pointsLabel}>pts</Text>
        </View>
      </View>
      <View style={styles.playersContainer}>
        <Text style={styles.playersLabel}>👥 Players:</Text>
        <Text style={styles.players}>{team.player1} & {team.player2}</Text>
      </View>
      <View style={styles.recordContainer}>
        <View style={styles.recordBadge}>
          <Text style={styles.recordLabel}>W</Text>
          <Text style={styles.recordValue}>{team.wins}</Text>
        </View>
        <Text style={styles.recordSeparator}>•</Text>
        <View style={styles.recordBadge}>
          <Text style={styles.recordLabel}>L</Text>
          <Text style={styles.recordValue}>{team.losses}</Text>
        </View>
      </View>
    </View>
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
  teamCard: { 
    borderLeftWidth: 4, 
    borderLeftColor: COLORS.ACCENT 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 0, 0, 0.2)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  indexText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
  teamName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    textShadowColor: 'rgba(139, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pointsBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.4)',
  },
  points: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.SUCCESS,
  },
  pointsLabel: {
    fontSize: 10,
    color: COLORS.SUCCESS,
    fontWeight: '600',
  },
  playersContainer: {
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 10,
  },
  playersLabel: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
    fontWeight: '600',
  },
  players: { 
    fontSize: 15, 
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  recordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  recordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  recordLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '700',
  },
  recordValue: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  recordSeparator: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default TeamCard;