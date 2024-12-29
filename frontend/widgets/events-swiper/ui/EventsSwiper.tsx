import React, {useEffect, useRef} from "react";
import {Pressable} from "react-native";
import {useRouter} from "expo-router";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import Swiper from "react-native-deck-swiper";
import {useEventsSwiperStore} from "@/features/content";
import {useCalendarStore} from "@/features/dates";
import {useReactionsStore} from "@/features/likes-dislikes";
import {useSelectedTagStore} from "@/features/tag-selected";
import {Event, EventCard, useEventCardStore} from "@/entities/event";
import {Box, ErrorCard, LoadingCard} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {getPeriodBorders} from "@/shared/scripts/date";
import Icon from "@/shared/ui/Icons/Icon";
import {SwipedAll} from "@/widgets/events-swiper/ui/SwipedAll";
import {useShallow} from "zustand/react/shallow";

export const EventsSwiper = () => {
  const theme = useTheme<Theme>();
  const router = useRouter();
  const username = useConfig().initDataUnsafe.user.username;
  const swiperRef = useRef<Swiper<Event> | null>();

  const {
    events, isLoading, hasError, swipedAll, setSwipedAll, fetchEvents
  } = useEventsSwiperStore(useShallow(state => ({
    events: state.events,
    isLoading: state.isLoading,
    hasError: state.hasError,
    swipedAll: state.swipedAll,
    setSwipedAll: state.setSwipedAll,
    fetchEvents: state.fetchEvents,
  })));

  const {
    selectedDays
  } = useCalendarStore(useShallow(state => ({selectedDays: state.selectedDays,})));

  const {
    tag, setTag
  } = useSelectedTagStore(useShallow(state => ({
    tag: state.tag,
    setTag: state.setTag,
  })));

  const {
    addLikedEvent, addDislikedEvent, removeLikedEvent, removeDislikedEvent, saveAction
  } = useReactionsStore(useShallow(state => ({
    addLikedEvent: state.addLikedEvent,
    addDislikedEvent: state.addDislikedEvent,
    removeLikedEvent: state.removeLikedEvent,
    removeDislikedEvent: state.removeDislikedEvent,
    saveAction: state.saveAction,
  })));

  const {
    swipeEnabled
  } = useEventCardStore(useShallow(state => ({swipeEnabled: state.swipeEnabled})));

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

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchEvents({
      username: username,
      tag: tag,
      date_start: borders.date_start,
      date_end: borders.date_end
    });
  }, [tag, selectedDays, username]);

  const renderCard = (event: Event) => (
    <EventCard
      event={event}
      onLike={() => {
        swiperRef.current?.swipeRight();
      }}
      onDislike={() => {
        swiperRef.current?.swipeLeft();
      }}
    />
  );

  console.log("swiper", isLoading, hasError, swipedAll, selectedDays, tag, swipeEnabled);

  if (isLoading) return <LoadingCard style={{ flex: 1, height: "100%", width: "100%" }}/>
  if (hasError) return <ErrorCard />
  if (swipedAll) return <SwipedAll/>

  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
    >
      <Box flex={1} backgroundColor="bg_color">
        <Swiper
          ref={swiper => {
            swiperRef.current = swiper;
          }}
          cards={events}
          renderCard={renderCard}
          horizontalSwipe={swipeEnabled}
          cardIndex={3}
          verticalSwipe={false}
          stackSize={2}
          stackScale={0}
          stackSeparation={0}
          stackAnimationTension={100}
          stackAnimationFriction={15}
          swipeBackCard
          containerStyle={{ backgroundColor: theme.colors.bg_color }}
          cardStyle={{ height: "100%" }}
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
          childrenOnTop={true}
          onSwipedAll={() => setSwipedAll(true)}
          onSwipedRight={(cardIndex) => {
            saveAction({
              action: "like",
              contentId: events[cardIndex].id,
              username: username
            }).then(() => {
              addLikedEvent(events[cardIndex]);
              removeDislikedEvent(events[cardIndex].id);
            })
          }}
          onSwipedLeft={(cardIndex) => {
            saveAction({
              action: "dislike",
              contentId: events[cardIndex].id,
              username: username
            }).then(() => {
              addDislikedEvent(events[cardIndex])
              removeLikedEvent(events[cardIndex].id);
            })
          }}
          onSwiping={(x) => {
            likeOpacity.value = x > 0 ? Math.min(x / 100, 1) : 0;
            dislikeOpacity.value = x < 0 ? Math.min(-x / 100, 1) : 0;
          }}
          onSwiped={resetOpacity}
          onSwipedAborted={resetOpacity}
          inputRotationRange={[-100 / 2, 0, 100 / 2]}
          outputRotationRange={["0deg", "0deg", "0deg"]}
        />

         {/*Иконка лайка */}
        <Animated.View style={[likeStyle, { position: "absolute", right: 0, top: "50%" }]}>
          <Box width={50} height={50} alignItems={"center"} justifyContent={"center"}
               backgroundColor={"red"} borderRadius={"l"}>
            <Icon name={"likeFilled"} color={theme.colors.gray} size={24}/>
          </Box>
        </Animated.View>

        {/* Иконка дизлайка */}
        <Animated.View style={[dislikeStyle, { position: "absolute", left: 0, top: "50%" }]}>
          <Box width={50} height={50} alignItems={"center"} justifyContent={"center"}
               backgroundColor={"gray"} borderRadius={"l"}>
            <Icon name={"dislike"} color={theme.colors.red} size={24}/>
          </Box>
        </Animated.View>
      </Box>

      {/* Buttons area */}
      <Box
        flexDirection={"row"}
        height={16 + 40 + 16}
        gap={"m"}
        padding={"m"}
        justifyContent={"flex-start"}
        position={"absolute"} zIndex={1}
        alignSelf={"flex-start"}
      >
        {/* Back button */}
        {
          tag && (
            <Pressable
              onPress={() => {
                router.replace("/(tabs)/tags");
                setTag(undefined);
              }}
            >
              <Box
                backgroundColor={"cardBGColor"}
                width={40} height={40}
                borderRadius={"eventCard"}
                alignItems={"center"} justifyContent={"center"}
              >
                <Icon name={"chevronLeft"} color={theme.colors.gray} size={24}/>
              </Box>
            </Pressable>
          )
        }

        {/* Swipe back card button */}
        <Pressable
          onPress={ () => {
            console.log("Back pressed");
            swiperRef.current?.swipeBack()
          }}
        >
          <Box
            backgroundColor={"cardBGColor"}
            width={40} height={40}
            borderRadius={"eventCard"}
            alignItems={"center"} justifyContent={"center"}
          >
            <Icon name={"back"} color={theme.colors.gray} size={24}/>
          </Box>
        </Pressable>
      </Box>
    </Box>
  )
}
