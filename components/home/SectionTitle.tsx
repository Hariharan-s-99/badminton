import { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors, HomeFonts } from '../../constants';

type Props = {
  title: string;
  icon?: ReactNode;
  link?: string;
};

export default function SectionTitle({ title, icon, link = 'VIEW ALL' }: Props) {
  return (
    <View style={styles.row}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.spacer} />
      {link ? (
        <>
          <Text style={styles.link}>{link}</Text>
          <Image source={require('../../assets/home/view-all.png')} style={styles.chevron} />
        </>
      ) : null}
    </View>
  );
}

export function Dot({ color }: { color: string }) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  row: { height: 18, flexDirection: 'row', alignItems: 'center' },
  title: { fontFamily: HomeFonts.semiCondensed, fontSize: 11, letterSpacing: 0.8, color: Colors.WHITE },
  spacer: { flex: 1 },
  link: { fontFamily: HomeFonts.semiCondensed, fontSize: 11, letterSpacing: 0.9, color: Colors.BRAND_RED },
  chevron: { width: 4, height: 7, marginLeft: 4 },
  dot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 5 },
});
