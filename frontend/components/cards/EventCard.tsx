import React, { useState } from "react";
import Text from "@/components/Text";
import { Image, ImageBackground, Pressable, ScrollView, Dimensions } from "react-native";
import Box from "@/components/Box";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import {formatDate} from "@/scripts/parseDate";

const { height: screenHeight } = Dimensions.get("window");

interface EventCardProps {
  name: string;
  description: string;
  image: string | null;
  date: string;
  contact: string
}

const EventCard: React.FC<EventCardProps> = ({
  name = "",
  description = "",
  image = "",
  date = "",
  contact = ""
}) => {
  const descriptionHeight = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    setIsExpanded(!isExpanded);

    const targetHeight = isExpanded ? 0 : screenHeight * 0.83;
    descriptionHeight.value = withTiming(targetHeight, { duration: 500 });
    overlayOpacity.value = withTiming(isExpanded ? 0 : 0.6, { duration: 500 });
  };

  const animatedDescriptionStyle = useAnimatedStyle(() => ({
    height: descriptionHeight.value,
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <ImageBackground
      source={{ uri: image ? image.replace("/minio:", "/130.193.41.98:") : undefined }}
      resizeMode="cover"
      blurRadius={16}
      style={{
        flex: 1,
        flexDirection: "column",
        borderRadius: 16,
        overflow: "hidden",
        justifyContent: "flex-end",
        backgroundColor: 'rgb(152,152,152)',
      }}
    >
      <Image
        source={{ uri: image ? image.replace("/minio:", "/130.193.41.98:") : undefined }}
        resizeMode="contain"
        style={{
          width:"100%",
          height: "100%",
          position: "absolute"
        }}
      />

      {/* Анимированный полупрозрачный слой для затемнения */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "black",
          },
          animatedOverlayStyle,
        ]}
      />

      <Box
        padding="m"
        gap="m"
      >
        <Box
          backgroundColor="secondary_bg_color"
          opacity={0.6}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
          }}
        />

        {/* Название события */}
        <Text
          variant="header"
          color="text_color"
        >
          { name }
        </Text>

        {/* Анимированное описание с ScrollView */}
        <Animated.View
          style={[
            animatedDescriptionStyle,
            {
              overflow: "hidden",
            },
          ]}
        >
          <ScrollView>
            <Text
              variant="body"
              style={{
                color: 'white',
              }}
            >
              { description }
            </Text>
          </ScrollView>
        </Animated.View>

        {/* Кнопка Подробнее */}
        <Pressable onPress={handlePress}>
          <Box
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text
              variant="body"
              style={{ color: 'rgb(200,200,200)'}}
            >
              { isExpanded ? "Свернуть" : "Подробнее" }
            </Text>
          </Box>
        </Pressable>

        <Text
          variant="body"
          style={{
            color: 'white',
          }}
          textAlign="right"
        >
          { formatDate(date) }
        </Text>
      </Box>
    </ImageBackground>
  );
};

export default EventCard;
