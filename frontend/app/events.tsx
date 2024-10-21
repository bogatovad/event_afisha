import Box from "@/components/Box";
import Swiper from 'react-native-deck-swiper'
import EventCard from "@/components/cards/EventCard";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/constants/Theme";
import {useEventStore} from "@/stores/useEventsStore";
import {useEffect} from "react";
import LoadingCard from "@/components/cards/LoadingCard";
import ErrorCard from "@/components/cards/ErrorCard";
import {useLocalSearchParams} from "expo-router";

export default function EventsScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>()

  const theme = useTheme<Theme>()
  const { events, isLoading, hasError, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents(tag)
      .then(() => console.log("Events loaded"));
  }, []);

  if (isLoading) {
    return <LoadingCard/>
  }

  if (hasError) {
    return <ErrorCard/>
  }

  return (
    <Box
      flex={1}
    >
      <Swiper
        cards={events}
        renderCard={(event) =>
          <EventCard
            name={ event.name }
            date={ event.date }
            description={ event.description }
            image={ event.image }
            contact={ event.contact }
          />}
        backgroundColor="white"
        cardHorizontalMargin={16}
        horizontalSwipe={true}
        verticalSwipe={false}
        stackSize={2}
        containerStyle={{
          flex: 1,
          backgroundColor: theme.colors.bg_color,
        }}
        cardVerticalMargin={16}
      >
      </Swiper>
    </Box>
  );
}
