import { COLORS, globalStyles } from '@/app/utils/styles';
import { Team } from '@/app/utils/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TeamCardProps {
  team: Team;
  index: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, index }) => {
  return (
    <View style={[globalStyles.card, styles.teamCard]}>
      <View style={styles.header}>
        <Text style={styles.teamName}>{index + 1}. {team.name}</Text>
        <Text style={styles.points}>Points: {team.points}</Text>
      </View>
      <Text style={styles.players}>{team.player1} & {team.player2}</Text>
      <Text style={styles.record}>Record: {team.wins}W - {team.losses}L</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  teamCard: { borderLeftWidth: 4, borderLeftColor: COLORS.ACCENT },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  teamName: { fontSize: 18, fontWeight: 'bold', color: COLORS.PRIMARY },
  points: { fontSize: 16, fontWeight: '600', color: COLORS.SUCCESS },
  players: { fontSize: 14, color: COLORS.TEXT_SECONDARY },
  record: { fontSize: 12, color: COLORS.TEXT_SECONDARY, marginTop: 4 },
});

export default TeamCard;