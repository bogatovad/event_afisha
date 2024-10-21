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
        renderCard={EventCard}
        backgroundColor="white"
        cardHorizontalMargin={0}
        stackSize={2}
        disableTopSwipe={true}
        disableBottomSwipe={true}
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
