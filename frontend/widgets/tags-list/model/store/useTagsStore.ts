import { create } from 'zustand';
import {Tag} from "@/entities/tag";
import tagsService from "@/widgets/tags-list/api/TagsService";
import {PreferencesRequest, TagsRequest} from "@/widgets/tags-list";

interface TagsState {
  tags: Tag[];
  preferences: number[];
  onTagLike: (params: PreferencesRequest) => void;
  isLoading: boolean;
  hasError: boolean;
  fetchTags: (params: TagsRequest) => void;
}

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  preferences: [],
  isLoading: true,
  hasError: false,

  onTagLike: (params: PreferencesRequest) => {
    set((state) => {
      if (state.preferences.find((p) => p === params.tag_id)) {
        tagsService.deletePreference(params)
          .then((response) => console.log(response))
          .catch((e) => console.log(e));

        return { preferences: state.preferences.filter((p) => p !== params.tag_id) };
      }

      tagsService.savePreference(params)
        .then((response) => console.log(response))
        .catch((e) => console.log(e));

      return { preferences:[...state.preferences, params.tag_id] };
    });
  },

  fetchTags: (params) => {
    set({ isLoading: true, hasError: false });

    tagsService.getTags(params)
      .then((response) => {
        if (response.status == 200) {
          console.log(`Successfully received tags`);
          set({ tags: sortTagsByPreferences(MockTags, [4,6]), preferences: [4,6], isLoading: false });
          //set({ tags: sortTagsByPreferences(response.data.tags, response.data.preferences), preferences: response.data.preferences, isLoading: false });
        } else {
          console.log(`Tags request error with code: ${response.status}`);
          set({ hasError: true, isLoading: false });
        }
      })
      .catch((e) => {
        console.log(`Events request error: ${e}`);
        set({ hasError: true, isLoading: false });
      });
  }
}));

const sortTagsByPreferences = (tags: Tag[], preferences: number[]): Tag[] => {
  return tags.sort((a, b) => {
    const indexA = preferences.indexOf(a.id);
    const indexB = preferences.indexOf(b.id);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return b.count - a.count;
  });
};

const MockTags: Tag[] = [
  {
    id: 1,
    name: "Спорт",
    description: "Спорт",
    image: "https://afishabot.ru/afisha-files/images_tag/4804ea3f-ce05-4f87-9708-5387de5a9bd7.webp?AWSAccessKeyId=minioadmin&Signature=3gCs0JIJj%2FLtx8lnV3bDi6TbuDc%3D&Expires=1738065230",
    count: 10
  },
  {
    id: 2,
    name: "АктивныйОтдых",
    description: "Активный отдых",
    image: "https://afishabot.ru/afisha-files/images_tag/DALLE_2024-11-03_21.43.24_-_A_vibrant_scene_of_people_enjoying_active_outdoor_recreation_in_nature._A_group_of_friends_are_hiking_on_a_scenic_trail_surrounded_by_mountains_trees_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.webp?AWSAccessKeyId=minioadmin&Signature=WwPuIJx83KiRv4MRfqzDRFfJcQE%3D&Expires=1738065230",
    count: 20
  },
  {
    id: 3,
    name: "Искусство",
    description: "Активный отдых",
    image: "https://afishabot.ru/afisha-files/images_tag/DALLE_2024-11-03_21.43.24_-_A_vibrant_scene_of_people_enjoying_active_outdoor_recreation_in_nature._A_group_of_friends_are_hiking_on_a_scenic_trail_surrounded_by_mountains_trees_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.webp?AWSAccessKeyId=minioadmin&Signature=WwPuIJx83KiRv4MRfqzDRFfJcQE%3D&Expires=1738065230",
    count: 30
  },
  {
    id: 4,
    name: "Спорт3",
    description: "Активный отдых",
    image: "https://afishabot.ru/afisha-files/images_tag/DALLE_2024-11-03_21.43.24_-_A_vibrant_scene_of_people_enjoying_active_outdoor_recreation_in_nature._A_group_of_friends_are_hiking_on_a_scenic_trail_surrounded_by_mountains_trees_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.webp?AWSAccessKeyId=minioadmin&Signature=WwPuIJx83KiRv4MRfqzDRFfJcQE%3D&Expires=1738065230",
    count: 40
  },
  {
    id: 5,
    name: "Спор4",
    description: "Активный отдых",
    image: "https://afishabot.ru/afisha-files/images_tag/DALLE_2024-11-03_21.43.24_-_A_vibrant_scene_of_people_enjoying_active_outdoor_recreation_in_nature._A_group_of_friends_are_hiking_on_a_scenic_trail_surrounded_by_mountains_trees_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.webp?AWSAccessKeyId=minioadmin&Signature=WwPuIJx83KiRv4MRfqzDRFfJcQE%3D&Expires=1738065230",
    count: 50
  },
  {
    id: 6,
    name: "Спорт5",
    description: "Активный отдых",
    image: "https://afishabot.ru/afisha-files/images_tag/DALLE_2024-11-03_21.43.24_-_A_vibrant_scene_of_people_enjoying_active_outdoor_recreation_in_nature._A_group_of_friends_are_hiking_on_a_scenic_trail_surrounded_by_mountains_trees_%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.webp?AWSAccessKeyId=minioadmin&Signature=WwPuIJx83KiRv4MRfqzDRFfJcQE%3D&Expires=1738065230",
    count: 60
  },
]
