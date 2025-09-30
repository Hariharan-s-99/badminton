import StyledButton from '@/components/ui/StyledButton';
import TeamCard from '@/components/ui/TeamCard';
import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [setupStage]);

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
      <View key={index} style={styles.inputWrapper}>
        <View style={styles.playerNumber}>
          <Text style={styles.playerNumberText}>{index + 1}</Text>
        </View>
        <TextInput
          style={[
            globalStyles.input,
            styles.playerInput,
            setupStage === 'teams' && styles.disabledInput
          ]}
          placeholder={`Player ${index + 1} Name`}
          placeholderTextColor={COLORS.BORDER}
          value={players[index]}
          onChangeText={(text) => handlePlayerChange(text, index)}
          editable={setupStage === 'input'}
        />
      </View>
    ));
  };

  if (setupStage === 'input') {
    return (
      <ScrollView style={globalStyles.container} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🏆</Text>
            <Text style={[globalStyles.title, styles.mainTitle]}>Create Tournament</Text>
            <Text style={styles.subtitle}>Set up your badminton doubles tournament</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tournament Name</Text>
            <TextInput
              style={[globalStyles.input, styles.nameInput]}
              placeholder="e.g. Summer Championship 2025"
              placeholderTextColor={COLORS.BORDER}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Number of Players</Text>
            <Text style={styles.sectionHint}>Must be even, minimum 4</Text>
            <View style={styles.stepper}>
              <StyledButton
                title="−"
                onPress={() => setNumPlayers((prev) => Math.max(4, prev - 2))}
                style={styles.stepperButton}
              />
              <View style={styles.stepperValueContainer}>
                <Text style={styles.stepperValue}>{numPlayers}</Text>
                <Text style={styles.stepperLabel}>players</Text>
              </View>
              <StyledButton
                title="+"
                onPress={() => setNumPlayers((prev) => prev + 2)}
                style={styles.stepperButton}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>👥 Player Names</Text>
            <Text style={styles.sectionHint}>Enter all player names below</Text>
            <View style={styles.playersGrid}>
              {renderPlayerInputs()}
            </View>
          </View>

          {validationError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.error}>{validationError}</Text>
            </View>
          ) : null}

          <View style={styles.actionButton}>
            <StyledButton 
              title="✨ Generate Teams" 
              onPress={handleCreateTeams} 
              gradient 
            />
          </View>
        </Animated.View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.scrollContent}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🎯</Text>
          <Text style={[globalStyles.title, styles.mainTitle]}>Teams Generated</Text>
          <Text style={styles.subtitle}>
            {teamsGenerated.length} teams have been randomly paired
          </Text>
        </View>

        <View style={styles.teamsContainer}>
          {teamsGenerated.map((team, index) => (
            <TeamCard key={team.id} team={team} index={index} />
          ))}
        </View>

        <View style={styles.actionButton}>
          <StyledButton 
            title="📅 Schedule Fixtures" 
            onPress={handleScheduleFixtures} 
            gradient 
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { 
    padding: 20, 
    paddingBottom: 120 
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 8,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.BORDER,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY || '#1A1A1A',
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 13,
    color: COLORS.BORDER,
    marginBottom: 12,
  },
  nameInput: {
    fontSize: 16,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: COLORS.BACKGROUND || '#F8F9FA',
    borderRadius: 16,
    padding: 16,
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepperValueContainer: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  stepperValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
  },
  stepperLabel: {
    fontSize: 12,
    color: COLORS.BORDER,
    marginTop: 2,
  },
  playersGrid: {
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playerNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerNumberText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  playerInput: {
    flex: 1,
    marginVertical: 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorIcon: {
    fontSize: 20,
  },
  error: {
    color: COLORS.ERROR,
    fontSize: 14,
    fontWeight: '600',
  },
  teamsContainer: {
    marginVertical: 16,
    gap: 12,
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    opacity: 0.7,
  },
  actionButton: {
    marginTop: 8,
    marginBottom: 20,
  },
});

export default TournamentSetupForm;