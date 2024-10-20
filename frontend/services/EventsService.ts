import axiosInstance from "@/services/AxiosConfig";

export const getContentByTag = async (tag: string) => {
  try {
    const response = await axiosInstance.get(
      '/contents',
      {
        params: { tag }
      });

    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};
