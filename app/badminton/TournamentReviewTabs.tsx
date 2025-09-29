import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../utils/styles';
import { Tournament } from '../utils/types';
import FixturesPointsTab from './FixturesPointsTab';
import TeamsTab from './TeamsTab';


interface TournamentReviewTabsProps {
  tournament: Tournament;
  onShuffle: () => void;
  onCompleteMatch: (matchId: string, team1Score: number, team2Score: number) => void;
}

const TournamentReviewTabs: React.FC<TournamentReviewTabsProps> = ({ tournament, onShuffle, onCompleteMatch }) => {
  const [currentTab, setCurrentTab] = useState<'teams' | 'fixtures'>('teams');
  const [scores, setScores] = useState<{ [matchId: string]: { team1: string; team2: string } }>({});

  const handleScoreChange = (matchId: string, teamKey: 'team1' | 'team2', value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setScores((prev) => ({
      ...prev,
      [matchId]: { ...(prev[matchId] || { team1: '', team2: '' }), [teamKey]: numericValue },
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, currentTab === 'teams' && styles.activeTab]}
          onPress={() => setCurrentTab('teams')}
        >
          <Text style={[styles.tabText, currentTab === 'teams' && styles.activeTabText]}>Team Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, currentTab === 'fixtures' && styles.activeTab]}
          onPress={() => setCurrentTab('fixtures')}
        >
          <Text style={[styles.tabText, currentTab === 'fixtures' && styles.activeTabText]}>Fixtures & Points</Text>
        </TouchableOpacity>
      </View>
      {currentTab === 'teams' ? (
        <TeamsTab tournament={tournament} onShuffle={onShuffle} />
      ) : (
        <FixturesPointsTab
          tournament={tournament}
          scores={scores}
          onScoreChange={handleScoreChange}
          onCompleteMatch={onCompleteMatch}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.BORDER,
    borderRadius: 25,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 20 },
  activeTab: { backgroundColor: COLORS.ACCENT },
  tabText: { fontSize: 16, fontWeight: '600' },
  activeTabText: { color: '#FFF' },
});

export default TournamentReviewTabs;