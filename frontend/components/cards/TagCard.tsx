import React from "react";
import Box from "@/components/Box";
import Text from "@/components/Text";
import {ImageBackground, Pressable} from "react-native";
import {useRouter} from "expo-router";

interface TagCardProps {
  name: string,
  description: string,
  image: string | null,
}

const TagCard: React.FC<TagCardProps> = ({
  name,
  description,
  image
}) => {
  const router = useRouter();

  return (
    <Pressable
      style={{
        flex: 1
      }}
      onPress={ () => router.replace({
        pathname: "/feed",
        params: { tag: name }
      }) }
    >
      <ImageBackground
        source={{ uri: image ? image : undefined }}
        alt={description}
        resizeMode="cover"
        style={{
          minHeight: 150,
          backgroundColor: 'rgb(152,152,152)',
          justifyContent: "flex-end",
          alignItems: "center",
          borderRadius: 16,
          overflow: "hidden"
        }}
      >
        <Box
          width="100%"
          backgroundColor="secondary_bg_color"
          alignItems="center"
          justifyContent="center"
          padding="s"
        >
          <Text
            variant="body"
            color="text_color"
          >
            { name + " "}
          </Text>
        </Box>
      </ImageBackground>
    </Pressable>
  )
}

export default TagCard;
