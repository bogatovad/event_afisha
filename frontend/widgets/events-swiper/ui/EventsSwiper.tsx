import React, {useEffect, useRef} from "react";
import {Pressable} from "react-native";
import {useRouter} from "expo-router";
import {useTheme} from "@shopify/restyle";
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
import {Swiper} from "@/widgets/events-swiper/ui/Swiper";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export const EventsSwiper = () => {
  const theme = useTheme<Theme>();
  const router = useRouter();
  const username = useConfig().initDataUnsafe.user.username;
  const swiperRef = useRef<any>();

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

  console.log("swiper", isLoading, hasError, swipedAll, selectedDays, tag);

  if (isLoading) return <LoadingCard style={{ flex: 1, height: "100%", width: "100%" }}/>
  if (hasError) return <ErrorCard />
  if (swipedAll) return <SwipedAll/>

  return (
    <GestureHandlerRootView>
      <Box
        flex={1}
        backgroundColor="bg_color"
      >
        <Box flex={1} backgroundColor="bg_color">
          <Swiper
            ref={swiperRef}
            data={events}
            renderCard={renderCard}
            onSwipeRight={(event: Event) => {
              // saveAction({
              //   action: "like",
              //   contentId: event.id,
              //   username: username
              // }).then(() => {
              //   addLikedEvent(event);
              //   removeDislikedEvent(event.id);
              // })
            }}
            onSwipeLeft={(event: Event) => {
              // saveAction({
              //   action: "dislike",
              //   contentId: event.id,
              //   username: username
              // }).then(() => {
              //   addDislikedEvent(event)
              //   removeLikedEvent(event.id);
              // })
            }}
            onSwipedAll={() => setSwipedAll(true)}
          />
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
    </GestureHandlerRootView>
  )
}
