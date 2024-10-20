import { create } from 'zustand';
import {sendFeedback} from "@/services/feedbackService";
import {config} from "@/scripts/config";

interface FeedbackState {
  text: string;
  hasError: boolean;
  isSuccess: boolean;
  setText: (text: string) => void;
  submitFeedback: () => Promise<void>;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  text: '',
  hasError: false,
  isSuccess: false,

  setText: (text: string) => set({ text }),

  submitFeedback: async () => {
    set({ hasError: false, isSuccess: false });

    try {
      const { username } = config().initDataUnsafe.user
      const response = await sendFeedback(username, useFeedbackStore.getState().text);

      if (response.status === 200) {
        set({ isSuccess: true });
      } else {
        set({ hasError: true });
      }
    } catch (error) {
      set({ hasError: true });
    }
  },
}));
