import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Tournament } from '../utils/types';
import FixturesPointsTab from './FixturesPointsTab';
import TeamsTab from './TeamsTab';

interface TournamentReviewTabsProps {
  tournament: Tournament;
  onShuffle: () => void;
  onCompleteMatch: (matchId: string, team1Score: number, team2Score: number) => void;
}

// Dark Red Theme Colors
const COLORS = {
  BACKGROUND: '#1A0505',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B89090',
  PRIMARY: '#8B0000',
  ACCENT: '#FF6B6B',
  TAB_BG: 'rgba(139, 0, 0, 0.15)',
  TAB_BORDER: 'rgba(139, 0, 0, 0.3)',
  BORDER: 'rgba(139, 0, 0, 0.5)',
};

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
    <View style={styles.container}>
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, currentTab === 'teams' && styles.activeTab]}
          onPress={() => setCurrentTab('teams')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, currentTab === 'teams' && styles.activeTabText]}>
            👥 Team Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, currentTab === 'fixtures' && styles.activeTab]}
          onPress={() => setCurrentTab('fixtures')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, currentTab === 'fixtures' && styles.activeTabText]}>
            🗓️ Fixtures & Points
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.TAB_BG,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.TAB_BORDER,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  activeTab: { 
    backgroundColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabText: { 
    fontSize: 15, 
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  activeTabText: { 
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
  },
});

export default TournamentReviewTabs;