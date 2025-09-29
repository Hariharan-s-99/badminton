import StyledButton from '@/components/ui/StyledButton';
import TeamCard from '@/components/ui/TeamCard';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, globalStyles } from '../utils/styles';
import { Tournament } from '../utils/types';
import { generateRoundRobinMatches, generateTeams, generateTimeSlots } from '../utils/utils';

interface TournamentSetupFormProps {
  onTournamentCreated: (tournament: Tournament) => void;
}

const TournamentSetupForm: React.FC<TournamentSetupFormProps> = ({ onTournamentCreated }) => {
  const [setupStage, setSetupStage] = useState<'input' | 'teams'>('input');
  const [name, setName] = useState('');
  const [numPlayers, setNumPlayers] = useState(4);
  const [players, setPlayers] = useState<string[]>(Array(4).fill(''));
  const [validationError, setValidationError] = useState('');
  const [teamsGenerated, setTeamsGenerated] = useState<any[]>([]);

  useEffect(() => {
    setPlayers((prev) => Array(numPlayers).fill('').map((_, i) => prev[i] || ''));
  }, [numPlayers]);

  const handlePlayerChange = (text: string, index: number) => {
    const newPlayers = [...players];
    newPlayers[index] = text.trim();
    setPlayers(newPlayers);
  };

  const handleCreateTeams = () => {
    const cleanedPlayers = players.filter((p) => p !== '');
    if (!name.trim()) {
      setValidationError('Please enter a tournament name.');
      return;
    }
    if (cleanedPlayers.length < 4) {
      setValidationError('Minimum 4 players required.');
      return;
    }
    if (cleanedPlayers.length % 2 !== 0) {
      setValidationError('Number of players must be even.');
      return;
    }
    if (new Set(cleanedPlayers).size !== cleanedPlayers.length) {
      setValidationError('Player names must be unique.');
      return;
    }

    setValidationError('');
    const generatedTeams = generateTeams(cleanedPlayers);
    setTeamsGenerated(generatedTeams);
    setSetupStage('teams');
  };

  const handleScheduleFixtures = () => {
    const teams = teamsGenerated;
    const matches = generateRoundRobinMatches(teams);
    const matchesPerRound = Math.floor(teams.length / 2);
    const timeSlots = generateTimeSlots(matches.length, matchesPerRound);

    const scheduledMatches = matches.map((match, index) => ({
      ...match,
      timeSlot: timeSlots[index],
      court: (index % 2) + 1,
    }));

    const newTournament: Tournament = {
      name: name.trim(),
      date: new Date().toISOString().split('T')[0],
      players: teams.flatMap((t: any) => [t.player1, t.player2]),
      teams,
      matches: scheduledMatches,
      currentRound: 1,
      totalRounds: Math.ceil(matches.length / matchesPerRound),
      format: 'round-robin',
    };

    onTournamentCreated(newTournament);
  };

  const renderPlayerInputs = () => {
    return Array.from({ length: numPlayers }).map((_, index) => (
      <TextInput
        key={index}
        style={[globalStyles.input, setupStage === 'teams' && styles.disabledInput]}
        placeholder={`Player ${index + 1} Name`}
        placeholderTextColor={COLORS.BORDER}
        value={players[index]}
        onChangeText={(text) => handlePlayerChange(text, index)}
        editable={setupStage === 'input'}
      />
    ));
  };

  if (setupStage === 'input') {
    return (
      <ScrollView style={globalStyles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={globalStyles.title}>📝 Create Tournament</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Tournament Name"
          placeholderTextColor={COLORS.BORDER}
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Number of Players (Even, min 4):</Text>
        <View style={styles.stepper}>
          <StyledButton
            title="-"
            onPress={() => setNumPlayers((prev) => Math.max(4, prev - 2))}
            style={styles.stepperButton}
          />
          <Text style={styles.stepperValue}>{numPlayers}</Text>
          <StyledButton
            title="+"
            onPress={() => setNumPlayers((prev) => prev + 2)}
            style={styles.stepperButton}
          />
        </View>
        <Text style={globalStyles.title}>👥 Player Names</Text>
        {renderPlayerInputs()}
        {validationError ? <Text style={styles.error}>{validationError}</Text> : null}
        <StyledButton title="Create Teams" onPress={handleCreateTeams} gradient />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={globalStyles.title}>Teams Generated</Text>
      <Text style={globalStyles.subtitle}>Review the randomly paired teams below.</Text>
      <View style={styles.teamsContainer}>
        {teamsGenerated.map((team, index) => (
          <TeamCard key={team.id} team={team} index={index} />
        ))}
      </View>
      <StyledButton title="Schedule Fixtures" onPress={handleScheduleFixtures} gradient />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 100 },
  label: { fontSize: 16, marginVertical: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  stepperButton: { width: 40, height: 40, borderRadius: 20 },
  stepperValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.ACCENT, marginHorizontal: 16 },
  error: { color: COLORS.ERROR, textAlign: 'center', marginVertical: 8 },
  teamsContainer: { marginVertical: 16 },
  disabledInput: { backgroundColor: '#F0F0F0', opacity: 0.7 },
  backButton: { backgroundColor: COLORS.BORDER },
});

export default TournamentSetupForm;