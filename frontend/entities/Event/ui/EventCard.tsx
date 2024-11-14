import React, {useEffect, useState} from "react";
import {Image, ImageBackground, Pressable, ScrollView, FlatList } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useEventsStore } from "@/widgets/Events";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";
import {formatDate} from "@/shared/scripts/date";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";
import Icon from "@/shared/ui/Icons/Icon";
import {Hyperlink} from "react-native-hyperlink";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {ActionButton, TagChip} from "@/shared/ui";
import {Event} from "@/entities/Event/model/types/events"
import {useRouter} from "expo-router";

interface EventCardProps {
  event: Event;
  onLike: () => void;
  onDislike: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onLike,
  onDislike
}) => {
  const theme = useTheme<Theme>();
  const config = useConfig();
  const router = useRouter();

  const heightValue = useSharedValue(125);

  const [cardHeight, setCardHeight] = useState(0);
  const [infoHeight, setInfoHeight] = useState(0);

  const {
    descriptionExpanded,
    setDescriptionExpanded,
    setSwipeEnabled,
    tag, setTag
  } = useEventsStore();

  useEffect(() => {
    heightValue.value = withTiming(
      descriptionExpanded ? (125 + cardHeight - infoHeight - 36 - 16 - 10) : 125,
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

  return (
    <ImageBackground
      source={{ uri: event.image ? event.image : undefined }}
      resizeMode="cover"
      blurRadius={16}
      style={{
        flex: 1,
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: theme.colors.secondary_bg_color,
      }}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setCardHeight(height);
      }}
    >
      <Image
        source={{ uri: event.image ? event.image : undefined }}
        resizeMode="contain"
        style={{
          width:"100%",
          height: "100%",
          position: "absolute"
        }}
      />

      {/* Back button */}
      {
        tag && (
          <Pressable
            onPress={() => {
              router.replace("/(tabs)/tags");
              setTag(undefined);
            }}
            style={{
              backgroundColor: theme.colors.cardBGColor,
              width: 36, height: 36,
              position: "absolute",
              top: 16, left: 16,
              borderRadius: 50,
              zIndex: 1, alignItems: "center", justifyContent: "center"
            }}
          >
            <Icon name={"chevronLeft"} color={theme.colors.gray} size={24}/>
          </Pressable>
        )
      }

      <Box
        flex={1}
        justifyContent="flex-end"
      >
        <Box
          backgroundColor={"cardBGColor"}
          borderTopLeftRadius={"eventCard"}
          borderTopRightRadius={"eventCard"}
          gap={"l"}
          paddingTop={"m"}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setInfoHeight(height);
          }}
        >
          {/* Main info (name, tags) */}
          <Box
            gap={"s"}
            paddingHorizontal={"eventCardPadding"}
          >
            {/* Event Title */}
            <Text
              variant={"cardHeader"}
              color={"cardMainTextColor"}
            >
              { event.name }
            </Text>

            {/* Event Categories */}
            {
              event.categories && (
                <Box height={40}>
                  <FlatList
                    data={event.categories}
                    renderItem={ ({ item }) => (
                      <TagChip text={item}/>
                    )}
                    keyExtractor={(item) => item}
                    style={{ zIndex: 1, flexGrow: 1 }}
                    horizontal
                    accessible
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 16 }}
                  />
                </Box>
              )
            }
          </Box>

          {/* Sub info (location, price, date) */}
          <Box
            flexDirection="column"
            gap="s"
            paddingHorizontal={"eventCardPadding"}
          >
            {/* Location here */}

            {/* Price here */}

            {/* Date with time */}
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
                { formatDate(event.date) }
              </Text>
            </Box>
          </Box>

          {/* Description */}
          <Box
            overflow={"hidden"}
            marginHorizontal={"l"}
            borderRadius={"l"}
          >
            <Animated.View
              style={[
                animatedDescriptionStyle,
                {
                  overflow: "hidden",
                  backgroundColor: theme.colors.cardBGColor,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }
              ]}
            >
              <ScrollView overScrollMode={"never"} style={{ flex: 1 }} contentContainerStyle={{ gap: 10 }}>
                <Text
                  variant={"cardSubheader"}
                  color={"cardMainTextColor"}
                >
                  { "О МЕРОПРИЯТИИ" }
                </Text>

                <Text
                  variant="cardText"
                  color="cardSubtextColor"
                >
                  {event.description}
                </Text>

                {event.contact && event.contact.length > 0 && (
                  <Box
                    gap={"s"}
                  >
                    <Text
                      variant={"cardText"}
                      color={"cardSubtextColor"}
                    >
                      { "\nСсылки:" }
                    </Text>

                    {event.contact.map((con, index) => {
                      return (
                        <Hyperlink
                          key={index}
                          linkDefault={true}
                          linkStyle={{ color: theme.colors.link_color }}
                          onPress={ () => config.openLink(Object.values(con)[0], { try_instant_view: true }) }
                          linkText={(url) => {
                            const contact = event.contact!.find((c) => Object.values(c)[0] === url);
                            return contact ? Object.keys(contact)[0] : url;
                          }}
                        >
                          <Text
                            variant={"cardText"}
                          >
                            {Object.values(con)[0]}
                          </Text>
                        </Hyperlink>
                      );
                    })}
                  </Box>
                )}
              </ScrollView>
            </Animated.View>

            <Pressable
              onPress={() => setDescriptionExpanded(!descriptionExpanded)}
              style={{
                alignItems: "center",
                backgroundColor: theme.colors.cardBGColor
              }}
            >
              <Icon
                name={descriptionExpanded ? "chevronDown" : "chevronUp"}
                color={theme.colors.gray}
                size={24}/>
            </Pressable>
          </Box>

          {/* Like/Dislike buttons */}
          <Box
            flexDirection={"row"}
            width={"100%"}
            paddingBottom={"l"}
            paddingHorizontal={"l"}
            gap={"s"}
          >
            <ActionButton type={"dislike"} onPress={onDislike}/>
            <ActionButton type={"like"} onPress={onLike}/>
          </Box>
        </Box>
      </Box>
    </ImageBackground>
  );
};
