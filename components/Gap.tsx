import { View } from 'react-native';

export default function Gap({ size }: { size: number }) {
  return <View style={{ flexBasis: size, flexShrink: 1, minHeight: Math.round(size / 3) }} />;
}
