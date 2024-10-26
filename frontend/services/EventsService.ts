import axiosInstance from "@/services/AxiosConfig";

export interface ContentParams {
  tag: string,
  date_start?: string,
  date_end?: string
}

export const getContent = async (
  params: ContentParams
) => {
  try {
    return await axiosInstance.get(
      '/contents',
      {
        params: params
      });
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

export const postAction = async (
  action: "like" | "dislike",
  username: string,
  contentId: number
)=> {
  return await axiosInstance.post(
    `/${action}`,
    {
      username: username,
      content_id: contentId
    });
}