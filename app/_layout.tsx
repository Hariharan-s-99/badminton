import { BarlowCondensed_500Medium, BarlowCondensed_600SemiBold } from '@expo-google-fonts/barlow-condensed';
import {
  BarlowSemiCondensed_400Regular,
  BarlowSemiCondensed_500Medium,
  BarlowSemiCondensed_600SemiBold,
  BarlowSemiCondensed_700Bold,
} from '@expo-google-fonts/barlow-semi-condensed';
import { ChakraPetch_600SemiBold } from '@expo-google-fonts/chakra-petch';
import { RobotoCondensed_500Medium } from '@expo-google-fonts/roboto-condensed';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  // Not gated on `loaded`: the static web export must still render, and text
  // simply swaps to the design font once it arrives.
  useFonts({
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
    BarlowSemiCondensed_400Regular,
    BarlowSemiCondensed_500Medium,
    BarlowSemiCondensed_600SemiBold,
    BarlowSemiCondensed_700Bold,
    RobotoCondensed_500Medium,
    ChakraPetch_600SemiBold,
  });
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
