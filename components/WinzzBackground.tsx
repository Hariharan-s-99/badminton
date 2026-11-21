import { ImageBackground, StyleSheet, View } from 'react-native';
import { Colors } from '../constants';

const SOURCE = require('../assets/images/winzz_background.jpg');

type Props = {
  children?: React.ReactNode;
};

export default function WinzzBackground({ children }: Props) {
  return (
    <View style={styles.background}>
      <ImageBackground source={SOURCE} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.BACKGROUND,
  },
  image: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
