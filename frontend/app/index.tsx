import Box from "@/components/Box";
import Swiper from 'react-native-deck-swiper'
import EventCard from "@/components/cards/EventCard";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/constants/Theme";
import Text from "@/components/Text";
import {useEventStore} from "@/stores/useEventsStore";
import {useEffect} from "react";

export default function HomeScreen() {
  const theme = useTheme<Theme>()
  const { events, loading, error, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents('sport')
      .catch(() => console.log(error?.toString()));
  }, []);

  if (loading) {
    return (
      <Box
        flex={1}
        backgroundColor="bg_color"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          variant="header"
          color="text_color"
        >
          Loading...
        </Text>
      </Box>
    )
  }

  return (
    <Box
      flex={1}
    >
      <Swiper
        cards={events}
        renderCard={EventCard}
        infinite
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
