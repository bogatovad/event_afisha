import React, {useEffect} from "react";
import Text from "@/components/Text";
import { Image, ImageBackground, Pressable, ScrollView } from "react-native";
import Box from "@/components/Box";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import {formatDate} from "@/scripts/date";
import { LinearGradient } from "expo-linear-gradient";
import {Feather} from "@expo/vector-icons";
import { useEventsStore } from "@/stores/useEventsStore";

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
  const flexValue = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const nameFlex = useSharedValue(1);
  const nameOpacity = useSharedValue(1);

  const {
    descriptionExpanded,
    toggleDescriptionExpanded
  } = useEventsStore();

  useEffect(() => {
    flexValue.value = withTiming(descriptionExpanded ? 1 : 0, { duration: 500 });
    overlayOpacity.value = withTiming(descriptionExpanded ? 0.7 : 0, { duration: 500 });
    nameFlex.value = withTiming(descriptionExpanded ? 0 : 1, { duration: 500 });
    nameOpacity.value = withTiming(descriptionExpanded ? 0 : 1, { duration: 500 });
  }, [descriptionExpanded]);

  const animatedDescriptionStyle = useAnimatedStyle(() => ({
    flex: flexValue.value,
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const animatedNameStyle = useAnimatedStyle(() => ({
    flex: nameFlex.value,
    opacity: nameOpacity.value,
    overflow: "hidden",
    justifyContent: "flex-end"
  }));

  return (
    <ImageBackground
      source={{ uri: image ? image : undefined }}
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
        source={{ uri: image ? image : undefined }}
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
        flex={1}
        padding="m"
        gap="m"
      >
        <LinearGradient
          colors={['rgb(40,40,40)', "transparent", "transparent"]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
          }}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        />

        {/* Анимированное описание с ScrollView */}
        <Box flex={1}>
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
                {description}
              </Text>
            </ScrollView>
          </Animated.View>
        </Box>

        {/* Анимированное название мероприятия */}
        <Animated.View style={animatedNameStyle}>
          <Text
            variant="header"
            textAlign="center"
            style={{
              color: 'white',
            }}
          >
            {name}
          </Text>
        </Animated.View>

        {/* Кнопка Информации (описания) */}
        <Pressable
          onPress={toggleDescriptionExpanded}
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1
          }}
        >
          <Box
            justifyContent="center"
            alignItems="center"
          >
            <Feather name={"info"} size={24} color={'rgb(152,152,152)'} />
          </Box>
        </Pressable>

        <Text
          variant="body"
          style={{
            color: 'white',
          }}
          textAlign="center"
        >
          { formatDate(date) }
        </Text>
      </Box>
    </ImageBackground>
  );
};

export default EventCard;
