import { create } from 'zustand';
import {AxiosError} from "axios";
import {config} from "@/scripts/config";
import EventsService from "@/services/EventsService";
import {Event, ContentParams} from "@/types/events.types"

interface EventsState {
  tag: string | undefined;
  events: Event[];
  isLoading: boolean;
  hasError: boolean;
  swipedAll: boolean;
  fetchEvents: (tag?: string, date_start?: string, date_end?: string) => void;
  saveAction: (action: "like" | "dislike", id: number) => Promise<void>;
  setSwipedAll: (state: boolean) => void;
  setTag: (tag: string | undefined) => void;
  descriptionExpanded: boolean;
  toggleDescriptionExpanded: () => void;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  tag: undefined,
  events: [],
  isLoading: true,
  hasError: false,
  swipedAll: false,

  fetchEvents: (
    tag?: string,
    date_start?: string,
    date_end?: string
  ) => {
    set({ isLoading: true, hasError: false });

    const params: ContentParams = {};
    if (tag)        params.tag = tag;
    if (date_start) params.date_start = date_start;
    if (date_end)   params.date_end = date_end;

    EventsService.getContent(params)
      .then((response) => {
        switch (response.status) {
          case 200: {
            console.log(`Successfully get events`);
            if (response.data.length > 0) {
              set({ events: response.data, isLoading: false, swipedAll: false });
            } else {
              console.log(`No events on provided params`);
              set({ isLoading: false, swipedAll: true })
            }
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

  saveAction: async (
    action,
    id
  ) => {
    const { username } = config().initDataUnsafe.user;

    await EventsService.postAction({action: action, username: username, contentId: id})
      .then((response) => {
        if (response.status === 200) {
          console.log(`Successfully post like/dislike`);
        } else {
          console.log(`Error in posting like/dislike with code: ${response.status}`);
        }
      })
      .catch((e: AxiosError) => {
        console.log(`Error posting like/dislike with error: ${e}`);
      })
  },

  setSwipedAll: async (state: boolean) => {
    set({ swipedAll: state });
  },

  setTag: (newTag: string | undefined) => {
    set({ tag: newTag });
  },

  descriptionExpanded: false,
  toggleDescriptionExpanded: () => {
    const { descriptionExpanded } = get();
    set({ descriptionExpanded: !descriptionExpanded })
  }
}));
