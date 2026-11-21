import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import WinzzBackground from '../components/WinzzBackground';
import WinzzLogo from '../components/WinzzLogo';
import { Colors } from '../constants';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useLocalSearchParams<{ user?: string }>();

  return (
    <WinzzBackground>
      <View style={styles.screen}>
        <View style={styles.logo}>
          <WinzzLogo />
        </View>
        <Text style={styles.welcome}>Welcome{user ? `, ${user}` : ''}!</Text>
        <Text style={styles.subtitle}>You are logged in</Text>
        <Pressable onPress={() => router.replace('/login')} style={styles.logout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>
    </WinzzBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: '68%',
    maxWidth: 320,
  },
  welcome: {
    marginTop: 28,
    color: Colors.WHITE,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    color: Colors.TEXT_MUTED,
    fontSize: 13,
  },
  logout: {
    marginTop: 28,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: Colors.BRAND_RED,
    fontSize: 14,
    fontWeight: '700',
  },
});
