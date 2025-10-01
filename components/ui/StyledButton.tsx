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

// Dark Red Theme Colors
const COLORS = {
  PRIMARY: '#8B0000',
  ACCENT: '#FF6B6B',
  GRADIENT_START: '#8B0000',
  GRADIENT_END: '#5C0000',
  TEXT_PRIMARY: '#FFFFFF',
};

const StyledButton: React.FC<StyledButtonProps> = ({ title, onPress, gradient, style }) => {
  const content = (
    <TouchableOpacity 
      style={[styles.button, !gradient && styles.solidButton, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      {gradient ? (
        <LinearGradient 
          colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]} 
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
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
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solidButton: {
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: { 
    color: COLORS.TEXT_PRIMARY, 
    fontSize: 16, 
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gradient: { 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 6,
  },
});

export default StyledButton;