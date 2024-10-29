import Box from "@/components/Box";
import React, {useEffect} from "react";
import {useTagsStore} from "@/stores/useTagsStore";
import LoadingCard from "@/components/cards/LoadingCard";
import ErrorCard from "@/components/cards/ErrorCard";
import TagCard from "@/components/cards/TagCard";
import {FlatList} from "react-native";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/constants/Theme";
import Topbar from "@/components/navigation/Topbar";
import {useEventsStore} from "@/stores/useEventsStore";
import {useRouter} from "expo-router";

export default function TagsScreen() {
  const { tags, isLoading, hasError, fetchTags } = useTagsStore();
  const { setTag } = useEventsStore();

  const theme = useTheme<Theme>();
  const router = useRouter();

  useEffect(() => {
    fetchTags();
  }, []);

  if (isLoading) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <Topbar title={"Категории"}/>
        <LoadingCard />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <Topbar title={"Категории"}/>
        <ErrorCard />
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <Topbar
        title={"Категории"}
      />

      <FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        data={tags}
        renderItem={({ item }) =>
          <TagCard
            name={ item.name }
            description={ item.description }
            image={ item.image }
            onPress={ () => {
              setTag(item.name);
              router.replace("/feed") ;
            }}
          />
        }
        keyExtractor={ item => item.name }
        numColumns={2}
        style={{
          width: "100%"
        }}
        contentContainerStyle={{
          backgroundColor: theme.colors.bg_color,
          paddingHorizontal: theme.spacing.m,
          paddingBottom: theme.spacing.s,
          gap: 12
        }}
        columnWrapperStyle={{
          gap: 12
        }}
      />
    </Box>
  );
}
