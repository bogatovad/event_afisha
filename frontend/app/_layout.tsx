import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {ConfigProvider} from "@/shared/providers/TelegramConfig/TelegramConfig";
import {DynamicThemeProvider} from "@/shared/providers/Theme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    InterItalic: require('@/assets/fonts/Inter-Italic.otf'),
    InterMedium: require('@/assets/fonts/Inter-Medium.otf'),
    InterRegular: require('@/assets/fonts/Inter-Regular.otf'),
    InterSemiBold: require('@/assets/fonts/Inter-SemiBold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ConfigProvider>
      <DynamicThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} redirect />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </DynamicThemeProvider>
    </ConfigProvider>
  );
}
