import { Tabs, usePathname } from 'expo-router';
import BottomNavBar from '../../components/BottomNavBar';
import WinzzBackground from '../../components/WinzzBackground';
import { Colors } from '../../constants';

const HOME_ART = { color: Colors.HOME_BG };

export default function TabsLayout() {
  const pathname = usePathname();
  return (
    <WinzzBackground topArt={pathname === '/home' ? HOME_ART : undefined}>
      <Tabs
        tabBar={(props) => <BottomNavBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="players" />
        <Tabs.Screen name="matches" />
        <Tabs.Screen name="more" />
      </Tabs>
    </WinzzBackground>
  );
}
