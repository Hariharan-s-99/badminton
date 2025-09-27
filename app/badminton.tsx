import ParallaxScrollView from '@/components/parallax-scroll-view';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Color variables
const COLORS = {
  TEXT_PRIMARY: '#4A4A4A',
  BUTTON_PRIMARY: 'rgba(180, 131, 131, 0.26)',
  BUTTON_SECONDARY: 'rgba(99, 7, 7, 0.26)',
  BACK_ICON_BACKGROUND: 'rgba(122, 8, 8, 0.4)',
};

export default function BadmintonScreen() {
  const insets = useSafeAreaInsets();
  
  const handleBackPress = () => {
    router.back();
  };

  const handleOrganizeTournament = () => {
    router.push('/badminton/new');
  };

  const handleContinueTournament = () => {
    router.push('/badminton/continue');
  };

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        backgroundImage={require('../assets/images/badmintonBack.svg')}
      >
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to Badminton!</Text>
          <Text style={styles.description}>
            Get ready to play the fastest racket sport in the world
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleOrganizeTournament}>
            <Text style={styles.buttonText}>Organize New Tournament</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleContinueTournament}>
            <Text style={styles.buttonText}>Continue Existing Tournament</Text>
          </TouchableOpacity>
        </View>
      </ParallaxScrollView>

      {/* Perfect Back Icon with Safe Area */}
      <TouchableOpacity 
        style={[
          styles.backIcon, 
          { 
            top: insets.top + 10, // Dynamic safe area + 10px padding
          }
        ]} 
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <View style={styles.backIconContainer}>
          <Text style={styles.backIconText}>←</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    minHeight: 600,
    marginTop: 80,
  },
  welcomeText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    gap: 16,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 20, // Higher z-index to ensure it's always on top
  },
  backIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.BACK_ICON_BACKGROUND,
    borderRadius: 22, // Perfect circle
    alignItems: 'center',
    justifyContent: 'center',
    // Add subtle shadow for better visibility
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  backIconText: {
    color: '#FFFFFF', // White for better contrast
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -2, // Slight adjustment to center the arrow visually
  },
});