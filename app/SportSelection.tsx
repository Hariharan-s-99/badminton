import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Colors } from "@/constants";


interface Sport {
  id: string;
  name: string;
  emoji: string;
  gradient: [string, string];
}

const sports: Sport[] = [
  {
    id: 'badminton',
    name: 'Badminton',
    emoji: '🏸',
    gradient: ['#4A1419', Colors.THEME_CONTRAST],
  },
  {
    id: 'cricket',
    name: 'Cricket',
    emoji: '🏏',
    gradient: ['#1A1A1A', '#2D2D2D'],
  },
  {
    id: 'football',
    name: 'Football',
    emoji: '⚽',
    gradient: ['#1A1A1A', '#2D2D2D'],
  },
  {
    id: 'tennis',
    name: 'Tennis',
    emoji: '🎾',
    gradient: ['#1A1A1A', '#2D2D2D'],
  },
  {
    id: 'table-tennis',
    name: 'Table Tennis',
    emoji: '🏓',
    gradient: ['#1A1A1A', '#2D2D2D'],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    emoji: '🏀',
    gradient: ['#1A1A1A', '#2D2D2D'],
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    emoji: '🏐',
    gradient: ['#1A1A1A', '#2D2D2D'],
  },
  {
    id: 'golf',
    name: 'Golf',
    emoji: '⛳',
    gradient: ['#1A1A1A', '#2D2D2D'],
  },
];

const SportSelection = () => {
  
  const handleSportPress = (sport: Sport) => {
    if (sport.id === 'badminton') {
      router.push("./badmintonKickStart");
    } else {
      console.log(`${sport.name} is locked - Coming Soon!`);
    }
  };

  const isLocked = (sportId: string) => sportId !== 'badminton';

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Pick Your Game</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.sportsContainer}>
        {sports.map((sport) => {
          const locked = isLocked(sport.id);

          return (
            <TouchableOpacity
              key={sport.id}
              style={[
                styles.sportButton,
                locked && styles.lockedButton,
              ]}
              onPress={() => handleSportPress(sport)}
              activeOpacity={locked ? 1 : 0.85}
              disabled={locked}
            >
              <View
                style={[
                  styles.gradientButton,
                  { backgroundColor: locked ? sport.gradient[1] : sport.gradient[1] },
                  !locked && { backgroundColor: sport.gradient[1] } 
                ]}
              >
                <View style={styles.buttonContent}>
                  <View style={styles.nameContainer}>
                    <Text
                      style={[
                        styles.emoji,
                        locked && styles.lockedEmoji,
                      ]}
                    >
                      {sport.emoji}
                    </Text>
                    <Text
                      style={[
                        styles.sportName,
                        locked ? styles.lockedText : styles.activeText,
                      ]}
                    >
                      {sport.name}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.arrow,
                      locked ? styles.lockedArrow : styles.activeArrow,
                    ]}
                  >
                    <Text
                      style={[
                        styles.arrowText,
                        locked ? styles.lockedArrowText : styles.activeArrowText,
                      ]}
                    >
                      {locked ? '🔒' : '>'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>More sports coming soon!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    textAlign: 'center',
    color: Colors.TITLE_COLOR,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  divider: {
    width: 80,
    height: 4,
    backgroundColor: Colors.THEME_CONTRAST,
    borderRadius: 2,
  },
  sportsContainer: {
    paddingVertical: 16,
  },
  sportButton: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 36,
    marginRight: 16,
  },
  sportName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  arrowText: {
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: Colors.TITLE_COLOR,
    opacity: 0.6,
    fontWeight: '500',
  },
  activeText: {
    color: Colors.TITLE_COLOR,
  },
  activeArrow: {
  },
  activeArrowText: {
    color: Colors.TITLE_COLOR,
    fontSize: 24,
  },
  lockedButton: {
    opacity: 0.8,
  },
  lockedEmoji: {
    opacity: 0.4,
  },
  lockedText: {
    color: Colors.TITLE_COLOR,
  },
  lockedArrow: {
  },
  lockedArrowText: {
    color: Colors.TITLE_COLOR,
    fontSize: 16,
  },
});

export default SportSelection;
