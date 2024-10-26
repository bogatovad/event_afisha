import { create } from 'zustand';
import {ContentParams, getContent} from "@/services/EventsService";
import {AxiosResponse} from "axios";

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
  fetchEvents: (tag: string, date_start?: string, date_end?: string) => void;
  setSwipedAll: (state: boolean) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  isLoading: true,
  hasError: false,
  swipedAll: false,

  fetchEvents: (
    tag: string,
    date_start?: string,
    date_end?: string
  ) => {
    set({ isLoading: true, hasError: false });

    const params: ContentParams = { tag };
    if (date_start) params.date_start = date_start;
    if (date_end) params.date_end = date_end;

    getContent(params)
      .then((response: AxiosResponse) => {
        switch (response.status) {
          case 200: {
            if (response.data.length > 0) {
              set({ events: response.data, isLoading: false, swipedAll: false });
            } else {
              set({ isLoading: false, swipedAll: true })
            }
            break;
          }
          default: set({ hasError: true, isLoading: false });
        }
      })
      .catch(() => set({ hasError: true, isLoading: false }));
  },

  setSwipedAll: async (state: boolean) => {
    set({ swipedAll: state });
  }
}));
