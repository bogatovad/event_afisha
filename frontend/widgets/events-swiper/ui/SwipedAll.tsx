import React, {useEffect} from "react";
import {Box, Text} from "@/shared/ui";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Pressable} from "react-native";
import {useRouter} from "expo-router";
import {useSelectedTagStore} from "@/features/tag-selected";
import {useCalendarStore} from "@/features/dates";

export const SwipedAll: React.FC = () => {
  const router = useRouter();

  const { tag, setTag } = useSelectedTagStore();
  const { selectedDays } = useCalendarStore();

  useEffect(() => {
    swipedAllInfoOpacity.value = withTiming(1);
  }, []);

  const swipedAllInfoOpacity = useSharedValue(0);

  const swipedAllInfoStyle = useAnimatedStyle(() => ({
    opacity: swipedAllInfoOpacity.value,
    gap: 16
  }));

  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor="bg_color"
      padding="xl"
    >
      <Animated.View
        style={ swipedAllInfoStyle }
      >
        <Text
          variant="body"
          color="text_color"
          textAlign="center"
        >
          { tag ? "Мероприятия в этой категории закончились" : "Мероприятия закончились" }
        </Text>

        {
          tag && (
            <Pressable
              onPress={ () => {
                router.navigate("/tags");
                setTag(undefined);
              }}
            >
              <Box
                flexDirection="row"
                height={44}
                padding="l"
                alignItems="center"
                justifyContent="center"
                backgroundColor="button_color"
                style={{
                  borderRadius: 12
                }}
              >
                <Text
                  variant="body"
                  color="button_text_color"
                >
                  { "Выбрать другую категорию" }
                </Text>
              </Box>
            </Pressable>
          )
        }

        {
          Object.keys(selectedDays).length > 0 && (
            <Pressable
              onPress={ () => router.navigate("/(tabs)/calendar")}
            >
              <Box
                flexDirection="row"
                height={44}
                padding="l"
                alignItems="center"
                justifyContent="center"
                backgroundColor="button_color"
                style={{
                  borderRadius: 12
                }}
              >
                <Text
                  variant="body"
                  color="button_text_color"
                  textAlign={"center"}
                >
                  { "Изменить даты мероприятий" }
                </Text>
              </Box>
            </Pressable>
          )
        }
      </Animated.View>
    </Box>
  )
}
