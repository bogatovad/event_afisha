import { create } from 'zustand';
import TagsService from '@/services/TagsService';
import {Tag} from "@/types/tags.types";

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  hasError: boolean;
  fetchTags: () => void;
}

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  isLoading: true,
  hasError: false,

  fetchTags: () => {
    set({ isLoading: true, hasError: false });

    TagsService.getTags()
      .then((response) => {
        if (response.status == 200) {
          console.log(`Successfully received tags`);
          set({ tags: response.data, isLoading: false });
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
