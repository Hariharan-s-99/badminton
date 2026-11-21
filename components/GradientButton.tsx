import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants';

type Props = {
  label: string;
  onPress?: () => void;
};

export default function GradientButton({ label, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <LinearGradient
        colors={[Colors.BUTTON_GRADIENT_START, Colors.BUTTON_GRADIENT_END]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <Text style={styles.label}>{label}</Text>
        <Ionicons name="arrow-forward" size={18} color={Colors.WHITE} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BRAND_RED,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
