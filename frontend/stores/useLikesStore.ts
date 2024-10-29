import { create } from 'zustand';
import {config} from "@/scripts/config";
import {Event} from "@/types/events.types"
import LikesService from "@/services/LikesService";

interface LikesState {
  likes: Event[];
  isLoading: boolean;
  hasError: boolean;
  modalVisible: boolean;
  selectedEvent: number | undefined;
  fetchLikes: () => void;
  setModalVisible: (visible: boolean) => void;
  setEventSelected: (index: number | undefined ) => void;
}

export const useLikesStore = create<LikesState>((set) => ({
  likes: [],
  isLoading: true,
  hasError: false,
  modalVisible: false,
  selectedEvent: undefined,

  fetchLikes: () => {
    set({ isLoading: true, hasError: false });

    const { username } = config().initDataUnsafe.user
    LikesService.getLikes({username: username })
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
