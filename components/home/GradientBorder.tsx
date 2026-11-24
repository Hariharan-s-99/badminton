import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants';

type Props = {
  radius: number;
  width: number;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export default function GradientBorder({ radius, width, style, innerStyle, children }: Props) {
  return (
    <LinearGradient
      colors={[Colors.PANEL_EDGE_RED, Colors.PANEL_EDGE_TEAL]}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 1, y: 0.7 }}
      style={[{ borderRadius: radius, padding: width }, style]}
    >
      <View style={[styles.inner, { borderRadius: Math.max(radius - width, 0) }, innerStyle]}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  inner: { backgroundColor: Colors.NAV_BG, overflow: 'hidden' },
});
