import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants';

type Props = {
  height?: number;
  radius?: number;
  border?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export default function Panel({ height, radius = 8, border = 1.2, style, contentStyle, children }: Props) {
  return (
    <View style={[{ height, borderRadius: radius, padding: border, overflow: 'hidden' }, style]}>
      <LinearGradient
        colors={[Colors.PANEL_EDGE_RED, Colors.PANEL_EDGE_TEAL]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[Colors.PANEL_EDGE_SHADE, Colors.PANEL_EDGE_SHADE, 'transparent']}
        locations={[0, 0.4, 0.75]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.fill, { borderRadius: Math.max(radius - border, 0) }, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: Colors.PANEL_SOLID },
});
