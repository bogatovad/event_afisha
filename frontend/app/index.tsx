import Box from "@/components/Box";
import Text from "@/components/Text";
import {useEffect} from "react";
import {useTagsStore} from "@/stores/useTagsStore";
import LoadingCard from "@/components/cards/LoadingCard";
import ErrorCard from "@/components/cards/ErrorCard";
import TagCard from "@/components/cards/TagCard";
import {Animated, FlatList, Pressable} from "react-native";
import ScrollView = Animated.ScrollView;
import {router} from "expo-router";

export default function HomeScreen() {
  const { tags, isLoading, hasError, fetchTags } = useTagsStore();

  useEffect(() => {
    fetchTags()
      .finally(() => console.log("Tags: " + tags.toString()));
  }, []);

  if (isLoading) {
    return <LoadingCard/>
  }

  if (hasError) {
    return <ErrorCard/>
  }

  return (
    <ScrollView
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
    >
      <Box
        backgroundColor="bg_color"
        alignItems="center"
        justifyContent="center"
        padding="l"
        gap="m"
      >
        <Pressable
          onPress={ () => router.push("/about") }
          style={{
            width: "100%"
          }}
        >
          <Box
            width={"100%"}
            height={40}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            padding={"m"}
            backgroundColor="button_color"
            style={{
              borderRadius: 12,
            }}
          >
            <Text
              variant="body"
              color="button_text_color"
            >
              { "О нас" }
            </Text>
          </Box>
        </Pressable>

        <FlatList
          data={tags}
          renderItem={({ item }) =>
            <TagCard
              name={ item.name }
              description={ item.description }
              image={ item.image }
            />
          }
          keyExtractor={ item => item.name }
          numColumns={2}
          style={{
            width: "100%"
          }}
          contentContainerStyle={{
            gap: 12
          }}
          columnWrapperStyle={{
            gap: 12
          }}
        />
      </Box>
    </ScrollView>
  );
}
