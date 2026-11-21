import { StyleSheet, View } from 'react-native';
import RatioImage from './RatioImage';

export default function WinzzLogo() {
  return (
    <View style={styles.container}>
      <RatioImage
        source={require('../assets/images/winzz_badge.png')}
        ratio={210 / 200}
        style={styles.badge}
      />
      <RatioImage
        source={require('../assets/images/winzz_text.png')}
        ratio={320 / 135}
        style={styles.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  badge: {
    width: '62%',
  },
  text: {
    width: '100%',
    marginTop: '-4%',
  },
});
