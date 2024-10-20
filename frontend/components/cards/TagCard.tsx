import React from "react";
import Box from "@/components/Box";
import Text from "@/components/Text";
import {Pressable} from "react-native";
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
      onPress={ () => router.push({
        pathname: "/events",
        params: { tag: name }
      }) }
    >
      <Box
        flexDirection="row"
      >
        <Text
          variant="body"
          color="text_color"
        >
          { name + " "}
        </Text>

        <Text
          variant="body"
          color="text_color"
        >
          { description + " "}
        </Text>

        <Text
          variant="body"
          color="text_color"
        >
          { image }
        </Text>
      </Box>
    </Pressable>
  )
}

export default TagCard;
