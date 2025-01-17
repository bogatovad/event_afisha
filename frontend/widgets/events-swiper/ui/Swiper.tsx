import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { Event } from "@/entities/event";
import { useSwiperState } from "@/widgets/events-swiper/model/store/useSwiperStore";
import { Box } from "@/shared/ui";
import Icon from "@/shared/ui/Icons/Icon";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/shared/providers/Theme";

interface SwiperProps {
  data: Event[];
  renderCard: (event: Event) => React.JSX.Element;
  onSwipeRight: (event: Event) => void;
  onSwipeLeft: (event: Event) => void;
  onSwipedAll: () => void;
}

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 0.2 * width;

export const Swiper = forwardRef(
  (
    { data, renderCard, onSwipeLeft, onSwipeRight, onSwipedAll }: SwiperProps,
    ref
  ) => {
    const theme = useTheme<Theme>();

    const { currentIndex, setCurrentIndex } = useSwiperState();

    const likeOpacity = useSharedValue(0);
    const dislikeOpacity = useSharedValue(0);
    const translateCardX = useSharedValue(0);

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
    };

    const handleSwipeComplete = useCallback(
      (direction: "left" | "right" | "back") => {

        if (direction === "back") {
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
          return;
        }

        if (direction === "left") {
          onSwipeLeft(data[currentIndex]);
        } else if (direction === "right") {
          onSwipeRight(data[currentIndex]);
        }

        setCurrentIndex(currentIndex + 1);
        if (currentIndex + 1 === data.length) {
          onSwipedAll();
        }
      },
      [data, onSwipeLeft, onSwipeRight, onSwipedAll, currentIndex, setCurrentIndex]
    );

    useImperativeHandle(ref, () => ({
      swipeLeft: () => {
        translateCardX.value = withSpring(
          -width,
          { mass: 2, damping: 10, overshootClamping: true },
          () => {
            runOnJS(handleSwipeComplete)("left");
            translateCardX.value = 0;
          }
        );
      },
      swipeRight: () => {
        translateCardX.value = withSpring(
          width,
          { mass: 2, damping: 10, overshootClamping: true },
          () => {
            runOnJS(handleSwipeComplete)("right");
            translateCardX.value = 0;
          }
        );
      },
      swipeBack: () => {
        runOnJS(handleSwipeComplete)("back");
      },
    }));

    const cardPanGesture = Gesture.Pan()
      .onUpdate((event) => {
        translateCardX.value = event.translationX;

        likeOpacity.value =
          event.translationX > 0
            ? Math.min(event.translationX / 100, 1)
            : 0;
        dislikeOpacity.value =
          event.translationX < 0
            ? Math.min(-event.translationX / 100, 1)
            : 0;
      })
      .onEnd((event) => {
        const direction = event.translationX > 0 ? "right" : "left";

        resetOpacity();
        if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
          translateCardX.value = withSpring(
            direction === "right" ? width : -width,
            {
              mass: 2,
              damping: 10,
              overshootClamping: true,
            },
            () => {
              runOnJS(handleSwipeComplete)(direction);
              translateCardX.value = 0;
            }
          );
        } else {
          translateCardX.value = withSpring(0, {
            mass: 2,
            damping: 10,
            overshootClamping: true,
          });
        }
      });

    console.log(currentIndex);
    console.log(data);

    return (
      <Box flex={1} overflow="hidden">
        <GestureDetector gesture={cardPanGesture}>
          <Box flex={1}>
            {data
              .slice(Math.max(currentIndex, 0), currentIndex + 2)
              .map((item, index) => {
                const cardIndex = Math.max(currentIndex, 0) + index;
                const isActiveCard = cardIndex === currentIndex;

                console.log(cardIndex);

                const animatedCardStyle = useAnimatedStyle(() => ({
                  transform: [{ translateX: translateCardX.value }],
                }));

                return (
                  <Animated.View
                    key={item.id}
                    style={[
                      { position: "absolute", height: "100%", width: "100%" },
                      { zIndex: (cardIndex === currentIndex - 1) ? -1 : (data.length - cardIndex) },
                      isActiveCard ? animatedCardStyle : {},
                    ]}
                  >
                    {renderCard(item)}
                  </Animated.View>
                );
              })}
          </Box>
        </GestureDetector>

        {/* Like Icon */}
        <Animated.View
          style={[
            likeStyle,
            {
              position: "absolute",
              right: 0,
              top: "50%",
              zIndex: data.length + 1,
            },
          ]}
        >
          <Box
            width={50}
            height={50}
            alignItems="center"
            justifyContent="center"
            backgroundColor="red"
            borderRadius="l"
          >
            <Icon name="likeFilled" color={theme.colors.gray} size={24} />
          </Box>
        </Animated.View>

        {/* Dislike Icon */}
        <Animated.View
          style={[
            dislikeStyle,
            {
              position: "absolute",
              left: 0,
              top: "50%",
              zIndex: data.length + 1,
            },
          ]}
        >
          <Box
            width={50}
            height={50}
            alignItems="center"
            justifyContent="center"
            backgroundColor="gray"
            borderRadius="l"
          >
            <Icon name="dislike" color={theme.colors.red} size={24} />
          </Box>
        </Animated.View>
      </Box>
    );
  }
);
