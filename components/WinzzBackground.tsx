import { ImageBackground, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { Colors } from '../constants';
import RatioImage from './RatioImage';

const SHARED = require('../assets/images/winzz_background.jpg');

type TopArt = { source?: ImageSourcePropType; ratio?: number; color: string; top?: number };

type Props = {
  children?: React.ReactNode;
  // Screen-specific art that is pinned to the top and continues in a flat
  // colour below (so it works at any height without scrolling or stretching).
  topArt?: TopArt;
};

export default function WinzzBackground({ children, topArt }: Props) {
  return (
    <View style={[styles.background, topArt && { backgroundColor: topArt.color }]}>
      {topArt ? (
        topArt.source && (
          <View style={[styles.topArt, { top: topArt.top ?? 0 }]} pointerEvents="none">
            <RatioImage source={topArt.source} ratio={topArt.ratio ?? 1} style={styles.topArtImage} />
          </View>
        )
      ) : (
        <ImageBackground source={SHARED} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden', // the top art can be taller than short/wide viewports
    backgroundColor: Colors.BACKGROUND,
  },
  image: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  topArt: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  topArtImage: { width: '100%', maxWidth: 414 },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
