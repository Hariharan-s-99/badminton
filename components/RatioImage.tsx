import { Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  source: ImageSourcePropType;
  ratio: number;
  style?: StyleProp<ViewStyle>;
};

export default function RatioImage({ source, ratio, style }: Props) {
  return (
    <View style={[{ aspectRatio: ratio }, style]}>
      <Image source={source} style={styles.fill} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    width: '100%',
    height: '100%',
  },
});
