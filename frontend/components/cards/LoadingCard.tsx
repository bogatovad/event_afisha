import React from "react";
import Box from "@/components/Box";
import Text from "@/components/Text";

const LoadingCard = () => {
  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
      justifyContent="center"
      alignItems="center"
    >
      <Text
        variant="header"
        color="text_color"
      >
        { "Загрузка..." }
      </Text>
    </Box>
  )
}

export default LoadingCard;
