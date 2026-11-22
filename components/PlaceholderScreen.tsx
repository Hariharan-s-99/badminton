import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants';

export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: Colors.WHITE, fontSize: 22, fontWeight: '500' },
  sub: { marginTop: 6, color: Colors.TEXT_MUTED, fontSize: 13 },
});
