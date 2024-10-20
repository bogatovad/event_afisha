import axiosInstance from "@/services/AxiosConfig";

type Tag = {
  name: string;
  description: string;
  image: string | null;
}

type getTagsResponse = {
  data: Tag[];
}

export const getTags = async () => {
  try {
    const { data: response, status } = await axiosInstance.get<getTagsResponse>(
      "/tags"
    );

    console.log("Responce: " + response);

    return { response, status };
  } catch (error) {
    throw error;
  }
}
