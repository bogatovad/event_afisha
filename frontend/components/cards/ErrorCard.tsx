import React from "react";
import Box from "@/components/Box";
import Text from "@/components/Text";

const ErrorCard = () => {
  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
      justifyContent="center"
      alignItems="center"
    >
      <Text
        variant="body"
        color="text_color"
        textAlign="center"
      >
        { "😬 Упс... Что-то пошло не так." }
      </Text>
    </Box>
  )
}

export default ErrorCard;
