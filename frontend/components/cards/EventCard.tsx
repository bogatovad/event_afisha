import React from "react";
import Text from "@/components/Text";
import {ImageBackground, Linking} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import Box from "@/components/Box";

interface EventCardProps {
  name: string,
  description: string,
  image: string,
  contact: string,
  date: string
}

const EventCard = ({
  name = "",
  description = "",
  image = "",
  contact = "",
  date = ""
}: EventCardProps) => {
  const handleTitlePress = async () => {
    const supported = await Linking.canOpenURL(contact);

    if (supported) {
      await Linking.openURL(contact);
    } else {
      console.log("Link not supported")
    }
  };

  return (
    <ImageBackground
      source={{ uri: image }}
      resizeMode="cover"
      style={{
        flex: 1,
        flexDirection: "column",
        borderRadius: 16,
        overflow: "hidden",
        marginHorizontal: 16,
        justifyContent: "flex-end",
        backgroundColor: 'rgb(152,152,152)'
      }}
    >
      <Box
        padding='l'
        gap='s'
      >
        <LinearGradient
          colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.8)', 'transparent']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%"
          }}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0.5 }}
        />

        <Text
          variant="header"
          onPress={ handleTitlePress }
          style={{
            color: 'white'
          }}
        >
          { name }
        </Text>

        <Text
          variant="body"
          style={{
            color: 'white'
          }}
        >
          { description }
        </Text>

        <Text
          variant="body"
          style={{
            color: 'white'
          }}
          textAlign="right"
        >
          { date }
        </Text>
      </Box>
    </ImageBackground>
  )
}

export default EventCard;
