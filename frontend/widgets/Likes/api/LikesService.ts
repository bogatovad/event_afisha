import {LikesParams} from "@/widgets/Likes";
import {EventsResponse} from "@/widgets/Events";
import axiosInstance from "@/shared/api/AxiosConfig";
import {Event} from "@/entities/Event"

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
