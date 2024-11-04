import React, {useEffect} from "react";
import {Pressable} from "react-native";
import {useRouter} from "expo-router";
import {MaterialIcons} from "@expo/vector-icons";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import Swiper from "react-native-deck-swiper";
import {useEventsStore} from "@/widgets/Events";
import {useCalendarStore} from "@/features/Date";
import {EventCard} from "@/entities/Event";
import {Box, ErrorCard, LoadingCard} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {getPeriodBorders} from "@/shared/scripts/date";

export const EventsSwiper = () => {
  const theme = useTheme<Theme>();
  const router = useRouter();
  const username = useConfig().initDataUnsafe.user.username;
  const {
    tag,
    events,
    isLoading,
    hasError,
    swipedAll,
    fetchEvents,
    saveAction,
    setSwipedAll,
    setTag,
    descriptionExpanded,
  } = useEventsStore();

  const {
    selectedDays,
  } = useCalendarStore();

  const swipedAllInfoOpacity = useSharedValue(0);
  const likeOpacity = useSharedValue(0);
  const dislikeOpacity = useSharedValue(0);

  const likeStyle = useAnimatedStyle(() => ({
    opacity: likeOpacity.value,
    transform: [{ translateX: withTiming(likeOpacity.value ? -20 : 20) }],
  }));
  const dislikeStyle = useAnimatedStyle(() => ({
    opacity: dislikeOpacity.value,
    transform: [{ translateX: withTiming(dislikeOpacity.value ? 20 : -20) }],
  }));

  const resetOpacity = () => {
    likeOpacity.value = withTiming(0);
    dislikeOpacity.value = withTiming(0);
  }

  const swipedAllInfoStyle = useAnimatedStyle(() => ({
    opacity: swipedAllInfoOpacity.value,
    gap: 16
  }));

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));

    fetchEvents(tag, borders.date_start, borders.date_end);
  }, [tag]);

  useEffect(() => {
    if (swipedAll) {
      swipedAllInfoOpacity.value = withTiming(1);
    } else {
      swipedAllInfoOpacity.value = withTiming(0);
    }
  }, [swipedAll]);

  if (isLoading) {
    return (
      <Box flex={1} backgroundColor="bg_color" style={{ paddingHorizontal: 16, paddingBottom: 16}}>
        <LoadingCard style={{ borderRadius: 16, overflow: 'hidden', height: "100%", width: "100%" }}/>
      </Box>
    );
  }

  if (hasError) {
    return <ErrorCard />
  }

  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
    >
      {
        !swipedAll && (
          <Box flex={1} backgroundColor="bg_color">
            <Swiper
              cards={events}
              renderCard={(event) => (
                <EventCard
                  name={event.name}
                  date={event.date}
                  description={event.description}
                  image={event.image}
                  contact={event.contact}
                />
              )}
              backgroundColor="white"
              cardHorizontalMargin={16}
              horizontalSwipe={!descriptionExpanded}
              verticalSwipe={false}
              stackSize={3}
              containerStyle={{ backgroundColor: theme.colors.bg_color }}
              cardStyle={{ height: "100%", paddingBottom: 16 }}
              cardVerticalMargin={0}
              childrenOnTop={true}
              onSwipedAll={() => setSwipedAll(true)}
              onSwiping={(x) => {
                likeOpacity.value = x > 0 ? Math.min(x / 100, 1) : 0;
                dislikeOpacity.value = x < 0 ? Math.min(-x / 100, 1) : 0;
              }}
              onSwiped={resetOpacity}
              onSwipedRight={(cardIndex) => saveAction("like", events[cardIndex].id, username)}
              onSwipedLeft={(cardIndex) => saveAction("dislike", events[cardIndex].id, username)}
              onSwipedAborted={resetOpacity}
            />

            {/* Иконка лайка */}
            <Animated.View style={[likeStyle, { position: "absolute", right: 0, top: "50%" }]}>
              <Box width={50} height={50} alignItems={"center"} justifyContent={"center"}
                   style={{ borderRadius: 25, backgroundColor: 'rgb(95,239,15)'}}>
                <MaterialIcons name="thumb-up" size={24} color="white" />
              </Box>
            </Animated.View>

            {/* Иконка дизлайка */}
            <Animated.View style={[dislikeStyle, { position: "absolute", left: 0, top: "50%" }]}>
              <Box width={50} height={50} alignItems={"center"} justifyContent={"center"}
                   style={{ borderRadius: 25, backgroundColor: 'rgb(255,0,0)'}}>
                <MaterialIcons name="thumb-down" size={24} color="white" />
              </Box>
            </Animated.View>
          </Box>
        )
      }

      {
        swipedAll && (
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
            </Animated.View>
          </Box>
        )
      }
    </Box>
  )
}
