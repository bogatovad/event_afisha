import React, {useEffect} from "react";
import Animated, {interpolateColor, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";
import {OnboardingIllustration, OnboardingNav, OnboardingText, useOnboardingStore} from "@/widgets/Onboarding";
import {Box} from "@/shared/ui";

export const OnboardingPage: React.FC = () => {
  const theme = useTheme<Theme>();
  const backgroundAnimation = useSharedValue(0)

  const animatedBackground = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      backgroundAnimation.value,
      [1, 2, 3],
      [theme.colors.lime, theme.colors.blue, theme.colors.lightblue],
      'RGB',
      {gamma: 2.2}
    ),
  }));

  const { page } = useOnboardingStore();

  useEffect(() => {
    backgroundAnimation.value = withTiming(page, { duration: 400 });
  }, [page]);

  return (
    <Animated.View
      style={[
        animatedBackground,
        {
          flex: 1,
          justifyContent: "flex-end",
          gap: 36
        }
      ]}
    >
      <OnboardingIllustration/>

      <OnboardingText/>

      <OnboardingNav/>
    </Animated.View>
  )
}
