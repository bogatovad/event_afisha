import React from "react";
import {Box, Text} from "@/shared/ui";

interface TagChipProps {
  text: string;
}

export const TagChip: React.FC<TagChipProps> = ({
  text
}) => {
  return (
    <Box
      height={40}
      borderRadius={"l"}
      padding={"s"}
      backgroundColor={"cardBGColor"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Text
        variant={"tagChip"}
        color={"lime"}
        selectable={false}
      >
        {text}
      </Text>
    </Box>
  )
}
