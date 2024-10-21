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
  fetchEvents: (tag: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  isLoading: true,
  hasError: false,

  fetchEvents: async (tag: string) => {
    set({ isLoading: true, hasError: false });

    getContentByTag(tag)
      .then((response) => {
        if (response.status == 200) {
          set({ events: response.data, isLoading: false });
        } else {
          set({ hasError: true, isLoading: false });
        }
      })
      .catch(() => {
        set({ hasError: true, isLoading: false });
      });
  }
}));
