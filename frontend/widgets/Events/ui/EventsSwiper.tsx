import React, {useEffect, useRef} from "react";
import {Pressable} from "react-native";
import {useRouter} from "expo-router";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import Swiper from "react-native-deck-swiper";
import {useEventsStore} from "@/widgets/Events/model/store/useEventsStore";
import {useCalendarStore} from "@/widgets/Date";
import {EventCard} from "@/entities/Event";
import {Box, ErrorCard, LoadingCard} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {getPeriodBorders} from "@/shared/scripts/date";
import {useLikesStore} from "@/widgets/Likes";
import {Event} from "@/entities/Event"

export const EventsSwiper = () => {
  const theme = useTheme<Theme>();
  const router = useRouter();
  const username = useConfig().initDataUnsafe.user.username;
  const swiperRef = useRef<Swiper<Event> | null>();
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
  } = useEventsStore();

  const {
    selectedDays,
  } = useCalendarStore();

  const {
    addLikedEvent,
    removeLikedEvent
  } = useLikesStore();

  const swipedAllInfoOpacity = useSharedValue(0);

  const swipedAllInfoStyle = useAnimatedStyle(() => ({
    opacity: swipedAllInfoOpacity.value,
    gap: 16
  }));

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchEvents(tag, borders.date_start, borders.date_end);
  }, [tag, selectedDays]);

  useEffect(() => {
    if (swipedAll) {
      swipedAllInfoOpacity.value = withTiming(1);
    } else {
      swipedAllInfoOpacity.value = withTiming(0);
    }
  }, [swipedAll]);

  if (isLoading) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <LoadingCard style={{ height: "100%", width: "100%" }}/>
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
              ref={swiper => {
                swiperRef.current = swiper;
              }}
              cards={events}
              renderCard={(event) => (
                <EventCard
                  event={event}
                  onLike={ () => { swiperRef.current?.swipeRight() } }
                  onDislike={ () => { swiperRef.current?.swipeLeft() } }
                />
              )}
              backgroundColor="white"
              horizontalSwipe={false}
              verticalSwipe={false}
              stackSize={3}
              containerStyle={{ backgroundColor: theme.colors.bg_color }}
              cardStyle={{ height: "100%" }}
              cardVerticalMargin={0}
              cardHorizontalMargin={0}
              childrenOnTop={true}
              onSwipedAll={() => setSwipedAll(true)}
              onSwipedRight={(cardIndex) => {
                saveAction("like", events[cardIndex].id, username)
                  .then(() => addLikedEvent(events[cardIndex]))
              }}
              onSwipedLeft={(cardIndex) => {
                saveAction("dislike", events[cardIndex].id, username)
                  .then(() => removeLikedEvent(events[cardIndex].id))
              }}
              inputRotationRange={[-100 / 2, 0, 100 / 2]}
              outputRotationRange={["0deg", "0deg", "0deg"]}
            />
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
    </Box>
  )
}
