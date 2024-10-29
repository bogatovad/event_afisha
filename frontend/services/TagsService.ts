import axiosInstance from "@/services/AxiosConfig";
import {Tag, TagsResponse} from "@/types/tags.types";

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
