import {Event, EventsResponse} from "@/types/events.types";
import axiosInstance from "@/services/AxiosConfig";
import {LikesParams} from "@/types/likes.types";

class LikesService {
  async getLikes(
    params: LikesParams
  ) {
    console.log("Send GET likes request with params: ", params);

    const response: EventsResponse = await axiosInstance.get<Event[]>(
      '/contents/liked',
      {
        params: params
      });

    return response;
  }
}

export default new LikesService();
