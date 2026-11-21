import { DimensionValue, StyleSheet, View } from 'react-native';
import WinzzLogo from './WinzzLogo';

type Props = {
  maxWidth?: DimensionValue;
};

export default function AuthLogoArea({ maxWidth = '75%' }: Props) {
  return (
    <View style={styles.area}>
      <View style={[styles.logo, { maxWidth }]}>
        <WinzzLogo />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: '100%',
    aspectRatio: 1.028,
    justifyContent: 'flex-end',
  },
});
