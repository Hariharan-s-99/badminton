import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants';

export default function OrDivider() {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.text}>OR</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.DIVIDER,
  },
  text: {
    color: Colors.WHITE,
    fontSize: 11,
  },
});
