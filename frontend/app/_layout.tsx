import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {ConfigProvider} from "@/shared/providers/TelegramConfig";
import {DynamicThemeProvider} from "@/shared/providers/Theme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    InterItalic: require('../shared/assets/fonts/Inter-Italic.otf'),
    InterMedium: require('../shared/assets/fonts/Inter-Medium.otf'),
    InterRegular: require('../shared/assets/fonts/Inter-Regular.otf'),
    InterSemiBold: require('../shared/assets/fonts/Inter-SemiBold.otf'),
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
