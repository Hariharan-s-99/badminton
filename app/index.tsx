import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import RatioImage from '../components/RatioImage';
import WinzzBackground from '../components/WinzzBackground';
import WinzzLogo from '../components/WinzzLogo';
import { Colors } from '../constants';

const LOAD_DURATION_MS = 5000;

export default function LoadingScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: LOAD_DURATION_MS,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) router.replace('/login');
    });
  }, [progress, router]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <WinzzBackground>
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.logoArea}>
            <View style={styles.logo}>
              <WinzzLogo />
            </View>
          </View>

          <View style={styles.bottom}>
            <View style={styles.track}>
              <Animated.View style={[styles.fill, { width: fillWidth }]}>
                <LinearGradient
                  colors={['rgba(255,0,0,0)', Colors.ERROR, Colors.WHITE]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
            <Text style={styles.loadingText}>LOADING...</Text>
            <RatioImage
              source={require('../assets/images/winzz_nav_icons.png')}
              ratio={351 / 60}
              style={styles.navIcons}
            />
          </View>
        </View>
      </View>
    </WinzzBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    paddingBottom: 32,
  },
  logoArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 90,
  },
  logo: {
    width: '68%',
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
  },
  track: {
    width: '43%',
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  loadingText: {
    marginTop: 14,
    paddingLeft: 4,
    color: Colors.TITLE_COLOR,
    fontSize: 12,
    letterSpacing: 4,
  },
  navIcons: {
    width: '66%',
    marginTop: 36,
  },
});
