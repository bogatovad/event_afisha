import React from "react";
import {Box} from "@/shared/ui";
import {DatePicker} from "@/widgets/Date";

export const CalendarPage: React.FC = () => {
  return (
    <Box
      flex={1}
      backgroundColor={"bg_color"}
      justifyContent={"center"}
      padding={"m"}
    >
      <DatePicker/>
    </Box>
  )
}
