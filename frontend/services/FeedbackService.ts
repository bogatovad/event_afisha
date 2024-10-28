import axiosInstance from "@/services/AxiosConfig";
import {FeedbackData, FeedbackResponse} from "@/types/feedback.types";

class FeedbackService {
  async sendFeedback (
    feedbackData: FeedbackData,
  ) {
    const response: FeedbackResponse = await axiosInstance.post<{ status: string }>(
      '/feedback',
      feedbackData
    );

    return response
  };
}

export default new FeedbackService();
