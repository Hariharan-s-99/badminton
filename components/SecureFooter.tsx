import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants';

export default function SecureFooter() {
  return (
    <View style={styles.footer}>
      <Ionicons name="shield-checkmark-outline" size={20} color={Colors.BRAND_RED} />
      <Text style={styles.text}>Your data is safe and secure with us</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  text: {
    maxWidth: 190,
    color: Colors.TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
