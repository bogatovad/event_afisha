import React, {useEffect} from "react";
import {EventsSwiper} from "@/widgets/events-swiper";
import {Box, ErrorCard, LoadingCard} from "@/shared/ui";
import {useFeedStore} from "@/features/content";
import {getPeriodBorders} from "@/shared/scripts/date";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {useCalendarStore} from "@/features/dates";

export const FeedPage = () => {
  console.log(123);
  const username = useConfig().initDataUnsafe.user.username;
  const {
    feed,
    isLoading, hasError,
    swipedAll, setSwipedAll,
    fetchFeed,
  } = useFeedStore();
  const { selectedDays} = useCalendarStore();

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchFeed({
      username: username,
      date_start: borders.date_start,
      date_end: borders.date_end
    });
  }, [selectedDays]);

  if (isLoading) return <LoadingCard style={{ flex: 1, height: "100%", width: "100%" }}/>
  if (hasError) return <ErrorCard />

  return (
    <Box
      flex={1}
      flexDirection="column"
    >
      <EventsSwiper events={feed} swipedAll={swipedAll} setSwipedAll={setSwipedAll}/>
    </Box>
  )
}
