import {FeedbackService} from "@/pages/info/api/FeedbackService";

export {ProfilePage} from "./ui/ProfilePage";
export {FeedbackPage} from "./ui/FeedbackPage";

export {useFeedbackStore} from "./model/store/useFeedbackState";
export {FeedbackData, FeedbackResponse} from "./model/types/feedback.types"

export const feedbackService = new FeedbackService();


