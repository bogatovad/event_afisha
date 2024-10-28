import React, { useEffect } from "react";
import Box from "@/components/Box";
import Text from "@/components/Text";
import { useLikesStore } from "@/stores/useLikesStore";
import Topbar from "@/components/navigation/Topbar";
import LoadingCard from "@/components/cards/LoadingCard";
import ErrorCard from "@/components/cards/ErrorCard";

export default function LikesScreen() {
  const {
    likes,
    isLoading,
    hasError,
    fetchLikes,
  } = useLikesStore();

  useEffect(() => {
    fetchLikes();
  }, []);

  if (isLoading) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <Topbar title={"Понравилось"} />
        <LoadingCard />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <Topbar title={"Понравилось"} />
        <ErrorCard />
      </Box>
    );
  }

  if (likes.length === 0) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <Topbar title={"Понравилось"} />
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text variant="body" color="text_color">
            { "Нет понравившихся мероприятий" }
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="bg_color">
      <Topbar title={"Понравилось"} />
      <Box flex={1} backgroundColor="bg_color" paddingHorizontal="m">
        {
          likes.map((item, index) => (
            <Text
              key={index}
              variant="body"
              color="text_color"
            >
              {item.name}
            </Text>
          ))
        }
      </Box>
    </Box>
  );
}
