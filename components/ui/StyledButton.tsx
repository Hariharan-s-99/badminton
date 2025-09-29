import { COLORS } from '@/app/utils/styles';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface StyledButtonProps {
  title: string;
  onPress: () => void;
  gradient?: boolean;
  style?: any;
}

const StyledButton: React.FC<StyledButtonProps> = ({ title, onPress, gradient, style }) => {
  const content = (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      {gradient ? (
        <LinearGradient colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]} style={styles.gradient}>
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: COLORS.ACCENT,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  gradient: { borderRadius: 25 },
});

export default StyledButton;