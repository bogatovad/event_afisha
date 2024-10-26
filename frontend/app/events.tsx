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
                horizontalSwipe={true}
                verticalSwipe={false}
                stackSize={2}
                containerStyle={{ backgroundColor: theme.colors.bg_color }}
                cardStyle={{ height: "100%", paddingBottom: 16 }}
                cardVerticalMargin={0}
                childrenOnTop={true}
                onSwipedAll={() => setSwipedAll(true)}
                onSwiping={(x) => {
                  likeOpacity.value = x > 0 ? Math.min(x / 100, 1) : 0;
                  dislikeOpacity.value = x < 0 ? Math.min(-x / 100, 1) : 0;
                }}
                onSwipedRight={resetOpacity}
                onSwipedLeft={resetOpacity}
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
                  <MaterialIcons name="thumb-up" size={24} color="white" />
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
