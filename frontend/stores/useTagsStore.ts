import { create } from 'zustand';
import {getTags} from '@/services/TagsService';

type Tag = {
  name: string;
  description: string;
  image: string | null;
}

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  hasError: boolean;
  fetchTags: () => Promise<void>;
}

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  isLoading: true,
  hasError: false,

  fetchTags: async () => {
    set({ isLoading: true, hasError: false });

    getTags()
      .then((response) => {
        if (response.status == 200) {
          set({ tags: response.data, isLoading: false });
        } else {
          set({ hasError: true, isLoading: false });
        }
      })
      .catch(() => {
        set({ hasError: true, isLoading: false });
      });
  }
}));
