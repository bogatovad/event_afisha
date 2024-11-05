import { create } from 'zustand';
import {Event} from "@/widgets/Events/model/types/events.types"
import {likesServices} from "@/widgets/Likes";

interface LikesState {
  likes: Event[];
  isLoading: boolean;
  hasError: boolean;
  modalVisible: boolean;
  selectedEvent: number | undefined;
  fetchLikes: (username: string) => void;
  setModalVisible: (visible: boolean) => void;
  setEventSelected: (index: number | undefined ) => void;
}

export const useLikesStore = create<LikesState>((set) => ({
  likes: [],
  isLoading: true,
  hasError: false,
  modalVisible: false,
  selectedEvent: undefined,

  fetchLikes: (
    username: string
  ) => {
    set({ isLoading: true, hasError: false });

    likesServices.getLikes({username: username })
      .then((response) => {
        switch (response.status) {
          case 200: {
            console.log(`Successfully get liked events`);
            set({ likes: response.data, isLoading: false });
            break;
          }
          default: {
            console.log(`Events request error with code: ${response.status}`);
            set({ hasError: true, isLoading: false });
          }
        }
      })
      .catch((e) => {
        console.log(`Events request error: ${e}`);
        set({ hasError: true, isLoading: false })
      });
  },

  setEventSelected: (index: number | undefined ) => {
    set({ selectedEvent: index });
  },

  setModalVisible: (visible: boolean) => {
    set({ modalVisible: visible });
  }
}));
