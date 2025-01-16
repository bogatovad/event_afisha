import React, {useEffect, useState} from "react";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withClamp, withTiming} from "react-native-reanimated";
import { useOnboardingStore } from "@/widgets/onboarding-elements/model/store/useOnboardingStore";
import { Box, Text } from "@/shared/ui";

export const OnboardingText: React.FC = () => {
  const { page, pageTitle, pageSubtitle, setPageText } = useOnboardingStore();
  const [pageSubTick, setPageSubTick] = useState(page);
  const [text, setText] = useState('')

  const opacity = useSharedValue(1);
  useEffect(() => {
    if (page != 1) {
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setPageSubTick)(page);
        runOnJS(setPageText)();
        opacity.value = withTiming(1, { duration: 200 });
      });
    } else {
      opacity.value = withTiming(1, { duration: 200 }, () => {
        runOnJS(setPageSubTick)(page);
        runOnJS(setPageText)();
        opacity.value = withTiming(1, { duration: 200 });
      });
    }
  }, [page]);
  
  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const changeTexthandler: void = useEffect(() => {
    // page === 1 ? 'для тебя' : (page === 2 ? 'под рукой' : '')
    let newText;
    if (page === 1) {
      newText = 'для тебя'
    } else if (page === 2) {
      newText = 'под рукой'
    } else {
      newText = ''
    }

    let timeoutId: any;
    if (page !== 1) {
      timeoutId = setTimeout(() => {
        setText(newText);
      }, 200);
    } else {
      setText(newText);
    }

    return () => clearTimeout(timeoutId);
  }, [page]) 


  return (
    <Animated.View
      style={animatedOpacity} 
    >
      <Box
        style={{
          gap: 20,
          paddingHorizontal: 40
        }}
      >
        <Box
          style={{
            backgroundColor: "#E1F44B",
            borderRadius: 25,
            padding: 10,
          }}
        >
          <Text
            variant={"onboardingSubtitle"}
            textAlign={"center"}
            color={"black" }
            fontSize={14}
            fontWeight={400}
            lineHeight={20}
          >
            {pageSubtitle} <Text fontWeight={800} color={"totalBlack"}>{text}</Text>
          </Text>
        </Box>
      </Box>
    </Animated.View>
  );
};
