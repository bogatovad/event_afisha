import React from "react";
import {useRouter} from "expo-router";
import {EventsSwiper} from "@/widgets/Events";
import {useEventsStore} from "@/widgets/Events";
import {Box, Topbar} from "@/shared/ui";

export const FeedPage = () => {
  const {
    tag,
    setTag
  } = useEventsStore()

  const router = useRouter();

  return (
    <Box
      flex={1}
      flexDirection="column"
    >
      <Topbar
        onBackPress={ tag ? () => {
          router.navigate("/tags");
          setTag(undefined)
        } : undefined }
        title={ tag ? tag : "Лента" }
      />

      <EventsSwiper/>
    </Box>
  )
}
