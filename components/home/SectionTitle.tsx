import { ReactNode } from 'react';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors, HomeFonts } from '../../constants';

type Props = {
  title: string;
  icon?: ReactNode;
  /** Right-hand link text; pass null to hide it. */
  link?: string | null;
  linkColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function SectionTitle({ title, icon, link = 'VIEW ALL', linkColor = Colors.BRAND_RED, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.spacer} />
      {link ? (
        <>
          <Text style={[styles.link, { color: linkColor }]}>{link}</Text>
          <Chevron color={linkColor} />
        </>
      ) : null}
    </View>
  );
}

/** The ">" after a link, tinted to the link colour. */
export function Chevron({ color, style }: { color: string; style?: object }) {
  return <Image source={require('../../assets/home/view-all.png')} style={[styles.chevron, { tintColor: color }, style]} />;
}

export function Dot({ color }: { color: string }) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  row: { height: 18, flexDirection: 'row', alignItems: 'center' },
  title: { fontFamily: HomeFonts.semiCondensed, fontSize: 10, letterSpacing: 0.5, color: Colors.WHITE },
  spacer: { flex: 1 },
  link: { fontFamily: HomeFonts.semiCondensed, fontSize: 10, letterSpacing: 0.6 },
  chevron: { width: 4, height: 7, marginLeft: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
});
