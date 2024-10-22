import { create } from 'zustand';
import {getContentByTag} from "@/services/EventsService";

interface Event {
  name: string;
  description: string;
  image: string;
  contact: string;
  date: string;
}

interface EventState {
  events: Event[];
  isLoading: boolean;
  hasError: boolean;
  swipedAll: boolean;
  fetchEvents: (tag: string) => Promise<void>;
  setSwipedAll: (state: boolean) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  isLoading: true,
  hasError: false,
  swipedAll: false,

  fetchEvents: async (tag: string) => {
    set({ isLoading: true, hasError: false });

    getContentByTag(tag)
      .then((response) => {
        if (response.status == 200) {
          set({ events: response.data, isLoading: false, swipedAll: false });
        } else {
          set({ hasError: true, isLoading: false });
        }
      })
      .catch(() => {
        set({ hasError: true, isLoading: false });
      });
  },

  setSwipedAll: async (state: boolean) => {
    set({ swipedAll: state });
  }
}));
