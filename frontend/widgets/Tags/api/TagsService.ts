import {Tag, TagsResponse} from "@/widgets/Tags";
import axiosInstance from "@/shared/api/AxiosConfig";

class TagsService {
  async getTags () {
    console.log("Send GET tags request");

    const response: TagsResponse = await axiosInstance.get<Tag[]>(
      "/tags"
    );

    return response;
  }
}

export default new TagsService();
