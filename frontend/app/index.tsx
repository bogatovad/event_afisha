import Box from "@/components/Box";
import {useEffect} from "react";
import {useTagsStore} from "@/stores/useTagsStore";
import LoadingCard from "@/components/cards/LoadingCard";
import ErrorCard from "@/components/cards/ErrorCard";
import TagCard from "@/components/cards/TagCard";

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
    <Box
      flex={1}
      backgroundColor="bg_color"
      alignItems="center"
      justifyContent="center"
    >
      {
        tags.map((tag) => (
          <TagCard
            key={tag.name}
            name={tag.name}
            description={tag.description}
            image={ tag.image }
          />
        ))
      }
    </Box>
  );
}
