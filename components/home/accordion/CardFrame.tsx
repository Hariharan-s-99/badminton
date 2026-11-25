import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';
import { Colors } from '../../../constants';


const R = 6;
const SW = 1.2;
const H = SW / 2;

function halfPaths(w: number, h: number) {
  const c = w / 2;
  const bar = (x: number, y0: number, y1: number, dx: number, bw: number) => `M${x} ${y0}H${x + bw}L${x + bw + dx} ${y1}H${x + dx}Z`;
  return {
    edge:
      `M${c - 62} ${H}H${R + H}A${R} ${R} 0 0 0 ${H} ${R + H}` +
      `V${h - R - H}A${R} ${R} 0 0 0 ${R + H} ${h - H}H${c - 75}`,
    topLine: `M${c - 50} 3.6H${c - 44}`,
    stripes: [c - 63, c - 58.5, c - 54].map((x) => bar(x, 0, 4, 2.5, 3.5)).join(''),
    dim: [c - 77, c - 72.6, c - 68.2].map((x) => bar(x, h, h - 3, 3.2, 3)).join(''),
    dimLine: `M${c - 65.5} ${h - 2.6}H${c - 60}`,
  };
}

export default function CardFrame() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const { w, h } = size;
  const p = w ? halfPaths(w, h) : null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={onLayout}>
      {p ? (
        <Svg width={w} height={h}>
          <Defs>
            <LinearGradient id="edgeL" x1="0" y1="0" x2={w / 2} y2="0" gradientUnits="userSpaceOnUse">
              <Stop offset="0.25" stopColor={Colors.LIVE_EDGE_LEFT} />
              <Stop offset="0.5" stopColor={Colors.LIVE_EDGE_GOLD} />
            </LinearGradient>
            <LinearGradient id="edgeR" x1="0" y1="0" x2={w / 2} y2="0" gradientUnits="userSpaceOnUse">
              <Stop offset="0.45" stopColor={Colors.LIVE_EDGE_RIGHT} />
              <Stop offset="0.75" stopColor={Colors.LIVE_TEAL} />
            </LinearGradient>
          </Defs>
          <Half p={p} edge="url(#edgeL)" stripes={Colors.LIVE_EDGE_GOLD} dim={Colors.LIVE_EDGE_GOLD_DIM} />
          <G transform={`translate(${w} 0) scale(-1 1)`}>
            <Half p={p} edge="url(#edgeR)" stripes={Colors.LIVE_TEAL} dim={Colors.LIVE_EDGE_TEAL_DIM} />
          </G>
        </Svg>
      ) : null}
    </View>
  );
}

type HalfProps = { p: ReturnType<typeof halfPaths>; edge: string; stripes: string; dim: string };

function Half({ p, edge, stripes, dim }: HalfProps) {
  return (
    <>
      <Path d={p.edge} stroke={edge} strokeWidth={SW} fill="none" />
      <Path d={p.topLine} stroke={stripes} strokeWidth={SW} fill="none" />
      <Path d={p.stripes} fill={stripes} />
      <Path d={p.dim} fill={dim} />
      <Path d={p.dimLine} stroke={dim} strokeWidth={0.6} strokeOpacity={0.5} fill="none" />
    </>
  );
}
