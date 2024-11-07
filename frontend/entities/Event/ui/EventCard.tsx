import React, {useEffect, useState} from "react";
import { Image, ImageBackground, ScrollView } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";
import { useEventsStore } from "@/widgets/Events";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";
import {formatDate} from "@/shared/scripts/date";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";
import Icon from "@/shared/ui/Icons/Icon";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {Contact} from "@/widgets/Events/model/types/events.types";
import {Hyperlink} from "react-native-hyperlink";
import {useConfig} from "@/shared/providers/TelegramConfig";

interface EventCardProps {
  name: string;
  description: string;
  image: string | null;
  date: string;
  contacts: Contact[] | null;
}

export const EventCard: React.FC<EventCardProps> = ({
  name,
  description,
  image,
  date,
  contacts
}) => {
  const theme = useTheme<Theme>();
  const config = useConfig();

  const heightValue = useSharedValue(0);

  const [cardHeight, setCardHeight] = useState(0);

  const {
    descriptionExpanded,
    setDescriptionExpanded,
    setSwipeEnabled
  } = useEventsStore();

  useEffect(() => {
    heightValue.value = withTiming(
      descriptionExpanded ? (cardHeight - 200) : 0,
      { duration: 350 },
    );
  }, [descriptionExpanded]);

  useEffect(() => {
    if (descriptionExpanded) {
      setSwipeEnabled(false);
    } else {
      setSwipeEnabled(true);
    }
  }, [descriptionExpanded]);

  const animatedDescriptionStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));

  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (!descriptionExpanded) setSwipeEnabled(false);
    })
    .onEnd((event) => {
      if (event.translationY < -50) {
        runOnJS(() => {
          setDescriptionExpanded(true);
        })();
      } else if (event.translationY > 50) {
        runOnJS(() => setDescriptionExpanded(false))();
      }
    })
    .onFinalize(() => {
      if (!descriptionExpanded) setSwipeEnabled(true);
    });

  return (
    <ImageBackground
      source={{ uri: image ? image : undefined }}
      resizeMode="cover"
      blurRadius={16}
      style={{
        flex: 1,
        flexDirection: "column",
        borderRadius: theme.borderRadii.eventCard,
        overflow: "hidden",
        backgroundColor: theme.colors.secondary_bg_color,
      }}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setCardHeight(height);
      }}
    >
      <Image
        source={{ uri: image ? image : undefined }}
        resizeMode="contain"
        style={{
          width:"100%",
          height: "100%",
          position: "absolute"
        }}
      />

      <Box
        flex={1}
        justifyContent="flex-end"
      >
        <GestureDetector gesture={panGesture}>
          <Box
            backgroundColor={"cardBGColor"}
            borderTopLeftRadius={"eventCard"}
            borderTopRightRadius={"eventCard"}
            gap={"s"}
            paddingHorizontal="eventCardPadding"
          >
            <Box
              id="MainInfo"
              flexDirection="column"
              paddingTop="l"
              gap="s"
            >
              <Text
                variant={"cardHeader"}
                color={"cardMainTextColor"}
              >
                { name }
              </Text>

              {/* Location here */}

              {/* Price here */}
              <Box
                flexDirection="row"
                gap="xs"
                alignItems="center"
              >
                <Icon name={"calendar"} color={theme.colors.gray} size={16}/>

                <Text
                  variant={"cardDate"}
                  color={"cardMainTextColor"}
                >
                  { formatDate(date) }
                </Text>
              </Box>
            </Box>

            {/* Описание */}
            <Animated.View
              style={[
                animatedDescriptionStyle,
                {
                  overflow: "hidden"
                }
              ]}
            >
              <ScrollView style={{ height: cardHeight - 200 }}>
                <Text
                  variant="cardText"
                  color="cardSubtextColor"
                >
                  {description}
                </Text>

                {contacts && contacts.length > 0 && (
                  <Box
                    gap={"s"}
                  >
                    <Text
                      variant={"cardText"}
                      color={"cardSubtextColor"}
                    >
                      { "\nСсылки:" }
                    </Text>

                    {contacts.map((contact, index) => {
                      return (
                        <Hyperlink
                          key={index}
                          linkDefault={true}
                          linkStyle={{ color: theme.colors.link_color }}
                          onPress={ () => config.openLink(Object.values(contact)[0], { try_instant_view: true }) }
                          linkText={(url) => {
                            const contact = contacts.find((c) => Object.values(c)[0] === url);
                            return contact ? Object.keys(contact)[0] : url;
                          }}
                        >
                          <Text
                            variant={"cardText"}
                          >
                            {Object.values(contact)[0]}
                          </Text>
                        </Hyperlink>
                      );
                    })}
                  </Box>
                )}
              </ScrollView>
            </Animated.View>

            <Box
              id="SwipeArea"
              width={"100%"}
              paddingBottom="l"
              gap={"s"}
              alignItems={"center"}
            >
              <Box height={4} borderRadius={"l"} width={22} style={{ backgroundColor: "rgba(255,255,255,0.25)" }} />
              <Box height={4} borderRadius={"l"} width={75} style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
            </Box>
          </Box>
        </GestureDetector>
      </Box>
    </ImageBackground>
  );
};
