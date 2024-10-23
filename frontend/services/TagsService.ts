import axiosInstance from "@/services/AxiosConfig";

export const getTags = async () => {
  try {
    return await axiosInstance.get(
      "/tags"
    );
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
}
