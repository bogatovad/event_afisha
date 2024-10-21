import axiosInstance from "@/services/AxiosConfig";

export const getContentByTag = async (tag: string) => {
  try {
    return await axiosInstance.get(
      '/contents',
      {
        params: { tag }
      });
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};
