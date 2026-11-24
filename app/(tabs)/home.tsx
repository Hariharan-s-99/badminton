import { ScrollView, StyleSheet, View } from 'react-native';
import ActionCards from '../../components/home/ActionCards';
import LiveMatches from '../../components/home/LiveMatches';
import PerformancePanel from '../../components/home/PerformancePanel';
import ProfileHeader from '../../components/home/ProfileHeader';
import TopPlayers from '../../components/home/TopPlayers';
import RatioImage from '../../components/RatioImage';

const ART = require('../../assets/images/winzz_home_background.png');
const ART_RATIO = 1267 / 2768;

export default function HomeScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.art} pointerEvents="none">
        <RatioImage source={ART} ratio={ART_RATIO} style={styles.artImage} />
      </View>

      <ProfileHeader />
      <ActionCards />
      <PerformancePanel />
      <LiveMatches />
      <TopPlayers />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  page: {
    width: '100%',
    maxWidth: 414,
    alignSelf: 'center',
    paddingHorizontal: 6,
    paddingBottom: 10,
    gap: 10,
  },
  art: { position: 'absolute', top: 0, left: 0, right: 0 },
  artImage: { width: '100%' },
});
