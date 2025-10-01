import StyledButton from '@/components/ui/StyledButton';
import TeamCard from '@/components/ui/TeamCard';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Tournament } from '../utils/types';

interface TeamsTabProps {
  tournament: Tournament;
  onShuffle: () => void;
}

// Dark Red Theme Colors
const COLORS = {
  BACKGROUND: '#1A0505',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B89090',
  PRIMARY: '#8B0000',
  CARD_BG: 'rgba(139, 0, 0, 0.15)',
  BORDER: 'rgba(139, 0, 0, 0.5)',
};

const TeamsTab: React.FC<TeamsTabProps> = ({ tournament, onShuffle }) => {
  const sortedTeams = [...tournament.teams].sort((a, b) => b.wins - a.wins || b.points - a.points);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Team Standings</Text>
        <Text style={styles.subtitle}>
          Sorted by wins and points
        </Text>
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.teamsContainer}>
          {sortedTeams.map((team, index) => (
            <TeamCard key={team.id} team={team} index={index} />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <StyledButton 
            title="🔀 Shuffle Teams" 
            onPress={onShuffle}
            gradient
          />
        </View>
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
  teamsContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 8,
  },
});

export default TeamsTab;