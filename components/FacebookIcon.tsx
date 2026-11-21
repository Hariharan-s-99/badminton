import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants';

export default function FacebookIcon() {
  return (
    <View style={styles.facebook}>
      <Text style={styles.facebookF}>f</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  facebook: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  facebookF: {
    color: Colors.WHITE,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: -3,
  },
});
