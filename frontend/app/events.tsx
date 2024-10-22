import Box from "@/components/Box";
import Swiper from 'react-native-deck-swiper'
import EventCard from "@/components/cards/EventCard";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/constants/Theme";
import {useEventStore} from "@/stores/useEventsStore";
import {useEffect} from "react";
import LoadingCard from "@/components/cards/LoadingCard";
import ErrorCard from "@/components/cards/ErrorCard";
import {useLocalSearchParams, useRouter} from "expo-router";
import Topbar from "@/components/navigation/Topbar";
import {MaterialIcons} from "@expo/vector-icons";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import Text from "@/components/Text";
import {Pressable} from "react-native";

export default function EventsScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>();

  const swipedAllInfoOpacity = useSharedValue(0);

  const swipedAllInfoStyle = useAnimatedStyle(() => ({
    opacity: swipedAllInfoOpacity.value,
    gap: 16
  }));

  const onSwipedAll = () => {
    setSwipedAll(true);
    swipedAllInfoOpacity.value = withTiming(1);
  }

  const theme = useTheme<Theme>();
  const router = useRouter();
  const {
    events,
    isLoading,
    hasError,
    swipedAll,
    fetchEvents,
    setSwipedAll
  } = useEventStore();

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
      <Topbar
        onBackPress={() => router.back() }
        title={ tag }
        rightIcon={ <MaterialIcons name="date-range" size={20} color={theme.colors.text_color}/> }
      />

      <Box flex={1}>
        {
          !swipedAll && (
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
              onSwipedAll={ onSwipedAll }
              containerStyle={{
                backgroundColor: theme.colors.bg_color,
              }}
              cardStyle={{
                height: "100%",
                paddingBottom: 16
              }}
              cardVerticalMargin={0}
              childrenOnTop={true}
            />
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
                  { "Мероприятия в этой категории закончились" }
                </Text>

                <Pressable
                  onPress={ () => router.back() }
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
                      color="text_color"
                    >
                      { "На главный экран" }
                    </Text>
                  </Box>
                </Pressable>
              </Animated.View>
            </Box>
          )
        }
      </Box>
    </Box>
  );
}
