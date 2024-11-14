import React from "react";
import {EventsSwiper} from "@/widgets/Events";
import {Box} from "@/shared/ui";

export const FeedPage = () => {
  return (
    <Box
      flex={1}
      flexDirection="column"
    >
      <EventsSwiper/>
    </Box>
  )
}
