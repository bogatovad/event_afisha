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
import {Modal, Pressable} from "react-native";
import {useCalendarStore} from "@/stores/useCalendarStore";
import DatePicker from "@/components/input/DatePicker";
import {getPeriodBorders} from "@/scripts/date";

export default function EventsScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>();

  const swipedAllInfoOpacity = useSharedValue(0);

  const swipedAllInfoStyle = useAnimatedStyle(() => ({
    opacity: swipedAllInfoOpacity.value,
    gap: 16
  }));

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

  const {
    isCalendarVisible,
    selectedDays,
    updateSelectedDays,
    clearSelectedDays,
    setCalendarVisible
  } = useCalendarStore();

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));

    fetchEvents(tag, borders.date_start, borders.date_end);
  }, []);

  useEffect(() => {
    if (swipedAll) {
      swipedAllInfoOpacity.value = withTiming(1);
    } else {
      swipedAllInfoOpacity.value = withTiming(0);
    }
  }, [swipedAll]);

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
        rightIcon={
          <MaterialIcons
            name="date-range"
            size={20}
            color={ Object.keys(selectedDays).length > 0 && !isCalendarVisible ?
              theme.colors.button_color :
              theme.colors.text_color
            }
          />
        }
        onRightIconPress={ () => setCalendarVisible(true) }
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
              onSwipedAll={ () => setSwipedAll(true) }
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

        <Modal
          visible={isCalendarVisible}
          transparent={true}
          animationType={"fade"}
        >
          <Box
            flex={1}
            justifyContent={"center"}
            padding={"l"}
            overflow={"hidden"}
            style={{
              backgroundColor: 'rgba(0,0,0, 0.5)'
            }}
          >
            <DatePicker
              selectedDays={ selectedDays }
              onDaySelected={ updateSelectedDays }
              onClear={ () => clearSelectedDays() }
              onAccept={ () => {
                const borders = getPeriodBorders(Object.keys(selectedDays));

                fetchEvents(tag, borders.date_start, borders.date_end);
                setCalendarVisible(false);
              }}
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}
