import StyledButton from '@/components/ui/StyledButton';
import TeamCard from '@/components/ui/TeamCard';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { globalStyles } from '../utils/styles';
import { Tournament } from '../utils/types';

interface TeamsTabProps {
  tournament: Tournament;
  onShuffle: () => void;
}

const TeamsTab: React.FC<TeamsTabProps> = ({ tournament, onShuffle }) => {
  const sortedTeams = [...tournament.teams].sort((a, b) => b.wins - a.wins || b.points - a.points);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Team Standings</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {sortedTeams.map((team, index) => (
          <TeamCard key={team.id} team={team} index={index} />
        ))}
        <StyledButton title="Shuffle Teams" onPress={onShuffle} />
      </ScrollView>
    </View>
  );
};

export default TeamsTab;